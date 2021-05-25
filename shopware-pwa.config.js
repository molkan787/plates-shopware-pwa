if(process.env.NODE_ENV == 'production'){
  module.exports = {
    shopwareEndpoint: "https://backend.reg4plates.com",
    shopwareAccessToken: "SWSCHRKDH6PMYCJHMGOEYUB15Q",
    pwaHost: "https://reg4plates.com/",
  };
}else{
  module.exports = {
    shopwareEndpoint: "http://localhost",
    shopwareAccessToken: "SWSCD0TWM0ZONXRMC2PLSGJOQQ",
    pwaHost: "https://pwa-demo-api.shopware.com/prev/",
  };

}