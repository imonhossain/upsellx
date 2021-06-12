const db = require("../models");
const ClientInfo = db.clientInfos;

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function main(url) {
  const allData = {}
  allData.url = url;
  const facebookInfo = {}

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.content();
  const $ = cheerio.load(html);

  const facebookURL = $("a[href*=www.facebook.com]").attr("href");

  if (facebookURL) {
    const facebookPage = await browser.newPage();
    await facebookPage.goto(facebookURL);
    const facebookHtml = await facebookPage.content();
    const facebook$ = cheerio.load(facebookHtml);

    facebookInfo.name = facebook$('._64-f span').text();
    facebookInfo.address = facebook$('._2wzd').text();
    facebook$('._4bl9 > div').each((index, element) => {
      if (index === 6) {
        facebookInfo.phone = facebook$(element).text();
      }
    })
    facebookInfo.businessType = facebook$('#seo_h1_tag ._1c03').text();
  }
  allData.facebookInfo = facebookInfo;
  return allData;

}
module.exports = {
  saveClientInfo: (data, callBack) => {
    main(data.url).then(allData => {
      const clientInfo = new ClientInfo({
        url: allData.url,
        facebookInfo: allData.facebookInfo,
      });
      return callBack(null, clientInfo);
    });
  },
};
