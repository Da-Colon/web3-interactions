FROM node:16.2.0
WORKDIR /usr/src/app

ENV PORT=8080

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "develop"]