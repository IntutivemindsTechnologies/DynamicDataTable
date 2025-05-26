let resetVariables = (component) => {

    component.tableHeaders=[];
    component.tableHeaderLabel=[];
    component.tableHeaderLabelToRemove=[];
    component.tableHeaderToRemove=[];
    component.visibleData=[];
    component.globalData=[];
    component.tableDataPn=[];
    component.columnFilters = {};
    component.selectedRows = [];
    component.globalFilteredData = [];
    component.columnFilteredData = [];
    component.dataToSort = [];
    component.relatedLabelMap = {};
    component.isUpdatableMap = {};
    component.globalSearchResult = [];
    component.filteredData = [];
    component.editedIds = [];
    component.fieldTypeMap = {};
    component.requiredFieldMap = {};
    component.accountNames = [];
    component.hidColId = [];
}

export {resetVariables};