let handleInputChange = (event,soql,relatedLabelMap,columnFilters,visibleData, dataToSort,stopColumnRender,
    checkForFilteredList,component,template,totalRecords,showSubmit,editedIds) =>{
    const inputValue = event.target.value.toLowerCase();
    let currentHeader = event.currentTarget.dataset.id; 
    component.showSubmit = false;   
    component.editedIds = [];
    console.log('column filters ::',columnFilters);
    if (soql) {
        currentHeader = relatedLabelMap[currentHeader];
    }
    columnFilters[currentHeader] = inputValue;
    component.filteredData = [...visibleData];
    for (const header in columnFilters) {
        const filterValue = columnFilters[header];
        console.log('filter Value ::',filterValue);
        if (header.includes('.')) {
            console.log('header ::',header);
            component.filteredData = component.filteredData.filter(item => {
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
               console.log('second');
               component.filteredData = component.filteredData.filter(item =>{
                console.log(' item ::', item[header]);
                console.log('type of item ::',typeof item[header]);
                if(typeof item[header] == 'object' && item[header] !==null){
                    return  Object.values(item[header]).filter(items => items !== null && items !== '' ).join(',').toLowerCase().includes(filterValue);
                }
                else{
                    console.log(' item 22::', item[header]);
                    return String(item[header]).toLowerCase().includes(filterValue);
                }
               
            }

               
            );
        }
    }
    dataToSort = component.filteredData;
    let isEmpty = Object.values(columnFilters).every(value => value === '');
    if (isEmpty) {
        component.stopColumnRender = true;
        checkForFilteredList = false;
        component.populateTableBody2(component.filteredData);
    }
    else {
        if (component.filteredData.length === 0) {
            component.stopColumnRender = true;
            const tbody = template.querySelector('tbody');
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No data available</td></tr>';
            totalRecords = 0;
            checkForFilteredList = true;
        } else {       
            component.stopColumnRender = true;         
            checkForFilteredList = false;
            component.populateTableBody2(component.filteredData);
        }
    }
    console.log('filtered data cfinside::',component.filteredData);
    
}
export {handleInputChange};