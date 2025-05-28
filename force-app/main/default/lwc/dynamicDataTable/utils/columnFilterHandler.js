
let handleInputChange = (event,soql,relatedLabelMap,columnFilters,filteredData,visibleData, dataToSort,stopColumnRender,
    checkForFilteredList,component,template,totalRecords,showSubmit,editedIds) =>{
    const inputValue = event.target.value.toLowerCase();
    let currentHeader = event.currentTarget.dataset.id; 
    component.showSubmit = false;   
    component.editedIds = [];
    if (soql) {
        currentHeader = relatedLabelMap[currentHeader];
    }
    columnFilters[currentHeader] = inputValue;
    filteredData = [...visibleData];
    for (const header in columnFilters) {
        const filterValue = columnFilters[header];
        if (header.includes('.')) {
            filteredData = filteredData.filter(item => {
                if (item[header.split('.')[0]] !== undefined && item[header.split('.')[0]][header.split('.')[1]] !== undefined) {
                    if(typeof item[header.split('.')[0]][header.split('.')[1]] == 'object'){
                      console.log('object ');
                      return  Object.values(item[header.split('.')[0]][header.split('.')[1]]).filter(items => items !== null && items !== '' ).join(',').toLowerCase().includes(filterValue);
                    }
                    else{
                        return String(item[header.split('.')[0]][header.split('.')[1]]).toLowerCase().includes(filterValue);
                    }
                  
                }
                else if (filterValue == '') {
                    return visibleData;
                }
            });
        }
        else {

            filteredData = filteredData.filter(item =>{
                console.log('type of item ::',typeof item[header]);
                if(typeof item[header] == 'object'){
                    return  Object.values(item[header]).filter(items => items !== null && items !== '' ).join(',').toLowerCase().includes(filterValue);
                }
                else{
                    return String(item[header]).toLowerCase().includes(filterValue);
                }
               
            }

               
            );
        }
    }
    dataToSort = filteredData;
    let isEmpty = Object.values(columnFilters).every(value => value === '');
    if (isEmpty) {
        component.stopColumnRender = true;
        checkForFilteredList = false;
        component.populateTableBody2(filteredData);
    }
    else {
        if (filteredData.length === 0) {
            component.stopColumnRender = true;
            const tbody = template.querySelector('tbody');
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No data available</td></tr>';
            totalRecords = 0;
            checkForFilteredList = true;
        } else {       
            component.stopColumnRender = true;         
            checkForFilteredList = false;
            component.populateTableBody2(filteredData);
        }
    }
}
export {handleInputChange};