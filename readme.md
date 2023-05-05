# 地方競馬(サラ系）の予想プログラムです。
# src
git clone 'https://github.com/kenchanbaken/todo_app_php_v4-master.git'
# node.js v18.16.0
npm install
# config.jsを手動で作成します。
module.exports = {
  mysql: {
    user: 'youruser',
    password: 'yourepass'
  }
}
# MySQL
CREATE DATABASE localkeiba CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

# tableを作成します。
localkeiba.sql
# 1.今月の開催情報をDBに登録します。
node kaisai-info.js
# 2.開催情報をAPIとして起動します。
node api-todays-venue.js &
# 3.本日開催されるレース情報をDBに登録します。
save-race-count-by-date.js yyyymmdd


