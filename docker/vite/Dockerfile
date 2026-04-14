FROM node:20-alpine

WORKDIR /app

# cria diretório com permissões corretas
RUN chown -R node:node /app

USER node

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
