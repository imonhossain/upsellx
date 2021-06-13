const db = require("../models");
const ClientInfo = db.clientInfos;

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function main(url) {
  const allData = {
    url,
    posts: [],
    prices: [],
    copyright: "",
    facebookInfo: {}
  }
  const facebookInfo = {}

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.content();
  const $ = cheerio.load(html);

  const facebookURL = $("a[href*=www.facebook.com]").attr("href");
  const blogPageURL = $(`a[href*=${url}blog]`).attr("href");
  const pricingURL = $(`a[href*=${url}pricing]`).attr("href");
  console.log("blogPageURL", blogPageURL);
  console.log("pricingURL", pricingURL);

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

  if (blogPageURL) {
    const posts = []
    console.log("blogPageURL", blogPageURL);
    const subPage = await browser.newPage();
    await subPage.goto(blogPageURL);
    const subHtml = await subPage.content();
    const sub$ = cheerio.load(subHtml);
    allData.posts.length = 0;
    sub$('.main .post.status-publish').each((index, item) => {
      let postObj = {}
      console.log(sub$(item).find('.blog-title a').text());
      postObj.title = sub$(item).find('.title-header .title a').text();
      postObj.link = sub$(item).find('a').attr('href');
      postObj.imageUrl = sub$(item).find('.featured-image').attr('style');
      postObj.postDate = sub$(item).find('p.hide').text();
      postObj.category = [];
      $(item).find(".title-cats").each(subItem => {
        postObj.category.push(subItem);
      })
      allData.posts.push(postObj);
    });
    // allData.posts = posts;
  }

  if (pricingURL) {
    allData.prices.length = 0;
    console.log("pricingURL", pricingURL);
    const subPage = await browser.newPage();
    await subPage.goto(pricingURL);
    const subHtml = await subPage.content();
    const sub$ = cheerio.load(subHtml);

    sub$('.cell.large-4 .package').each((index, item) => {
      let pricesObj = {}
      pricesObj.name = sub$(item).find('.cell-body .name').text().trim();
      pricesObj.amount = sub$(item).find('.cell-body .amount span:last').text().trim();
      if (!pricesObj.amount) {
        pricesObj.amount = sub$(item).find('.cell-body .amount').text().trim();
      }
      pricesObj.amountType = sub$(item).find('.per').text().trim();
      pricesObj.title = sub$(item).find('.title').text().trim();
      console.log("pricesObj.title", pricesObj.title);
      pricesObj.link = sub$(item).find('.learnmore a').attr('href');
      // prices.push(pricesObj);
      allData.prices.push(pricesObj);
    });
  }

  if (url.includes('metigy.com')) {
    console.log("include");
    allData.copyright = $(".copyright").text();
  }
  // console.log("allData", allData);

  allData.facebookInfo = facebookInfo;
  return allData;

}
module.exports = {
  saveClientInfo: (data, callBack) => {
    main(data.url).then(allData => {
      const clientInfo = new ClientInfo({
        url: allData.url,
        facebookInfo: allData.facebookInfo,
        prices: allData.prices,
        posts: allData.posts,
      });
      return callBack(null, clientInfo);
    });
  },
};
