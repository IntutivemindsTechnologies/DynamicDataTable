let handleFileCLick = (component) =>{

   component.template.removeEventListener('click', component.handleFileOutsideClick);
        component.isDrawerVisible=false;
         component.isDrawerOpen = false; 
        component.isFileDropdown=!component.isFileDropdown;

        if(component.isFileDropdown){
          component.template.addEventListener('click',component.handleAdditionalFuncOutClick);
        }
        else{
            component.template.removeEventListener('click',component.handleAdditionalFuncOutClick);
        }
    
}

export {handleFileCLick};