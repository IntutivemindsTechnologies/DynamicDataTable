let handleGlobalReset2 = (component) => {
console.log('hsgdhd');
    if(component.savedQueryDataFlag){
        component.mainDropdownVal='soqldata';
        component.soqlDropdown = true;
             component.jsonTextBox=false;
             component.soqlTextBox = false;
             component.selectedLabel = component.savedQueryLabel;
    }
    else if(component.soqlTextBoxQueryFlag){
        console.log('soql input ::',component.soqlInput);
          component.mainDropdownVal='soqldata';
        component.soqlDropdown = true;
             component.jsonTextBox=false;
             component.soqlTextBox = true;
               component.selectedLabel = 'Write your own query';
            // component.selectedLabel = component.savedQueryLabel;
    }
    else if(component.jsonDataFlag){
        console.log('json flag enter');
          component.mainDropdownVal='jsondata';
        component.soqlDropdown = false;
             component.jsonTextBox=true;
           component.soqlTextBox = false;
    }
    else{
        component.mainDropdownVal = 'flowdata';
         component.soqlTextBox = false;
          component.soqlDropdown = false;
          component.jsonTextBox = false;
    }
//component.mainDropdownVal='';
//component.jsonTextBox=false;
//component.soqlDropdown = false;
component.successToastMessage = false;
component.stopColumnRender=true;
//component.soqlTextBox = false;
component.customErrorMessage='';
component.soqlLoadData=false;

}

export {handleGlobalReset2};