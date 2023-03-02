#!/bin/bash


sudo yum -y update
sudo yum -y upgrade

echo sudo unzip webapp.zip
mkdir webapp
tar -xvf webapp.tar.gz -C webapp/

curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install 16.9.1

cd webapp
npm install

# NODE_ENV=$NODE_ENV PGUSER=$PGUSER PGHOST=$PGHOST PGPASSWORD=$PGPASSWORD PGDATABASE=$PGDATABASE PGPORT=$PGPORT SERVERPORT=$SERVERPORT npx sequelize-cli db:migrate

echo sudo touch /etc/systemd/system/webApp.service
touch webApp.service
chmod 755 webApp.service

cat << EOF >> webApp.service
[Unit]
Description=webApp
Documentation=https://github.com/shivamt24
After=network.target

[Service]
Environment=APP_NAME="webapp"
EnvironmentFile=-/home/ec2-user/nodeEnvVars
RestartSec=10
Restart=always
Type=simple
User=ec2-user
ExecStart=/home/ec2-user/.nvm/versions/node/v16.9.1/bin/node /home/ec2-user/webapp/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target

EOF

sudo mv webApp.service /etc/systemd/system/webApp.service

sudo systemctl daemon-reload
sudo systemctl enable webApp
sudo systemctl stop webApp












