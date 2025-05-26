let handleIdColumn = (event,component) => {
  
    if (component.visibleData.length === 0) {
        event.preventDefault();
        event.target.checked = component.toggleIdColumn;
        return;
    }
    else if (component.visibleData.length !== 0 && component.checkForFilteredList == true) {
        event.preventDefault();
        event.target.checked = component.toggleIdColumn;
        return;
    }


    if (component.visibleData.length > 0 && component.filteredData.length > 0) {

        component.toggleIdColumn = !component.toggleIdColumn;
        component.showSubmit = false;
        component.editedIds = [];
        component.isIdColumnVisible = !component.isIdColumnVisible;

        if (component.toggleIdColumn == false) {
            component.tableHeaders = component.tableHeaders.filter(header => !component.tableHeaderToRemove.includes(header));
            component.tableHeaderLabel = component.tableHeaderLabel.filter(header => !component.tableHeaderLabelToRemove.includes(header));
            component.stopColumnRender == true;
            component.populateTableBody2(component.filteredData);
        }
        else {
            component.tableHeaderLabel = component.tableHeaderLabel.concat(component.tableHeaderLabelToRemove);
            component.tableHeaders = component.tableHeaders.concat(component.tableHeaderToRemove);
            component.stopColumnRender == true;
            component.populateTableBody2(component.filteredData);
        }
    }
    else {

        component.toggleIdColumn = !component.toggleIdColumn;
        component.showSubmit = false;
        component.editedIds = [];
        component.isIdColumnVisible = !component.isIdColumnVisible;
        if (component.toggleIdColumn == false) {
            component.tableHeaders = component.tableHeaders.filter(header => !component.tableHeaderToRemove.includes(header));
            component.tableHeaderLabel = component.tableHeaderLabel.filter(header => !component.tableHeaderLabelToRemove.includes(header));
            component.stopColumnRender == true;
            component.populateTableBody2(component.visibleData);
        }
        else {
            component.tableHeaderLabel = component.tableHeaderLabel.concat(component.tableHeaderLabelToRemove);
            component.tableHeaders = component.tableHeaders.concat(component.tableHeaderToRemove);
            component.stopColumnRender == true;
            component.populateTableBody2(component.visibleData);
        }
    }
}
export {handleIdColumn};