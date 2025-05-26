let toggleDrawer =(component) =>{

     component.isSettingPopup=!component.isSettingPopup;
      if(component.isSettingPopup){
        component.template.addEventListener('click',component.handleSettingPopupOutClick);
      }
      else{
        component.template.removeEventListener('click',component.handleSettingPopupOutClick);
      }

}

export {toggleDrawer};