declare module "@salesforce/apex/DynamicDataTableHandler.getFieldName" {
  export default function getFieldName(param: {query: any, fieldName: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.getrelatedFieldName" {
  export default function getrelatedFieldName(param: {objectName: any, fieldName: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.getUpdateStatus" {
  export default function getUpdateStatus(param: {query: any, fieldName: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.getDataFromQuery" {
  export default function getDataFromQuery(param: {query: any, limitSize: any, offset: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.getObjectLabelName" {
  export default function getObjectLabelName(param: {query: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.iconNamesForObjects" {
  export default function iconNamesForObjects(param: {query: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.updateSObject" {
  export default function updateSObject(param: {jsonData: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.getUpdateStatusNew" {
  export default function getUpdateStatusNew(param: {query: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.getMapofTypeForFields" {
  export default function getMapofTypeForFields(param: {query: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.getPicklistValue" {
  export default function getPicklistValue(param: {query: any, field: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.getMapofRequiredField" {
  export default function getMapofRequiredField(param: {query: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.getNamesOfObject" {
  export default function getNamesOfObject(param: {sObjectName: any, field: any, searchKey: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.getRelatedRecords" {
  export default function getRelatedRecords(param: {referenceData: any}): Promise<any>;
}
declare module "@salesforce/apex/DynamicDataTableHandler.getRelatedPicklistValue" {
  export default function getRelatedPicklistValue(param: {objectName: any, field: any}): Promise<any>;
}
