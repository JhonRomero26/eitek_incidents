.PHONY: help install dev start stop backend frontend db db-init db-reset clean logs test build

# Variables
DB_NAME ?= eitek
DB_USER ?= postgres
DB_PASSWORD ?= postgres
DB_HOST ?= localhost
DB_PORT ?= 5432

help:
	@echo "╔════════════════════════════════════════════════════════════════╗"
	@echo "║        Sistema de Gestión de Incidencias - EITEK               ║"
	@echo "╠════════════════════════════════════════════════════════════════╣"
	@echo "║  Comandos disponibles:                                         ║"
	@echo "╠════════════════════════════════════════════════════════════════╣"
	@echo "║  make install     - Instalar todas las dependencias            ║"
	@echo "║  make dev         - Iniciar todo en modo desarrollo            ║"
	@echo "║  make start       - Iniciar backend y frontend                 ║"
	@echo "║  make stop        - Detener todos los servicios                ║"
	@echo "║  make backend     - Iniciar solo el backend                    ║"
	@echo "║  make frontend    - Iniciar solo el frontend                   ║"
	@echo "║  make db          - Iniciar PostgreSQL (requiere Docker)       ║"
	@echo "║  make db-init     - Inicializar la base de datos               ║"
	@echo "║  make db-reset    - Reiniciar la base de datos                 ║"
	@echo "║  make test        - Ejecutar tests                             ║"
	@echo "║  make build       - Construir para producción                  ║"
	@echo "║  make clean       - Limpiar archivos generados                 ║"
	@echo "║  make logs        - Ver logs del backend                       ║"
	@echo "╚════════════════════════════════════════════════════════════════╝"

# Instalar dependencias
install: install-backend install-frontend
	@echo "✅ Dependencias instaladas correctamente"

install-backend:
	@echo "📦 Instalando dependencias del backend..."
	@cd backend && chmod +x gradlew && ./gradlew dependencies --quiet

install-frontend:
	@echo "📦 Instalando dependencias del frontend..."
	@cd frontend && bun install || npm install

# Desarrollo
dev:
	@echo "🚀 Iniciando entorno de desarrollo..."
	@make -j2 backend frontend

start: dev

# Backend
backend:
	@echo "☕ Iniciando backend en http://localhost:8080..."
	@cd backend && ./gradlew bootRun

backend-bg:
	@echo "☕ Iniciando backend en segundo plano..."
	@cd backend && ./gradlew bootRun &

# Frontend
frontend:
	@echo "⚛️  Iniciando frontend en http://localhost:5173..."
	@cd frontend && bun dev || npm run dev

frontend-bg:
	@echo "⚛️  Iniciando frontend en segundo plano..."
	@cd frontend && (bun dev || npm run dev) &

# Base de datos
db:
	@echo "🐘 Iniciando PostgreSQL con Docker..."
	@docker run --name eitek_postgres -d \
		-e POSTGRES_DB=$(DB_NAME) \
		-e POSTGRES_USER=$(DB_USER) \
		-e POSTGRES_PASSWORD=$(DB_PASSWORD) \
		-p $(DB_PORT):5432 \
		-v eitek_pgdata:/var/lib/postgresql/data \
		postgres:16-alpine || docker start eitek_postgres
	@echo "✅ PostgreSQL disponible en localhost:$(DB_PORT)"

db-init:
	@echo "🗄️  Inicializando base de datos..."
	@PGPASSWORD=$(DB_PASSWORD) psql -h $(DB_HOST) -p $(DB_PORT) -U $(DB_USER) -d $(DB_NAME) -f db/schema.sql
	@PGPASSWORD=$(DB_PASSWORD) psql -h $(DB_HOST) -p $(DB_PORT) -U $(DB_USER) -d $(DB_NAME) -f db/seed.sql
	@echo "✅ Base de datos inicializada"

db-reset:
	@echo "🔄 Reiniciando base de datos..."
	@PGPASSWORD=$(DB_PASSWORD) psql -h $(DB_HOST) -p $(DB_PORT) -U $(DB_USER) -c "DROP DATABASE IF EXISTS $(DB_NAME);"
	@PGPASSWORD=$(DB_PASSWORD) psql -h $(DB_HOST) -p $(DB_PORT) -U $(DB_USER) -c "CREATE DATABASE $(DB_NAME);"
	@make db-init

db-stop:
	@echo "🛑 Deteniendo PostgreSQL..."
	@docker stop eitek_postgres 2>/dev/null || true

# Detener servicios
stop:
	@echo "🛑 Deteniendo servicios..."
	@lsof -ti:8080 | xargs kill -9 2>/dev/null || true
	@lsof -ti:5173 | xargs kill -9 2>/dev/null || true
	@echo "✅ Servicios detenidos"

# Tests
test: test-backend test-frontend
	@echo "✅ Todos los tests completados"

test-backend:
	@echo "🧪 Ejecutando tests del backend..."
	@cd backend && ./gradlew test

test-frontend:
	@echo "🧪 Ejecutando tests del frontend..."
	@cd frontend && bun test || npm test || echo "No hay tests configurados"

# Build
build: build-backend build-frontend
	@echo "✅ Build completado"

build-backend:
	@echo "🔨 Construyendo backend..."
	@cd backend && ./gradlew bootJar
	@echo "📦 JAR generado en backend/build/libs/"

build-frontend:
	@echo "🔨 Construyendo frontend..."
	@cd frontend && bun run build || npm run build
	@echo "📦 Build generado en frontend/dist/"

# Limpieza
clean:
	@echo "🧹 Limpiando archivos generados..."
	@cd backend && ./gradlew clean
	@rm -rf frontend/dist frontend/node_modules/.vite
	@echo "✅ Limpieza completada"

# Logs
logs:
	@echo "📋 Mostrando logs del backend..."
	@cd backend && tail -f build/logs/*.log 2>/dev/null || echo "No hay logs disponibles"

# Verificar requisitos
check:
	@echo "🔍 Verificando requisitos..."
	@command -v java >/dev/null 2>&1 && echo "✅ Java: $$(java -version 2>&1 | head -1)" || echo "❌ Java no encontrado"
	@command -v node >/dev/null 2>&1 && echo "✅ Node: $$(node -v)" || echo "❌ Node no encontrado"
	@command -v bun >/dev/null 2>&1 && echo "✅ Bun: $$(bun -v)" || echo "⚠️  Bun no encontrado (opcional)"
	@command -v psql >/dev/null 2>&1 && echo "✅ PostgreSQL CLI disponible" || echo "⚠️  psql no encontrado"
	@command -v docker >/dev/null 2>&1 && echo "✅ Docker: $$(docker -v | cut -d' ' -f3)" || echo "⚠️  Docker no encontrado (opcional)"
