# --- Estágio 1: Composer ---
FROM composer:latest AS vendor
WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --no-scripts \
    --optimize-autoloader

# --- Estágio 2: Produção (PHP-FPM) ---
FROM php:8.4-fpm-alpine
WORKDIR /var/www/html

# Instala extensões PHP
RUN apk add --no-cache \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
 && docker-php-ext-install pdo_mysql bcmath gd zip

# Copia dependências do Composer
COPY --from=vendor /app/vendor ./vendor

# Copia código
COPY . .

# Permissões
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Gera APP_KEY (importante!)
RUN php artisan key:generate --force 2>/dev/null || true

EXPOSE 9000
CMD ["php-fpm"]
