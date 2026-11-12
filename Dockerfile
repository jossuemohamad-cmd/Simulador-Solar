# ========================================================
# LECASU — Dockerfile de Produção (Node.js Alpine Leve)
# ========================================================

FROM node:20-alpine

WORKDIR /app

# Copia todos os ficheiros da aplicação
COPY . .

# Variáveis de ambiente de produção
ENV NODE_ENV=production
ENV PORT=5500

# Porta do servidor
EXPOSE 5500

# Executa o servidor nativo leve
CMD ["node", "backend/server-app.js"]

