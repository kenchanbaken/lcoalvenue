/**
 * kaisai-info.js
 * 
 * DDL
  CREATE TABLE `calendar` (
    `id` int(11) NOT NULL,
    `race_date` date DEFAULT NULL,
    `venue` varchar(255) DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  ALTER TABLE `calendar`
    ADD PRIMARY KEY (`id`);
  ALTER TABLE `calendar`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;
*/
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const mysql = require('mysql2/promise');
const options = new chrome.Options();
options.addArguments('--headless');
const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();
// 当月の開催情報を取得する。このページにはデフォルトで当月分のみの情報が表示されます。
driver.get('https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop');
var venuPositionIndex = {
  //"帯広ば": 3,
  "門別": 4,
  "札幌": 5,
  "盛岡": 6,
  "水沢": 7,
  "浦和": 8,
  "船橋": 9,
  "大井": 10,
  "川崎": 11,
  "金沢": 12,
  "笠松": 13,
  "名古屋": 14,
  "中京": 15,
  "園田": 16,
  "姫路": 17,
  "高知": 18,
  "佐賀": 19
};

/**
 * readVenuOnce(venue)
 * @param {*} venue 
 * @returns results
 */
async function readVenuOnce(venue) {
  var results = {};
  try {
    var now = new Date();
    var currentMonth = now.getMonth() + 1;
    var venuPosition = venuPositionIndex[venue];
    var xpathDays = new Array();
    for (var i = 0; i < 31; i++) {
      var wkString = '//*[@id="mainContainer"]/article/div/div[2]/table/tbody/tr[' + venuPosition + ']/td[' + (i + 1) + ']';
      xpathDays.push(wkString);
    }
    for (var i = 0; i < 31; i++) {
      var wkString = xpathDays[i];
      var elem = await driver.findElement(webdriver.By.xpath(wkString));
      var text = await elem.getText();
      if ((text.includes('●')) || (text.includes('D')) || (text.includes('☆'))) {
        var key = "202304" + ("0" + (i)).slice(-2);
        results[key] = venue;
      }
    }
    return results;
  } catch (error) {
    console.error(error);
  }
}

async function saveResultToMysql(results) {
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

    for (const key of Object.keys(results)) {
      const venue = results[key];
      await connection.execute('REPLACE INTO calendar (race_date, venue) VALUES (?, ?)', [key, venue]);
    }

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

Promise.all([
  readVenuOnce('門別'),
  readVenuOnce('札幌'),
  readVenuOnce('盛岡'),
  readVenuOnce('水沢'),
  readVenuOnce('浦和'),
  readVenuOnce('船橋'),
  readVenuOnce('大井'),
  readVenuOnce('川崎'),
  readVenuOnce('金沢'),
  readVenuOnce('笠松'),
  readVenuOnce('名古屋'),
  readVenuOnce('中京'),
  readVenuOnce('園田'),
  readVenuOnce('姫路'),
  readVenuOnce('高知'),
  readVenuOnce('佐賀')
])
.then((results) => {
  results.forEach((result) => {
    console.log(result);
    saveResultToMysql(result)
      .then(() => {
        console.log('Saved to MySQL!');
      })
      .catch((error) => {
        console.error(error);
      });
  });
})
.catch((error) => {
  console.error(error);
});


