
let checkAllCheckboxes = (event,component,isMainCheckboxChecked,template,tableDataPn,selectedRows,output ) => {
    const clicked = event.target.checked;
    component.isMainCheckboxChecked = clicked;
    const checkboxes =  template.querySelectorAll('tbody input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.checked = clicked;
        const rowId = checkbox.dataset.id;

        if (clicked) {
            const rowData = tableDataPn.find(row => row.Id == rowId || row.id == rowId || row.ID == rowId);
            if (rowData && ! selectedRows.includes(rowData)) {
               selectedRows.push(rowData);
            }

        } else {
            const index =  selectedRows.findIndex(row => row.Id == rowId || row.id == rowId || row.ID == rowId);
            if (index !== -1) {
                selectedRows.splice(index, 1);
            }
        }
    });
    component.output = JSON.stringify(selectedRows);
}

export {checkAllCheckboxes}; 