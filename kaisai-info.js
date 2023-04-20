const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const mysql = require('mysql2/promise');
const options = new chrome.Options();
options.addArguments('--headless');
const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();
//当月を取得する。このページにはデフォルトで当月分のみの情報が表示されます。
driver.get('https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop');
var venuPositionIndex=[];
venuPositionIndex["帯広ば"]=3;
venuPositionIndex["門別"]= 4;
venuPositionIndex["札幌"]= 5;
venuPositionIndex["盛岡"] = 6;
venuPositionIndex["水沢"] = 7;
venuPositionIndex["浦和"] =8;
venuPositionIndex["船橋"]=9;
venuPositionIndex["大井"]=10;
venuPositionIndex["川崎"]=11;
venuPositionIndex["金沢"]=12;
venuPositionIndex["笠松"]=13;
venuPositionIndex["名古屋"]=14;
venuPositionIndex["中京"]=15;
venuPositionIndex["園田"]=16;
venuPositionIndex["姫路"]=17;
venuPositionIndex["高知"]=18;
venuPositionIndex["佐賀"]=19;
var results = {};

function readVenuOnce(argVenu) {
  return new Promise(async (resolve, reject) => {
    try {
      
      var now = new Date();
      var currentMonth = now.getMonth()+1;
      venuPositionIndex= venuPositionIndex[argVenu];
      var xpathDays = new Array();
      for (var i = 0; i < 31; i++) { 
        var wkString = '//*[@id="mainContainer"]/article/div/div[2]/table/tbody/tr['+venuPositionIndex+']/td[' + (i+1) + ']'; 
        xpathDays.push(wkString);
      }

      for (var i = 0; i < 31; i++) { 
        var wkString = xpathDays[i];
        var elem = await driver.findElement(webdriver.By.xpath(wkString));
        var text = await elem.getText();
        if ( (text.includes('●')) || (text.includes('D')) || (text.includes('☆'))) {
          var key = "202304" + ("0" + (i)).slice(-2); 
          results[key] = argVenu;
        }
      }
      resolve(results);
    } catch (error) {
      reject(error);
    } finally {
      await driver.quit();
    }
  });
}
const config = require('./config.js');

async function saveResultToMysql(results) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: config.mysql.user,
      password: config.mysql.password,
      database: 'localkeiba'
    });

    await connection.beginTransaction();

    for (const key in results) {
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
  readVenuOnce('船橋'),
  readVenuOnce('大井')
])
.then((results) => {
  results.forEach((result) => {
    console.log(result);
    saveResultToMysql(result);
  });
})
.catch((error) => {
  console.error(error);
});

/*
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