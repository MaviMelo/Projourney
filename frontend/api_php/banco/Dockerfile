FROM mysql:8.0

# Define senha do root
ENV MYSQL_ROOT_PASSWORD=root

# (opcional) cria um banco padrão
ENV MYSQL_DATABASE=projourney_2

# Copia os arquivos SQL para o diretório de init automático
COPY projourney_db.sql /docker-entrypoint-initdb.d/
COPY projourney2_database_backup.sql /docker-entrypoint-initdb.d/
