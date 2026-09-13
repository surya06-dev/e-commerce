FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 4003
EXPOSE 9464
CMD ["npm", "start"]
