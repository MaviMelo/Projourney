# --- Estágio 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

# Cache de dependências: Copia apenas os arquivos de gerenciamento de pacotes
COPY package.json package-lock.json ./

# Instala todas as dependências (incluindo devDependencies como TypeScript e Vite)
RUN npm install

# Copia o restante do código fonte
COPY . .

# Executa o script "build" definido no package.json (tsc && vite build)
RUN npm run build

# --- Estágio 2: Produção (Servidor Web) ---
FROM nginx:1.25-alpine

# Copia os arquivos gerados pelo Vite (pasta dist) para o diretório padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta padrão do Nginx
EXPOSE 80

# Inicializa o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
