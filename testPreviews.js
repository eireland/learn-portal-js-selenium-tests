async function testPreviews()
{
  const portal = require('./portalPagesObject');
  const searchPage = require('./searchPageObject');
  const homeDir = require('os').homedir();

  var url = 'https://learn.concord.org/search';
  //var url = 'https://learn.concord.org/search?search_term=&sort_order=Newest&include_official=1&material_types%5B%5D=Activity&material_properties%5B%5D=Runs+in+browser&investigation_page=1&activity_page=3&interactive_page=1';
  var testScreenshotDir = homeDir+'/Sites/learn_material_screenshot_results/test_screenshots_js/';


    async function verifyMaterials(ksearch) {
    var pageNum = 1,
      wantNum = 1; //change wantNum to desired page number
    var lastNumPages = 0;

    while (pageNum < wantNum) {
      portal.sleepWait(3000);
      ksearch.nextPage();
      pageNum++;
    }
    console.log("page num is " + pageNum);
    // 1. Check to see how many pages there are? to know how many times to click on Next button (to get number of listings xpath = //*[@id="offering_list"]/p/span/text()), there are 10 listing per page.
    portal.sleepWait(3000);
    //lastNumPages = ksearch.getNumPages();
    lastNumPages = await ksearch.getNumPages().then(function (lastNumPages) {
      console.log("In verify materials, num of pages is " + lastNumPages);
      return lastNumPages
    });
    while (pageNum <= lastNumPages) {
      console.log("page num is " + pageNum);
      var materialNum = 0;
      //2. Get a list of Preview buttons, and click it that many times css: '.button' with 'Preview' text
      var numMaterials = await ksearch.getNumMaterial();
      while (materialNum <= numMaterials.length - 1) {
        console.log("material num is " + materialNum);
        (numMaterials[materialNum]).click();
        portal.sleepWait(3000);
        //3. For every preview, take a screenshot just to make sure page loads correctly.
        var tabHandles = await portal.getTabHandles();
        await portal.switchToTab(tabHandles[1]);
        portal.sleepWait(3000);

        var pageTitle = await portal.getPageTitle();
        if (pageTitle=="") {
          var pageURL = await portal.getCurrentUrl();
          pageTitle = pageURL;
        }
        if (pageTitle.includes('SPARKS')){
          var sparksURL = await portal.getCurrentUrl();
          var splitSparksURL = sparksURL.split('#');
          console.log("splitSparksURL[1] is "+splitSparksURL[1]);
          pageTitle = splitSparksURL[1];
        }
        if (pageTitle.includes('SmartGraphs')){
          var smartgraphsURL = await portal.getCurrentUrl();
          var splitSmartGraphsURL = smartgraphsURL.split('/');
          pageTitle = splitSmartGraphsURL[4];
        }
        if (pageTitle.includes('Lab Interactive')){
          var newPageTile = pageTitle.replace('Lab Interactive','');
          pageTitle = newPageTile;
        }
        console.log("materialNum is "+materialNum);
        portal.saveScreenshot(testScreenshotDir, pageTitle, materialNum);
        await portal.closeTab(tabHandles[1]);
        await portal.switchToTab(tabHandles[0]);
        portal.sleepWait(3000);
        materialNum++;
      }
      portal.sleepWait(3000);
      if (pageNum < lastNumPages) {
        await ksearch.nextPage();
        portal.sleepWait(2000);
      }
      pageNum++;
    }
    ;
  }

  portal.manageWindowSize(1680, 1023);
  portal.visit(url);
  searchPage.clickOnFilter('run in browser');

  portal.sleepWait(3000);
  searchPage.clickOnFilter('sequence');
  portal.sleepWait(5000);
  await verifyMaterials(searchPage);
  searchPage.clickOnFilter('sequence');

  portal.sleepWait(3000);
  searchPage.clickOnFilter('activity');
  portal.sleepWait(3000);
  await verifyMaterials(searchPage);
  searchPage.clickOnFilter('activity');

  portal.sleepWait(3000);
  searchPage.clickOnFilter('interactive');
  portal.sleepWait(3000);
  await verifyMaterials(searchPage);
  portal.teardown();
}

testPreviews();