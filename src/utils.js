const puppeteer = require('puppeteer');

async function asyncTransformTr2Array(tr){

    console.log("test");

    let retArray = await tr.$$eval('td', items => {

        let tempArray = [];

        for(item of items){

            if(item.textContent === "年月" || item.textContent === "使用日数" || item.textContent === "使用量") continue;

            tempArray.push(item.textContent);

        }

        return tempArray;
    });

    return retArray;

} 