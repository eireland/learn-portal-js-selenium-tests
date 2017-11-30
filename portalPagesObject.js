var BaseObject = require('./webdriverBase');
var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;
var driver;
var searchPageObject=require('./searchPageObject');



class PortalPagesObject extends BaseObject {

  constructor() {
    super();
    global.searchPage = searchPageObject;
  }

}
module.exports = new PortalPagesObject();