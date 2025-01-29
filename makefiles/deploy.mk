## DEPLOY VARS ##
ACCOUNT_ID      ?= 929226109038
DEPLOY_REGION   ?= eu-west-1
DESIRED_COUNT   ?= 1
MIN_SCALING     ?= 1
MAX_SCALING     ?= 2
MEMORY_SIZE     ?= 256
AUTOSCALING     ?= false
HTTP_PRIORITY	?= 24
HTTPS_PRIORITY	?= 24

BUILD_NUMBER    ?= $(shell date +%s)
BUILD_TIMESTAMP ?= 20220216
TAG_DEPLOY      ?= $(BUILD_TIMESTAMP).$(BUILD_NUMBER)

PROD_DOCKER_IMAGE    = $(PROJECT_NAME):$(TAG_DEPLOY)
DEPLOY_REGISTRY = $(ACCOUNT_ID).dkr.ecr.$(DEPLOY_REGION).amazonaws.com
STACK_PATH      = $(INFRA_BUCKET)/build/cloudformation/$(OWNER)/$(ENV)/$(PROJECT_NAME)

sync-deploy-config: ##Deploy Sync deploy files from S3
	aws s3 sync s3://$(INFRA_BUCKET)/config/deploy/$(OWNER)/$(ENV)/$(SERVICE_NAME)/ deploy/ --profile $(ENV)

tag.build:
	echo $(TAG_DEPLOY)

build-prod-image: ##@Deploy Create a Docker image with only prod dependencies packaged
	make login-aws
	docker build -f docker/prod/Dockerfile --no-cache -t $(PROD_DOCKER_IMAGE) .

migrate-deploy: ##@Deploy Run migrations
	make container-deploy-run COMMAND="sequelize db:migrate"
	make container-deploy-run COMMAND="sequelize db:seed:all"

container-deploy-run: ##@Deploy Run deploy container commands
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-u $(UID_LOCAL):$(GID_LOCAL) \
		--network=$(DOCKER_NETWORK) \
		${DEV_DOCKER_IMAGE} \
		pnpm $(COMMAND)

login-aws: ##Deploy Login to AWS
	aws ecr get-login-password --region $(DEPLOY_REGION) --profile $(ENV) | docker login --username AWS --password-stdin $(ACCOUNT_ID).dkr.ecr.$(DEPLOY_REGION).amazonaws.com

deploy-image:
	docker tag $(PROD_DOCKER_IMAGE) $(DEPLOY_REGISTRY)/$(PROD_DOCKER_IMAGE)
	aws ecr get-login-password --region $(DEPLOY_REGION) --profile $(ENV) | docker login --username AWS --password-stdin ${DEPLOY_REGISTRY}
	docker push $(DEPLOY_REGISTRY)/$(PROD_DOCKER_IMAGE) >> pushImage
	cat pushImage

imagescan:
	$(eval IMAGEID := $(shell cat pushImage | grep digest | awk '{print $$3}'))
	python ../../scripts/py/ecr/scanImagev2.py --id=${IMAGEID} --owner=${OWNER} --env=${ENV} --service=${SERVICE_NAME}

validateTrivyImage:
	@/bin/bash ../../scripts/bash/vuln/trivyImage.sh ${PROD_DOCKER_IMAGE}

describeAwsImage:
	$(eval IMAGEID := $(shell cat pushImage | grep digest | awk '{print $$3}'))
	python ../../scripts/py/ecr/imageScanVulnarability.py --id=${IMAGEID} --owner=${OWNER} --env=${ENV} --service=${SERVICE_NAME}

validateEcrImage:
	@sh ../../scripts/bash/vuln/awsEcrImage.sh ${OWNER} ${ENV} ${SERVICE_NAME}

init-aws-cdk-ecr:
	git clone -b master --single-branch --depth 1 git@bitbucket.org:neorepo/neoauto-cdk-modules.git ecr
	cd ecr && git sparse-checkout set repositorio-ecr
	aws s3 cp s3://${INFRA_BUCKET}/config/infraestructura/${OWNER}/${ENV}/${DEPLOY_REGION}/ecs/${SERVICE_NAME}/.env ecr/repositorio-ecr/ --profile ${ENV}
	cd ecr/repositorio-ecr/ && npm install
	cp makefiles/cdk_ecr/Makefile ecr/repositorio-ecr/

init-aws-cdk-ecs-service:
	git clone -b master --single-branch --depth 1 git@bitbucket.org:neorepo/neoauto-cdk-modules.git module
	cd module && git sparse-checkout set servicio-ecs
	aws s3 cp s3://${INFRA_BUCKET}/config/infraestructura/${OWNER}/${ENV}/${DEPLOY_REGION}/ecs/${SERVICE_NAME}/.env module/servicio-ecs/ --profile ${ENV}
	cd module/servicio-ecs/ && npm install
	cp makefiles/cdk_ecs/Makefile module/servicio-ecs/

deploy-ecs: ##@Deploy Deploy updating the service
	aws ecs register-task-definition --region $(DEPLOY_REGION) --profile $(ENV) \
		--region $(DEPLOY_REGION) \
		--family $(PROJECT_NAME) \
		--task-role-arn $(OWNER).$(ENV).$(SERVICE_NAME).ecs \
		--container-definitions "[{\"name\":\"$(PROJECT_NAME)\",\"essential\":true,\"memory\":$(MEMORY_SIZE),\"portMappings\":[{\"protocol\":\"tcp\",\"containerPort\":80,\"hostPort\":0}],\"environment\":[{\"name\":\"PREFIX\",\"value\":\"$(PREFIX_PATH)\"}],\"image\":\"$(DEPLOY_REGISTRY)/$(PROD_DOCKER_IMAGE)\",\"logConfiguration\":{\"logDriver\":\"awslogs\",\"options\":{\"awslogs-group\":\"$(PROJECT_NAME)\",\"awslogs-region\":\"$(DEPLOY_REGION)\"}}}]" \
		--profile ${ENV} \
		--query taskDefinition.taskDefinitionArn
	aws ecs update-service --cluster $(CLUSTER) --service $(PROJECT_NAME) --task-definition $(PROJECT_NAME) --desired-count $(DESIRED_COUNT) --region $(DEPLOY_REGION) --profile $(ENV)