.DEFAULT_GOAL := help
.PHONY: venv
.EXPORT_ALL_VARIABLES:

## ENVIRONMENT AWS VARS ##
ENV 			?= env
DEPLOY_REGION	?= region
ACCOUNT_ID		?= account

## DEPLOY STACK CDK VARS ##
DESIRED_COUNT	?= 1
MEMORY_SIZE		?= 256
PREFIX_PATH		?= /v1
DOMAIN_HTTP		?= dominio
DOMAIN_HTTPS	?= dominio
HTTP_PRIORITY	?= 0
HTTPS_PRIORITY	?= 0

PARAMS_CDK = "${DESIRED_COUNT},${MEMORY_SIZE},${PREFIX_PATH},${DOMAIN_HTTP},${DOMAIN_HTTPS},${HTTP_PRIORITY},${HTTPS_PRIORITY},${MIN_SCALING},${MAX_SCALING},${THRESHOLD_HIGH},${THRESHOLD_LOW},${SCALINGTYPE},${DASH}"

## CONTEXT CDK VARS ##
CTX_ECS ?= $(shell node ../../generateContext/main.js $(PARAMS_CDK))

bootstrap:
	cdk bootstrap aws://${ACCOUNT_ID}/${DEPLOY_REGION} \
	-c ecs:service='${CTX_ECS}' \
	--profile ${ENV}

synth:
	cdk synth -c ecs:service='${CTX_ECS}' --profile ${ENV}

deploy:
	cdk deploy --require-approval never \
	-c ecs:service='${CTX_ECS}' \
	--profile ${ENV}

destroy:
	cdk destroy --all --force -c ecs:service='${CTX_ECS}' --profile ${ENV}
