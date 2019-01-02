const puppeteer = require('puppeteer');

exports.asyncTransformTr2Array = async (tr) => {

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