const db = require("../models");
const ClientInfo = db.clientInfos;
const puppeteer = require('puppeteer');
const jquery$ = require('jquery');
const cheerio = require('cheerio');
var request = require('request')

async function main(url) {
  const allData = {
    url,
    posts: [],
    prices: [],
    copyright: "",
    facebookInfo: {},
    linkedInInfo: {},
    twitterInfo: {},
    socialLinks: {},
  }
  const facebookInfo = {}

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.content();
  const $ = cheerio.load(html);

  const FACEBOOK_URL = $("a[href*=facebook.com]").attr("href");
  const LINKEDIN_URL = $("a[href*=linkedin.com]").attr("href");
  const TWITTER_URL = $("a[href*=twitter.com]").attr("href");
  const YOUTUBE_URL = $("a[href*=youtube.com/]").attr("href");
  const INSTAGRAM_URL = $("a[href*=www.instagram.com/]").attr("href");


  const blogPageURL = $(`a[href*=${url}blog]`).attr("href");
  const pricingURL = $(`a[href*=${url}pricing]`).attr("href");
  console.log("blogPageURL", blogPageURL);
  console.log("pricingURL", pricingURL);

  if (FACEBOOK_URL) {
    const facebookPage = await browser.newPage();
    await facebookPage.goto(FACEBOOK_URL);
    const facebookHtml = await facebookPage.content();
    const facebook$ = cheerio.load(facebookHtml);
    allData.socialLinks.facebookLink = FACEBOOK_URL;
    facebookInfo.name = facebook$('._64-f span').text();
    facebookInfo.address = facebook$('._2wzd').text();
    facebook$('._4bl9 > div').each((index, element) => {
      if (index === 6) {
        facebookInfo.phone = facebook$(element).text();
      }
    })
    facebookInfo.businessType = facebook$('#seo_h1_tag ._1c03').text();
  }

  if (LINKEDIN_URL) {
    allData.socialLinks.linkedInLink = LINKEDIN_URL;
    // console.log("LINKEDIN_URL", LINKEDIN_URL);
    // const subPage = await browser.newPage();
    // await subPage.goto(LINKEDIN_URL);
    // const subHtml = await subPage.content();
    // const sub$ = cheerio.load(subHtml);
    // allData.linkedInInfo.logoUrl = sub$('.org-top-card-primary-content__logo-container').attr('src');
    // allData.linkedInInfo.name = sub$('.block.mt2 h1.t-24.t-black.t-bold.full-width >span').text().trim();
    // allData.linkedInInfo.sortDesc = sub$('.org-top-card-summary__tagline').text().trim();
    // allData.linkedInInfo.employeeSize = sub$('.org-top-card-secondary-content__connection .ember-view .org-top-card-secondary-content__see-all').text().trim();

  }
  if (TWITTER_URL) {
    console.log("TWITTER_URL", TWITTER_URL);
    allData.socialLinks.twitterUrl = TWITTER_URL;
    const subPage = await browser.newPage();
    await subPage.goto(TWITTER_URL);
    const subHtml = await subPage.content();
    const sub$ = cheerio.load(subHtml);
    allData.twitterInfo.logoUrl = sub$('.css-901oao css-16my406.r-poiln3.r-bcqeeo.r-qvutc0').attr('src');
    allData.twitterInfo.name = sub$('.css-901oao css-16my406.r-poiln3.r-bcqeeo.r-qvutc0').text().trim();
    allData.twitterInfo.sortDesc = sub$('css-901oao.css-16my406').text().trim();
    allData.twitterInfo.following = sub$('a.css-4rbku5.css-18t94o4 .r-qvutc0').text().trim();
    allData.twitterInfo.follower = sub$('.css-1dbjc4n .r-18jsvk2 .r-qvutc0').text().trim();

  }
  if (YOUTUBE_URL) {
    allData.socialLinks.youtubeLink = YOUTUBE_URL;
  }
  if (INSTAGRAM_URL) {
    allData.socialLinks.instagramLink = INSTAGRAM_URL;
  }

  // var service_url = 'https://kgsearch.googleapis.com/v1/entities:search?callback=?';
  // var params = {
  //   'query': 'Taylor Swift',
  //   'limit': 10,
  //   'indent': true,
  //   'key': '',
  // };

  // try {
  //   console.log("params", params);
  //   await request({ url: service_url, qs: params }, function (err, response, body) {
  //     if (err) { console.log(err); return; }
  //     console.log("Get response: " + response);
  //     console.log("Get body: " + body);
  //   });
  // } catch (error) {
  //   console.log("error ", error);
  // }



  if (blogPageURL) {
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
      console.log("allData", allData);
      const clientInfo = new ClientInfo({
        url: allData.url,
        facebookInfo: allData.facebookInfo,
        twitterInfo: allData.twitterInfo,
        linkedInInfo: allData.linkedInInfo,
        prices: allData.prices,
        posts: allData.posts,
        socialLinks: allData.socialLinks,
      });
      return callBack(null, clientInfo);
    });
  },
};
