let handleDropChange = (event,component) =>{

 component.lastUpdatedTime = new Date();
        component.interval = setInterval(() => {
            component.lastUpdatedTime = new Date(component.lastUpdatedTime);     
        }, 60000); 
      
      component.customErrorMessage='';
      let selectedVal = event.detail.value;
      if( selectedVal == 'jsondata'){
        component.jsonInput='';
        component.selectedLabel='';
        component.queryDropdownData='';
        component.soql = '';
        component.mainDropdownVal =  event.detail.value;
        component.successToastMessage = false;
         component.jsonTextBox=true;
         component.soqlDropdown = false;
         component.showCustomError=false;      
         component.soqlTextBox = false;
      }
      else if (selectedVal == 'soqldata'){
        component.soqlInput='';
        component.selectedLabel = 'Select Query Option…';
        component.mainDropdownVal =  event.detail.value;     
        component.soqlDropdown = true;
        component.jsonTextBox=false;   
      }

      else{
        component.mainDropdownVal =  event.detail.value;     
        component.isDrawerVisible=false;
        component.isDrawerOpen=false;   
        component.successToastMessage = false;    
        component.isLoading = true;
        component.soqlDropdown = false;
        component.jsonTextBox=false;   
       component.showtoggle=false;
     
       if (component.objectLabelFromProperty == undefined) {
        component.objectLabel = null;
    }
    else {
        component.objectLabel = component.objectLabelFromProperty;
    }

       if((component.tableData != undefined && component.tableData.length>0) || (component.tableData.length == 0 ) || (component.tableData ==false  ) ){   
        component.soql='';
        component.stopColumnRender = true;
        component.tableData=undefined;
        component.resetVariables();
    }
        component.loadTableData();
      }
    

}

export {handleDropChange};