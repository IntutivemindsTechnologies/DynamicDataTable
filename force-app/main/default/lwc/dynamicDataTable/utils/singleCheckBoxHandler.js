
let handleCheckboxChange = (event,tableDataPn,selectedRows,visibleData,component,isMainCheckboxChecked,output) => {
        const rowId = event.currentTarget.dataset.id
        const isChecked = event.target.checked;
        let rowData;

        for (let i = 0; i < tableDataPn.length; i++) {
            if (tableDataPn[i].Id == rowId || tableDataPn[i].id == rowId || tableDataPn[i].ID == rowId) {
                rowData = tableDataPn[i];
                break;
            }
        }

        if (isChecked) {
            selectedRows.push(rowData);
            if (selectedRows.length === visibleData.length) {
                component.isMainCheckboxChecked = true;
            }
        }
        else {
            component.isMainCheckboxChecked = false;
            const index = selectedRows.findIndex(item => item === rowData);
            if (index !== -1) {
                selectedRows.splice(index, 1);
            }
        }

        component.output = JSON.stringify(selectedRows);

    }

    export {handleCheckboxChange};