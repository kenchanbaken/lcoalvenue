/**
 * kaisai-info.js
 * how to  start: node kaisai-info.js 2023 06
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
const args = process.argv.slice(2);
const year = args[0];
const month = args[1];

const url = `https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop?k_year=${year}&k_month=${month}`;
driver.get(url);

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
var venuecodes = {
  10: "盛岡",
  11: "水沢",
  18: "浦和",
  19: "船橋",
  20: "大井",
  21: "川崎",
  22: "金沢",
  23: "笠松",
  24: "名古屋",
  25: "中京",
  27: "園田",
  28: "姫路",
  31: "高知",
  32: "佐賀",
  36: "門別",
  43: "岩手"
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
      if ((text.includes('●')) || (text.includes('Ｄ')) || (text.includes('☆'))) {
        var key = year + ("0" + month).slice(-2) + ("0" + (i + 0)).slice(-2);
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
      const code = Object.keys(venuecodes).find((key) => venuecodes[key] === venue);
      await connection.execute('REPLACE INTO calendar (race_date, venucode, venue) VALUES (?, ?, ?)', [key, code, venue]);
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