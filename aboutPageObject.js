var BaseObject = require('./webdriverBase');
var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;

const   ABOUT_HEADER = {xpath: '//h1[contains(text(),"About")]'};


class AboutPageObject extends BaseObject {
  constructor() {
    super();
  }

  verifyAboutPage() {
    return assert(driver.isDisplayed(ABOUT_HEADER));
  }
}

module.exports = new AboutPageObject();
