# 地方競馬(ばんえい意外）の開催情報をDBに保存します。
# src
git clone 'https://github.com/kenchanbaken/todo_app_php_v4-master.git'
# node.js v18.16.0
npm install
# config.jsを手動で作成してください。
module.exports = {
  mysql: {
    user: 'youruser',
    password: 'yourepass'
  }
}
# MySQL
CREATE DATABASE localkeiba CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

# table
see localkeiba.sql

# exec
node kaisai-info.js

