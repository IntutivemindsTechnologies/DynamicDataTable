const handleSort = (event, dataToSort, showSubmit, editedIds, selectedHeaderId, activeHeader, sortedBy, sortedDirection, soql, relatedLabelMap, template, component) => {


    if (dataToSort.length > 0) {
        component.showSubmit = false;
        component.editedIds = [];
        selectedHeaderId = event.currentTarget.dataset.id;
        activeHeader = selectedHeaderId;
        sortedBy = event.currentTarget.dataset.id;
        sortedDirection = event.currentTarget.dataset.set;

        if (soql) {
            const sortedArray = sortData(relatedLabelMap[sortedBy], sortedDirection, selectedHeaderId, template, dataToSort);
            console.log('sorted array ::', sortedArray);
            component.populateTableBody2(sortedArray);
        }
        else {
            const sortedArray = sortData(sortedBy, sortedDirection, selectedHeaderId, template, dataToSort);
            component.populateTableBody2(sortedArray);
        }
    }
}


// Sorts data based on the given field and direction
let sortData = (field, direction, selectedField, template, dataToSort) => {
    const allArrowIcons = template.querySelectorAll('lightning-icon');
    allArrowIcons.forEach(icon => {
        icon.classList.remove('arrowIconShow');
    });

    if (direction == 'desc') {
        const tableHeader = template.querySelector(`th[data-id="${selectedField}"]`);
        const arrowIcon = tableHeader.querySelector('lightning-icon');
        arrowIcon.iconName = 'utility:arrowup';
        arrowIcon.classList.add('arrowIconShow');
        tableHeader.setAttribute('data-set', 'asc')
        const a = [...dataToSort];
        a.sort((a, b) => {
            if (field.includes('.')) {
                if (typeof a[field.split('.')[0]][field.split('.')[1]] == 'string' && typeof b[field.split('.')[0]][field.split('.')[1]] == 'string') {
                    return a[field.split('.')[0]][field.split('.')[1]].toLowerCase() > b[field.split('.')[0]][field.split('.')[1]].toLowerCase() ? 1 : -1;
                }
                else if (a[field.split('.')[0]][field.split('.')[1]] == null && b[field.split('.')[0]][field.split('.')[1]] == null) {
                    return -1;
                }
                else if (b[field.split('.')[0]][field.split('.')[1]] == null && typeof a[field.split('.')[0]][field.split('.')[1]] == 'string') {
                    return 1;
                }
                else if (a[field.split('.')[0]][field.split('.')[1]] == null && typeof b[field.split('.')[0]][field.split('.')[1]] == 'string') {
                    return -1;
                }
                else {
                    if (typeof a[field.split('.')[0]][field.split('.')[1]]  == 'object' && typeof b[field.split('.')[0]][field.split('.')[1]] == 'object') {
                        console.log('object');
                        let vala = Object.values(a[field.split('.')[0]][field.split('.')[1]]).filter(items => items !== null && items !== '' ).join(',');
                        let valb = Object.values(b[field.split('.')[0]][field.split('.')[1]]).filter(items => items !== null && items !== '' ).join(',');
                        console.log('val ::',vala);
                        console.log('val2 ::',valb);
                        return vala > valb ? 1 :-1;
                    }
                    else{
                        return a[field.split('.')[0]][field.split('.')[1]] > b[field.split('.')[0]][field.split('.')[1]] ? 1 : -1;
                    }
                   
                }
            }
            else {
                if (typeof a[field] == 'string' && typeof b[field] == 'string') {
                    return a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1;
                }
                else if (a[field] == null && b[field] == null) {
                    return -1;
                }
                else if (a[field] == null && typeof b[field] == 'string') {
                    return 1;
                }
                else if (b[field] == null && typeof a[field] == 'string') {
                    return -1;
                }
                else {
                    if (typeof a[field] == 'object' && typeof b[field] == 'object') {
                        console.log('object');
                        let vala = Object.values(a[field]).filter(items => items !== null && items !== '' ).join(',');
                        let valb = Object.values(b[field]).filter(items => items !== null && items !== '' ).join(',');
                        console.log('val ::',vala);
                        console.log('val2 ::',valb);
                        return vala >valb ? 1 :-1;
                    }
                    else {
                        console.log('desc condt.');
                        console.log('a field ::', a[field]);
                        console.log('b field ::', b[field]);
                        return a[field] > b[field] ? 1 : -1;

                    }
                }
            }
        }
        );
        return a;
    }
    else {
        const tableHeader = template.querySelector(`th[data-id="${selectedField}"]`);
        const arrowIcon = tableHeader.querySelector('lightning-icon');
        arrowIcon.iconName = 'utility:arrowdown';
        arrowIcon.classList.add('arrowIconShow');
        tableHeader.setAttribute('data-set', 'desc');
        const a = [...dataToSort]
        a.sort((a, b) => {
            if (field.includes('.')) {
                if (typeof a[field.split('.')[0]][field.split('.')[1]] == 'string' && typeof b[field.split('.')[0]][field.split('.')[1]] == 'string') {
                    return a[field.split('.')[0]][field.split('.')[1]].toLowerCase() < b[field.split('.')[0]][field.split('.')[1]].toLowerCase() ? 1 : -1;
                }
                else if (a[field.split('.')[0]][field.split('.')[1]] == null && b[field.split('.')[0]][field.split('.')[1]] == null) {
                    return -1;
                }
                else if (b[field.split('.')[0]][field.split('.')[1]] == null && typeof a[field.split('.')[0]][field.split('.')[1]] == 'string') {
                    return -1;
                }
                else if (a[field.split('.')[0]][field.split('.')[1]] == null && typeof b[field.split('.')[0]][field.split('.')[1]] == 'string') {
                    return 1;
                }
                else {
                    if (typeof a[field.split('.')[0]][field.split('.')[1]]  == 'object' && typeof b[field.split('.')[0]][field.split('.')[1]] == 'object') {
                        console.log('object');
                        let vala = Object.values(a[field.split('.')[0]][field.split('.')[1]]).filter(items => items !== null && items !== '' ).join(',');
                        let valb = Object.values(b[field.split('.')[0]][field.split('.')[1]]).filter(items => items !== null && items !== '' ).join(',');
                        console.log('val ::',vala);
                        console.log('val2 ::',valb);
                        return vala < valb ? 1 :-1;
                    }
                    else{
                        return a[field.split('.')[0]][field.split('.')[1]] < b[field.split('.')[0]][field.split('.')[1]] ? 1 : -1;
                    }
                   
                }
            }
            else {
                if (typeof a[field] == 'string' && typeof b[field] == 'string') {
                    return a[field].toLowerCase() < b[field].toLowerCase() ? 1 : -1
                }
                else if (a[field] == null && b[field] == null) {
                    return -1;
                }
                else if (a[field] == null && typeof b[field] == 'string') {
                    return -1;
                }
                else if (b[field] == null && typeof a[field] == 'string') {
                    return 1;
                }
                else {
                    if (typeof a[field] == 'object' && typeof b[field] == 'object') {
                        console.log('object');
                        let vala = Object.values(a[field]).filter(items => items !== null && items !== '' ).join(',');
                        let valb = Object.values(b[field]).filter(items => items !== null && items !== '' ).join(',');
                        console.log('val ::',vala);
                        console.log('val2 ::',valb);
                        return vala <valb ? 1 :-1;
                    }
                    else{
                        console.log('asc');
                        console.log('a field ::', a[field]);
                        console.log('b field ::', b[field]);
                        return a[field] < b[field] ? 1 : -1
                    }
                  
                }
            }
        });
        return a;
    }
}
export { handleSort, sortData };