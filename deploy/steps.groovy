def getAgent() {
  def agentLabel = 'master'
  script {
    def nodes = Jenkins.instance.nodes
    nodes.each { node ->
      if (node.toComputer().name != "stress") {
        if(node.toComputer().online) {agentLabel = 'cluster'}
      }
    }
  }
  return agentLabel
}

def getEnvironmentByStage(def stage) {
  def ENVIRONMENTS = [
    development: ['dev','558705146899'],
    staging: ['pre','551273959084'],
    production: ['prod','101667311186']
  ]
  return ENVIRONMENTS[stage]
}

def getRegionAWS(def regionName) {
  def REGION_AWS = [
    virginia: 'us-east-1',
    irlanda: 'eu-west-1'
  ]
  return REGION_AWS[regionName]
}

def checkAuthorization(def stage) {
  if (stage != 'development') {
        deployUser=sh(script:"python ../../scripts/py/keycloack/getUserAuth.py --env='${stage}'",returnStdout:true).trim()
        def userInput = input(
              id: 'userInput',
              message: '¿Deseas continuar con el despliegue?',
              submitter: "${deployUser}"
        )
  }
}

def checkDefectDojo(def stage, def exec, def user, def reponame, def build_id, def commit_hash, def branch_tag, def repo_url, def gitCommitMsg ) {
  if (stage == 'development') {
    statusDojo=sh(script:"python ../../scripts/py/dojo/app.py --process=detectServer",returnStdout:true).trim()
    if (statusDojo=='Dojo_Ok') {
      responseValidateUser=sh(script:"python ../../scripts/py/dojo/app.py --process=validateUser --inputs='${user}'",returnStdout:true).trim()
      statusUser = responseValidateUser.split(',').last()
      if (statusUser!=' es valido') {
        println "Status User Dojo: \n${statusUser}"
        error("Error por fallo user dojo credenciales no valido.")
        currentBuild.result = 'ABORTED'  
      }
      sh "python ../../scripts/py/dojo/app.py --process=createProduct --inputs='${reponame}'"
      sh "python ../../scripts/py/dojo/app.py --process=addEngagement --inputs='${reponame},${build_id},${commit_hash},${branch_tag},${repo_url},${gitCommitMsg.replace(',', ' ')},${stage},${exec},${user}'"
    } else {
       if (statusDojo!='Dojo_Bypass') {
          println "Status Defect Dojo: \n${statusDojo}"
          error("Error por fallo en el servidor defect dojo.")
          currentBuild.result = 'ABORTED'  
       }
    }
  }
}

def installDependencies(def config, def stage) {
  withEnv(config) {
    importVulnTrivyStatic(stage,"app/")
  }
}

def vulnDescribeImageScan(def config) {
    withEnv(config) {
    sh 'make describeAwsImage'
  }
}

def dependencies(def config) {
  withEnv(config) {
    sh 'make sync-container-config'
    sh 'make build-dev-image'
    sh 'make test-deploy'
    sh 'make migrate-deploy'
  }
}

def configs(def stage, def regionName, def jobName) {
  enviroment = getEnvironmentByStage(stage)
  region = getRegionAWS(regionName)
  env = enviroment[0]
  account = enviroment[1]
  service = jobName.split('-').last()

  withEnv(["ENV=${env}","SERVICE_NAME=${service}","INFRA_BUCKET=infraestructura.neoauto.${env}"]) {
    echo 'Synchronizing...'
    sh 'make sync-deploy-config'
    repository = sh(script:"python ../../scripts/py/ecr/describeRepository.py --env=${env} --region=${region} --serv=${service}",returnStdout:true).trim()
  }

  configFile = readYaml file: 'deploy/jenkins.private.yml'

  config = [
    "ENV=${env}",
    "SERVICE_NAME=${service}",
    "DEPLOY_REGION=${region}",
    "INFRA_BUCKET=infraestructura.neoauto.${env}",
    "DESIRED_COUNT=${configFile.params.DESIRED_COUNT}",
    "PREFIX_PATH=${configFile.params.PATHPREFIX}",
    "HTTP_PRIORITY=${configFile.params.HTTP_PRIORITY}",
    "HTTPS_PRIORITY=${configFile.params.HTTPS_PRIORITY}",
    "MEMORY_SIZE=${configFile.params.MEMORY_SIZE}",
    "DOMAIN_HTTP=${configFile.params.DOMAIN_HTTP}",
    "DOMAIN_HTTPS=${configFile.params.DOMAIN_HTTPS}",
    "ACCOUNT_ID=${account}",
    "MIN_SCALING=${configFile.params.MIN_SCALING}",
    "MAX_SCALING=${configFile.params.MAX_SCALING}",
    "THRESHOLD_HIGH=${configFile.params.THRESHOLD_HIGH}",
    "THRESHOLD_LOW=${configFile.params.THRESHOLD_LOW}",
    "SCALINGTYPE=${configFile.params.SCALINGTYPE}",
    "DASH=${configFile.params.DASH}"
  ]
  return ["configuration":config,"ecr":repository]
}

def importVulnTrivyStatic(def stage, def dir) {
  if ( stage == 'development' && statusDojo == 'Dojo_Ok' ) {
    sh "python ../../scripts/py/dojo/app.py --process=changeR --inputs=${userBuild},2"
    filename="static.json"
    sh "rm -rf ../../scripts/py/dojo/${filename}"
    sh "trivy fs --scanners vuln --format json --pkg-types os,library --output ../../scripts/py/dojo/${filename} ${dir}"
    sh "python ../../scripts/py/dojo/app.py --process=import --inputs='${reponame},${engagement},trivy,../../scripts/py/dojo/${filename},${userBuild}'"
  }
}

def importVulnTrivyImage(def stage) {
  if ( stage == 'development' && statusDojo == 'Dojo_Ok' ) {
    filename="image.json"
    sh "rm -rf ../../scripts/py/dojo/${filename}"
    env = getEnvironmentByStage(stage)[0]
    service = jobName.split('-').last()
    imageDeploy = "neoauto-${env}-${service}:${buildTimestamp}.${buildNumber}"
    sh "trivy image --scanners vuln --format json --pkg-types os,library --output ../../scripts/py/dojo/${filename} ${imageDeploy}"
    sh "python ../../scripts/py/dojo/app.py --process=import --inputs='${reponame},${engagement},trivy,../../scripts/py/dojo/${filename},${userBuild}'"
    sh "python ../../scripts/py/dojo/app.py --process=changeR --inputs=${userBuild},5"
  }
}
  
def createPushEcr(def config) {
  withEnv(config) {
    sh 'make init-aws-cdk-ecr'
    sh 'cd ecr/repositorio-ecr/ && make bootstrap'
    sh 'cd ecr/repositorio-ecr/ && make synth'
    sh 'cd ecr/repositorio-ecr/ && make deploy'
    sh 'make build-prod-image'
    sh 'make deploy-image'
    sh 'make imagescan'
  }
}

def pushImageEcr(def config) {
  withEnv(config) {
    sh 'make build-prod-image'
    sh 'make deploy-image'
    sh 'make imagescan'
  }
}

def validateVulnerability(def stage, def config, def runscan) {
  vulnDescribeImageScan(config)
  validateAwsImageEcr=sh(script:"make validateEcrImage",returnStdout:true).trim()
  if(validateAwsImageEcr=='abort' && runscan=='YES_EXEC'){
    println "Se encontraron vulnerabilidades en imagen aws ecr: ${validateAwsImageEcr}"
    error("Error por fallo de Vulnerabilidades en imagen ecr.")
    currentBuild.result = 'ABORTED'
  }

  if (stage == 'development' && statusDojo == 'Dojo_Ok' ) {       
    findingsCritical=sh(script:"python ../../scripts/py/dojo/app.py --process=getFindings --inputs='${reponame},Critical,ms-trivy'",returnStdout:true).trim()
    if( findingsCritical.toInteger() > 0 ){
        println "Se encontraron ${findingsCritical} vulnerabilidades con severidad Critical"
        error("Error por fallo del Vulnerabilidades Critical revisar el servidor defect dojo.")
        currentBuild.result = 'ABORTED'
    }
    findingsHigh=sh(script:"python ../../scripts/py/dojo/app.py --process=getFindings --inputs='${reponame},High,ms-trivy'",returnStdout:true).trim()
    if( findingsHigh.toInteger() > 0 ){
        println "Se encontraron ${findingsHigh} vulnerabilidades con severidad High"
        error("Error por fallo del Vulnerabilidades High revisar el servidor defect dojo.")
        currentBuild.result = 'ABORTED'
    }
    findingsMedium=sh(script:"python ../../scripts/py/dojo/app.py --process=getFindings --inputs='${reponame},Medium,ms-trivy'",returnStdout:true).trim()
    if( findingsMedium.toInteger() > 0 ){
        println "Se encontraron ${findingsMedium} vulnerabilidades con severidad Medium"
        error("Error por fallo del Vulnerabilidades Medium revisar el servidor defect dojo.")
        currentBuild.result = 'ABORTED'
    }
  }
}

def createService(def config) {
  withEnv(config) {
    sh 'make init-aws-cdk-ecs-service'
    sh 'cd module/servicio-ecs/ && make bootstrap'
    sh 'cd module/servicio-ecs/ && make synth'
    sh 'cd module/servicio-ecs/ && make deploy'
  }
}

def updateService(def config) {
  withEnv(config) {
     sh 'make deploy-ecs'
  }
}

def metricJob(def postjob, def deployTook) {
  println "Job ${postjob} tomo: ${deployTook}"
  if (agentnode == 'built-in') {
        sh 'find -user root | xargs -I % sudo chown -Rh "jenkins":"jenkins" %'
        sleep 1
        sh 'find -user root | xargs -I % sudo chown -Rh "jenkins":"jenkins" %'
  }
}

return this
