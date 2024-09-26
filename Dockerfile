# Ein Node.js v.22 Image als Basis verwendet
FROM node:22-bookworm-slim

# Arbeitsverzeichnis definiert
WORKDIR /feedback-app

# Kopiere package.json in das Arbeitsverzeichnis
COPY package.json /feedback-app/

# Installiere Abhaengigkeiten
RUN npm install

# Kopiere den Rest der App in das Arbeitsverzeichnis
COPY . /feedback-app/

# Öffne den Port 3000
EXPOSE 3000

# Definiere den Befehl, der die App startet
CMD [ "npm", "start" ]
