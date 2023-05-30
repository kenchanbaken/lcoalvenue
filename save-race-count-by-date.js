/*
* save-race-count-by-date.js
* @auther kenchanbaken@gmail.com
* save-race-count-by-date.js yyyymmdd
* 1.CALL api-todays-venu.js
* http://localhost:3000/api-venue/yyyy-mm-dd
* return [{"venucode":19},{"venucode":24},{"venucode":27}]
* 2.then save to database localkeiba.race_cnt by  yyyymmdd+venucode : node race-count-to-db.js yyyymmdd+venucode
*/

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const mysql = require('mysql2/promise');
const options = new chrome.Options();
options.addArguments('--headless', '--disable-cache');
const driver = new webdriver.Builder();

// 1.yyyymmddを引数で受け取る
const [,, dateString] = process.argv;
const yyyymmdd = dateString.slice(0, 8);
const fetch = require('node-fetch');

/*
* getVenuCodes(yyyymmdd)
* @arg yymmdd String
* http://localhost:3000/api-venue/yyyy-mm-dd を呼び出して　指定日に開催されるvenuCodesを複数取得する。
*/
async function getVenuCodes(yyyymmdd) {
  const response = await fetch(`http://localhost:3000/api-venue/${yyyymmdd}`);
  const data = await response.json();
  const venuCodes = data.map(item => item.venucode);
  return venuCodes;
}

function executeCommand(command) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

async function saveRaceCount(yyyymmdd, venuCodes) {
  for (let i = 0; i < venuCodes.length; i++) {
    const venuCode = venuCodes[i];
    const command = `node race-count-to-db.js ${yyyymmdd}${venuCode}`;
    await executeCommand(command);
  }
}

(async () => {
  const venuCodes = await getVenuCodes(yyyymmdd);
  await saveRaceCount(yyyymmdd, venuCodes);
  console.log('All commands executed successfully!');
})();
