

/*

* 1.月指定で開催情報を取得しDBに保存する
* node kaisai-info.js 2023 05

* 2.日付指定でどこの競馬場が開催されているか競馬場コードを返すAPIを起動する
* node api-todays-venue.js &
* http://localhost:3000/api-venue/2023-05-05

* 3.日付を指定して開催レース数を取得し、MySQLに保存する
*node save-race-count-by-date.js yyyymmdd

* 4.日付と競馬場コードを指定して開催レース数を取得し、MySQLに保存するこのプログラムはsave-race-count-by-date.jsから呼び出される
* node race-count-to-db.js 2023050519

*/