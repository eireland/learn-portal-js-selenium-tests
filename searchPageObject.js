var BaseObject = require('./webdriverBase');
var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;
//var driver;
const   SEQUENCE_CHECKBOX = {id: 'investigation'},
  ACTIVITIES_CHECKBOX = {id: 'Activity'},
  INTERACTIVE_CHECKBOX = {id: 'Interactive'},
  RUNS_IN_BROWSER_CHECKBOX = {id: 'runs_in_browser'},
  REQUIRES_DOWNLOAD_CHECKBOX = {id: 'requires_download'},
  TOTAL_NUM_MATERIALS = {css: '.materials_container > div:nth-child(2) > p:nth-child(1) > span:nth-child(1) > b:nth-child(2)'},
  NEXT_PAGE = {css: '.next'},
  PREVIEW_BUTTON = {xpath: '//a[contains(text(),"Preview")]'},
  MATERIAL_TITLE = {css: ".material_list_item"};

class SearchPageObject extends BaseObject {
  constructor(){
    super();
  }

  clickOnFilter(filter) {
    console.log('In click on filter. Filter is '+filter);
    switch (filter) {
      case 'sequence':
        super.clickOn(SEQUENCE_CHECKBOX);
        break;
      case 'activity':
        super.clickOn(ACTIVITIES_CHECKBOX);
        break;
      case 'interactive':
        super.clickOn(INTERACTIVE_CHECKBOX);
        break;
      case 'run in browser':
        super.clickOn(RUNS_IN_BROWSER_CHECKBOX);
        break;
      case 'requires download':
        super.clickOn(REQUIRES_DOWNLOAD_CHECKBOX);
    }
  }

  clickOnButton(button) {
    console.log('In click on button');
    switch (button) {
      case 'preview':
        super.clickOn(PREVIEW_BUTTON);
        break;
    }
  }

   async getNumPages() {
    console.log("In get num pages");
     var numTotal = driver.findElement(TOTAL_NUM_MATERIALS).getText().then(function(totalMaterials){
      var total = parseInt(totalMaterials);
      var guessPages = parseInt(total/10);
      var numPages = 0;
       if (!(total%10)==0){
         return numPages = guessPages+1;
       }
       else {
         return numPages = guessPages;
       }
      });
    return numTotal;
   }

  async nextPage() {
    console.log("in nextPage");
    await driver.findElement(NEXT_PAGE).click();
  }

  async getNumMaterial() { //finds num of material by how many preview buttons there are
    console.log('in get num material');
    //var numMaterial= await driver.findElements(PREVIEW_BUTTON).then(function(materials) {
    //  console.log("materials are "+materials);
    //  return materials;
    //});
    var numMaterial= await driver.findElements(PREVIEW_BUTTON);
    console.log('numMaterial is '+ numMaterial.length);
    return numMaterial;
  }

  async getMaterialNames() {
    console.log("in get material names");
    //var materialTitles = [];
    //var materialLocations = await driver.findElements(MATERIAL_TITLE)
    var materialTitles = await driver.findElements(MATERIAL_TITLE).then(function(materialLocations){
      console.log("Material locations are " + materialLocations);
      var titles = [];
      for (var i = 0; i < materialLocations.length; i++) {
        titles.push(materialLocations[i].attribute('data-material_name'));
      };
      console.log ("titles in then are " + titles);
      return titles
    });

    console.log("Material titles are " + materialTitles);
    return materialTitles;
  }

}
module.exports = new SearchPageObject();
