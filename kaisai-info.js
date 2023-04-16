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
var venuIndex=[];
venuIndex["帯広ば"]=3;
venuIndex["門別"]= 4;
venuIndex["札幌"]= 5;
venuIndex["盛岡"] = 6;
venuIndex["水沢"] = 7;
venuIndex["浦和"] =8;
venuIndex["船橋"]=9;
venuIndex["大井"]=10;
venuIndex["川崎"]=11;
venuIndex["金沢"]=12;
venuIndex["笠松"]=13;
venuIndex["名古屋"]=14;
venuIndex["中京"]=15;
venuIndex["園田"]=16;
venuIndex["姫路"]=17;
venuIndex["高知"]=18;
venuIndex["佐賀"]=19;
var results = {};


function readVenuOnce(argVenu) {
  return new Promise(async (resolve, reject) => {
    try {
      
      var now = new Date();
      var currentMonth = now.getMonth()+1;
      venuIndex= venuIndex[argVenu];
      var xpathDays = new Array();
      for (var i = 0; i < 31; i++) { 
        var wkString = '//*[@id="mainContainer"]/article/div/div[2]/table/tbody/tr['+venuIndex+']/td[' + (i+1) + ']'; 
        xpathDays.push(wkString);
      }

      for (var i = 0; i < 31; i++) { 
        var wkString = xpathDays[i];
        var elem = await driver.findElement(webdriver.By.xpath(wkString));
        var text = await elem.getText();
        if (text.includes('●') || text.includes('D') || text.includes('☆')) {
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
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: config.mysql.user,
        password: config.mysql.password,
        database: 'localkeiba'
      });
    for (const key in results) {
      const venue = results[key];
      await connection.execute('REPLACE INTO calendar (race_date, venue) VALUES (?, ?)', [key, venue]);
    }
    console.log('Results saved to MySQL!');
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}



readVenuOnce('門別')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });
readVenuOnce('盛岡')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });

readVenuOnce('水沢')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });
readVenuOnce('浦和')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });

readVenuOnce('船橋')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });


readVenuOnce('大井')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });

readVenuOnce('川崎')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });

readVenuOnce('金沢')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });

readVenuOnce('笠松')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });

readVenuOnce('名古屋')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });

readVenuOnce('園田')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });

readVenuOnce('姫路')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });

readVenuOnce('高知')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });

readVenuOnce('佐賀')
  .then((result) => {
    console.log(result);
    saveResultToMysql(result);
  })
  .catch((error) => {
    console.error(error);
  });

