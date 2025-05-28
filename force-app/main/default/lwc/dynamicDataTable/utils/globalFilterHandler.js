

let handleKeyUp = (event,template,showInput,showSubmit,editedIds,visibleData,globalSearchCloseFilterData 
    ,dataToSort,tableDataPn,tableHeaders, stopColumnRender,checkForFilteredList,filteredData,totalRecords,component ) => {

    const allArrowIcons = component.template.querySelectorAll('lightning-icon');
    allArrowIcons.forEach(icon => {
        icon.classList.remove('arrowIconShow');
    });
    console.log('in handle keyup');
    component.showInput = false;
    component.showSubmit = false;
    component.editedIds = [];
    var inputText = event.target.value;
    component.visibleData = searchTable(inputText,component.tableDataPn,component.tableHeaders);
    console.log('visible data ::', component.visibleData );
    component.globalSearchCloseFilterData = searchTable(inputText,component.tableDataPn,component.tableHeaders);
    console.log('component.globalSearchCloseFilterData data ::', component.globalSearchCloseFilterData);
    component.dataToSort = component.visibleData;


    if (component.visibleData == '') {
        component.stopColumnRender = true;
        component.checkForFilteredList = false;
        component.filteredData = [];
        const tbody = component.template.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No data available</td></tr>';
        component.totalRecords = 0;
    }
    else {
        var text = component.template.querySelector('h3');
        text.textContent = '';
        component.stopColumnRender = true;
        component.filteredData = [];
        component.checkForFilteredList = false;
        component.populateTableBody2(component.visibleData);
    }
}


// Search through table data and return filtered results based on the search input
let searchTable = (data,tableDataPn,tableHeaders) => {
    console.log('in search table keyup');
    data = data.toLowerCase();
    console.log('data ::',data);
    var filteredData = [];
    try{
    tableDataPn.some((item) => {
        let matchFound = false;
        tableHeaders.some((head) => {
            if (!head.includes('.') && String(item[head]).toLowerCase().includes(data)) {
                console.log('entered here ::::');
                console.log('item ::',item);
                filteredData.push(item);
                matchFound = true;
                return matchFound;
            }
           else if (!head.includes('.') && typeof item[head] =='object' && item[head] !== null && item[head] !== undefined  &&  Object.values(item[head]).filter(items => items !== null && items !== '' ).join(',').toLowerCase().includes(data)) {
                filteredData.push(item);
                matchFound = true;
                return matchFound;
            }
            else if (item[head.split('.')[0]] !== undefined) {
                console.log('dot head ::',head);
                if (head.includes('.') && String(item[head.split('.')[0]][head.split('.')[1]]).toLowerCase().includes(data)) {
                    filteredData.push(item);
                    matchFound = true;
                    return matchFound;
                }
                else if(head.includes('.') && typeof item[head.split('.')[0]][head.split('.')[1]] == 'object' && item[head.split('.')[0]][head.split('.')[1]] !== null && item[head.split('.')[0]][head.split('.')[1]] !== undefined  && Object.values(item[head.split('.')[0]][head.split('.')[1]]).filter(items => items !== null && items !== '' ).join(',').toLowerCase().includes(data)){
                  console.log('object dot');
                    filteredData.push(item);
                    matchFound = true;
                    return matchFound;
                }
            }
        })
        console.log('filteredData 1 :',filteredData);
    })
    console.log('filteredData  :',filteredData);
}
catch(error){
console.log('error occured ::',error);
}
    return filteredData;  
}

export {handleKeyUp,searchTable};