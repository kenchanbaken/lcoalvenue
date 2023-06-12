/*
* racing-form-to-db.js 
* how to start: node racing-form-to-db.js 202306091012
* @param {string} raceid
*   raceid is yyyymmdd+venucode+racenumber
* 
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
const [,, dateString] = process.argv;
const yyyymmdd = dateString.slice(0, 8);
const venuCode = dateString.slice(8,10);
const args = process.argv.slice(2);
const year = yyyymmdd.slice(0, 4);
const month = yyyymmdd.slice(4, 6);
const day = yyyymmdd.slice(6, 8);
const raceNumber = parseInt(dateString.slice(10));
const raceDate = `${year}/${month}/${day}`;
const encodedRaceDate = encodeURIComponent(raceDate).replace(/%20/g, '%2f');

// sample url
// https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/DebaTable?k_raceDate=2023%2f05%2f13&k_raceNo=1&k_babaCode=31

const url = `https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/DebaTable?k_raceDate=${encodedRaceDate}&k_raceNo=${raceNumber}&k_babaCode=${venuCode}`;
console.log(url);

async function main() {
  // WebDriverを起動
  const url = `https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/DebaTable?k_raceDate=${encodedRaceDate}&k_raceNo=${raceNumber}&k_babaCode=${venuCode}`;
  await driver.get(url);
  const tables = await driver.findElements(webdriver.By.css('table'));
  const raceListTable = tables[0]; // 一番最初のtable要素を取得
  console.log(raceListTable);
  
 // 馬番の取得
 const horseNums = await driver.executeScript(`return Array.from(document.querySelectorAll('.horseNum')).map(e => e.textContent)`);
 horseNums.pop(); // "馬番"を削除する
 console.log(`horseNums: ${JSON.stringify(horseNums)}`);
 // 枠番の取得
 const frameNums = await driver.executeScript(`return Array.from(document.querySelectorAll('.courseNum:not(.waku)')).map(elm => elm.textContent.trim())`);
 horseNums.pop(); // "枠番"を削除する
 console.log(`frameNums: ${JSON.stringify(frameNums)}`);
 
async function saveResultToMysql() 
{
  // replace into racing_form
  let id, frame_number,horse_number,horse_name,sex_age,hair,birthyear,birthymonth,sire,dam,broodmare_sire,jockey,affiliation,burden_weight,trainer,owner,breaeder
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
      await connection.execute('REPLACE INTO racing_form (id, frame_number,horse_number,horse_name,sex_age,hair,birthyear,birthymonth,sire,dam,broodmare_sire,jockey,affiliation,burden_weight,trainer,owner,breaeder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, frame_number,horse_number,horse_name,sex_age,hair,birthyear,birthymonth,sire,dam,broodmare_sire,jockey,affiliation,burden_weight,trainer,owner,breaeder]);
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
}
main()
  .then(() => driver.quit())
  .catch((err) => {
    console.error(err);
    driver.quit();
  });
