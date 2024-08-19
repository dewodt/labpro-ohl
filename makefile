init-network:
	docker network create labpro-ohl-network

run-db-dev:
	docker compose up --build labpro-ohl-db-dev

run-app-dev:
	docker compose up --build labpro-ohl-app-dev

run-tw-dev:
	npm run build:tailwind:dev

run-client-dev:
	npm run build:client:dev

run-app-prod:
	docker compose up --build labpro-ohl-app-prod

run-seeder-dev:
	docker compose up --build labpro-ohl-seeder-dev

run-seeder-prod:
	docker compose up --build labpro-ohl-seeder-prod

reset:
	docker compose down -v
	sudo rm -rf ./db-data
	sudo rm -rf ./dist

stop:
	docker compose down