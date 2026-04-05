help:
	@echo "Available commands:"
	@echo "  make dev            - Start development server"
	@echo "  make dev-mock       - Start with mock API (Prism)"
	@echo "  make build          - Build for production"
	@echo "  make lint           - Run ESLint"
	@echo "  make test           - Run tests (requires setup)"
	@echo "  make test-watch     - Run tests in watch mode"
	@echo "  make mock-api       - Start Prism mock server"
	@echo "  make compile-api    - Compile TypeSpec to OpenAPI"
	@echo "  make generate-types - Generate TS types from OpenAPI"
	@echo "  make clean          - Remove build artifacts"
	@echo "  make stop           - Stop all services (vite, prism, uvicorn)"
	@echo "  make restart        - Stop all and start with real backend"
	@echo "  make restart-mock   - Stop all and start with mock API (background)"
stop:
	-fuser -k 5173/tcp 2>/dev/null
	-fuser -k 4010/tcp 2>/dev/null
	-fuser -k 8000/tcp 2>/dev/null
	@echo "All services stopped"
restart: stop
	@echo "Starting backend on port 8000..."
	$(MAKE) --no-print-directory _start-backend
	@sleep 2
	@echo "Starting frontend on port 5173..."
	$(MAKE) --no-print-directory _start-vite-real
restart-mock: stop
	@echo "Starting Prism mock API on port 4010..."
	$(MAKE) --no-print-directory _start-mock-api
	@sleep 2
	@echo "Starting frontend on port 5173..."
	$(MAKE) --no-print-directory _start-vite-mock

_start-backend:
	cd backend && nohup poetry run python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 > /tmp/backend.log 2>&1 &
_start-mock-api:
	nohup npx prism mock src/api/openapi.json -p 4010 > /tmp/prism.log 2>&1 &
	@echo "Prism mock API started"
_start-vite-mock:
	nohup npx vite --mode mock --host > /tmp/vite.log 2>&1 &
	@echo "Vite dev server started"
_start-vite-real:
	nohup npx vite --host > /tmp/vite.log 2>&1 &
	@echo "Vite dev server started"
dev:
	npm run dev
dev-mock:
	npm run dev:mock
build:
	npm run build
lint:
	npm run lint
test:
	npm test
test-watch:
	npm run test:watch
mock-api:
	npm run mock:api
compile-api:
	npm run compile:api
generate-types:
	npm run generate:types
clean:
	rm -rf dist tsp-output
