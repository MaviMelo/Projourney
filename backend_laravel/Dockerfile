# --- Estágio 1: Build (Composer) ---
FROM composer:latest AS vendor
WORKDIR /app

# Copia apenas os arquivos de dependências para aproveitar o cache
COPY composer.json composer.lock ./

# Instala as dependências do Laravel sem pacotes de desenvolvimento e otimiza o autoloader
RUN composer install \
    --no-interaction \
    --prefer-dist \
    --no-scripts \
    --optimize-autoloader
    # --no-dev 

# --- Estágio 2: Produção (Aplicação) ---
FROM php:8.4-fpm-alpine
WORKDIR /var/www/html

# Instala extensões PHP essenciais para o Laravel (ex: pdo_mysql, bcmath, zip)
RUN apk add --no-cache \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    iputils-ping \
    icu-dev \
    nodejs \
    npm \
 && docker-php-ext-install pdo_mysql bcmath gd zip intl

# Copia as dependências geradas no Estágio 1
COPY --from=vendor /app/vendor ./vendor

# Copia o restante do código-fonte do Laravel
COPY . .

# Instala dependências do frontend e faz build do Vite (para Inertia/manifest.json)
RUN npm ci && npm run build && cp public/build/.vite/manifest.json public/build/manifest.json 2>/dev/null || true

# Ajusta as permissões das pastas de cache e storage para o usuário do PHP-FPM (www-data)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expõe a porta padrão do PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
