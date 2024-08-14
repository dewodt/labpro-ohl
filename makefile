init-network:
	docker network create labpro-ohl-network

run-db:
	docker compose up --build labpro-ohl-db

run-app-dev:
	docker compose up --build labpro-ohl-dev

run-app-prod:
	docker compose up --build labpro-ohl-prod

reset:
	docker compose down -v
	sudo rm -rf ./db-data
	sudo rm -rf ./dist

stop:
	docker compose down