const yaml = require('js-yaml');
const fs = require('fs');
const puppeteer = require('puppeteer');
const utils = require('./src/utils.js')

let config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
        

puppeteer.launch({
    headless: false,
    slowMo: 25 // 遅延時間
}
).then(async browser => {

    const page = await browser.newPage();
    await page.goto(config.url);

    //ログインIDとパスワードの入力
    await page.type("#idId", config.userId);
    await page.type("#idPassword", config.password);

    await page.click('#idLogin');

    //↓上手く行かないので、単純にwait
    //await page.waitForNavigation({waitUntil: 'domcontentloaded'});
    await page.waitFor(5000);

    const divbox = await page.$('div[class="box01 box firstBox"]')
    await divbox.click('a');
    await page.waitFor(5000);

    let arrayDate = [];
    let arrayDaysUsed = [];
    let arrayAmountUsed = [];
    let arrayCharge = [];

    const tables = await page.$$('table[class="view_table"]');

    for(table of tables){

        const trs = await table.$$('tr')

        for(tr of trs){

            let tempArray = await tr.$$eval('th', items => {

                let retArray = [];

                for(item of items){

                    if(item.textContent === "年月") continue;

                    retArray.push(item.textContent);

                }

                return retArray;
            });

            Array.prototype.push.apply(arrayDate, tempArray);

            tempArray = await utils.asyncTransformTr2Array(tr);

            console.log("tempArray:", tempArray);


        }


    }

    //結果をファイルに出力
    fs.writeFile('result.csv', arrayDate.toString(),(err) => {
        if (err) throw err;
       console.log('done');
    });


    await page.screenshot({path: 'screenshot2.png'});
    browser.close();
  });
  