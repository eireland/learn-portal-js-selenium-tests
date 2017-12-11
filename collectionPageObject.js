var BaseObject = require('./webdriverBase');
var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;

const
  COLLECTION_HEADER = {css: '.portal-pages-collections-page-header'},
  COLLECTION_CARD = {css: '.portal-pages-collections-card'},
  COLLECTION_CARD_IMAGE = {css: '.portal-pages-collections-card-image-preview'},
  COLLECTION_CARD_NAME = {css: '.portal-pages-collections-card-name'},
  COLLECTION_CARD_DESCRIPTION = {css: '.portal-pages-collections-card-description'},
  SRF_HOME_LINK = {css: '.special-link'};

class CollectionPageObject extends BaseObject {
  constructor() {
    super();
  }

  verifyCollectionPage () {
    return assert(driver.isDisplayed(COLLECTION_HEADER));
  }
}

module.exports = new CollectionPageObject();
