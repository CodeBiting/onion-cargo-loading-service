#!/bin/bash
# Pujar aquest fitxer al servidor a on es vulgui desplegar i executar-lo
# <https://help.clouding.io/hc/es/articles/4408985454098-C%C3%B3mo-utilizar-la-llave-privada-para-acceder-por-SSH-PEM->
# Ex connexió ssh: ssh root@dirección_IP_del_servidor -i /ruta/ejemplo/default.pem
# Ex pujar fitxers: scp fitxer.tar root@dirección_IP_del_servidor:/ruta_servidor -i /ruta/ejemplo/default.pem
# CodeBiting - JDH 2022-12-08
# *****************************************************************************


printf "\n\nConfiguration data:"
#printf "\n Dades de connexió amb el GITHUB\n"
#read -p "  Usuari de GitHub: " githubUsername
#read -sp "  Contrasenya:" githubPassword
printf "\n Data for MySQL\n"
read -p "  User: " MYSQL_USER
read -sp "  Passoword: " MYSQL_PASSWORD
#Comprovate if the evniroment variables are empty (no username or password)
if [ -z "$MYSQL_USER" ]; then
  MYSQL_USER=default
  printf "\n -- No user entry\n  ---> DEFAULT USERNAME: default"
fi
if [ -z "$MYSQL_PASSWORD" ]; then
  MYSQL_PASSWORD=Mypass123
  printf "\n -- No password entry.\n  ---> DEFAULT PASSWORD: Mypass123"
fi

printf "\n** GET PROJECT REPOSITORY **\n"
git clone https://github.com/CodeBiting/onion-cargo-loading-service.git
cd onion-cargo-loading-service/

printf "\n** CREATE/MODIFY CONFIGURATION DB **\n"
# Create the "config.js" to acces the DB
touch config/config.js 
echo 'module.exports = {' >> config/config.js 
echo '    client: "TEST",' >> config/config.js 
echo '    service: "onion-cargo-loading-service",' >> config/config.js 
echo '    db: {' >> config/config.js 
echo '      host: "127.0.0.1",' >> config/config.js 
echo '      port: 3306,' >> config/config.js 
echo '      database: "cargo_loading",' >> config/config.js 
echo "      user: '$MYSQL_USER'," >> config/config.js 
echo "      password: '$MYSQL_PASSWORD'," >> config/config.js 
echo '      connectionLimit: 10' >> config/config.js 
echo '    }' >> config/config.js 
echo '}' >> config/config.js 
# Give permissions to "MYSQL_USER"
echo "GRANT ALL PRIVILEGES ON cargo_loading.* TO '$MYSQL_USER'@'localhost' WITH GRANT OPTION;" >> scripts/sql/database.sql
# Install docker-compose

printf "\n** Installation docker-compose **\n"
sudo apt install docker-compose -y

printf "\n** Building/Starting docker-compose **\n"
docker-compose up -d

printf "\n*** END ***\n"