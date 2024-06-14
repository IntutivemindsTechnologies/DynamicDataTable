declare module "@salesforce/apex/DynamicDataTableHandler.getObjectName" {
  export default function getObjectName(param: {recordId: any}): Promise<any>;
}
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
