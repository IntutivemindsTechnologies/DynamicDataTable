let handleJsonDataClickSec = (component) => {
  try {
   
    component.handleGlobalReset();
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
        component.reloadBtn = false;
        component.jsonDataFlag = true;
        component.soqlTextBoxQueryFlag = false;
        component.savedQueryDataFlag = false;
        component.queryDropdownData = '';
        component.soql = '';
        component.standardQueryLabel='';
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
        component.reloadBtn = true;
        component.soqlTextBoxQueryFlag = true;
        component.savedQueryDataFlag = false;
        component.jsonDataFlag = false;

        component.isDrawerVisible = false;
        component.standardQueryLabel='';
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
        component.selectedLabel = 'Write your own query';
        component.soqlTextBox = true;
        component.showCustomError = true;
        component.customErrorMessage = 'Please valid SOQL Query';
        component.isLoadingData = false;
        component.stopColumnRender = true;
        return;
      }
    }

    if (component.queryDropdownData) {
      
       component.reloadBtn = true;
       component.savedQueryDataFlag = true;
       component.soqlTextBoxQueryFlag = false;
        component.jsonDataFlag = false;

     
       component.savedQueryLabel = component.selectedLabel;
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
    
    component.stopColumnRender = false;
    
  }
  catch (error) {
    console.error('error in ', error);
  }

}

export { handleJsonDataClickSec };