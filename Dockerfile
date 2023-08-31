# Partim d’una imatge mínima de node 18.12.1 LTS https://hub.docker.com/_/node
FROM node:lts-alpine
# Indicar el creador
LABEL maintainer="Codebiting - JDH"
# Instalem wget
RUN apk update && apk add wget
# Creem un directori per l'aplicacio i descarreguem el projecte
RUN mkdir -p /usr/src/app
# Establim el directori de treball
WORKDIR /usr/src/app
# Copiem el nostre projecte a dins del contenidor
COPY ./ /usr/src/app/
RUN ls -l /usr/src/app
# Instal·lem les depencencies. Si les instal·lem per produccio fer: npmci --only=production
RUN npm install
RUN ls -l /usr/src/app
# Comprobació de que el contenidor funciona correctament
HEALTHCHECK  --interval=5m --timeout=3s \
             CMD wget -q --no-verbose --tries=1 \
             --spider http://localhost:8080/v1/healthcheck || exit 1

# Exposem el port de l'aplicacio
EXPOSE 8080
# Establim les variables d'entorn
ENV NODE_ENV='production'
ENV PORT=8080
# Definim la comanda per executar l'aplicacio
CMD ["node", "bin/www"]