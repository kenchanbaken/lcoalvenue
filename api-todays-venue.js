// how to start
// node api-todays-venue.js & start http://localhost:3000
// how to shutdown 
// Stop-Job -Id 1
const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const app = express();
const config = require('./config.js');

// MySQL接続
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.mysql.user,
  password: config.mysql.password,
  database: 'localkeiba'
});

// MySQL接続確認
connection.connect((error) => {
  if (error) {
    console.log('MySQL connection error:', error);
    throw error;
  }
  console.log('Connected to MySQL');
});

// 本日の日付を取得
const today = moment().format('YYYY-MM-DD');

// 本日の開催レースコードを取得するAPI
app.get('/api-todays-venue', (req, res) => {
  const query = 'SELECT venucode FROM calendar WHERE race_date = ?';
  connection.query(query, [today], (error, results) => {
    if (error) {
      console.log('MySQL query error:', error);
      throw error;
    }
    res.json(results);
  });
});

// サーバーを起動
const server = app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// サーバー終了時のMySQL接続切断処理
process.on('SIGINT', () => {
  console.log('Stopping server');
  server.close(() => {
    console.log('Server stopped');
    connection.end((error) => {
      if (error) throw error;
      console.log('Disconnected from MySQL');
      process.exit();
    });
  });
});
