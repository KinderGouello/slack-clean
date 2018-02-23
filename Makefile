CMD_DOCKER_COMPOSE=docker-compose -p slackclean

all:

build:
	$(CMD_DOCKER_COMPOSE) build

start:
	$(CMD_DOCKER_COMPOSE) up -d

down:
	$(CMD_DOCKER_COMPOSE) down

node:
	$(CMD_DOCKER_COMPOSE) exec app bash
