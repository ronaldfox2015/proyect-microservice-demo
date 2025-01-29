# Deploy
ENV ?= env

bootstrap:
	$(eval CDK_ACCOUNT := $(shell cat .env | grep CDK_ACCOUNT | awk '{print $$3}' ))
	$(eval CDK_REGION := $(shell cat .env | grep CDK_REGION | awk '{print $$3}' ))
	cdk bootstrap aws://${CDK_ACCOUNT}/${CDK_REGION} --profile ${ENV}

synth:
	cdk synth --profile ${ENV}

deploy:
	cdk deploy --require-approval never --profile ${ENV}

destroy:
	cdk destroy --all --force --profile ${ENV}
