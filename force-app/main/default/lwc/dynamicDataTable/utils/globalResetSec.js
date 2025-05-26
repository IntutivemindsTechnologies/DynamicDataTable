let handleGlobalReset2 = (component) => {

component.mainDropdownVal='';
component.jsonTextBox=false;
component.soqlDropdown = false;
component.successToastMessage = false;
component.stopColumnRender=true;
component.soqlTextBox = false;
component.customErrorMessage='';
component.soqlLoadData=false;

}

export {handleGlobalReset2};