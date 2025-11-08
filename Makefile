.DEFAULT_GOAL := help
.PHONY: venv doc
.EXPORT_ALL_VARIABLES:

## APP VARS ##
OWNER             = proyect
SERVICE_TYPE      = microservice
SERVICE_NAME      = demo
VERSION           = v1
APP_NAME          = $(SERVICE_TYPE)-$(SERVICE_NAME)
DOCKER_NETWORK    ?= neo_network
DOCKER_USER       ?= node:node
TIME_ZONE         = America/Lima
CONTAINER_PORT    ?= 80
PATH_PREFIX       = /$(VERSION)

## GENERAL VARS ##
ENV               ?= dev
NODE_ENV          ?= dev
ACCOUNT_ENV       ?= $(ENV)
INFRA_BUCKET      ?= infraestructura.neoauto.local
CLUSTER           ?= $(OWNER)-$(ENV)
PROJECT_NAME      = $(OWNER)-$(ENV)-$(SERVICE_NAME)
APP_DIR           = app
DEPLOY_REGION     ?= us-east-1
PATH_SERVICE      = /$(VERSION)/$(SERVICE_NAME)*

## INCLUDE TARGETS ##
include makefiles/container.mk
include makefiles/migration.mk
include makefiles/document.mk
include makefiles/deploy.mk
include makefiles/test.mk
include makefiles/helper.mk
include makefiles/security.mk
include makefiles/help.mk

