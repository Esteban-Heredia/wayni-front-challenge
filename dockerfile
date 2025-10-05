#Probar y revisar la version de node, si no funcina probar 18.20.1 pero era next 14
FROM node:20.11.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]
