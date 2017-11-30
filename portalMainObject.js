var BaseObject = require('./webdriverBase');
var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;
var driver;

class PortalMainObject extends BaseObject {

}
module.exports = new PortalMainObject();
