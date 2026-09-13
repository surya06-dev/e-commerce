FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 4006
EXPOSE 9464
CMD ["node", "server.js"]
