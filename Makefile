# Development
.PHONY: dev build start lint typecheck format

# Db
.PHONY: db-generate db-migrate db-push db-drop db-studio db-seed db-reset auth-generate

# Maintenance
.PHONY: clean install format

# Testing
.PHONY: build check all help

# ---------------------------------------------------------------------------- #
#                                                                              #
# ---------------------------------------------------------------------------- #

dev: ## Start dev server
	npm run dev

build: ## Production build
	npm run build

start: ## Start production server
	npm run start

typecheck: ## Run TypeScript compiler check
	npm run typecheck

format: ## Format code with Prettier
	npm run format

lint: ## Linter
	npm run lint

db-generate: ## Generate Drizzle migration files
	npm run db:generate

db-migrate: ## Run pending migrations
	npm run db:migrate

db-push: ## Push schema changes to DB
	npm run db:push

db-drop: ## Drop a migration
	npm run db:drop

db-studio: ## Open Drizzle Studio
	npm run db:studio

db-seed: ## Seed data to db
	npm run db:seed

db-reset: ## Reset database
	npm run db:reset

auth-generate: ## Generate Better Auth types
	npm run auth:generate

clean: ## Remove .next and node_modules
	rm -rf .next node_modules

install: ## Fresh install dependencies
	npm install --legacy-peer-deps

# All in one
all: format typecheck build ## format + typecheck + build

# Help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
