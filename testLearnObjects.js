async function testLearnObjects() {
  const portal = require('./portalPagesObject');
  const searchPage = require('./searchPageObject');
  const aboutPage = require('./aboutPageObject');
  const learnHeader = require('./learn_component_object/learnHeader');
  const collectionPage = require('./collectionPageObject');
  const homeDir = require('os').homedir();

  const REGISTER_MODAL_HEADER = {css: '#signup-default-modal > div > div > h2 > strong'};


  var url = 'https://learn.concord.org/';
  var adminName = 'ETestadmin',
      adminPassword = 'ETestadmin';


  portal.manageWindowSize(1680, 1023);
  portal.visit(url);
  portal.verifyPage("STEM Resource Finder");
  console.log("Open Collection Page");
  portal.clickLink('collection');
  portal.verifyCollectionPage();
  console.log("Open About page");
  portal.clickLink('about');
  portal.verifyAboutPage();
  console.log("Open Landing Page");
  portal.clickLink('logo');
  portal.verifyLandingPage();
  portal.clickButton('login');
  portal.login(adminName, adminPassword);

  if (portal.verifyAuthUser('admin')){
    console.log("Auth verified");
  }
  else {console.log("Auth not verified")}

  portal.logout();
  portal.clickButton('register');
  portal.switchToModal();
  var modalHeader = portal.find(REGISTER_MODAL_HEADER).text;
  console.log("Header is " + modalHeader);
  portal.closeModal();
}

testLearnObjects();