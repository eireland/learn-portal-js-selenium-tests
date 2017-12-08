var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;
var fs = require('fs');
var util = require('util');

var driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth()+1;
  var dd = this.getDate();

  return [this.getFullYear(), !mm[1] && '0', mm, !dd[1] && '0', dd].join('')
};


class BaseObject {

  constructor() {
      global.driver = driver;
  }

  async visit (url) {
    await driver.get(url);
  }

  async manageWindowSize(width,height) {
    await driver.manage().window().setSize(width,height);
  }

  maximizeWindowSize() {
    driver.manage().maximize();
  }

  verifyPage(title) {
    driver.getTitle().then(function(page_title) {
      assert.equal(title, page_title);
    })
  }

  async getPageTitle() {
    return driver.getTitle();
  }

  async getCurrentUrl() {
    return driver.getCurrentUrl();
  }

  async find(locator){ //locator is JSON object of form {id:'selector'} ie.{className: "class_name"}, {css: "#div > input[type='checkbox']}
    await driver.findElement(locator);
  }

  async findAll(locator){ //locator is JSON object of form {id:'selector'} ie.{className: "class_name"}, {css: "#div > input[type='checkbox']}
    await driver.findElements(locator);
  }

  async clear(locator) {
    var el = await driver.findElement(locator)
    await el.clear();
  }

  async type(locator, input) {
    var el = await driver.findElement(locator)
    await el.clear();
    await el.sendKeys(input);
  }

  async clickOn(locator) {
    var el = await driver.findElement(locator)
    await el.click();
  }

  async clickWithOffset(locator, xoffset,yoffset) {
    var element = await driver.findElement(locator);
    driver.actions().mouseMove(element, xoffset,yoffset).click().perform();
  }

  async clickHold(locator, duration) {
    var element = await driver.findElement(locator);
    driver.actions().mouseDown().mouseMove(element).mouseUp().perform();
    driver.sleep(duration);
    driver.actions().release(element).perform();
  }

  async hover(locator) {
    var element = await driver.findElement(locator);
    driver.actions().mouseMove(element).perform();
  }

  async displayed(locator) {
    assert(await driver.findElement(locator)).isDisplayed()
  }

  async textOf(locator) {
    var el = await driver.findElement(locator);
    await el.getText().then(function(text) {
      console.log("Text is " + text); //return text
    });
  }

  async title() {
    driver.getPageTitle().then(function(text) {console.log("Page title is " + text);});
  }

  saveScreenshot(dir, pageTitle, counter) {
    console.log("In page screenshot. Page title is " + pageTitle);
    var filename = pageTitle.replace(/[?\/\s]/g, '_');
    if (filename.length > 20) {
      var new_filename = filename.substr(0,30);
      filename = new_filename;
    }
    filename = dir+filename+"_" +counter;

    driver.takeScreenshot().then(this.writeScreenshot.bind(null,filename));
  }

  writeScreenshot(filename, data) {
    console.log("in write screenshot");
    console.log("filename is "+filename);
    var date = new Date().yyyymmdd() + ".png";
    fs.writeFileSync(filename, data, 'base64');
  }

  //TODO: Need function for getting and writing browser logs

  teardown() {
    driver.quit();
  }

  waitFor(locator) {
    driver.wait(function(locator){
      return driver.isElementPresent(locator);}, 45000);
  }

  waitUntil(locator) {
    driver.manage().timeouts().implicitlyWait(11000);
  }

  sleepWait(duration) {
    driver.sleep(duration);
  }

  switchToMain() {
    driver.switchTo().defaultContent();//back to main window
  }

  switchToAlert() {
    driver.switchTo. alert();
  }

  switchToModal() {
    driver.getAllWindowHandles().then(function(allWindows) {
      //switch to modal
      driver.switchTo().window(allWindows[allWindows.length-1]);
    });
  }

  async switchToiFrame(name) { //name = "attr_text" ex. iframe name='iframe_name'=>attr_text="iframe_name"
    await driver.switchTo.frame(name)
  }

  async getTabHandles() {
    return await driver.getAllWindowHandles();
  }

  async switchToTab(handle) {
    console.log("In switch to tab")
    await driver.switchTo().window(handle);
  }

  switchToFirstTab() {
    driver.getAllWindowHandles().then(function(allWindows) {
      driver.switchTo().window(allWindows[0])});
  }

  switchToLastTab() {
    driver.getAllWindowHandles().then(function(allWindows) {
      driver.switchTo().window(allWindows[allWindows.length-1])
    })
  }

  async closeTab(handle) {
    await driver.switchTo().window(handle).then(function(window) {
      driver.close();
    })
  }

  switchToLastWindow() {
    driver.getAllWindowHandles().then(function(allWindows) {
      driver.switchTo().window(allWindows[allWindows.length - 1]);
    })
  }

  selectMenuItem(menuItemText){
    var menuItem = {xpath: "//div/a[contains(@class,'menu-item')]/span[contains(text(),'"+menuItemText+"')]"};
    waitFor(menuItem);
    clickOn(menuItem);
  }

  selectFromDropdown(dropdown, dropdownLocator, item) {
    console.log("in select from dropdown");
    var dropdownLocation = find(dropdown);
    clickOn(dropdown);
    driver.sleep(3000);
    var list_item = {xpath: '"'+dropdownLocator+'ul/li/a[contains(text(),"'+item+'")]'}
    clickOn(list_item);
  }

  getLink(pageLocator) {
    return pageLocator.attribute('href');
  }



  chromePrint(type) {
    var print_save_button =  {css: '#print-header > div > button.print.default'},
        change_destination = {css: '#destination-settings > div.right-column > button'},
        pdf = {xpath: '//ul/li/span/span[contains(@title,"Save as PDF")]'};
    var destination, keys;
    switch (type) {
      case "pdf":
        destination = pdf;
        break;
    }
    switchToLastWindow();
    clickOn(change_destination);
    driver.sleep(2000);
    clickOn(destination);
    clickOn(print_save_button);
    driver.sleep(1000);
    keys = 'return';
    util.debug('osascript -e \'tell application "System Events" to keystroke ' + keys + "'");
  }
}

module.exports = BaseObject;
