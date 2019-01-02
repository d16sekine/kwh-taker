const yaml = require("js-yaml");
const fs = require("fs");
const puppeteer = require("puppeteer");
const utils = require("./utils.js");
const csv = require("csv");

let config = yaml.safeLoad(fs.readFileSync("./config.yml", "utf8"));
        

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

    await page.click("#idLogin");

    //↓上手く行かないので、単純にwait
    //await page.waitForNavigation({waitUntil: "domcontentloaded"});
    await page.waitFor(3000);

    const divbox = await page.$('div[class="box01 box firstBox"]')
    await divbox.click("a");
    await page.waitFor(3000);

    let arrayDate = ["年月"];
    let arrayDaysUsed = ["使用日数"];
    let arrayAmountUsed = ["使用量"];
    let arrayCharge = ["請求金額"];

    const tables = await page.$$('table[class="view_table"]');

    for(table of tables){

        const trs = await table.$$("tr")

        for(tr of trs){

            let tempArray = await tr.$$eval("th", items => {

                let retArray = [];

                for(item of items){

                    if(item.textContent === "年月") continue;

                    retArray.push(item.textContent);

                }

                return retArray;
            });

            Array.prototype.push.apply(arrayDate, tempArray);

            tempArray = await utils.asyncTransformTr2Array(tr);

            //console.log("tempArray[0]", tempArray[0]);

            if(tempArray[0] === undefined) continue;

            let tempStr = tempArray[0].toString();

            if(tempStr.match(/使用日数/)){
                tempArray.shift();
                Array.prototype.push.apply(arrayDaysUsed, tempArray);
            }

            if(tempStr.match(/使用量/)){
                tempArray.shift();
                Array.prototype.push.apply(arrayAmountUsed, tempArray);
            }

            if(tempStr.match(/請求金額/)){
                tempArray.shift();
                Array.prototype.push.apply(arrayCharge, tempArray);
            }

        }


    }

    // console.log("arrayDayUsed:", arrayDaysUsed)
    // console.log("arrayAmountUse:", arrayAmountUsed)
    // console.log("arrayCharge:", arrayCharge)

    let arrayOutput = [];

    for(let i = 0; i < arrayDate.length; i++){

        let array1 = [];

        array1.push(arrayDate[i]);
        array1.push(arrayDaysUsed[i]);
        array1.push(arrayAmountUsed[i]);
        array1.push(arrayCharge[i]);

        arrayOutput.push(array1);

    }

    //結果をファイルに出力

    csv.stringify(arrayOutput, function(err, output){

        fs.writeFile("result.csv", output,(err) => {
            if (err) throw err;
           console.log("done");
        });

    })
    //await page.screenshot({path: "screenshot2.png"});
    browser.close();
  });
  