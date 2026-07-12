#!/bin/sh
set -e

# Aguarda o MySQL estar pronto (opcional, mas evita erros)
echo "Aguardando o banco de dados..."
sleep 15

# Executa as migrations
echo "Rodando as migrations..."
php artisan migrate --force

# Executa os seeds (opcional: comente se não quiser apagar/duplicar dados em produção)
echo "Rodando os seeds..."
php artisan db:seed --force

# Executa o comando principal do container (o CMD original: php-fpm)
exec "$@"
