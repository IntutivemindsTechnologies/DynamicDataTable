let handleJsonDataClickSec = (component) => {
  try {
    console.log('data');
    component.handleGlobalReset();
      //component.saveState();
    component.isLoadingData = true;
    
    const textarea = component.template.querySelector('[data-id=myJsonTextarea]');
    if (textarea) {

      if (textarea.value == undefined) {
        component.mainDropdownVal = 'jsondata';
        component.jsonTextBox = true;
        component.isLoadingData = false;
        return;
      }

      component.tableData = textarea.value;
      if (component.tableData.toLowerCase().trim().indexOf("[") === 0) {
        console.log('json data');
        component.showCustomError = false;
        component.showtoggle = false;
        component.isDrawerVisible = false;
        component.firstBox = false;
        component.isDrawerOpen = false;
      //  component.globalData = component.tableData;

          //this.tableHeaders = Object.keys(this.tableData[0]);
 component.resetVariables();
      }
      else {
        component.isDrawerVisible = true;
        component.isDrawerOpen = true;
        component.mainDropdownVal = 'jsondata';
        component.jsonTextBox = true;
        component.showCustomError = true;
        component.customErrorMessage = 'Please valid JSON Data';
        component.isLoadingData = false;
        component.stopColumnRender = true;
        return;
      }
    }

    const textarea2 = component.template.querySelector('[data-id=mySoqlTextarea]');
    if (textarea2) {

      if (textarea2.value == undefined) {
        component.isLoadingData = false;
        return;
      }

      component.tableData = textarea2.value;
      if (component.tableData.toLowerCase().trim().indexOf("select") === 0) {
        component.isDrawerVisible = false;
        component.firstBox = false;
        component.isDrawerOpen = false;
        component.showCustomError = false;
        component.queryDropdownData = '';
        component.successToastMessage = false;
        component.toggleIdColumn = true;
        component.isLoading = true;
        component.rowSize = 10;
        component.rowOffset = 0;

        if (component.showtoggleProperty) {
          component.showtoggle = true;
        }
        else {
          component.showtoggle = false;
        }
        component.resetVariables();
      }
      else {
        component.isDrawerVisible = true;
        component.isDrawerOpen = true;
        component.mainDropdownVal = 'soqldata';
        component.soqlDropdown = true;
        component.selectedLabel = 'Write own query';
        component.soqlTextBox = true;
        component.showCustomError = true;
        component.customErrorMessage = 'Please valid SOQL Query';
        component.isLoadingData = false;
        component.stopColumnRender = true;
        return;
      }
    }

    if (component.queryDropdownData) {
     component.isDrawerVisible = false;
      component.firstBox = false;
      component.isDrawerOpen = false;
      component.tableData = component.queryDropdownData;

      if (component.showtoggleProperty) {
        component.showtoggle = true;
      }
      else {
        component.showtoggle = false;
      }
      component.resetVariables();
    }


    if (component.objectLabelFromProperty == undefined) {
      component.objectLabel = null;
    }
    else {
      component.objectLabel = component.objectLabelFromProperty;
    }
    component.loadTableData();
    console.log('end');
    component.stopColumnRender = false;
    console.log('end2 :: ',component.tableData);
  }
  catch (error) {
    console.error('error in ', error);
  }

}

export { handleJsonDataClickSec };