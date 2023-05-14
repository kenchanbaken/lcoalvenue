/**
 * 
 * node race-count-to-db.js 2023051431
 */
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const mysql = require('mysql2/promise');
const options = new chrome.Options();
options.addArguments('--headless', '--disable-cache');

const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();
  driver.manage().deleteAllCookies();
// ページを開く前にキャッシュをクリアする
driver.executeScript(() => {
  // Cookieを削除する
  document.cookie = '';
  // キャッシュを削除する
  caches.keys().then(function(names) {
    for (let name of names)
      caches.delete(name);
  });
});

async function getRaceCount(url) {
  await driver.get(url);
  const tables = await driver.findElements(webdriver.By.css('table'));
  const raceListTable = tables[0]; // 一番最初のtable要素を取得
  const rows = await raceListTable.findElements(webdriver.By.css('tr'));
  const lastRow = rows[rows.length - 1];
  const raceCount = await lastRow.findElement(webdriver.By.css('td:nth-child(1)')).getText();
  return parseInt(raceCount);
}

async function main() {

  const [,, dateString] = process.argv;
  const yyyymmdd = dateString.slice(0, 8);
  const venuCode = dateString.slice(8);
  const args = process.argv.slice(2);
  const year = yyyymmdd.slice(0, 4);
  const month = yyyymmdd.slice(4, 6);
  const day = yyyymmdd.slice(6, 8);

  const raceDate = `${year}/${month}/${day}`;
  const encodedRaceDate = encodeURIComponent(raceDate).replace(/%20/g, '%2f');
  const url = `https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${encodedRaceDate}&k_babaCode=${venuCode}`;
  console.log(url);
  const raceCount = await getRaceCount(url);
  console.log(`Race count: ${raceCount}`);
  const id = yyyymmdd + venuCode;
  await saveResultToMysql(id, raceCount);
}

async function saveResultToMysql(id,cnt) {
  console.log(`id,cnt: ${id}${cnt}`);
  const config = require('./config.js');
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: config.mysql.user,
      password: config.mysql.password,
      database: 'localkeiba'
    });
    await connection.beginTransaction();
    await connection.execute('REPLACE INTO race_cnt (id, cnt) VALUES (?, ?)', [id, cnt]);
    await connection.commit();
    console.log('Results saved to MySQL!');
  } catch (error) {
      await connection.rollback();
      console.error(error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}


main()
  .then(() => driver.quit())
  .catch((err) => {
    console.error(err);
    driver.quit();
  });