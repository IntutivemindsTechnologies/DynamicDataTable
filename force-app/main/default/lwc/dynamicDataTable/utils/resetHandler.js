let handleReset = (template,selectedRows,showInput,showSubmit,editedIds,filteredData,component ) => {
    console.log('reset ');
    const inputElement = component.template.querySelector('[data-id="searchInput"]');
    inputElement.value = '';
    const checkboxes = component.template.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    component.selectedRows = [];

    const allArrowIcons = component.template.querySelectorAll('lightning-icon');
    allArrowIcons.forEach(icon => {
        icon.classList.remove('arrowIconShow');

    });
    component.showInput = false;
    component.showSubmit = false;
    component.editedIds = [];
    component.filteredData = [];
    component.columnFilters = {};
    component.populateTableBody();

}
export {handleReset};