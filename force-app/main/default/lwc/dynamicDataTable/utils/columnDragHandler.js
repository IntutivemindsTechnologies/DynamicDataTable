
 // Handle the start of a drag event for column header
let handleDragStart= (event,showSubmit,editedIds,template,component) => {
    component.showSubmit = false;
    component.editedIds = [];
    event.dataTransfer.setData('text', event.target.dataset.index);
    const inputField = template.querySelector('lightning-input');
    inputField.value = '';
}
// Handle the drop position for column header
let handleDrop = (event, tableHeaders, tableHeaderLabel, component) => {
    const fromIndex = event.dataTransfer.getData('text');
    const toIndex = event.currentTarget.dataset.index;

    if (fromIndex !== toIndex) {
        component.tableHeaders.splice(toIndex, 0, component.tableHeaders.splice(fromIndex, 1)[0]);
        component.tableHeaders = [...component.tableHeaders];
  
        if (component.tableHeaderLabel.length > 0) {
            component.tableHeaderLabel.splice(toIndex, 0, component.tableHeaderLabel.splice(fromIndex, 1)[0]);
            component.tableHeaderLabel = [...component.tableHeaderLabel];
        }
        component.populateTableBody();
    }
   
}


export {handleDragStart,handleDrop};