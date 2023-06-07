# 地方競馬(サラ系）の予想プログラムです。
# how to install
sudo yum install -y curl
curl -sL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs
node -v
npm install
sudo dnf install unzip
sudo dnf install nss
wget https://chromedriver.storage.googleapis.com/$(curl https://chromedriver.storage.googleapis.com/LATEST_RELEASE)/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
sudo mv chromedriver /usr/bin/
# init MYSQL
sudo mysql_secure_installation
# create database on MySQL
CREATE DATABASE localkeiba CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
# execute ddl
mysql -u youruser -p localkeiba < localkeiba.sql
# download src
git clone 'https://github.com/kenchanbaken/localvenue.git'
# vim config.js on current directory.
module.exports = {
  mysql: {
    user: 'youruser',
    password: 'yourepass'
  }
}
# 1.今月の開催情報をDBに登録します。
node kaisai-info.js
# 2.開催情報をAPIとして起動します。
node api-todays-venue.js &
# 3.本日開催されるレース情報をDBに登録します。
save-race-count-by-date.js yyyymmdd

