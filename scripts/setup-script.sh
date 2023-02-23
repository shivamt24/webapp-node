#!/bin/bash

NODE_ENV=dev 
PGUSER=thabes 
PGHOST=127.0.0.1 
PGPASSWORD=thabes 
PGDATABASE=api 
PGPORT=5432 
SERVERPORT=8080


sudo yum -y update
sudo yum -y upgrade


echo "Setting up Postgres Database"
sudo amazon-linux-extras enable postgresql14
sudo yum install postgresql-server -y
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

echo sudo systemctl status postgresql

sudo sed -i 's/host\s\+all\s\+all\s\+127\.0\.0\.1\/32\s\+ident/host    all             all             127.0.0.1\/32            md5/' /var/lib/pgsql/data/pg_hba.conf
sudo systemctl restart postgresql

sudo su postgres <<EOF
createdb  $PGDATABASE;
psql -c "CREATE USER $PGUSER WITH PASSWORD '$PGPASSWORD';"
psql -c "grant all privileges on database $PGDATABASE to $PGUSER;"
EOF

sudo su postgres -c "psql -d $PGDATABASE -U postgres"<<'EOF'
CREATE LANGUAGE plpgsql;
CREATE FUNCTION update_updated_on_product_task() RETURNS TRIGGER AS $$
BEGIN
NEW.date_last_updated = now();
RETURN NEW;
END;
$$ language 'plpgsql';

EOF


sudo su postgres -c "psql -d $PGDATABASE -U postgres"<<'EOF'
CREATE FUNCTION update_updated_on_user_task()
RETURNS TRIGGER AS $$
BEGIN
NEW.account_updated = now();
RETURN NEW;
END;
$$ language 'plpgsql';

EOF

echo sudo unzip webapp.zip
mkdir webapp
tar -xvf webapp.tar.gz -C webapp/


curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install 16.9.1

cd webapp
npm install

NODE_ENV=$NODE_ENV PGUSER=$PGUSER PGHOST=$PGHOST PGPASSWORD=$PGPASSWORD PGDATABASE=$PGDATABASE PGPORT=$PGPORT SERVERPORT=$SERVERPORT npx sequelize-cli db:migrate

echo sudo touch /etc/systemd/system/webApp.service
touch webApp.service
chmod 755 webApp.service

cat << EOF >> webApp.service
[Unit]
Description=webApp
Documentation=https://github.com/shivamt24
After=network.target

[Service]
Environment=NODE_ENV=$NODE_ENV 
Environment=PGUSER=$PGUSER 
Environment=PGHOST=$PGHOST 
Environment=PGPASSWORD=$PGPASSWORD 
Environment=PGDATABASE=$PGDATABASE 
Environment=PGPORT=$PGPORT 
Environment=SERVERPORT=$SERVERPORT
Environment=APP_NAME="webapp"
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
sudo systemctl start webApp
sudo systemctl enable webApp



echo node server.js


echo NODE_ENV=dev PGUSER=thabes PGHOST=127.0.0.1 PGPASSWORD=thabes PGDATABASE=api PGPORT=5432 SERVERPORT=8080 











