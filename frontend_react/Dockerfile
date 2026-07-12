# Estágio Único: Instalação e Build
FROM node:22-alpine
WORKDIR /app

# Cache de dependências
COPY package.json package-lock.json ./
RUN npm install

# Copia o código e gera a pasta /app/dist
COPY . .
RUN npm run build

# Mantém o container vivo ou serve os arquivos estáticos (opcional, dependendo de como o proxy acessa)
CMD ["npm", "run", "preview", "--", "--host"]
