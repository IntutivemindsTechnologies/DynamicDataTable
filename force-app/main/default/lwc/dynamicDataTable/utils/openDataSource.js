let handleOpenDataSource = (component) => {
try{

    component.isSettingPopup=false;
         component.handleGlobalReset2();

  if (component.isDrawerOpen) {
            component.isDrawerOpen = false;
            component.template.removeEventListener('click',component.handleFileOutsideClick);
            setTimeout(() => {
                component.isDrawerVisible = false;
            }, 600); 
        } else {
            
            component.isDrawerVisible = true;
             component.template.addEventListener('click', component.handleFileOutsideClick);
            setTimeout(() => {
                component.isDrawerOpen = true;
            }, 0); 
        }

}
catch(error){

}
  
}

export {handleOpenDataSource};