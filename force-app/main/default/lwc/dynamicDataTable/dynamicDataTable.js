import { LightningElement, api, track } from 'lwc';
import getFieldName from '@salesforce/apex/DynamicDataTableHandler.getFieldName';
import getrelatedFieldName from '@salesforce/apex/DynamicDataTableHandler.getrelatedFieldName';
import getObjApiName from '@salesforce/apex/DynamicDataTableHandler.getObjApiName';
import isAutonumberField from '@salesforce/apex/DynamicDataTableHandler.isAutonumberField';
import getUpdateStatusNew from '@salesforce/apex/DynamicDataTableHandler.getUpdateStatusNew';
import getList from '@salesforce/apex/DynamicDataTableHandler.getDataFromQuery';
import getObjectLabelName from '@salesforce/apex/DynamicDataTableHandler.getObjectLabelName';
import iconNamesForObjects from '@salesforce/apex/DynamicDataTableHandler.iconNamesForObjects';
import updateSObject from '@salesforce/apex/DynamicDataTableHandler.updateSObject';
import getMapofTypeForFields from '@salesforce/apex/DynamicDataTableHandler.getMapofTypeForFields';
import getPicklistValue from '@salesforce/apex/DynamicDataTableHandler.getPicklistValue';
import getMapofRequiredField from '@salesforce/apex/DynamicDataTableHandler.getMapofRequiredField';
import getNamesOfObject from '@salesforce/apex/DynamicDataTableHandler.getNamesOfObject';
import getRelatedRecords from '@salesforce/apex/DynamicDataTableHandler.getRelatedRecords';
import getRelatedPicklistValue from '@salesforce/apex/DynamicDataTableHandler.getRelatedPicklistValue';
import { handleSort, sortData } from "./utils/sortingHandler";
import { handleDragStart, handleDrop } from "./utils/columnDragHandler";
import { handleKeyUp, searchTable } from "./utils/globalFilterHandler";
import { handleInputChange } from "./utils/columnFilterHandler";
import { handleReset } from "./utils/resetHandler";
import { handleCsvData, convertToCsvFile, createDownload, handleExcelData, createXlsDownload } from "./utils/csvXlsHandler";
import { checkAllCheckboxes } from "./utils/mainCheckBoxHandler";
import { handleCheckboxChange } from "./utils/singleCheckBoxHandler";
import { handleScroll } from "./utils/scrollHandler";
import { handleIdColumn } from "./utils/idColumnHandler";
import { handleGlobalReset } from "./utils/globalResetHandler";
import { resetVariables } from "./utils/resetVariablesHandler";
import { handleOpenDataSource } from "./utils/openDataSource";
import { handleDropChange } from "./utils/dataSourceDropdown";
import { handleJsonDataClickSec } from "./utils/mainJsonDataClick";
import { handleJsonDataClick } from "./utils/componentJsonDataClick";
import { handleOptionSelect } from "./utils/queryOptionSelect";
import { handleFileCLick } from "./utils/fileDropdownHandler";
import { handleGlobalReset2 } from "./utils/globalResetSec";
import { toggleDrawer } from "./utils/settingPopup";
import getQueryValues from '@salesforce/apex/DynamicDataTableHandler.getQueryValues';
import getQueryByName from '@salesforce/apex/DynamicDataTableHandler.getQueryByName';
import hasPermissionSet from '@salesforce/apex/DynamicDataTableHandler.hasPermissionSet';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';





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
    @api stopColumnRender = false;
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
    tableHeaderToRemove = [];
    @track toggleIdColumn = true;
    tableHeaderLabelToRemove = [];
    @api rowSize = 10;
    @api rowOffset = 0;
    @api showSpinner = false;
    isLoaded = false;
    enableInfiniteLoading = false;
    totalRecords = 0;
    showSubmit = false;
    @api objectLabelFromProperty;
    @api objectLabel;
    isLoading = true;
    isLoadingData = false;
    iconName;
    @api showReferenceToggle = false;
    @api globalSearchResult = [];
    @api inlineEditing = false;
    @track activeHeader = null;
    @track showNoDataMessage;
    @track showHeaderName;
    @api tableDataErrorMsg;
    @api globalSearchCloseFilterData;
    @api isIdColumnVisible = false;
    @track scrolled = false;
    @api filteredData = [];
    @api checkForFilteredList;
    @api checkBoxVisibile = false;
    @api showtoggle = false;
    @api editedIds = [];
    @api fieldTypeMap = {};
    @api requiredFieldMap = {};
    @api pickListChange = false;
    @api handleKeyup = null;
    @api handleBlur = null;
    successToastMessage;
    errorToastMessage;
    @api exportData;
    @api showExportButtons = false;
    showSearchLookUp1 = true;
    showSearchLookup2 = true;
    childLookup = true;
    objectNameForChild;
    fieldNameForChild;
    inputValueForChild;
    @track selectedTdElement;
    dynamicInstance;
    @track accountNames = [];
    debounceTimeout;
    hidColId = [];
    hasError = false;
    @api jsonData = false;
    @api soqlData = false;
    @track statusOptions;
    queryData = false;
    @track isChecked = false;
    @api customQuery;
    @api jsonDataa = false;
    @api soqlDataa = false;
    @track value1;
    @api value2;
    @api value3;
    @track disableJsonValidation = false;
    @api isJsonValid;
    @api isSoqlValid;
    @api flowData = false;
    @api jsonTextBox = false;
    @api soqlDropdown = false;
    @api queryDropdownData;
    @api customErrorMessage;
    @api showCustomError = false;
    @api mainDropdownVal;
    @api showtoggleProperty;
    @api getOpen = false;
    @api dropdownOpen;
    @track selectedLabel = 'Select an Option…';
    @api soqlLoadData = false;
    @api lastUpdatedTime = new Date();
    @track isDrawerOpen = false;
    @api firstBox = false;
    @api isFileDropdown = false;
    @api isAdditionalFunction;
    @api drawerStyle;
    @api isDrawerVisible = false;
    @api isDrawerOpennn = false;
    @track jsonInput = '';
    @track soqlInput = '';
    @track isSettingPopup;
    @api filter = '';
    @api selectedRow = '';
    @api standardQueryLabel;
    @api isStateRestored = false;
    @api test;
    @api jsonList;
    @api flowPresent = false;
    @api notFlowData = false;
    @api hasAccess = false;
    @api flowDataPresent = false;
    @api selectedValueFlow;
    @api savedQueryDataFlag = false;
    @api savedQueryLabel = '';
    @api soqlTextBoxQueryFlag = false;
    @api jsonDataFlag = false;
    @api reloadBtn = false;
    @api objectName;
    @api isAutoNumber;







    get hasStatusOptions() {
        return this.statusOptions.length > 0;
    }


    get isButtonDisabled() {
        return !this.jsonInput || this.jsonInput.trim().length === 0;
    }



    handleReloadData() {

        this.globalData = [];
        this.tableDataPn = [];
        if (this.soql) {
            this.tableData = this.soql;
            this.rowOffset = 0;
            this.rowSize = 10;
            this.toggleIdColumn = true;
        }
        else if (this.flowDataPresent && this.mainDropdownVal == 'flowdata') {

            this.tableData = undefined;
            this.isLoading = true;
            this.isLoadingData = true;
            setTimeout(() => {
                this.loadTableData();

            }, 1000);
            this.stopColumnRender = false;
            return;



        }
        else {
            this.tableData = JSON.stringify(this.tableData);
        }




        this.handleJsonDataClick();





    }


    // To get value in Json Textbox
    handleJsonInputChange(event) {
        this.jsonInput = event.target.value;
    }



    get isSoqlButtonDisabled() {
        return !this.soqlInput || this.soqlInput.trim().length === 0;
    }

    // To get value in Soql Textbox
    handleSoqlnInputChange(event) {
        this.soqlInput = event.target.value;
    }

    get drawerClass() {
        return this.isDrawerOpen ? 'drawer slide-in' : 'drawer slide-out';

    }



    // To handle file outside click
    handleFileOutsideClick = (event) => {
        try {
            const dropdown = this.template.querySelector('.dropdown-container');
            if (
                dropdown &&
                !dropdown.contains(event.target)) {

                this.isDrawerOpen = false;
                this.isDrawerVisible = false;
                this.template.removeEventListener('click', this.handleFileOutsideClick);
            }
        }
        catch (error) {

        }

    }

    //To Reset variables
    handleGlobalReset2() {
        handleGlobalReset2.bind(this)(this);
    }


    // To Open the Sidebar of Datasource
    handleOpenDataSource(event) {
        handleOpenDataSource.bind(this)(this);
    }



    handleSettingPopupOutClick = (event) => {
        try {
            const dropdown = this.template.querySelector('.addSetting');
            const settingIcon = this.template.querySelector('.trigger-icon');

            if (dropdown && !dropdown.contains(event.target) && settingIcon && !settingIcon.contains(event.target)) {
                this.isSettingPopup = false;
                this.template.removeEventListener('click', this.handleSettingPopupOutClick);
            }
        }
        catch (error) {

        }
    }





    //To Open Popup from Setting Icon
    toggleDrawer() {
        toggleDrawer.bind(this)(this);
    }

    //To Open Popup for downloading files
    handleFileCLick() {
        handleFileCLick.bind(this)(this);
    }


    handleAdditionalFuncOutClick = (event) => {
        try {
            const dropdown = this.template.querySelector('.addFile');
            const toggleIcon = this.template.querySelector('.combo-button');

            if (dropdown && !dropdown.contains(event.target) && toggleIcon && !toggleIcon.contains(event.target)) {
                this.isFileDropdown = false;
                this.template.removeEventListener('click', this.handleAdditionalFuncOutClick);
            }
        }
        catch (error) {

        }
    }


    get timeAgo() {
        if (!this.lastUpdatedTime) return '';
        const now = new Date();
        const updated = new Date(this.lastUpdatedTime);
        const diffMs = now - updated;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        if (diffSec < 60) return `few seconds ago`;
        if (diffMin < 60) return `${diffMin} minutes ago`;
        if (diffHr < 24) return `${diffHr} hour ago`;
        return `${diffDay} day ago`;
    }


    get dropdownTriggerClass() {
        return `slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ${this.dropdownOpen ? 'slds-is-open' : ''}`;
    }

    //To toggle the SOQL Query dropdown
    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
    }

    // To Select option from SOQL Query Dropdown
    handleOptionSelect(event) {
        handleOptionSelect.bind(this)(event, this);
    }

    get dropdownOptions() {
        const options = [];

        if (this.flowRecord.length > 0) {
            options.push({ label: 'Flow Data', value: 'flowdata' });
        }
        if (this.jsonData) {
            options.push({ label: 'JSON Data', value: 'jsondata' });
        }
        if (this.soqlData) {
            options.push({ label: 'SOQL Data', value: 'soqldata' });
        }
        return options;
    }

    //To Reset all the Datasource Dropdown Value
    handleGlobalReset(event) {
        handleGlobalReset.bind(this)(this);

    }

    //To Reset all the variables of Datasorce
    resetVariables() {
        resetVariables.bind(this)(this);
    }

    //To handle selection from DataSource Dropdown
    handleDropChange(event) {
        handleDropChange.bind(this)(event, this);
    }

    get isTextAreaValid() {
        return !this.isChecked;
    }


    handleDropdownClick = (event) => {
        event.stopPropagation();
    };


    handleOutsideClick = (event) => {
        setTimeout(() => {
            this.dropdownOpen = false;
        }, 100);
    }



    disconnectedCallback() {

        window.removeEventListener('click', this.handleOutsideClick);
        clearInterval(this.interval);
    }



    saveState() {

        const pathname = window.location.pathname;


        if (pathname !== '/lightning/n/DDTIM') {
            return;
        }


        const state = {
            data: this.globalData,
            data5: this.soql,
            data11: this.toggleIdColumn,
            data12: this.showtoggle,
            data13: this.showReferenceToggle,
            data15: this.isIdColumnVisible,
            data26: this.standardQueryLabel,
            data27: this.savedQueryDataFlag,
            data28: this.soqlTextBoxQueryFlag,
            data29: this.jsonDataFlag,
            data30: this.savedQueryLabel,
            data31: this.jsonInput,
            data32: this.soqlInput,
            data33: this.queryDropdownData,
            data34: this.reloadBtn

        };

        sessionStorage.setItem('dynamicDataTableState', JSON.stringify(state));
    }


    restoreState() {
        const pathname = window.location.pathname;

        if (pathname !== '/lightning/n/DDTIM') {
            return;
        }




        const saved = sessionStorage.getItem('dynamicDataTableState');

        if (saved) {
            this.isStateRestored = true;
            const state = JSON.parse(saved);
            this.jsonList = state.data;
            this.soql = state.data5;
            this.toggleIdColumn = true;
            this.showtoggle = state.data12;
            this.showReferenceToggle = state.data13;
            this.isIdColumnVisible = state.data15;
            this.standardQueryLabel = state.data26;
            this.savedQueryDataFlag = state.data27;
            this.soqlTextBoxQueryFlag = state.data28;
            this.jsonDataFlag = state.data29;
            this.savedQueryLabel = state.data30;
            this.jsonInput = state.data31;
            this.soqlInput = state.data32;
            this.queryDropdownData = state.data33;
            this.reloadBtn = state.data34;

        }

    }




    checkPermission() {
        hasPermissionSet({ permissionSetName: 'DDT' })
            .then((result) => {
                if (result) {
                    this.hasAccess = true;
                } else {
                    this.hasAccess = false;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Permission Error',
                            message: 'Permission required to access the component.',
                            variant: 'error',
                            mode: 'sticky'
                        })
                    );
                }
            })
            .catch((error) => {
                console.error(error);
                this.hasAccess = false;
            });
    }




    connectedCallback() {



        this.checkPermission();
        if (this.flowRecord.length == 0) {
            this.restoreState();
        }

        try {
            getQueryValues()
                .then(result => {
                    this.statusOptions = Object.keys(result).map(key => ({
                        label: key,
                        value: result[key]
                    }));
                })
                .catch(error => {
                    console.log('error ::', error);
                })
        }
        catch (error) {
            console.log('error', error);
        }




        window.addEventListener('click', this.handleOutsideClick);



        this.firstBox = true;

        if (this.flowRecord.length > 0) {
            this.flowDataPresent = true;
            //this.selectedValueFlow = 'flow'
            this.savedQueryDataFlag = false;
            this.soqlTextBoxQueryFlag = false;
            this.jsonDataFlag = false;


            this.isStateRestored = false;
            this.standardQueryLabel = '';
            this.soql = '';
            this.jsonList = [];
            this.firstBox = false;
            this.mainDropdownVal = 'flowdata';
            if (this.objectLabelFromProperty == undefined) {
                this.objectLabel = null;
            }
            else {
                this.objectLabel = this.objectLabelFromProperty;
            }

            setTimeout(() => {
                this.loadTableData();
            }, 0);
        }

        if (this.isStateRestored) {
            this.isLoadingData = true;
            this.firstBox = false;

            this.loadTableData();


            this.stopColumnRender = false;

        }




    }




    // To handle JSON Data Click
    handleJsonDataClick() {

        handleJsonDataClick.bind(this)(this);
    }

    handleJsonDataClickSec() {

        handleJsonDataClickSec.bind(this)(this);
    }

    //To load Data in table 
    async loadTableData() {
        if (this.isStateRestored) {

            if (this.standardQueryLabel != '' && this.standardQueryLabel != undefined) {
                this.test = await getQueryByName({ name: this.standardQueryLabel });
                this.tableData = this.test;


                const result = await getQueryValues();
                this.statusOptions = Object.keys(result).map(key => ({
                    label: key,
                    value: result[key]
                }));


            }
            else if (this.soql != '') {
                this.tableData = this.soql;
                this.isStateRestored = false;
            }
            else {
                this.tableData = JSON.stringify(this.jsonList);
                this.isStateRestored = false;

            }

        }


        if (this.tableData !== undefined) {
            try {
                // Condition for Json input
                if (this.tableData && this.tableData.toLowerCase().trim().indexOf("[") === 0) {


                    setTimeout(() => {
                        try {
                            this.tableData = JSON.parse(this.tableData);
                            this.tableHeaders = Object.keys(this.tableData[0]);
                            this.tableHeaderLabel = this.tableHeaders;
                            this.tableDataPn = this.tableData;
                            this.globalData = this.tableDataPn;
                            this.totalRecords = this.globalData.length;
                            this.isLoading = false;
                            this.isLoadingData = false;
                            this.enableInfiniteLoading = false;
                            this.flowPresent = false;
                            this.notFlowData = true;
                            if (this.objectLabel == null) {
                                this.objectLabel = 'JSON Data';
                            }
                            if (this.exportData) {
                                this.showExportButtons = true;
                            }
                            this.iconName = 'standard:dataset';
                        }
                        catch (error) {
                            console.error('error is json  ::', error);
                            this.isLoading = false;
                            this.isLoadingData = false;
                            this.tableData = false;
                            this.tableDataErrorMsg = 'The component encountered a problem: no records were found, or the datasource is incorrect. Please check your datasource (JSON/SOQL/FlowData).';
                        }
                    }, 800);




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

                    getObjApiName({ query: this.soql })
                        .then(result => {

                            this.objectName = result;

                        })



                    isAutonumberField({ query: this.soql })
                        .then(result => {
                            this.isAutoNumber = result;

                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });




                    //Getting Icon of the Object.
                    iconNamesForObjects({ query: this.soql })
                        .then(result => {
                            this.iconName = result;
                        })


                    this.showReferenceToggle = true;
                    this.getSoqlData();
                    this.flowPresent = false;
                    this.notFlowData = true;

                }
                else {
                    this.isLoading = false;
                    this.isLoadingData = false;
                    this.tableData = false;
                    this.tableDataErrorMsg = 'The component encountered a problem: no records were found, or the datasource is incorrect. Please check your datasource (JSON/SOQL/FlowData).';
                }
            }
            catch (error) {
                console.error('error is 33 ::', error);
                this.isLoading = false;
                this.isLoadingData = false;
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

            this.savedQueryDataFlag = false;
            this.soqlTextBoxQueryFlag = false;
            this.jsonDataFlag = false;

            //  this.isLoadingData = true;
            this.tableData = JSON.parse(JSON.stringify(this.flowRecord));
            this.tableHeaders = Object.keys(this.tableData[0]);
            this.tableHeaderLabel = this.tableHeaders;
            this.tableDataPn = JSON.parse(JSON.stringify(this.flowRecord));
            this.globalData = this.tableDataPn;

            this.isLoading = false;


            this.enableInfiniteLoading = false;

            if (this.objectLabel == null) {
                this.objectLabel = 'Flow Record Data';
            }
            if (this.exportData) {
                this.showExportButtons = true;
            }
            this.iconName = 'standard:dataset';
            this.isLoadingData = false;
            this.stopColumnRender = false;
        }
        else {
            this.isLoading = false;
            this.tableData = false;
            this.tableDataErrorMsg = 'The component encountered a problem: no records were found, or the datasource is incorrect. Please check your datasource (JSON/SOQL/FlowData).';
        }



    }

    getSoqlData() {
        if (this.exportData) {
            this.showExportButtons = true;
        }

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
                this.fieldTypeMap = await getMapofTypeForFields({ query: this.soql });
                this.isUpdatableMap = await getUpdateStatusNew({ query: this.soql });
                this.requiredFieldMap = await getMapofRequiredField({ query: this.soql });

                if (this.tableData.length === 0 && this.globalData.length === 0) {
                    this.tableData = false;
                    this.showNoDataMessage = true;
                    this.isLoading = false;
                    this.isLoadingData = false;
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
                                        if (keyData != null && typeof keyData == 'object' && this.fieldTypeMap[header] !== 'ADDRESS') { //
                                            for (const objKey of Object.keys(keyData)) {
                                                if (objKey !== 'attributes' && objKey !== 'Id') {
                                                    //Getting column header name for reference object field.
                                                    let relatedLabel = await getrelatedFieldName({ objectName: header, fieldName: objKey });
                                                    if (!this.tableHeaderLabel.includes(relatedLabel) && relatedLabel !== null) {
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
                                        if (keyData != null && typeof keyData == 'object' && this.fieldTypeMap[header] !== 'ADDRESS') {
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
                    this.isLoadingData = false;

                    this.scrolled = false;
                    if (this.stopColumnRender == true) {
                        this.stopColumnRender = false;
                    }
                }
            })
            .catch(error => {

                this.isLoading = false;
                this.isLoadingData = false;
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
                    input.style.outline = 'none';
                    const td = document.createElement('td');
                    td.dataset.type = this.fieldTypeMap[header];


                    if (this.soql) {
                        if (this.inlineEditing) {
                            if (header.includes('.')) {
                                if (row[header.split('.')[0]] !== undefined) {
                                    if (header.split('.')[1] == 'Name') {
                                        const link = document.createElement('a');
                                        link.href = '/' + row[header.split('.')[0]]['Id'];
                                        link.target = '_blank';
                                        link.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                        td.dataset.lookup = 'LOOKUPNAME';
                                        td.dataset.header = header;
                                        td.dataset.id = row[header.split('.')[0]]['Id'];
                                        td.dataset.linkid = '/' + row[header.split('.')[0]]['Id'];
                                        td.appendChild(link);

                                    }
                                    else if (!this.isUpdatableMap[header]) {
                                        if (typeof row[header.split('.')[0]][header.split('.')[1]] == 'object') {

                                            td.textContent = row[header.split('.')[0]][header.split('.')[1]] == undefined ? '' : Object.values(row[header.split('.')[0]][header.split('.')[1]]).filter(items => items !== null && items !== '').join(',');
                                            td.dataset.header = header;
                                            td.dataset.value = Object.values(row[header.split('.')[0]][header.split('.')[1]]);
                                        }
                                        else {
                                            td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                            td.dataset.header = header;
                                            td.dataset.value = row[header.split('.')[0]][header.split('.')[1]];
                                        }

                                    }
                                    else if (this.fieldTypeMap[header] == 'DATE') {
                                        if (row[header.split('.')[0]][header.split('.')[1]] !== '') {
                                            const date = new Date(row[header.split('.')[0]][header.split('.')[1]]);
                                            const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                                            td.textContent = formattedDate;
                                        }
                                        else {
                                            td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                        }
                                        td.dataset.header = header;
                                        td.dataset.value = row[header.split('.')[0]][header.split('.')[1]];
                                        td.dataset.id = row[header.split('.')[0]]['Id'];

                                    }
                                    else if (this.fieldTypeMap[header] == 'DATETIME') {

                                        if (row[header.split('.')[0]][header.split('.')[1]] !== '') {
                                            const date = new Date(row[header.split('.')[0]][header.split('.')[1]]);
                                            const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                                            let hours = date.getHours();
                                            const minutes = date.getMinutes().toString().padStart(2, '0');
                                            const ampm = hours >= 12 ? 'PM' : 'AM';
                                            hours = hours % 12;
                                            hours = hours ? hours : 12;
                                            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
                                            const formattedDateTime = `${formattedDate} ${formattedTime}`;
                                            td.textContent = formattedDateTime;
                                        }
                                        else {

                                            td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                        }
                                        td.dataset.header = header;
                                        td.dataset.value = row[header.split('.')[0]][header.split('.')[1]];
                                        td.dataset.id = row[header.split('.')[0]]['Id'];

                                    }
                                    else if (this.fieldTypeMap[header] == 'PICKLIST') {

                                        td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                        td.dataset.header = header;
                                        td.dataset.value = row[header.split('.')[0]][header.split('.')[1]];

                                        td.dataset.id = row[header.split('.')[0]]['Id'];

                                    }
                                    else if (this.fieldTypeMap[header] == 'BOOLEAN') {
                                        td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                        td.dataset.header = header;
                                        td.dataset.value = row[header.split('.')[0]][header.split('.')[1]];

                                        td.dataset.id = row[header.split('.')[0]]['Id'];
                                    }
                                    else {

                                        if (this.isUpdatableMap[header]) {
                                            input.value = row[header.split('.')[0]][header.split('.')[1]];
                                            td.dataset.header = header;
                                            td.dataset.value = row[header.split('.')[0]][header.split('.')[1]];
                                            td.dataset.id = row[header.split('.')[0]]['Id'];
                                        }

                                    }

                                }
                                else {
                                    td.textContent = '';
                                }
                            }

                            else if (header == 'Name' || (this.isAutoNumber && header === this.objectName + 'Number')) { //|| header == 'CaseNumber'
                                const link = document.createElement('a');
                                link.textContent = row[header];
                                link.href = '/' + row.Id;
                                link.target = '_blank';
                                td.appendChild(link);

                            }
                            else if ((!this.isUpdatableMap[header] && header !== 'Name') || (this.isUpdatableMap[header] && isId(row[header]) && header !== 'Name')) {

                                if (typeof row[header] == 'object') {

                                    td.textContent = row[header] == undefined ? '' : Object.values(row[header]).filter(items => items !== null && items !== '').join(',');
                                    td.dataset.header = header;
                                    td.dataset.value = Object.values(row[header]);
                                }
                                else {
                                    td.textContent = row[header] == undefined ? '' : row[header];
                                    td.dataset.header = header;
                                    td.dataset.value = row[header];
                                }

                            }
                            else {

                                if (this.fieldTypeMap[header] == 'BOOLEAN' && this.isUpdatableMap[header]) {
                                    td.textContent = row[header];
                                    td.dataset.header = header;


                                }
                                else if (this.fieldTypeMap[header] == 'PICKLIST') {
                                    td.dataset.value = row[header];
                                    td.dataset.header = header;
                                    td.textContent = row[header];

                                }
                                else if (this.fieldTypeMap[header] == 'DATE') {

                                    if (row[header] !== null) {
                                        const date = new Date(row[header]);
                                        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                                        td.textContent = formattedDate;
                                    }
                                    else {

                                        td.textContent = row[header];
                                    }


                                    td.dataset.header = header;
                                    td.dataset.value = row[header];
                                }
                                else if (this.fieldTypeMap[header] == 'DATETIME') {

                                    if (row[header] !== null) {
                                        const date = new Date(row[header]);
                                        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                                        let hours = date.getHours();
                                        const minutes = date.getMinutes().toString().padStart(2, '0');
                                        const ampm = hours >= 12 ? 'PM' : 'AM';
                                        hours = hours % 12;
                                        hours = hours ? hours : 12;
                                        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
                                        const formattedDateTime = `${formattedDate} ${formattedTime}`;
                                        td.textContent = formattedDateTime;
                                    }
                                    else {
                                        td.textContent = row[header];
                                    }
                                    td.dataset.header = header;
                                    td.dataset.value = row[header];
                                }

                                else if (this.fieldTypeMap[header] == 'TEXTAREA') {
                                    if (row[header] == null) {
                                        td.innerHTML = '';
                                    }
                                    else {
                                        if (row[header].includes('<')) {
                                            td.innerHTML = row[header];
                                        }
                                        else {
                                            td.textContent = row[header];
                                        }
                                    }
                                }
                                else if (this.fieldTypeMap[header] == 'ADDRESS') {



                                    td.textContent = row[header] == undefined ? '' : Object.values(row[header]).filter(items => items !== null && items !== '').join(',');
                                    td.dataset.header = header;
                                    td.dataset.value = Object.values(row[header]);

                                }
                                else {

                                    input.value = row[header] == undefined ? '' : row[header];
                                    td.dataset.header = header;
                                    td.dataset.value = row[header];
                                }
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

                        if (typeof row[header] == 'object') {

                            td.textContent = row[header] == undefined ? '' : Object.values(row[header]).filter(items => items !== null && items !== '').join(',');
                        }



                        else {

                            if (typeof row[header] == 'string' && row[header].includes('<')) {

                                td.innerHTML = row[header];
                            }





                            else {
                                td.textContent = row[header] == undefined ? '' : row[header];
                            }

                        }


                    }
                    else {
                        td.textContent = row[header] == undefined ? '' : row[header];
                    }
                    if (this.isUpdatableMap[header] && (!isId(row[header])) && this.inlineEditing && header !== 'Name' && !(this.fieldTypeMap[header] == 'BOOLEAN' || this.fieldTypeMap[header] == 'PICKLIST' || this.fieldTypeMap[header] == 'DATE' || this.fieldTypeMap[header] == 'DATETIME' || this.fieldTypeMap[header] == 'TEXTAREA' || header.split('.')[1] == 'Name' || this.fieldTypeMap[header] == 'REFERENCE')) {//|| this.fieldTypeMap[header] == 'CURRENCY'
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
        if (this.flowRecord.length == 0) {
            this.saveState();
        }



    }


    // Handle Id column visibility toggle
    handleIdColumn(event) {

        handleIdColumn.bind(this)(event, this);
    }


    // To check whether scroll bar is in bottom.
    isScrolledToBottom(scrollableElement) {
        return Math.round(scrollableElement.scrollHeight - scrollableElement.scrollTop) === scrollableElement.clientHeight || Math.round(scrollableElement.scrollHeight - scrollableElement.scrollTop) === scrollableElement.clientHeight + 1;
    }

    // Handle scrolling in the data table for infinite loading
    handleScroll(event) {
        handleScroll.bind(this)(event, this.isScrolledToBottom, this.enableInfiniteLoading, this.template, this.scrolled,
            this);
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
        handleSort.bind(this)(event, this.dataToSort, this.showSubmit, this.editedIds, this.selectedHeaderId, this.activeHeader, this.sortedBy, this.sortedDirection, this.soql, this.relatedLabelMap, this.template, this);
    }

    // Handle the start of a drag event for column header
    handleDragStart(event) {
        handleDragStart.bind(this)(event, this.showSubmit, this.editedIds, this.template, this);
    }

    // Handle the drop event for column header
    handleDrop(event) {
        handleDrop.bind(this)(event, this.tableHeaders, this.tableHeaderLabel, this);
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
        handleKeyUp.bind(this)(event, this.template, this.showInput, this.showSubmit, this.editedIds, this.visibleData, this.globalSearchCloseFilterData, this.dataToSort, this.tableDataPn, this.tableHeaders, this.stopColumnRender,
            this.checkForFilteredList, this.filteredData, this.totalRecords, this);

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
                input.style.outline = 'none';
                const td = document.createElement('td');
                td.dataset.type = this.fieldTypeMap[header];

                if (this.soql) {
                    if (this.inlineEditing) {
                        if (header.includes('.')) {
                            if (row[header.split('.')[0]] !== undefined) {
                                if (header.split('.')[1] == 'Name') {
                                    const link = document.createElement('a');
                                    link.href = '/' + row[header.split('.')[0]]['Id'];
                                    link.target = '_blank';
                                    link.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                    td.dataset.lookup = 'LOOKUPNAME';
                                    td.dataset.header = header;
                                    td.dataset.linkid = '/' + row[header.split('.')[0]]['Id'];
                                    td.dataset.id = row[header.split('.')[0]]['Id'];
                                    td.appendChild(link);
                                }
                                else if (!this.isUpdatableMap[header]) {
                                    if (typeof row[header.split('.')[0]][header.split('.')[1]] == 'object') {
                                        td.textContent = row[header.split('.')[0]][header.split('.')[1]] == undefined ? '' : Object.values(row[header.split('.')[0]][header.split('.')[1]]).filter(items => items !== null && items !== '').join(',');
                                        td.dataset.header = header;
                                        td.dataset.value = Object.values(row[header.split('.')[0]][header.split('.')[1]]);
                                    }
                                    else {
                                        td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                        td.dataset.header = header;
                                        td.dataset.value = row[header.split('.')[0]][header.split('.')[1]];
                                    }

                                }
                                else if (this.fieldTypeMap[header] == 'DATE') {

                                    if (row[header.split('.')[0]][header.split('.')[1]] !== '') {
                                        const date = new Date(row[header.split('.')[0]][header.split('.')[1]]);
                                        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                                        td.textContent = formattedDate;
                                    }
                                    else {
                                        td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                    }
                                    td.dataset.header = header;
                                    td.dataset.value = row[header.split('.')[0]][header.split('.')[1]];
                                    td.dataset.id = row[header.split('.')[0]]['Id'];
                                }
                                else if (this.fieldTypeMap[header] == 'DATETIME') {
                                    if (row[header.split('.')[0]][header.split('.')[1]] !== '') {
                                        const date = new Date(row[header.split('.')[0]][header.split('.')[1]]);
                                        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                                        let hours = date.getHours();
                                        const minutes = date.getMinutes().toString().padStart(2, '0');
                                        const ampm = hours >= 12 ? 'PM' : 'AM';
                                        hours = hours % 12;
                                        hours = hours ? hours : 12;
                                        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
                                        const formattedDateTime = `${formattedDate} ${formattedTime}`;
                                        td.textContent = formattedDateTime;
                                    }
                                    else {
                                        td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                    }
                                    td.dataset.header = header;
                                    td.dataset.value = row[header.split('.')[0]][header.split('.')[1]];
                                    td.dataset.id = row[header.split('.')[0]]['Id'];
                                }
                                else if (this.fieldTypeMap[header] == 'PICKLIST') {
                                    td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                    td.dataset.header = header;
                                    td.dataset.value = row[header.split('.')[0]][header.split('.')[1]];
                                    td.dataset.id = row[header.split('.')[0]]['Id'];
                                }
                                else if (this.fieldTypeMap[header] == 'BOOLEAN') {
                                    td.textContent = row[header.split('.')[0]][header.split('.')[1]];
                                    td.dataset.header = header;
                                    td.dataset.value = row[header.split('.')[0]][header.split('.')[1]];
                                    td.dataset.id = row[header.split('.')[0]]['Id'];
                                }
                                else if (this.fieldTypeMap[header] == 'ADDRESS') {
                                    td.textContent = row[header.split('.')[0]][header.split('.')[1]] == undefined ? '' : Object.values(row[header.split('.')[0]][header.split('.')[1]]).filter(items => items !== null && items !== '').join(',');
                                    td.dataset.header = header;
                                    td.dataset.value = Object.values(row[header.split('.')[0]][header.split('.')[1]]);
                                }
                                else {
                                    input.value = row[header.split('.')[0]][header.split('.')[1]];
                                    td.dataset.header = header;
                                    td.dataset.value = row[header.split('.')[0]][header.split('.')[1]];
                                    td.dataset.id = row[header.split('.')[0]]['Id'];
                                }
                            }
                            else {
                                td.textContent = '';
                            }
                        }
                        else if (header == 'Name' || (this.isAutoNumber && header === this.objectName + 'Number')) { //|| header == 'CaseNumber'

                            const link = document.createElement('a');
                            link.textContent = row[header];
                            link.href = '/' + row.Id;
                            link.target = '_blank';
                            td.appendChild(link);
                        }
                        else if ((!this.isUpdatableMap[header] && header !== 'Name') || (this.isUpdatableMap[header] && isId(row[header]) && header !== 'Name')) {
                            if (typeof row[header] == 'object') {

                                td.textContent = row[header] == undefined ? '' : Object.values(row[header]).filter(items => items !== null && items !== '').join(',');
                                td.dataset.header = header;
                                td.dataset.value = Object.values(row[header]);
                            }
                            else {
                                td.textContent = row[header] == undefined ? '' : row[header];
                                td.dataset.header = header;
                                td.dataset.value = row[header];
                            }

                        }
                        else {
                            if (this.fieldTypeMap[header] == 'BOOLEAN' && this.isUpdatableMap[header]) {
                                td.textContent = row[header];
                                td.dataset.header = header;
                            }
                            else if (this.fieldTypeMap[header] == 'PICKLIST') {
                                td.dataset.value = row[header];
                                td.dataset.header = header;
                                td.textContent = row[header];
                            }

                            else if (this.fieldTypeMap[header] == 'DATE') {
                                if (row[header] !== null) {
                                    const date = new Date(row[header]);
                                    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                                    td.textContent = formattedDate;
                                }
                                else {
                                    td.textContent = row[header];
                                }
                                td.dataset.header = header;
                                td.dataset.value = row[header];
                            }
                            else if (this.fieldTypeMap[header] == 'DATETIME') {

                                if (row[header] !== null) {
                                    const date = new Date(row[header]);
                                    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                                    let hours = date.getHours();
                                    const minutes = date.getMinutes().toString().padStart(2, '0');
                                    const ampm = hours >= 12 ? 'PM' : 'AM';
                                    hours = hours % 12;
                                    hours = hours ? hours : 12;
                                    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
                                    const formattedDateTime = `${formattedDate} ${formattedTime}`;
                                    td.textContent = formattedDateTime;
                                }
                                else {
                                    td.textContent = row[header];
                                }
                                td.dataset.header = header;
                                td.dataset.value = row[header];
                            }
                            else if (this.fieldTypeMap[header] == 'TEXTAREA') {
                                if (row[header] == null) {
                                    td.innerHTML = '';
                                }
                                else {
                                    if (row[header].includes('<')) {
                                        td.innerHTML = row[header];
                                    }
                                    else {
                                        td.textContent = row[header];
                                    }
                                }
                            }
                            else if (this.fieldTypeMap[header] == 'ADDRESS') {
                                td.textContent = row[header] == undefined ? '' : Object.values(row[header]).filter(items => items !== null && items !== '').join(',');
                                td.dataset.header = header;
                                td.dataset.value = Object.values(row[header]);
                            }

                            else {
                                input.value = row[header] == undefined ? '' : row[header];
                            }
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

                    if (typeof row[header] == 'object') {

                        td.textContent = row[header] == undefined ? '' : Object.values(row[header]).filter(items => items !== null && items !== '').join(',');
                    }

                    else {

                        if (typeof row[header] == 'string' && row[header].includes('<')) {

                            td.innerHTML = row[header];
                        }





                        else {
                            td.textContent = row[header] == undefined ? '' : row[header];
                        }

                    }

                }
                else {
                    td.textContent = row[header] == undefined ? '' : row[header];
                }

                if (this.isUpdatableMap[header] && (!isId(row[header])) && this.inlineEditing && header !== 'Name' && !(this.fieldTypeMap[header] == 'BOOLEAN' || this.fieldTypeMap[header] == 'PICKLIST' || this.fieldTypeMap[header] == 'DATE' || this.fieldTypeMap[header] == 'DATETIME' || this.fieldTypeMap[header] == 'TEXTAREA' || header.split('.')[1] == 'Name')) {
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
        handleInputChange.bind(this)(event, this.soql, this.relatedLabelMap, this.columnFilters, this.visibleData,
            this.dataToSort, this.stopColumnRender, this.checkForFilteredList, this, this.template, this.totalRecords, this.showSubmit,
            this.editedIds);

    }

    //Reset the table to its original state, clearing filters and selections
    handleReset() {

        handleReset.bind(this)(this.template, this.selectedRows, this.showInput, this.showSubmit, this.editedIds
            , this.filteredData, this);
    }

    // Handle single checkbox selection for selecting all rows
    handleCheckboxChange(event) {
        handleCheckboxChange.bind(this)(event, this.tableDataPn, this.selectedRows, this.visibleData, this, this.isMainCheckboxChecked,
            this.output
        );
    }

    // Handle main checkbox selection for selecting the rows  
    checkAllCheckboxes(event) {
        checkAllCheckboxes.bind(this)(event, this, this.isMainCheckboxChecked, this.template, this.tableDataPn, this.selectedRows,
            this.output
        );
    }

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

    // Handle to submit the records
    handleGoNext() {
        this.submitData();
    }

    // Function to make cell editable according to their type
    async handleDoubleClick(event) {
        const target = event.target;

        if (target.tagName === 'TD' && target.dataset.type === 'BOOLEAN' && this.isUpdatableMap[target.dataset.header] && this.inlineEditing && target.dataset.id !== '') {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = target.textContent.trim().toLowerCase() === 'true';
            const currentValue = target.textContent.trim().toLowerCase() === 'true';
            checkbox.addEventListener('change', (event) => {
                target.dataset.value = event.target.checked;
                target.dataset.edited = "true";
                if (event.target.checked == currentValue) {
                    target.textContent = currentValue;
                    target.dataset.edited = "false";
                }

                const tr = target.closest('tr');
                let isAnyFieldEdited = false;
                tr.querySelectorAll('td').forEach(td => {
                    if (td.dataset.edited === "true") {
                        isAnyFieldEdited = true;
                    }
                });
                const hiddenIdCell = tr.querySelector('td:first-child');
                const hiddenId = hiddenIdCell.querySelector('input[type="hidden"]');

                if (hiddenId) {
                    if (!this.editedIds.includes(hiddenId.value)) {
                        this.editedIds.push(hiddenId.value);
                        this.showSubmit = true;
                        this.stopColumnRender = true;
                    }
                    else if (event.target.checked === currentValue && !isAnyFieldEdited) {
                        let index = this.editedIds.indexOf(hiddenId.value);
                        if (index !== -1) {
                            this.editedIds.splice(index, 1);
                        }
                        if (this.editedIds.length == 0) {
                            this.showSubmit = false;
                        }
                    }
                }

            });

            document.addEventListener('click', function handleOutsideClick(event) {

                if (!checkbox.contains(event.target) && !target.contains(event.target)) {
                    if (checkbox.checked == currentValue) {
                        target.textContent = currentValue;
                    }
                    document.removeEventListener('click', handleOutsideClick);
                }
            });
            target.innerHTML = '';
            target.appendChild(checkbox);

        }
        else if (target.tagName === 'TD' && target.dataset.type === 'PICKLIST' && this.inlineEditing && target.dataset.id !== '') {
            let currentValue = target.dataset.value;
            const headerValue = target.dataset.header;
            let pickListOptions
            if (headerValue.includes('.')) {
                let head = headerValue.split('.');

                pickListOptions = await getRelatedPicklistValue({ objectName: head[0], field: head[1] });

            }
            else {
                pickListOptions = await getPicklistValue({ query: this.soql, field: headerValue });
            }

            const select = document.createElement('select');
            let originalOptions = pickListOptions;

            let options = [...originalOptions];
            if (currentValue == 'null' || currentValue == '') {
                currentValue = '--None--';
            }

            if (!options.includes('--None--')) {
                options.unshift('--None--');
            }


            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                if (option === currentValue) {
                    optionElement.selected = true;
                }
                select.appendChild(optionElement);
            });

            select.addEventListener('change', (event) => {
                target.dataset.value = event.target.value;
                const selectedValue = event.target.value;
                target.dataset.edited = "true";

                if (selectedValue === '--None--' && currentValue === '--None--') {
                    target.textContent = '';
                    target.dataset.edited = "false";
                }
                else if (event.target.value == currentValue && currentValue != '--None--') {
                    target.textContent = event.target.value;
                    target.dataset.edited = "false";
                    target.style.border = '';

                }

                this.pickListChange = target.dataset.edited;
                const tr = target.closest('tr');
                const hiddenIdCell = tr.querySelector('td:first-child');
                const hiddenId = hiddenIdCell.querySelector('input[type="hidden"]');
                let isAnyFieldEdited = false;
                tr.querySelectorAll('td').forEach(td => {
                    if (td.dataset.edited === "true") {
                        isAnyFieldEdited = true;
                    }
                });

                if (hiddenId) {
                    try {
                        if (!this.editedIds.includes(hiddenId.value)) {
                            this.editedIds.push(hiddenId.value);
                            this.showSubmit = true;
                            this.stopColumnRender = true;
                        }
                        else if (event.target.value == currentValue && !isAnyFieldEdited) {
                            let index = this.editedIds.indexOf(hiddenId.value);
                            if (index !== -1) {
                                this.editedIds.splice(index, 1);
                            }
                            if (this.editedIds.length == 0) {
                                this.showSubmit = false;
                            }
                        }
                    } catch (error) {
                    }
                }
            });

            const self = this;
            document.addEventListener('click', function handleOutsideClick(event) {
                if (!select.contains(event.target) && !target.contains(event.target)) {
                    if (!self.requiredFieldMap[headerValue]) {
                        if (select.value === currentValue) {
                            if (select.value == '--None--' && currentValue == '--None--') {
                                target.textContent = '';
                            } else {
                                target.textContent = currentValue;
                            }
                        }
                    }
                    else {
                        if (select.value === currentValue) {
                            if (select.value == '--None--' && currentValue == '--None--') {
                                target.textContent = '';
                            } else {
                                target.textContent = currentValue;
                                target.style.border = '';
                            }
                        }
                    }
                    document.removeEventListener('click', handleOutsideClick);
                }
            });
            target.textContent = '';
            target.appendChild(select);
        }

        else if (target.tagName === 'TD' && target.dataset.type === 'DATE' && this.inlineEditing && target.dataset.id !== '') {
            const input = document.createElement('input');
            input.type = 'date';
            let currentDate = target.textContent.trim();
            if (currentDate) {
                const [month, day, year] = currentDate.split('/');
                currentDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
            input.value = currentDate;
            input.style.width = '100%';
            const currentValue = target.textContent.trim()

            input.addEventListener('change', (event) => {
                target.dataset.value = event.target.value;
                target.dataset.edited = "true";

                if (event.target.value == currentDate) {
                    target.textContent = currentValue;
                    target.dataset.edited = "false";
                }
                const tr = target.closest('tr');
                let isAnyFieldEdited = false;
                tr.querySelectorAll('td').forEach(td => {
                    if (td.dataset.edited === "true") {
                        isAnyFieldEdited = true;
                    }
                });

                const hiddenIdCell = tr.querySelector('td:first-child');
                const hiddenId = hiddenIdCell.querySelector('input[type="hidden"]');
                if (hiddenId) {
                    if (!this.editedIds.includes(hiddenId.value)) {
                        this.editedIds.push(hiddenId.value);
                        this.showSubmit = true;
                        this.stopColumnRender = true;
                    }
                    else if (event.target.value == currentDate && !isAnyFieldEdited) {
                        let index = this.editedIds.indexOf(hiddenId.value);
                        if (index !== -1) {
                            this.editedIds.splice(index, 1);
                        }

                        if (this.editedIds.length == 0) {
                            this.showSubmit = false;
                        }
                    }
                }
            });
            document.addEventListener('click', function handleOutsideClick(event) {

                if (!input.contains(event.target) && !target.contains(event.target)) {
                    let conInputDate = input.value;
                    if (conInputDate) {
                        const [year, month, day] = conInputDate.split('-');
                        conInputDate = `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
                    }
                    if (conInputDate == currentValue) {
                        target.textContent = currentValue;
                    }
                    document.removeEventListener('click', handleOutsideClick);
                }
            });
            target.textContent = '';
            target.appendChild(input);
        }

        else if (target.tagName === 'TD' && target.dataset.type === 'DATETIME' && this.inlineEditing && target.dataset.id !== '') {
            const input = document.createElement('input');
            input.type = 'datetime-local';
            let currentDate = target.textContent.trim();
            if (currentDate) {
                const [datePart, timePart, period] = currentDate.split(' ');
                const [month, day, year] = datePart.split('/');
                let [hours, minutes] = timePart.split(':');
                if (period === 'PM' && hours !== '12') {
                    hours = parseInt(hours, 10) + 12;
                } else if (period === 'AM' && hours === '12') {
                    hours = '00';
                }
                currentDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours}:${minutes.padStart(2, '0')}`;
            }
            input.value = currentDate;
            input.style.width = '100%';
            const currentValue = target.textContent.trim()
            input.addEventListener('change', (event) => {
                target.dataset.value = event.target.value;
                target.dataset.edited = "true";
                if (event.target.value == currentDate) {
                    target.textContent = currentValue;
                    target.dataset.edited = "false";
                }
                const tr = target.closest('tr');
                let isAnyFieldEdited = false;
                tr.querySelectorAll('td').forEach(td => {
                    if (td.dataset.edited === "true") {
                        isAnyFieldEdited = true;
                    }
                });

                const hiddenIdCell = tr.querySelector('td:first-child');
                const hiddenId = hiddenIdCell.querySelector('input[type="hidden"]');
                if (hiddenId) {
                    if (!this.editedIds.includes(hiddenId.value)) {
                        this.editedIds.push(hiddenId.value);
                        this.showSubmit = true;
                        this.stopColumnRender = true;
                    }
                    else if (event.target.value == currentDate && !isAnyFieldEdited) {
                        let index = this.editedIds.indexOf(hiddenId.value);
                        if (index !== -1) {
                            this.editedIds.splice(index, 1);
                        }
                        if (this.editedIds.length == 0) {
                            this.showSubmit = false;
                        }
                    }
                }
            });

            document.addEventListener('click', function handleOutsideClick(event) {

                if (!input.contains(event.target) && !target.contains(event.target)) {
                    let conInputDate = input.value;
                    if (conInputDate) {
                        const dateParts = conInputDate.split('T');
                        const [year, month, day] = dateParts[0].split('-');
                        const timeParts = dateParts[1].split(':');
                        let hours = parseInt(timeParts[0], 10);
                        const minutes = timeParts[1];
                        const ampm = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12;
                        hours = hours ? hours : 12;
                        conInputDate = `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year} ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
                    }
                    if (conInputDate == currentValue) {
                        target.textContent = currentValue;
                    }
                    document.removeEventListener('click', handleOutsideClick);
                }
            });
            target.textContent = '';
            target.appendChild(input);
        }
        else if (target.tagName === 'INPUT' && target.closest('td').dataset.id !== '') {
            const tdout = target.closest('td');
            let currentValue = tdout.dataset.value;
            target.readOnly = false;
            target.style.border = '1px solid black';
            target.style.outline = '1px solid black';
            this.handleKeyup = (event) => {
                const tdin = target.closest('td');
                target.style.backgroundColor = '#FAFAD2';
                target.dataset.edited = "true";
                tdin.dataset.edited = "true";
                if (event.target.value === currentValue) {
                    target.style.backgroundColor = '';
                    tdin.dataset.edited = "false";
                    target.dataset.edited = "false";
                }

                const tr = target.closest('tr');
                let isAnyFieldEdited = false;
                tr.querySelectorAll('td').forEach(td => {

                    if (td.dataset.edited === "true") {
                        isAnyFieldEdited = true;
                    }
                });

                const td = tr.querySelector('td:first-child');
                const hiddenId = td.querySelector('input[type="hidden"]');
                if (hiddenId) {
                    if (!this.editedIds.includes(hiddenId.value)) {
                        this.editedIds.push(hiddenId.value);
                        this.showSubmit = true;
                        this.stopColumnRender = true;
                    }
                    else if (event.target.value == currentValue && !isAnyFieldEdited) {
                        let index = this.editedIds.indexOf(hiddenId.value);
                        if (index !== -1) {
                            this.editedIds.splice(index, 1);
                        }
                        if (this.editedIds.length == 0) {
                            this.showSubmit = false;
                        }
                    }
                }
            };

            this.handleBlur = (event) => {

                if (event.target.value == currentValue) {
                    target.readOnly = true;
                    target.style.border = 'none';
                    target.style.outline = 'none';
                }
                target.readOnly = true;
                target.style.border = 'none';
                target.style.outline = 'none';
                target.removeEventListener('keyup', this.handleKeyup);
            }

            // Adding the event listener
            target.removeEventListener('blur', this.handleBlur);

            // Removing the event listener
            target.addEventListener('blur', this.handleBlur);
            target.addEventListener('keyup', this.handleKeyup);
        }
        else if (target.tagName === 'TD' && target.dataset.lookup == 'LOOKUPNAME' && this.inlineEditing) {

            let selectedLabelinLi = '';
            let selectedValueinLi;
            let sss = target.dataset.header;
            let s = sss.split('.');

            const input1 = document.createElement('input');
            input1.type = 'search';
            let currentVal = target.textContent;
            target.textContent = '';
            input1.value = currentVal;

            const dropdownDiv = document.createElement('div');
            dropdownDiv.style.display = 'none';
            dropdownDiv.style.border = '1px solid #ccc';
            dropdownDiv.style.position = 'absolute';
            dropdownDiv.style.zIndex = '1000';
            dropdownDiv.style.backgroundColor = 'white';
            const tr = target.closest('tr');
            target.appendChild(input1);
            target.appendChild(dropdownDiv);

            input1.addEventListener('keyup', async (event) => {
                let selectedVal = event.target.value;
                if (this.debounceTimeout) {
                    clearTimeout(this.debounceTimeout);
                }
                this.debounceTimeout = setTimeout(async () => {
                    if (selectedVal.length > 0) {
                        await this.fetchNamesOfObject(s[0], s[1], selectedVal);
                        if (this.accountNames.length > 0) {
                            dropdownDiv.innerHTML = '';

                            const ul = document.createElement('ul');
                            ul.style.border = '1px solid black';
                            this.accountNames.forEach(account => {
                                const li = document.createElement('li');
                                li.textContent = account.label;
                                li.dataset.value = account.value;
                                li.style.padding = '4px';
                                li.style.cursor = 'pointer';
                                li.addEventListener('mouseover', () => {
                                    li.style.backgroundColor = '#e0e0e0';
                                    li.style.border = '1px solid blue';
                                });
                                li.addEventListener('mouseout', () => {
                                    li.style.backgroundColor = '';
                                    li.style.border = '';
                                });
                                ul.appendChild(li);

                                li.addEventListener('click', (event) => {
                                    selectedLabelinLi = event.target.textContent;
                                    selectedValueinLi = event.target.dataset.value;
                                    input1.value = selectedLabelinLi;
                                    target.dataset.value = selectedValueinLi;
                                    target.dataset.id = selectedValueinLi;
                                    target.dataset.label = selectedLabelinLi;
                                    if (selectedLabelinLi == 'No Data Available' || selectedLabelinLi == currentVal) {
                                        target.dataset.edited = "false";
                                    }
                                    else {
                                        target.dataset.edited = "true";
                                    }

                                    const hiddenIdCell = tr.querySelector('td:first-child');
                                    const hiddenId = hiddenIdCell.querySelector('input[type="hidden"]');
                                    if (hiddenId && selectedLabelinLi !== 'No Data Available') {

                                        if (!this.editedIds.includes(hiddenId.value) && selectedLabelinLi !== currentVal) {
                                            this.editedIds.push(hiddenId.value);
                                            this.showSubmit = true;
                                            this.stopColumnRender = true;
                                        }
                                        else if (selectedLabelinLi == currentVal) {
                                            let index = this.editedIds.indexOf(hiddenId.value);
                                            if (index !== -1) {
                                                this.editedIds.splice(index, 1);
                                            }
                                            if (this.editedIds.length == 0) {
                                                this.showSubmit = false;
                                            }
                                        }
                                    }
                                    else if (this.editedIds.length == 0) {
                                        this.showSubmit = false;
                                    }
                                    dropdownDiv.style.display = 'none';
                                });
                            })
                            dropdownDiv.appendChild(ul);
                            dropdownDiv.style.display = 'block';
                        }
                    }
                    else {

                        target.dataset.value = '';
                        target.dataset.edited = 'true';
                        currentVal = '';

                        const hiddenIdCell = tr.querySelector('td:first-child');
                        const hiddenId = hiddenIdCell.querySelector('input[type="hidden"]');
                        if (hiddenId) {
                            if (!this.editedIds.includes(hiddenId.value)) {
                                this.editedIds.push(hiddenId.value);
                                this.showSubmit = true;
                                this.stopColumnRender = true;
                            }

                        }

                        this.accountNames = [];
                        dropdownDiv.style.display = 'none';
                    }
                }, 250)

            })

            document.addEventListener('click', function handleOutsideClick(event) {

                if (!target.contains(event.target) && !dropdownDiv.contains(event.target)) {


                    if (selectedLabelinLi == 'No Data Available' || (selectedLabelinLi == currentVal && currentVal != '')) {
                        dropdownDiv.style.display = 'none';
                        const link = document.createElement('a');
                        link.href = target.dataset.linkid;
                        link.textContent = currentVal;
                        target.innerHTML = '';
                        target.appendChild(link);
                    }
                    else if (selectedLabelinLi == currentVal && currentVal == '' && selectedValueinLi == undefined) {

                        dropdownDiv.style.display = 'none';
                        target.innerHTML = '';

                    }
                    else if (selectedLabelinLi == '' && currentVal !== '') {

                        dropdownDiv.style.display = 'none';
                        const link = document.createElement('a');
                        link.href = target.dataset.linkid;
                        link.textContent = currentVal;
                        target.innerHTML = '';
                        target.appendChild(link);
                    }
                    document.removeEventListener('click', handleOutsideClick);
                }
            });
        }
    }

    // Getting all Names of Object
    async fetchNamesOfObject(val1, val2, val3) {
        try {
            const result = await getNamesOfObject({ sObjectName: val1, field: val2, searchKey: val3 });
            if (result.length == 0) {
                this.accountNames = [{ label: 'No Data Available', value: 'no data' }];
            }
            else {
                this.accountNames = result.map(account => ({
                    label: account.label || 'No Data Available',
                    value: account.id || 'no data'
                }));
            }
        } catch (error) {
            console.error('Error fetching account names', error);
        }
    }


    handleSelectionChange(event) {
        if (this.selectedTdElement) {
            this.selectedTdElement.textContent = event.detail.label;
        }
    }

    // Function to save all editted records to save in database
    async submitData() {
        if (this.editedIds.length > 0) {
            const checkedIds = [];
            let jsonData = [];
            let filArray = [];
            this.hasError = false;
            const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

            function validateUrl(url) {
                return urlRegex.test(url);
            }

            function validateEmail(email) {
                return emailRegex.test(email);
            }

            this.template.querySelectorAll('tr').forEach(tr1 => {
                const editedRow = {};
                let relatedEditedRow = {};
                let idFound = false;
                const firstTd = tr1.querySelector('td:first-child');

                if (firstTd) {
                    const hiddenCol = firstTd.querySelector('input[type="hidden"]');
                    const tr = hiddenCol.closest('tr');
                    const tds = tr.querySelectorAll('td');
                    tds.forEach((td, index) => {
                        const input = td.querySelector('input[type="text"]');
                        const inputeditted = td.querySelector(' input[data-edited="true"]');
                        const select = td.querySelector('select');

                        // Handle Required fields of Object
                        if (this.editedIds.includes(hiddenCol.value) && this.requiredFieldMap[td.dataset.header]) {
                            let value;
                            if (td.dataset.type === "STRING") {
                                if (input) {
                                    value = input.value;
                                    if (value == '' && !td.dataset.header.includes('.')) {
                                        td.style.border = '2px solid red';
                                        this.errorToastMessage = true;
                                        this.errorMsg = 'Please enter a value in required field.';
                                        this.hasError = true;
                                    }
                                    else if (value == '' && td.dataset.header.includes('.')) {
                                        let dotHeader = td.dataset.header.split('.');
                                        this.requiredToastMessage(dotHeader, hiddenCol.value, td);

                                    }

                                }
                            }
                            else if (td.dataset.type === 'PICKLIST') {
                                const tdValue = td.textContent;
                                if (select) {
                                    value = select.value;

                                }
                                if ((tdValue == '' || value == '--None--') && !td.dataset.header.includes('.')) {
                                    td.style.border = '2px solid red';
                                    this.errorToastMessage = true;
                                    this.errorMsg = 'Please enter a value in required field.';
                                    this.hasError = true;

                                }
                                else if ((td.dataset.value == '' || td.dataset.value == '--None--') && td.dataset.header.includes('.')) {
                                    let dotHeader = td.dataset.header.split('.');
                                    this.requiredToastMessage(dotHeader, hiddenCol.value, td);

                                }
                            }
                            else if (td.dataset.type === 'DATE') {
                                if ((td.dataset.value == "null" || td.dataset.value == '') && !td.dataset.header.includes('.')) {
                                    td.style.border = '2px solid red';

                                    this.errorToastMessage = true;
                                    this.errorMsg = 'Please enter a value in required field.';
                                    this.hasError = true;
                                }
                                else if ((td.dataset.value == '' || td.dataset.value == 'null') && td.dataset.header.includes('.')) {
                                    let dotHeader = td.dataset.header.split('.');
                                    this.requiredToastMessage(dotHeader, hiddenCol.value, td);
                                }
                            }
                            else if (td.dataset.type === 'DATETIME') {
                                if ((td.dataset.value == "null" || td.dataset.value == '') && !td.dataset.header.includes('.')) {
                                    td.style.border = '2px solid red';
                                    this.errorToastMessage = true;
                                    this.errorMsg = 'Please enter a value in required field.';
                                    this.hasError = true;
                                }
                                else if ((td.dataset.value == '' || td.dataset.value == "null") && td.dataset.header.includes('.')) {
                                    let dotHeader = td.dataset.header.split('.');
                                    this.requiredToastMessage(dotHeader, hiddenCol.value, td);
                                }
                            }
                        }

                        // Collecting edited records of Object and related Objects
                        if ((input && input.dataset.edited == 'true') || (select && td.dataset.edited === "true") || (td.dataset.type === 'DATE' && td.dataset.edited === 'true') || (td.dataset.type === 'DATETIME' && td.dataset.edited === 'true') || (td.dataset.type === 'BOOLEAN' && td.dataset.edited === 'true') || (td.dataset.lookup === 'LOOKUPNAME' && td.dataset.edited === 'true')) {
                            const td2 = tr1.querySelector('td:nth-child(2)');
                            if (td2) {
                                const checkbox = td2.querySelector('input[type="checkbox"]');
                                if (checkbox) {
                                    const header = this.tableHeaders[index - 2];
                                    if (this.fieldTypeMap[header] !== 'PICKLIST' && this.fieldTypeMap[header] !== 'DATE' && this.fieldTypeMap[header] !== 'DATETIME' && this.fieldTypeMap[header] !== 'BOOLEAN' && td.dataset.lookup !== 'LOOKUPNAME') {
                                        if ((this.fieldTypeMap[header] == 'EMAIL' && !validateEmail(input.value) && input.value !== '') || (this.fieldTypeMap[header] == 'URL' && !validateUrl(input.value) && input.value !== '')) {
                                            input.style.border = '2px solid red';
                                            this.errorToastMessage = true;
                                            this.errorMsg = (this.fieldTypeMap[header] == 'EMAIL')
                                                ? 'Please enter a proper email address.'
                                                : (this.fieldTypeMap[header] == 'URL')
                                                    ? 'Please enter a proper URL address.'
                                                    : '';
                                            this.hasError = true;
                                            return;
                                        }
                                        if (!header.includes('.')) {
                                            editedRow['Id'] = hiddenCol.value;
                                            editedRow[header] = input.value;
                                        }
                                        else {
                                            let obj = this.processedDataForJson(header, hiddenCol.value, input.value);
                                            relatedEditedRow = { ...relatedEditedRow, ...obj };
                                        }
                                    }
                                    else if (select) {
                                        if (!header.includes('.')) {
                                            editedRow['Id'] = hiddenCol.value;
                                            editedRow[header] = select.value;
                                        }
                                        else {

                                            let obj = this.processedDataForJson(header, hiddenCol.value, select.value);
                                            relatedEditedRow = { ...relatedEditedRow, ...obj };

                                        }
                                    }
                                    else if (td.dataset.type === 'DATE' && td.dataset.edited === 'true') {
                                        if (this.editedIds.includes(hiddenCol.value)) {
                                            if (!header.includes('.')) {
                                                editedRow['Id'] = hiddenCol.value;
                                                editedRow[header] = td.dataset.value;
                                            }
                                            else {
                                                let obj = this.processedDataForJson(header, hiddenCol.value, td.dataset.value);
                                                relatedEditedRow = { ...relatedEditedRow, ...obj };
                                            }
                                        }
                                    }
                                    else if (td.dataset.type === 'DATETIME' && td.dataset.edited === 'true') {
                                        if (this.editedIds.includes(hiddenCol.value)) {
                                            if (!header.includes('.')) {
                                                editedRow['Id'] = hiddenCol.value;
                                                editedRow[header] = td.dataset.value;
                                            }
                                            else {
                                                let obj = this.processedDataForJson(header, hiddenCol.value, td.dataset.value);
                                                relatedEditedRow = { ...relatedEditedRow, ...obj };
                                            }
                                        }
                                    }
                                    else if (td.dataset.type === 'BOOLEAN' && td.dataset.edited === 'true') {

                                        let head = td.dataset.header;
                                        if (!head.includes('.')) {
                                            editedRow['Id'] = hiddenCol.value;
                                            editedRow[header] = td.dataset.value;
                                        }
                                        else {
                                            let obj = this.processedDataForJson(header, hiddenCol.value, td.dataset.value);
                                            relatedEditedRow = { ...relatedEditedRow, ...obj };
                                        }
                                    }
                                    else if (td.dataset.lookup === 'LOOKUPNAME' && td.dataset.edited === 'true') {
                                        let newHeader
                                        if (header.includes('.')) {
                                            newHeader = header.split('.');
                                            if (newHeader[0].endsWith('__r')) {
                                                newHeader = newHeader[0].replace('__r', '__c');
                                            }
                                            else {
                                                newHeader = newHeader[0] + 'Id';
                                            }
                                        }
                                        editedRow['Id'] = hiddenCol.value;

                                        editedRow[newHeader] = td.dataset.value;
                                    }
                                }
                                else if (select) {
                                    const header = this.tableHeaders[index - 1];
                                    if (!header.includes('.')) {
                                        editedRow['Id'] = hiddenCol.value;
                                        editedRow[header] = select.value;
                                    }
                                    else {
                                        let obj = this.processedDataForJson(header, hiddenCol.value, select.value);
                                        relatedEditedRow = { ...relatedEditedRow, ...obj };
                                    }

                                }
                                else if (td.dataset.type === 'DATE' && td.dataset.edited === 'true') {
                                    const header = this.tableHeaders[index - 1];


                                    if (!header.includes('.')) {
                                        editedRow['Id'] = hiddenCol.value;
                                        editedRow[header] = td.dataset.value;
                                    }
                                    else {
                                        let obj = this.processedDataForJson(header, hiddenCol.value, td.dataset.value);
                                        relatedEditedRow = { ...relatedEditedRow, ...obj };
                                    }
                                }

                                else if (td.dataset.type === 'DATETIME' && td.dataset.edited === 'true') {
                                    const header = this.tableHeaders[index - 1];
                                    if (!header.includes('.')) {
                                        editedRow['Id'] = hiddenCol.value;
                                        editedRow[header] = td.dataset.value;
                                    }
                                    else {
                                        let obj = this.processedDataForJson(header, hiddenCol.value, td.dataset.value);
                                        relatedEditedRow = { ...relatedEditedRow, ...obj };
                                    }
                                }

                                else if (td.dataset.type === 'BOOLEAN' && td.dataset.edited === 'true') {
                                    const header = this.tableHeaders[index - 1];
                                    if (!header.includes('.')) {
                                        editedRow['Id'] = hiddenCol.value;
                                        editedRow[header] = td.dataset.value;
                                    }
                                    else {
                                        let obj = this.processedDataForJson(header, hiddenCol.value, td.dataset.value);
                                        relatedEditedRow = { ...relatedEditedRow, ...obj };
                                    }
                                }

                                else if (td.dataset.lookup === 'LOOKUPNAME' && td.dataset.edited === 'true') {
                                    const header = this.tableHeaders[index - 1];
                                    let newHeader
                                    if (header.includes('.')) {
                                        newHeader = header.split('.');
                                        if (newHeader[0].endsWith('__r')) {
                                            newHeader = newHeader[0].replace('__r', '__c');
                                        }
                                        else {
                                            newHeader = newHeader[0] + 'Id';
                                        }
                                    }
                                    editedRow['Id'] = hiddenCol.value;
                                    editedRow[newHeader] = td.dataset.value;
                                }

                                else {
                                    const header = this.tableHeaders[index - 1];

                                    if (this.fieldTypeMap[header] == 'EMAIL' && !validateEmail(input.value)) {
                                        input.style.border = '2px solid red';
                                        this.errorToastMessage = true;
                                        this.errorMsg = 'Please enter a proper email address.';
                                        this.hasError = true;
                                        return;
                                    }
                                    if (!header.includes('.')) {
                                        editedRow['Id'] = hiddenCol.value;
                                        editedRow[header] = input.value;
                                    }
                                    else {
                                        let obj = this.processedDataForJson(header, hiddenCol.value, input.value);
                                        relatedEditedRow = { ...relatedEditedRow, ...obj };
                                    }
                                }
                            }
                            else {
                                const header = this.tableHeaders[index - 1];
                                if (this.fieldTypeMap[header] == 'EMAIL' && !validateEmail(input.value)) {
                                    this.errorToastMessage = true;
                                    this.errorMsg = 'Please enter a proper email address';
                                    this.hasError = true;
                                    return;
                                }
                                editedRow[header] = input.value;
                            }
                        }
                    });

                    if (editedRow && Object.keys(editedRow).length > 0) {
                        jsonData.push(editedRow);
                    }
                    if (relatedEditedRow && Object.keys(relatedEditedRow).length > 0) {
                        // Handle data with same related ObjectId and edited field
                        filArray = jsonData.filter(item => item.Id !== relatedEditedRow.Id);
                        const existItem = jsonData.find(item => item.Id == relatedEditedRow.Id);

                        if (existItem) {
                            const merge = { ...existItem, ...relatedEditedRow };
                            filArray.push(merge);
                        } else {
                            filArray.push(relatedEditedRow);
                        }

                        jsonData = filArray;
                    }
                }
            });
            if (this.hasError) {
                return;
            }

            // Saving the data to database
            const result = await updateSObject({ jsonData: JSON.stringify(jsonData) })

            if (result.startsWith('Record')) {
                const trs = this.template.querySelectorAll('tr');

                for (const tr of trs) {
                    const tds = tr.querySelectorAll('td');

                    for (const td of tds) {
                        if (td && td.dataset.edited == 'true') {
                            const trins = td.closest('tr');
                            const tds = trins.querySelectorAll('td');
                            tds.forEach((td) => {
                                const input = td.querySelector('input[type="hidden"]');
                                if (input) {
                                    if (!this.hidColId.includes(input.value)) {
                                        this.hidColId.push(input.value);
                                    }
                                }
                            })

                            if (td.dataset.header && td.dataset.header.includes('.')) {
                                let idToFind = td.dataset.header.split('.')[0];
                                if (!idToFind.endsWith('__r')) {
                                    idToFind = idToFind + 'Id';
                                }
                                else {
                                    idToFind = idToFind.replace('__r', '__c');
                                }

                                this.globalData.filter((row) => {
                                    return row[idToFind] == td.dataset.id;
                                }).map((row) => {
                                    if (!this.hidColId.includes(row.Id)) {
                                        this.hidColId.push(row.Id);
                                    }
                                })
                            }
                        }
                    }
                }
                // Updating the records in table after saving records in database
                for (const tr of trs) {
                    const tds = tr.querySelectorAll('td');
                    for (const td of tds) {
                        if (td && td.dataset.edited == 'true') {
                            const referenceFieldData2 = this.getReferenceFieldData2(jsonData);

                            const updatedRecords2 = await getRelatedRecords({ referenceData: referenceFieldData2 });


                            updatedRecords2.forEach((editedEntry) => {
                                let idToUpdate = editedEntry.Id;
                                this.globalData = this.globalData.map((entry) => {

                                    if (entry.Id == idToUpdate) {


                                        Object.keys(entry).forEach((key) => {
                                            if (typeof entry[key] === 'object' && entry[key] !== null) {
                                                if (!(key in editedEntry) && key !== 'attributes') {
                                                    // If the object itself is missing, set it to null

                                                    editedEntry[key] = { ...entry[key] }; // Copy the object structure
                                                    Object.keys(entry[key]).forEach((subKey) => {
                                                        if ((subKey in editedEntry[key]) && subKey !== 'attributes') {
                                                            editedEntry[key][subKey] = ''; // Set missing sub-properties to ''
                                                        }
                                                    })
                                                } else if (typeof editedEntry[key] === 'object') {
                                                    // If the object exists in editedEntry, check sub-properties
                                                    Object.keys(entry[key]).forEach((subKey) => {
                                                        if (!(subKey in editedEntry[key]) && subKey !== 'attributes') {
                                                            editedEntry[key][subKey] = ''; // Set missing sub-properties to ''
                                                        }
                                                    });
                                                }

                                            }
                                            else {

                                                if (!(key in editedEntry) && key !== 'attributes') {
                                                    editedEntry[key] = '';

                                                }


                                            }

                                        });
                                        const updatedEntry = { ...entry, ...editedEntry };

                                        return updatedEntry;
                                    }
                                    return entry;
                                })
                            })
                        }
                    }
                }

                this.successToastMessage = true;
                this.successMsg = result;
                this.successToastMessage = true;
                this.successMsg = result;
                jsonData.forEach((editedEntry) => {
                    const idToUpdate = editedEntry.Id;
                    this.globalData = this.globalData.map((entry) => {
                        if (entry.Id === idToUpdate) {

                            const updatedEntry = { ...entry, ...editedEntry };

                            for (let key in updatedEntry) {

                                if (updatedEntry[key] === '--None--') {
                                    updatedEntry[key] = '';
                                }
                            }


                            return updatedEntry;
                        }
                        return entry;
                    });
                });
            }
            else {
                this.errorToastMessage = true;
                this.errorMsg = result;
            }
            this.editedIds = [];
            this.showSubmit = false;
            this.populateTableBody();
            const inputElement = this.template.querySelector('[data-id="searchInput"]');
            inputElement.value = '';
            this.tableDataPn = this.globalData;
            this.showInput = false;
            const allArrowIcons = this.template.querySelectorAll('lightning-icon');
            allArrowIcons.forEach(icon => {
                icon.classList.remove('arrowIconShow');
            });
        }
    }

    // Handle Update of the rows after saving the record.
    getReferenceFieldData2(jsonData) {
        const referenceFields = [];
        this.hidColId.forEach(row => {
            referenceFields.push({ query: this.soql, id: row, fields: this.tableHeaders.toString() });
        })
        return referenceFields;

    }

    //Handle Cancel Button 
    handleCancel() {
        if (this.editedIds.length > 0) {
            this.populateTableBody();
            this.editedIds = [];
        }
        this.showSubmit = false;
    }

    // Handle Closing of succes toast message
    handleClose() {
        this.successToastMessage = false;
    }

    // Handle Closing of succes toast message
    handleErrorClose() {
        this.errorToastMessage = false;
    }

    // Handle csv data
    handleCsvData() {
        handleCsvData.bind(this)(this.selectedRows, this.globalData, this.tableHeaderLabel, this.tableHeaders);
    }

    // Handle xls data
    handleExcelData() {
        handleExcelData.bind(this)(this.selectedRows, this.globalData, this.tableHeaderLabel, this.tableHeaders);
    }

    // Handle Json Data of Related Objects 
    processedDataForJson(head, hidColVal, tdVal) {
        let relatedEditedRow = {};
        let dotHeader = head.split('.');
        if (dotHeader[1] !== 'Name') {
            this.globalData.find((entry) => {
                if (entry.Id == hidColVal) {

                    if (!dotHeader[0].endsWith('__r')) {
                        let newHeader = dotHeader[0] + '.Name';
                        this.template.querySelectorAll('tr').forEach(tr1 => {
                            const firstTd = tr1.querySelector('td:first-child');

                            if (firstTd) {
                                const hiddenCol = firstTd.querySelector('input[type="hidden"]');

                                if (hiddenCol.value == hidColVal) {
                                    const tr = hiddenCol.closest('tr');
                                    const tds = tr.querySelectorAll('td');
                                    tds.forEach(td => {
                                        if (td.dataset.header == newHeader) {
                                            relatedEditedRow['Id'] = td.dataset.id;
                                        }
                                    })
                                }
                            }
                        })
                        relatedEditedRow[dotHeader[1]] = tdVal;
                    }
                    else {
                        let newHeader = dotHeader[0].replace('__r', '__r.Name');
                        this.template.querySelectorAll('tr').forEach(tr1 => {
                            const firstTd = tr1.querySelector('td:first-child');

                            if (firstTd) {
                                const hiddenCol = firstTd.querySelector('input[type="hidden"]');
                                if (hiddenCol.value == hidColVal) {
                                    const tr = hiddenCol.closest('tr');
                                    const tds = tr.querySelectorAll('td');
                                    tds.forEach(td => {
                                        if (td.dataset.header == newHeader) {
                                            relatedEditedRow['Id'] = td.dataset.id;
                                        }
                                    })
                                }
                            }
                        })
                        relatedEditedRow[dotHeader[1]] = tdVal;
                    }
                }
            })
            return relatedEditedRow;
        }
    }

    // Validation Toast Message for Required Fields
    requiredToastMessage(header, hiddenColVal, td) {
        let dotHeader = header;
        let newHeader;
        if (dotHeader[1] !== 'Name') {
            if (!dotHeader[0].endsWith('__r')) {
                newHeader = dotHeader[0] + 'Id';
            }
            else {
                newHeader = dotHeader[0].replace('__r', '__c');
            }

            this.globalData.find((entry) => {

                if (entry.Id == hiddenColVal && entry[newHeader] !== undefined && entry[newHeader] !== '') {
                    td.style.border = '2px solid red';
                    this.errorToastMessage = true;
                    this.errorMsg = 'Please enter a value in required field.';
                    this.hasError = true;
                }
            })
        }
    }
}