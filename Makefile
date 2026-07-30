# Development
.PHONY: dev build start lint typecheck format

# Db
.PHONY: db-generate db-migrate db-push db-drop db-studio auth-generate

# Maintenance
.PHONY: clean install reset format

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

lint: ## Run ESLint
	npm run lint

typecheck: ## Run TypeScript compiler check
	npx tsc --noEmit

format: ## Format code with Prettier (if available)
	npx prettier --write .

check: lint typecheck ## Run lint + typecheck

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

auth-generate: ## Generate Better Auth types
	npm run auth:generate

clean: ## Remove .next and node_modules
	rm -rf .next node_modules

install: ## Fresh install dependencies
	npm install

reset: clean install ## Clean + reinstall
	@echo "Done — run 'make dev' to start"

# All in one
all: format check build ## Lint + typecheck + build

# Help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
