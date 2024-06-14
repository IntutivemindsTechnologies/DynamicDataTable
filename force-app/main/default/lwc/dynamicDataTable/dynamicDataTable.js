import { LightningElement, api, track } from 'lwc';
import getFieldName from '@salesforce/apex/DynamicDataTableHandler.getFieldName';
import getrelatedFieldName from '@salesforce/apex/DynamicDataTableHandler.getrelatedFieldName';
import getUpdateStatus from '@salesforce/apex/DynamicDataTableHandler.getUpdateStatus';
import getList from '@salesforce/apex/DynamicDataTableHandler.getDataFromQuery';
import getObjectLabelName from '@salesforce/apex/DynamicDataTableHandler.getObjectLabelName';
import iconNamesForObjects from '@salesforce/apex/DynamicDataTableHandler.iconNamesForObjects';

export default class DynamicDataTable extends LightningElement {

    @api tableData;
    tableHeaders = [];
    @api soql = '';
    @api flowRecord = [];
    @api visibleData;
    @api currentPage = 1;
    @api tableDataPn = [];
    @api tableDataQuery;
    showInput = false;
    selectedHeaderId = '';
    columnFilters = {};
    stopColumnRender = false;
    @api tableDataCheckBox;
    @api selectedRows = [];
    isMainCheckboxChecked = false;
    globalFilteredData = [];
    @api output;
    columnFilteredData = [];
    dataToSort = [];
    @api globalData = [];
    tableHeaderLabel = [];
    @api relatedLabelMap = {};
    @api isUpdatable;
    @api isUpdatableMap = {};
    @api tableHeaderToRemove = [];
    @track toggleIdColumn = true;
    @api tableHeaderLabelToRemove = [];
    @api rowSize = 10;
    @api rowOffset = 0;
    @api showSpinner = false;
    isLoaded = false;
    enableInfiniteLoading = false;
    totalRecords = 0;
    showSubmit = false;
    @api objectLabel;
    isLoading = true;
    iconName;
    @api showReferenceToggle = false;
    @api globalSearchResult = [];
    inlineEditing = false;
    @track activeHeader = null;
    @track showNoDataMessage;
    @track showHeaderName;
    @api tableDataErrorMsg;
    @api globalSearchCloseFilterData;
    @api isIdColumnVisible = false;
    @track scrolled = false;
    filteredData = [];
    @api checkForFilteredList;
    @api checkBoxVisibile = false;
    @api showtoggle;


    connectedCallback() {

        if (this.tableData !== undefined) {
            try {
                // Condition for Json input
                if (this.tableData && this.tableData.toLowerCase().trim().indexOf("[") === 0) {
                    this.tableData = JSON.parse(this.tableData);
                    this.tableHeaders = Object.keys(this.tableData[0]);
                    this.tableHeaderLabel = false;
                    this.tableDataPn = this.tableData;
                    this.globalData = this.tableDataPn;
                    this.totalRecords = this.globalData.length;
                    this.isLoading = false;
                    if (this.objectLabel == null) {
                        this.objectLabel = 'JSON Data';
                    }
                    this.iconName = 'standard:dataset';
                }
                // Condition for Soql input
                else if (this.tableData && this.tableData.toLowerCase().trim().indexOf("select") === 0) {
                    this.soql = this.tableData;
                    if (this.objectLabel == null) {
                        //Getting Object Label Name.
                        getObjectLabelName({ query: this.soql })
                            .then(result => {
                                this.objectLabel = result;
                            })
                    }
                    //Getting Icon of the Object.
                    iconNamesForObjects({ query: this.soql })
                        .then(result => {
                            this.iconName = result;
                        })
                    this.showReferenceToggle = true;
                    this.getSoqlData();
                }
                else {
                    this.isLoading = false;
                    this.tableData = false;
                    this.tableDataErrorMsg = 'The component encountered a problem: no records were found, or the datasource is incorrect. Please check your datasource (JSON/SOQL/FlowData).';
                }
            }
            catch (error) {
                this.isLoading = false;
                this.tableData = false;
                this.tableDataErrorMsg = 'The component encountered a problem: no records were found, or the datasource is incorrect. Please check your datasource (JSON/SOQL/FlowData).';
            }
        }
        else if (this.tableData == undefined && this.flowRecord == undefined) {
            this.isLoading = false;
            this.tableData = false;
            this.tableDataErrorMsg = 'The component encountered a problem: no records were found, or the datasource is incorrect. Please check your datasource (JSON/SOQL/FlowData).';
        }
        // Condition for flow record input
        else if (this.flowRecord.length > 0) {
            this.tableHeaderLabel = false;
            this.tableData = this.flowRecord;
            this.tableHeaders = Object.keys(this.tableData[0]);
            this.tableDataPn = this.flowRecord;
            this.globalData = this.tableDataPn;
            this.isLoading = false;
            if (this.objectLabel == null) {
                this.objectLabel = 'Flow Record Data';
            }
            this.iconName = 'standard:dataset';
        }
        else {
            this.isLoading = false;
            this.tableData = false;
            this.tableDataErrorMsg = 'The component encountered a problem: no records were found, or the datasource is incorrect. Please check your datasource (JSON/SOQL/FlowData).';
        }

    }


    // Fetches SOQL data and processes it
    getSoqlData() {
        //Function to check if a value is a valid ID
        function isIds(value) {
            return typeof value === 'string' && /^[a-zA-Z0-9]{15}$|^[a-zA-Z0-9]{18}$/.test(value);
        }
        //Function to make objects properties null for missing keys
        function ensureObjectsWithNullProperties(data) {
            const allProperties = {};
            data.forEach(item => {
                for (let key in item) {
                    if (typeof item[key] === 'object' && item[key] !== null && !Array.isArray(item[key])) {
                        if (!allProperties[key]) {
                            allProperties[key] = {};
                        }
                        for (let subKey in item[key]) {
                            allProperties[key][subKey] = '';
                        }
                    }
                }
            });

            data.forEach(item => {
                for (let key in allProperties) {

                    if (!item[key]) {
                        item[key] = { ...allProperties[key] };

                    } else {
                        for (let subKey in allProperties[key]) {
                            if (!item[key].hasOwnProperty(subKey)) {
                                item[key][subKey] = '';

                            }
                        }
                    }
                }
            });
            return data;
        }
        // Fetch data using SOQL query
        getList({ query: this.soql, limitSize: this.rowSize, offset: this.rowOffset })
            .then(async result => {
                this.tableData = JSON.parse(result);
                if (this.tableData.length === 0) {
                    this.tableData = false;
                    this.showNoDataMessage = true;
                    this.isLoading = false;
                    this.tableDataErrorMsg = 'The component encountered a problem: no records were found, or the datasource is incorrect. Please check your datasource (JSON/SOQL/FlowData).';
                }
                else {
                    this.showNoDataMessage = false;
                    let label;
                    let rel = this.relatedLabelMap;
                    function getLabelForHeader(headerToFind, rel) {
                        let label;
                        for (let [key, value] of Object.entries(rel)) {
                            if (value === headerToFind) {
                                label = key;
                                break;
                            }
                        }
                        return label;
                    }

                    if (this.toggleIdColumn == true && this.showtoggle == true) {
                        for (const entry of this.tableData) {
                            for (const header of Object.keys(entry)) {
                                if (header !== 'attributes' && !this.tableHeaders.includes(header)) {
                                    try {
                                        var keyData = entry[header];
                                        if (keyData != null && typeof keyData == 'object') {
                                            for (const objKey of Object.keys(keyData)) {
                                                if (objKey !== 'attributes' && objKey !== 'Id') {
                                                    //Getting column header name for reference object field.
                                                    let relatedLabel = await getrelatedFieldName({ objectName: header, fieldName: objKey });
                                                    if (!this.tableHeaderLabel.includes(relatedLabel)) {
                                                        this.tableHeaderLabel.push(relatedLabel);
                                                        this.relatedLabelMap[relatedLabel] = header + '.' + objKey;
                                                    }
                                                    if (relatedLabel != null && !this.tableHeaders.includes(header + '.' + objKey)) {
                                                        this.tableHeaders.push(header + '.' + objKey);
                                                    }

                                                }
                                            }
                                        }
                                        else {
                                            ////Getting column header name for field.
                                            label = await getFieldName({ query: this.soql, fieldName: header });
                                            this.tableHeaderLabel.push(label);
                                            this.relatedLabelMap[label] = header;
                                            this.tableHeaders.push(header);
                                            //Getting the status of field whether updatable or not.
                                            let isUpdateCheck = await getUpdateStatus({ query: this.soql, fieldName: header });
                                            this.isUpdatableMap[header] = isUpdateCheck;
                                        }
                                    } catch (error) {
                                    }
                                }
                            }
                        }
                        for (const entry of this.tableData) {
                            for (const header of Object.keys(entry)) {
                                if (isIds(entry[header])) {
                                    ////Getting label for header name having Id as value.
                                    let label = getLabelForHeader(header, this.relatedLabelMap);
                                    if (!this.tableHeaderToRemove.includes(header)) {
                                        this.tableHeaderToRemove.push(header);
                                    }
                                    if (!this.tableHeaderLabelToRemove.includes(label)) {
                                        this.tableHeaderLabelToRemove.push(label);
                                    }
                                }
                            }
                        }
                    }
                    else if (this.toggleIdColumn == true && this.showtoggle == false) {
                        for (const entry of this.tableData) {
                            for (const header of Object.keys(entry)) {
                                if (header !== 'attributes' && !this.tableHeaders.includes(header)) {
                                    try {
                                        var keyData = entry[header];
                                        if (keyData != null && typeof keyData == 'object') {
                                            for (const objKey of Object.keys(keyData)) {
                                                if (objKey !== 'attributes' && objKey !== 'Id') {
                                                    //Getting column header name for reference object field.
                                                    let relatedLabel = await getrelatedFieldName({ objectName: header, fieldName: objKey });
                                                    if (!this.tableHeaderLabel.includes(relatedLabel)) {
                                                        this.tableHeaderLabel.push(relatedLabel);
                                                        this.relatedLabelMap[relatedLabel] = header + '.' + objKey;
                                                    }
                                                    if (relatedLabel != null && !this.tableHeaders.includes(header + '.' + objKey)) {
                                                        this.tableHeaders.push(header + '.' + objKey);
                                                    }

                                                }
                                            }
                                        }
                                        else {
                                            ////Getting column header name for field.
                                            label = await getFieldName({ query: this.soql, fieldName: header });
                                            this.tableHeaderLabel.push(label);
                                            this.relatedLabelMap[label] = header;
                                            this.tableHeaders.push(header);
                                            //Getting the status of field whether editable or not.
                                            let isUpdateCheck = await getUpdateStatus({ query: this.soql, fieldName: header });
                                            this.isUpdatableMap[header] = isUpdateCheck;
                                        }
                                    } catch (error) {
                                    }
                                }
                            }
                        }
                        for (const entry of this.tableData) {
                            for (const header of Object.keys(entry)) {
                                if (isIds(entry[header])) {
                                    //Getting label for header name having Id as value.
                                    let label = getLabelForHeader(header, this.relatedLabelMap);
                                    if (!this.tableHeaderToRemove.includes(header)) {
                                        this.tableHeaderToRemove.push(header);
                                    }
                                    if (!this.tableHeaderLabelToRemove.includes(label)) {
                                        this.tableHeaderLabelToRemove.push(label);
                                    }
                                }
                            }
                        }
                        //Removing headers having Id as value
                        this.tableHeaders = this.tableHeaders.filter(header => !this.tableHeaderToRemove.includes(header));
                        this.tableHeaderLabel = this.tableHeaderLabel.filter(header => !this.tableHeaderLabelToRemove.includes(header));
                    }

                    this.tableDataQuery = JSON.parse(result);
                    //Checks condition when to stop fetching data by scrolling.
                    this.enableInfiniteLoading = (this.tableDataQuery.length == this.rowSize || this.tableDataQuery.length != 0);
                    if (this.tableDataQuery.length < this.rowSize) {
                        this.enableInfiniteLoading = false;
                    }
                    this.globalData = [...this.globalData, ...this.tableDataQuery];
                    this.tableDataPn = [...this.tableDataPn, ...this.tableDataQuery];
                    this.tableDataPn = ensureObjectsWithNullProperties(this.tableDataPn);
                    this.isLoaded = false;
                    this.isLoading = false;
                    this.scrolled = false;
                    if (this.stopColumnRender == true) {
                        this.stopColumnRender = false;
                    }
                }
            })
            .catch(error => {
                this.isLoading = false;
                this.tableData = false;
                this.tableDataErrorMsg = 'The component encountered a problem: no records were found, or the datasource is incorrect. Please check your datasource (JSON/SOQL/FlowData).';
            });
    }



    renderedCallback() {
        if (this.tableDataPn && this.tableDataPn.length > 0 && !this.stopColumnRender) {
            this.populateTableBody();
        }
        else if (this.stopColumnRender) {
        }
    }

    // Function to populate the table body.
    populateTableBody() {
        try {
            //Function to check if a value is a valid ID
            function isId(value) {
                return typeof value === 'string' && /^[a-zA-Z0-9]{15}$|^[a-zA-Z0-9]{18}$/.test(value);
            }
            this.visibleData = this.globalData;
            this.totalRecords = this.visibleData.length;
            this.dataToSort = this.visibleData;
            const tbody = this.template.querySelector('tbody');
            tbody.innerHTML = '';

            this.visibleData.forEach(row => {
                function forAnyId(row) {
                    return row.Id || row.id || row.ID;
                }
                // Check if all visible rows are selected.
                const allVisibleIdsSelected = this.visibleData.every(visibleRow => {
                    const visibleRowId = forAnyId(visibleRow);
                    return this.selectedRows.some(selectedRow => {
                        const selectedRowId = forAnyId(selectedRow);
                        return visibleRowId === selectedRowId;
                    });
                });
                if (!allVisibleIdsSelected) {
                    this.isMainCheckboxChecked = false;
                } else {
                    this.isMainCheckboxChecked = true;
                }


                const tr = document.createElement('tr');
                tr.addEventListener('dblclick', (event) => this.handleDoubleClick(event));
                const hiddenIdCell = document.createElement('td');
                hiddenIdCell.style.display = 'none';
                const hiddenIdInput = document.createElement('input');
                hiddenIdInput.type = "hidden";
                hiddenIdInput.value = forAnyId(row);
                hiddenIdCell.appendChild(hiddenIdInput);
                tr.appendChild(hiddenIdCell);

                // Check if the checkbox should be visible
                if (this.checkBoxVisibile) {

                    const checkboxCell = document.createElement('td');
                    const checkboxInput = document.createElement('input');
                    checkboxInput.type = 'checkbox';
                    checkboxInput.dataset.id = row.Id || row.id || row.ID;
                    checkboxInput.classList.add('customCll');
                    checkboxInput.addEventListener('change', (event) => this.handleCheckboxChange(event));
                    if (this.selectedRows.some(selectedRow => forAnyId(selectedRow) === forAnyId(row))) {
                        checkboxInput.checked = true;
                    }
                    checkboxCell.appendChild(checkboxInput);
                    tr.appendChild(checkboxCell);
                }

                this.tableHeaders.forEach((header, index) => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.setAttribute('readonly', true);
                    input.style.border = 'none';
                    input.style.width = 'auto';
                    const td = document.createElement('td');

                    if (this.soql) {
                        if (this.inlineEditing) {
                            if (header.includes('.')) {
                                if (row[header.split('.')[0]] !== undefined) {
                                    if (header.split('.')[1] == 'Name') {
                                        const link = document.createElement('a');
                                        link.href = '/' + row[header.split('.')[0]]['Id'];
                                        link.target = '_blank';
                                        link.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                        td.appendChild(link);
                                    }
                                    else {
                                        td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                    }
                                }
                                else {
                                    td.textContent = '';
                                }

                            }
                            else if (header == 'Name' || header == 'CaseNumber') {
                                const link = document.createElement('a');
                                link.textContent = row[header];
                                link.href = '/' + row.Id;
                                link.target = '_blank';
                                td.appendChild(link);

                            }
                            else if ((!this.isUpdatableMap[header] && header !== 'Name') || (this.isUpdatableMap[header] && isId(row[header]) && header !== 'Name')) {
                                td.textContent = row[header] == undefined ? '' : row[header];
                            }
                            else {
                                input.value = row[header] == undefined ? '' : row[header];
                            }
                        }
                        else {
                            if (header.includes('.')) {
                                if (row[header.split('.')[0]] !== undefined) {
                                    if (header.split('.')[1] == 'Name') {
                                        const link = document.createElement('a');
                                        link.href = '/' + row[header.split('.')[0]]['Id'];
                                        link.target = '_blank';
                                        link.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                        td.appendChild(link);
                                    }
                                    else {
                                        td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                    }
                                }
                                else {
                                    td.textContent = '';
                                }

                            }
                            else if (header == 'Name') {
                                const link = document.createElement('a');
                                link.textContent = row[header];
                                link.href = '/' + row.Id;
                                link.target = '_blank';
                                td.appendChild(link);
                            }
                            else if ((!this.isUpdatableMap[header] && header !== 'Name') || (this.isUpdatableMap[header] && isId(row[header]) && header !== 'Name')) {
                                td.textContent = row[header] == undefined ? '' : row[header];
                            }
                            else {
                                td.textContent = row[header] == undefined ? '' : row[header];
                            }
                        }
                    }
                    else if (this.flowRecord.length > 0) {
                        if (this.inlineEditing) {
                            if (!isId(row[header])) {
                                input.value = row[header] == undefined ? '' : row[header];
                            }
                            else {
                                td.textContent = row[header] == undefined ? '' : row[header];
                            }
                        }
                        else {
                            td.textContent = row[header] == undefined ? '' : row[header];
                        }
                    }
                    else {
                        td.textContent = row[header] == undefined ? '' : row[header];
                    }
                    if (this.isUpdatableMap[header] && (!isId(row[header])) && this.inlineEditing && header !== 'Name') {
                        td.appendChild(input);
                    }
                    if (!this.soql && this.flowRecord.length > 0 && !isId(row[header]) && this.inlineEditing) {
                        td.appendChild(input);
                    }
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
        } catch (error) {
            this.tableData = false;
            this.tableDataErrorMsg = 'There is some issue while populating data in the table';
        }

    }


    // Handle Id column visibility toggle
    handleIdColumn(event) {
        if (this.visibleData.length === 0) {
            event.preventDefault();
            event.target.checked = this.toggleIdColumn;
            return;
        }
        else if (this.visibleData.length !== 0 && this.checkForFilteredList == true) {
            event.preventDefault();
            event.target.checked = this.toggleIdColumn;
            return;
        }


        if (this.visibleData.length > 0 && this.filteredData.length > 0) {
            this.toggleIdColumn = !this.toggleIdColumn;
            this.showSubmit = false;
            this.isIdColumnVisible = !this.isIdColumnVisible;

            if (this.toggleIdColumn == false) {
                this.tableHeaders = this.tableHeaders.filter(header => !this.tableHeaderToRemove.includes(header));
                this.tableHeaderLabel = this.tableHeaderLabel.filter(header => !this.tableHeaderLabelToRemove.includes(header));
                this.stopColumnRender == true;
                this.populateTableBody2(this.filteredData);
            }
            else {
                this.tableHeaderLabel = this.tableHeaderLabel.concat(this.tableHeaderLabelToRemove);
                this.tableHeaders = this.tableHeaders.concat(this.tableHeaderToRemove);
                this.stopColumnRender == true;
                this.populateTableBody2(this.filteredData);
            }
        }
        else {
            this.toggleIdColumn = !this.toggleIdColumn;
            this.showSubmit = false;
            this.isIdColumnVisible = !this.isIdColumnVisible;
            if (this.toggleIdColumn == false) {
                this.tableHeaders = this.tableHeaders.filter(header => !this.tableHeaderToRemove.includes(header));
                this.tableHeaderLabel = this.tableHeaderLabel.filter(header => !this.tableHeaderLabelToRemove.includes(header));
                this.stopColumnRender == true;
                this.populateTableBody2(this.visibleData);
            }
            else {
                this.tableHeaderLabel = this.tableHeaderLabel.concat(this.tableHeaderLabelToRemove);
                this.tableHeaders = this.tableHeaders.concat(this.tableHeaderToRemove);
                this.stopColumnRender == true;
                this.populateTableBody2(this.visibleData);
            }
        }
    }

    // To check whether scroll bar is in bottom.
    isScrolledToBottom(scrollableElement) {
        return scrollableElement.scrollHeight - scrollableElement.scrollTop === scrollableElement.clientHeight || scrollableElement.scrollHeight - scrollableElement.scrollTop === scrollableElement.clientHeight + 1;
    }

    // Handle scrolling in the data table for infinite loading
    handleScroll(event) {
        if (event.target.scrollTop !== 0) {
            if (this.isScrolledToBottom(event.target) && !this.scrolled) {
                console.log('scrolled to bottom');
                this.scrolled = true;
                if (this.enableInfiniteLoading) {
                    this.showSubmit = false;
                    const allArrowIcons = this.template.querySelectorAll('lightning-icon');
                    allArrowIcons.forEach(icon => {
                        icon.classList.remove('arrowIconShow');
                    });
                    const inputElement = this.template.querySelector('[data-id="searchInput"]');
                    inputElement.value = '';
                    this.showInput = false;
                    this.loadMoreData();
                }

            }
        }


    }

    // Load more data when scrolled to the bottom
    loadMoreData() {
        this.isLoaded = true;
        this.rowOffset = this.rowSize + this.rowOffset;
        this.stopColumnRender = true;
        this.getSoqlData();
    }

    // Handle sorting of data by column
    handleSort(event) {
        if (this.dataToSort.length > 0) {
            this.showSubmit = false;
            this.selectedHeaderId = event.currentTarget.dataset.id;
            this.activeHeader = this.selectedHeaderId;
            this.sortedBy = event.currentTarget.dataset.id;
            this.sortedDirection = event.currentTarget.dataset.set;

            if (this.soql) {
                const sortedArray = this.sortData(this.relatedLabelMap[this.sortedBy], this.sortedDirection, this.selectedHeaderId);
                this.populateTableBody2(sortedArray);
            }
            else {
                const sortedArray = this.sortData(this.sortedBy, this.sortedDirection, this.selectedHeaderId);
                this.populateTableBody2(sortedArray);
            }
        }
    }

    // Sorts data based on the given field and direction
    sortData(field, direction, selectedField) {
        const allArrowIcons = this.template.querySelectorAll('lightning-icon');
        allArrowIcons.forEach(icon => {
            icon.classList.remove('arrowIconShow');
        });

        if (direction == 'desc') {
            const tableHeader = this.template.querySelector(`th[data-id="${selectedField}"]`);
            const arrowIcon = tableHeader.querySelector('lightning-icon');
            arrowIcon.iconName = 'utility:arrowup';
            arrowIcon.classList.add('arrowIconShow');
            tableHeader.setAttribute('data-set', 'asc')
            const a = [...this.dataToSort]
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
                        return a[field.split('.')[0]][field.split('.')[1]] > b[field.split('.')[0]][field.split('.')[1]] ? 1 : -1;
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
                        return a[field] > b[field] ? 1 : -1;
                    }
                }
            }
            );
            return a;
        }
        else {
            const tableHeader = this.template.querySelector(`th[data-id="${selectedField}"]`);
            const arrowIcon = tableHeader.querySelector('lightning-icon');
            arrowIcon.iconName = 'utility:arrowdown';
            arrowIcon.classList.add('arrowIconShow');
            tableHeader.setAttribute('data-set', 'desc');
            const a = [...this.dataToSort]
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
                        return a[field.split('.')[0]][field.split('.')[1]] < b[field.split('.')[0]][field.split('.')[1]] ? 1 : -1;
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
                        return a[field] < b[field] ? 1 : -1
                    }
                }
            });
            return a;
        }
    }
    // Handle the start of a drag event for column header
    handleDragStart(event) {
        this.showSubmit = false;
        event.dataTransfer.setData('text', event.target.dataset.index);
        const inputField = this.template.querySelector('lightning-input');
        inputField.value = '';
    }
    // Handle the drop position for olumn header
    handleDrop(event) {
        const fromIndex = event.dataTransfer.getData('text');
        const toIndex = event.currentTarget.dataset.index;

        if (fromIndex !== toIndex) {
            this.tableHeaders.splice(toIndex, 0, this.tableHeaders.splice(fromIndex, 1)[0]);
            this.tableHeaders = [...this.tableHeaders];

            if (this.tableHeaderLabel.length > 0) {
                this.tableHeaderLabel.splice(toIndex, 0, this.tableHeaderLabel.splice(fromIndex, 1)[0]);
                this.tableHeaderLabel = [...this.tableHeaderLabel];
            }
            this.populateTableBody();
        }
    }

    handleDragOver(event) {
        event.preventDefault();
    }

    // Clearing global search text and setting table to its original state.
    handleCross(event) {
        if (!event.target.value.length) {
            this.filteredData = [];
            this.showInput = false;
            this.populateTableBody();
        }
    }

    // Handle global search
    handleKeyUp(event) {
        const allArrowIcons = this.template.querySelectorAll('lightning-icon');
        allArrowIcons.forEach(icon => {
            icon.classList.remove('arrowIconShow');
        });
        this.showInput = false;
        this.showSubmit = false;
        var inputText = event.target.value;
        this.visibleData = this.searchTable(inputText);
        this.globalSearchCloseFilterData = this.searchTable(inputText);
        this.dataToSort = this.visibleData;


        if (this.visibleData == '') {
            this.stopColumnRender = true;
            this.checkForFilteredList = false;
            this.filteredData = [];
            const tbody = this.template.querySelector('tbody');
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No data available</td></tr>';
            this.totalRecords = 0;
        }
        else {
            var text = this.template.querySelector('h3');
            text.textContent = '';
            this.stopColumnRender = true;
            this.filteredData = [];
            this.checkForFilteredList = false;
            this.populateTableBody2(this.visibleData);
        }
    }


    // Search through table data and return filtered results based on the search input
    searchTable(data) {
        data = data.toLowerCase();
        var filteredData = [];
        this.tableDataPn.some((item) => {
            let matchFound = false;
            this.tableHeaders.some((head) => {

                if (!head.includes('.') && String(item[head]).toLowerCase().includes(data)) {
                    filteredData.push(item);
                    matchFound = true;
                    return matchFound;
                }
                else if (item[head.split('.')[0]] !== undefined) {
                    if (head.includes('.') && String(item[head.split('.')[0]][head.split('.')[1]]).toLowerCase().includes(data)) {
                        filteredData.push(item);
                        matchFound = true;
                        return matchFound;
                    }
                }
            })

        })
        return filteredData;
    }

    // Function to populate the table body with given data
    populateTableBody2(data) {
        function isId(value) {
            return typeof value === 'string' && /^[a-zA-Z0-9]{15}$|^[a-zA-Z0-9]{18}$/.test(value);
        }
        const tbody = this.template.querySelector('tbody');
        tbody.innerHTML = '';
        this.totalRecords = data.length;

        data.forEach(row => {
            function forAnyId(row) {
                return row.Id || row.id || row.ID;
            }

            // Check if all visible rows are selected
            const allVisibleIdsSelected = this.visibleData.every(visibleRow => {
                const visibleRowId = forAnyId(visibleRow);
                return this.selectedRows.some(selectedRow => {
                    const selectedRowId = forAnyId(selectedRow);
                    return visibleRowId === selectedRowId;
                });
            });

            if (!allVisibleIdsSelected) {
                this.isMainCheckboxChecked = false;
            }
            else {
                this.isMainCheckboxChecked = true;
            }



            const tr = document.createElement('tr');
            tr.addEventListener('dblclick', (event) => this.handleDoubleClick(event));

            const hiddenIdCell = document.createElement('td');
            hiddenIdCell.style.display = 'none';
            const hiddenIdInput = document.createElement('input');
            hiddenIdInput.type = "hidden";
            hiddenIdInput.value = forAnyId(row);
            hiddenIdCell.appendChild(hiddenIdInput);

            tr.appendChild(hiddenIdCell);



            if (this.checkBoxVisibile) {
                const checkboxCell = document.createElement('td');
                const checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';
                checkboxInput.dataset.id = row.Id || row.id || row.ID;
                checkboxInput.addEventListener('change', (event) => this.handleCheckboxChange(event));

                if (this.selectedRows.some(selectedRow => forAnyId(selectedRow) === forAnyId(row))) {
                    checkboxInput.checked = true;
                }


                checkboxCell.appendChild(checkboxInput);
                tr.appendChild(checkboxCell);
            }


            this.tableHeaders.forEach(header => {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = row[header] == undefined ? '' : row[header];
                input.setAttribute('readonly', true);
                input.style.border = 'none';
                input.style.width = 'auto';
                const td = document.createElement('td');

                if (this.soql) {
                    if (this.inlineEditing) {
                        if (header.includes('.')) {
                            if (row[header.split('.')[0]] !== undefined) {
                                if (header.split('.')[1] == 'Name') {
                                    const link = document.createElement('a');
                                    link.href = '/' + row[header.split('.')[0]]['Id'];
                                    link.target = '_blank';
                                    link.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                    td.appendChild(link);
                                }
                                else {
                                    td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                }
                            }
                            else {
                                td.textContent = '';
                            }

                        }
                        else if (header == 'Name') {
                            const link = document.createElement('a');
                            link.textContent = row[header];
                            link.href = '/' + row.Id;
                            link.target = '_blank';
                            td.appendChild(link);
                        }
                        else if ((!this.isUpdatableMap[header] && header !== 'Name') || (this.isUpdatableMap[header] && isId(row[header]) && header !== 'Name')) {
                            td.textContent = row[header] == undefined ? '' : row[header];
                        }
                        else {
                            input.value = row[header] == undefined ? '' : row[header];
                        }
                    }
                    else {
                        if (header.includes('.')) {
                            if (row[header.split('.')[0]] !== undefined) {
                                if (header.split('.')[1] == 'Name') {
                                    const link = document.createElement('a');
                                    link.href = '/' + row[header.split('.')[0]]['Id'];
                                    link.target = '_blank';
                                    link.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                    td.appendChild(link);
                                }
                                else {
                                    td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                }
                            }
                            else {
                                td.textContent = '';
                            }
                        }
                        else if (header == 'Name') {
                            const link = document.createElement('a');
                            link.textContent = row[header];
                            link.href = '/' + row.Id;
                            link.target = '_blank';
                            td.appendChild(link);
                        }
                        else if ((!this.isUpdatableMap[header] && header !== 'Name') || (this.isUpdatableMap[header] && isId(row[header]) && header !== 'Name')) {
                            td.textContent = row[header] == undefined ? '' : row[header];
                        }
                        else {
                            td.textContent = row[header] == undefined ? '' : row[header];
                        }
                    }
                }
                else if (this.flowRecord.length > 0) {
                    if (this.inlineEditing) {
                        if (!isId(row[header])) {
                            input.value = row[header] == undefined ? '' : row[header];
                        }
                        else {
                            td.textContent = row[header] == undefined ? '' : row[header];
                        }
                    }
                    else {
                        td.textContent = row[header] == undefined ? '' : row[header];
                    }
                }
                else {
                    td.textContent = row[header] == undefined ? '' : row[header];
                }


                if (this.isUpdatableMap[header] && (!isId(row[header])) && this.inlineEditing && header !== 'Name') {
                    td.appendChild(input);
                }
                if (!this.soql && this.flowRecord.length > 0 && !isId(row[header]) && this.inlineEditing) {
                    td.appendChild(input);
                }
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    }



    // Stopping the table to sort when searching in column filter.
    handleNotSort(event) {
        event.stopPropagation();
    }

    //Handle Column filter search.
    handleInputChange(event) {
        const inputValue = event.target.value.toLowerCase();
        let currentHeader = event.currentTarget.dataset.id;

        if (this.soql) {
            currentHeader = this.relatedLabelMap[currentHeader];
        }
        this.columnFilters[currentHeader] = inputValue;
        this.filteredData = [...this.visibleData];
        for (const header in this.columnFilters) {
            const filterValue = this.columnFilters[header];
            if (header.includes('.')) {
                this.filteredData = this.filteredData.filter(item => {
                    if (item[header.split('.')[0]] !== undefined && item[header.split('.')[0]][header.split('.')[1]] !== undefined) {
                        return String(item[header.split('.')[0]][header.split('.')[1]]).toLowerCase().includes(filterValue)
                    }
                    else if (filterValue == '') {
                        return this.visibleData;
                    }
                });
            }
            else {
                this.filteredData = this.filteredData.filter(item =>//{
                    String(item[header]).toLowerCase().includes(filterValue)
                );
            }
        }
        this.dataToSort = this.filteredData;
        let isEmpty = Object.values(this.columnFilters).every(value => value === '');
        if (isEmpty) {
            this.stopColumnRender = true;
            this.checkForFilteredList = false;
            this.populateTableBody2(this.filteredData);
        }
        else {
            if (this.filteredData.length === 0) {
                this.stopColumnRender = true;
                const tbody = this.template.querySelector('tbody');
                tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No data available</td></tr>';
                this.totalRecords = 0;
                this.checkForFilteredList = true;
            } else {
                this.stopColumnRender = true;
                this.checkForFilteredList = false;
                this.populateTableBody2(this.filteredData);
            }
        }
    }

    //Reset the table to its original state, clearing filters and selections
    handleReset() {
        const inputElement = this.template.querySelector('[data-id="searchInput"]');
        inputElement.value = '';
        const checkboxes = this.template.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        this.selectedRows = [];

        const allArrowIcons = this.template.querySelectorAll('lightning-icon');
        allArrowIcons.forEach(icon => {
            icon.classList.remove('arrowIconShow');

        });
        this.showInput = false;
        this.showSubmit = false;
        this.filteredData = [];
        this.populateTableBody();
    }

    // Handle main checkbox selection for selecting all rows
    handleCheckboxChange(event) {
        const rowId = event.currentTarget.dataset.id
        const isChecked = event.target.checked;
        let rowData;

        for (let i = 0; i < this.tableDataPn.length; i++) {
            if (this.tableDataPn[i].Id == rowId || this.tableDataPn[i].id == rowId || this.tableDataPn[i].ID == rowId) {
                rowData = this.tableDataPn[i];
                break;
            }
        }

        if (isChecked) {
            this.selectedRows.push(rowData);
            if (this.selectedRows.length === this.visibleData.length) {
                this.isMainCheckboxChecked = true;
            }
        }
        else {
            this.isMainCheckboxChecked = false;
            const index = this.selectedRows.findIndex(item => item === rowData);
            if (index !== -1) {
                this.selectedRows.splice(index, 1);
            }
        }
        console.log('selected rows :', this.selectedRows);
        this.output = JSON.stringify(this.selectedRows);

    }

    // Handle single checkbox selection for selecting the rows
    checkAllCheckboxes(event) {
        const clicked = event.target.checked;
        this.isMainCheckboxChecked = clicked;
        const checkboxes = this.template.querySelectorAll('tbody input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            checkbox.checked = clicked;
            const rowId = checkbox.dataset.id;

            if (clicked) {
                const rowData = this.tableDataPn.find(row => row.Id == rowId || row.id == rowId || row.ID == rowId);
                if (rowData && !this.selectedRows.includes(rowData)) {
                    this.selectedRows.push(rowData);
                }

            } else {
                const index = this.selectedRows.findIndex(row => row.Id == rowId || row.id == rowId || row.ID == rowId);
                if (index !== -1) {
                    this.selectedRows.splice(index, 1);
                }
            }
        });
        this.output = JSON.stringify(this.selectedRows);
    }


    // Getting header name of column.
    handleHeaderName(event) {
        this.stopColumnRender = true;
        this.showHeaderName = event.currentTarget.textContent;
    }

    get titleHeaderName() {
        return 'Sort on ' + this.showHeaderName;
    }
    get titleFilterHeaderName() {
        return this.showInput ? 'Close filter on ' + this.showHeaderName : 'Filter on ' + this.showHeaderName;

    }

    // Handle tooltip of column filter. 
    handleFilterColumn(event) {
        event.stopPropagation();
        this.showInput = !this.showInput;
        if (!this.titleFilterHeaderName.startsWith('Close filter on ')) {
            if (this.globalSearchCloseFilterData !== undefined) {
                this.populateTableBody2(this.globalSearchCloseFilterData);
            }
            else {
                this.populateTableBody2(this.visibleData);
            }
        }
    }

}