
 
 let handleReset = (template,selectedRows,showInput,showSubmit,editedIds,filteredData,component ) => {
    const inputElement = template.querySelector('[data-id="searchInput"]');
    inputElement.value = '';
    const checkboxes = template.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    selectedRows = [];

    const allArrowIcons = template.querySelectorAll('lightning-icon');
    allArrowIcons.forEach(icon => {
        icon.classList.remove('arrowIconShow');

    });
    component.showInput = false;
    component.showSubmit = false;
    component.editedIds = [];
    filteredData = [];
    component.populateTableBody();

}
export {handleReset};
