public with sharing class DynamicDataTableHandler {
    
    @TestVisible 
    private static Boolean getObjectApiNameByLabel(String objectApiNames) {
        Map<String, Schema.SObjectType> globalDescribeMap = Schema.getGlobalDescribe();
        if(globalDescribeMap.containsKey(objectApiNames)){
            return true;
        }
        else{
            objectApiNames  =objectApiNames.subString(0,objectApiNames.length()-3);
            if(globalDescribeMap.containsKey(objectApiNames)){
                return true;
            }
        }
        return false;
    }
    
    
    private static String getObjectNameFromQuery(String query){
        String objectName = '';
        Matcher objectMatcher = Pattern.compile(DynamicDataTableConstant.objectNameRegex).matcher(query);
        if (objectMatcher.find()) {
            objectName = objectMatcher.group(1);
        }
        return objectName;
    }
    
    
    private static Set<String> getFieldListFromQuery(String query){
        Set<String> queriedFields = new Set<String>();
        Matcher matcher = Pattern.compile(DynamicDataTableConstant.fieldsListRegex).matcher(query);
        if (matcher.find()) {
            String[] fields = matcher.group(1).split('\\s*,\\s*');
            for (String field : fields) {  
                queriedFields.add(field.toLowerCase());
            }  
        }
        return queriedFields;
    }
    
    
    private static Map<String, Schema.SObjectField> schemaGlobalFieldsMap(String objectName){
        Schema.SObjectType sObjectType = Schema.getGlobalDescribe().get(objectName);
        if (sObjectType != null) {
            return sObjectType.getDescribe().fields.getMap();
        } else {
            return new Map<String, Schema.SObjectField>();
        }
        
    }
    
    private static SObjectType schemaGlobalObject(String objectname){
        return  Schema.getGlobalDescribe().get(objectname);
    }
    
    
    
    private static Schema.DescribeFieldResult getFieldDescribe(SObjectType objToken, String fieldName) {
        Map<String, Schema.SObjectField> fieldMap = objToken.getDescribe().fields.getMap();
        if (fieldMap.containsKey(fieldName)) {
            return fieldMap.get(fieldName).getDescribe();
        } else {
            return null;
        }
    }    
    
    
    
    @AuraEnabled(cacheable=true)
    public static String getFieldName(String query,String fieldName){
        String fieldLabel;
        String objectName = getObjectNameFromQuery(query);
        Map<String, Schema.SObjectField> fieldMap = schemaGlobalFieldsMap(objectName);
        
        if(fieldMap.containsKey(fieldName)){
            Schema.DescribeFieldResult fieldResult = fieldMap.get(fieldName).getDescribe();
            fieldLabel = fieldResult.getLabel(); 
            Schema.DisplayType fieldType = fieldMap.get(fieldName).getDescribe().getType();
            if(fieldType == Schema.DisplayType.REFERENCE){
                boolean objectApiName = getObjectApiNameByLabel(fieldName);
                if(objectApiName){
                    fieldLabel=fieldLabel+ DynamicDataTableConstant.spaceString + DynamicDataTableConstant.fieldLabelIdSuffix;
                }
            }
            SObjectType objToken = schemaGlobalObject(objectname);
            if(fieldName==DynamicDataTableConstant.standardFieldName && !fieldLabel.contains(objectname)){
                fieldLabel=objToken+' '+fieldLabel;
            }   
        }
        System.debug('field label ::'+ fieldLabel);
        return fieldLabel;    
    } 
    
    
    @AuraEnabled(cacheable=true)
    public static String getrelatedFieldName(String objectName,String fieldName){
        String fieldLabel;
        If(DynamicDataTableConstant.standardAuditFields.contains(objectName)){  
            String name=objectName+' '+ DynamicDataTableConstant.standardFieldName;
            return name;   
        }
        if(objectName.endsWith(DynamicDataTableConstant.underscoreRSuffix)){
            objectName=objectName.substring(0,objectName.length()-3);
            Schema.SObjectType sObjectType = schemaGlobalObject(objectName);
            if (sObjectType == null) {
                objectName=objectName+DynamicDataTableConstant.underscoreCSuffix;
            }
        }
        Map<String, Schema.SObjectField> fieldMap = schemaGlobalFieldsMap(objectName);
        if(fieldMap.containsKey(fieldName)){
            Schema.DescribeFieldResult fieldResult = fieldMap.get(fieldName).getDescribe();
            fieldLabel = fieldResult.getLabel();
            Schema.DescribeSObjectResult describeResult = schemaGlobalObject(objectName).getDescribe(); 
            Boolean isCustom = describeResult.isCustom();
            if (!isCustom) {
                if(!fieldLabel.contains(objectName)){
                    fieldLabel=objectName+' '+fieldLabel;
                }
            }     
        }
        return fieldLabel; 
    } 
    
    
    @AuraEnabled(cacheable=true)
    public static Boolean getUpdateStatus(String query,String fieldName){ 
        String objectName = getObjectNameFromQuery(query);
        SObjectType objToken=schemaGlobalObject(objectName);
        Schema.DescribeFieldResult fieldResult=getFieldDescribe(objToken,fieldName);
        return fieldResult.isUpdateable(); 
    }
    
    
    
    private static  Set<String> getRefrenceFieldForQueriedFields(Set<String> queriedFields,  String objectName){
        SObjectType objectType = schemaGlobalObject(objectName); 
        
        for (String field : queriedFields) {
            if(!field.contains(DynamicDataTableConstant.dotOperator)){
                Schema.DescribeFieldResult fieldDescribe=getFieldDescribe(objectType,field);
                if (fieldDescribe.getType() == Schema.DisplayType.REFERENCE && fieldDescribe.isCustom()) {
                    queriedFields.remove(field);
                    if(getReferenceField(objectName, field) != null ){
                        field=field.substring(0,field.length()-3)+DynamicDataTableConstant.underscoreRSuffix+ DynamicDataTableConstant.dotOperator + DynamicDataTableConstant.standardFieldName.toLowerCase();
                    }
                    queriedFields.add(field);   
                }
                else if(fieldDescribe.getType() == Schema.DisplayType.REFERENCE && !fieldDescribe.isCustom()){
                    if(field.endsWith(DynamicDataTableConstant.fieldLabelIdSuffix.toLowerCase())){
                        queriedFields.remove(field);
                        if(getReferenceField(objectName, field) != null ){
                            field = field.substring(0, field.length() - 2)+ DynamicDataTableConstant.dotOperator + DynamicDataTableConstant.standardFieldName.toLowerCase();
                        }
                        queriedFields.add(field);
                    }
                }
            }
        }
        return queriedFields;
    }
    
    
    @AuraEnabled
    public static String getDataFromQuery(String query,Integer limitSize,Integer offset){
        Set<String> queriedFields = getFieldListFromQuery(query);
        String objectName = getObjectNameFromQuery(query);
        queriedFields=getRefrenceFieldForQueriedFields(queriedFields,objectName);
        String[] fieldsArray = new List<String>(queriedFields);
        String newQuery = 'SELECT ' + String.join(fieldsArray, ', ') + ' ';
        String modquery = query.replaceFirst(DynamicDataTableConstant.fieldsListRegex, newQuery + ' FROM');
        modquery=modquery+' LIMIT '+limitSize+' OFFSET '+offset;
        
        List<sObject> queriedRecords = Database.query(modquery);
        for (sObject record : queriedRecords) {
            Map<String, Object> populatedFieldsMap = new Map<String, Object>();
            for (String key : record.getPopulatedFieldsAsMap().keySet()) {
                if(record.getPopulatedFieldsAsMap().get(key) instanceof sObject){
                    SObject relatedObject = (SObject)record.getSObject(key);
                    Map<String,Object> relatedFieldMap =relatedObject.getPopulatedFieldsAsMap();
                    for(String relatedKey: relatedFieldMap.keySet()){
                        populatedFieldsMap.put(key.toLowerCase()+ DynamicDataTableConstant.dotOperator +relatedKey.toLowerCase(),relatedFieldMap.get(relatedKey));
                    }   
                }
                else{
                    populatedFieldsMap.put(key.toLowerCase(), record.get(key));
                }  
            }
            for(String field :queriedFields){
                if (!populatedFieldsMap.containsKey(field) ) {
                    if(!field.contains(DynamicDataTableConstant.dotOperator) && getUpdateStatus(query,field)){
                        record.put(field, null);
                    }
                }   
            }  
        }
        return JSON.serialize(queriedRecords); 
    }
    
    
    @AuraEnabled(cacheable=true)
    public static String getObjectLabelName(String query){
        String objectName = getObjectNameFromQuery(query);
        Schema.DescribeSObjectResult describeResult = schemaGlobalObject(objectName).getDescribe();
        String objectLabel = describeResult.getLabelPlural();
        
        return objectLabel;
    }
    
    
    @AuraEnabled(cacheable=true)
    public static String iconNamesForObjects(String query){
        String iconName;
        String objectName = getObjectNameFromQuery(query);
        SObjectType objToken = schemaGlobalObject(objectname);
        
        if(objToken  != null && objToken.getDescribe().isCustom()) {
            iconName=DynamicDataTableConstant.customIconName;
        } else {
            iconName=DynamicDataTableConstant.standardIconName;
        }
        String obj=objToken.toString();
        TabDefinition tabDefinitionRecord = [SELECT (SELECT Url FROM Icons WHERE ContentType LIKE 'image/svg%') FROM TabDefinition WHERE SobjectName =: obj];
        if (tabDefinitionRecord.Icons != null ) {
            String iconUrl = tabDefinitionRecord.Icons[0].Url; 
            List<String> urlParts = iconUrl.split(DynamicDataTableConstant.forSlashString);
            String lastPart = urlParts[urlParts.size() - 1];
            lastPart = lastPart.replace(DynamicDataTableConstant.svgString, '');
            iconName=iconName+lastPart;    
        }
        return iconName;   
    }
    
    
    @TestVisible 
    public static String getReferenceField(String sObjectName, String fieldAPIName){
        String referenceFieldToAppend = null;
        SObjectType objToken=schemaGlobalObject(sObjectName);
        Schema.DescribeFieldResult f=getFieldDescribe(objToken,fieldAPIName);        
        
        String referencedObjectName = f.getReferenceTo()
            .get(0)
            .getDescribe()
            .getName();
        
        Map<String, Schema.SObjectField> fieldMap = schemaGlobalFieldsMap(referencedObjectName);
        if(fieldMap.containsKey(DynamicDataTableConstant.standardFieldName)){
            referenceFieldToAppend = DynamicDataTableConstant.standardFieldName.toLowerCase();
        }
        else{ 
            referenceFieldToAppend = null;   
        }
        return referenceFieldToAppend;
    }
    
    
    @AuraEnabled
    public static String updateSObject(String jsonData) {
        try {
            List<SObject> recordsToUpdate = new List<SObject>();
            List<Object> requestDataList = (List<Object>) JSON.deserializeUntyped(jsonData);
            for (Object item : requestDataList) {
                Map<String, Object> requestData = (Map<String, Object>) item;
                Id recordId = (Id) requestData.get('Id');
                String sObjectApiName = recordId.getSObjectType().getDescribe().getName();
                SObject sObj = schemaGlobalObject(sObjectApiName).newSObject(recordId);
                for(String fieldName: requestData.keySet()){
                    Object fieldValue = requestData.get(fieldName);
                    
                    if (fieldValue ==DynamicDataTableConstant.NoneString) {
                        fieldValue = ''; 
                    }
                    Schema.DescribeFieldResult fieldResult = sObj.getSObjectType().getDescribe().fields.getMap().get(fieldName).getDescribe();
                    
                    if (fieldResult.isUpdateable()) {
                        
                        if (fieldResult.getType() == Schema.DisplayType.Date && fieldValue != null) {
                            sObj.put(fieldName, Date.valueOf((String) fieldValue));
                        } else if (fieldResult.getType() == Schema.DisplayType.DateTime && fieldValue != null ) {
                            String dateTimeString = (String) fieldValue;
                            if ( !dateTimeString.contains(DynamicDataTableConstant.spaceString)) {
                                dateTimeString = dateTimeString.replace('T', ' ') + DynamicDataTableConstant.secondString;
                            }
                            sObj.put(fieldName, DateTime.valueOf(dateTimeString));
                        } else if (fieldResult.getType() == Schema.DisplayType.Boolean && fieldValue != null) {
                            sObj.put(fieldName, Boolean.valueOf((String) fieldValue));
                        }
                        else if (fieldResult.getType() == Schema.DisplayType.DOUBLE ) {
                            System.debug('field value ::'+ fieldValue);
                            if (fieldValue == null || String.isBlank((String) fieldValue)) {
                                sObj.put(fieldName, null);  
                            } else {
                                sObj.put(fieldName, DOUBLE.valueOf((String) fieldValue));
                            }
                        }
                        else if (fieldResult.getType() == Schema.DisplayType.CURRENCY ) {
                            if (fieldValue == null || String.isBlank((String) fieldValue)) {
                                sObj.put(fieldName, null);  
                            } else {
                                sObj.put(fieldName, DOUBLE.valueOf((String) fieldValue));
                            }
                        }
                        else if (fieldResult.getType() == Schema.DisplayType.PERCENT ) {
                            if (fieldValue == null || String.isBlank((String) fieldValue)) {
                                sObj.put(fieldName, null);  
                            } else {
                                sObj.put(fieldName, DOUBLE.valueOf((String) fieldValue));
                            }
                        }
                        else if (fieldResult.getType() == Schema.DisplayType.INTEGER ) {
                            if (fieldValue == null || String.isBlank((String) fieldValue)) {
                                sObj.put(fieldName, null);  
                            } else {
                                sObj.put(fieldName, Integer.valueOf((String) fieldValue));
                            }
                        }
                        else {
                            sObj.put(fieldName, fieldValue);
                        }
                    }
                }
                recordsToUpdate.add(sObj);
            }
            if(!recordsToUpdate.isEmpty()){
                Database.update(recordsToUpdate);
                return DynamicDataTableConstant.recordSaveString;
            }
            else{
                return DynamicDataTableConstant.failedString;
            }
        }
        catch (DmlException dmlEx) {
            String message=dmlEx.getMessage();
            return DynamicDataTableConstant.failedDMLString + message.substring(message.indexOf(DynamicDataTableConstant.openSquareString)+1,message.indexOf(DynamicDataTableConstant.closeSquareString)) ;
        }
        catch(Exception e){
            return DynamicDataTableConstant.failedString + DynamicDataTableConstant.spaceString + e.getMessage();
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static  Map<String,Boolean> getUpdateStatusNew(String query){ 
        
        String   modquery=getModifiedQuery(query);
        String objectName = getObjectNameFromQuery(query);
        
        Map<String,Boolean> fieldMap=new Map<String,Boolean>();
        SObjectType objToken = schemaGlobalObject(objectName);      
        Set<String> fields=getFieldListFromQuery(query);
        Set<String> fieldsOfModQuery=getFieldListFromQuery(modquery);
        
        fields.addAll(fieldsOfModQuery);       
        for (String field : fields) {              
            if(field.contains('.')){
                List<String> fieldParts = field.split('\\.');
                String firstPart=fieldParts[0];
                Map<String,Object> resultMap =getReferenceFieldDescribe(field,objToken);
                Schema.DescribeFieldResult relatedFieldDescribe = (Schema.DescribeFieldResult)resultMap.get('relatedFieldDescribe');
                String referencedObjectName1 = (String)resultMap.get('referencedObjectName1');
                
                if(relatedFieldDescribe != null){                     
                    referencedObjectName1= getReferenceObjectName(firstPart,referencedObjectName1);                       
                    String name = referencedObjectName1+'.'+relatedFieldDescribe.getName();    
                    Boolean type = Boolean.valueOf(relatedFieldDescribe.isUpdateable());    
                    fieldMap.put(name,type);
                }   
            }
            Schema.DescribeFieldResult fieldResult = getFieldDescribe(objToken,field);          
            if(fieldResult != null){
                String name = fieldResult.getName();
                Boolean type = Boolean.valueOf(fieldResult.isUpdateable());             
                fieldMap.put(name,type);
            }   
        }                 
        return fieldMap;
        
    }
    
    
    public static String getModifiedQuery(String query){
        Set<String> queriedFields = getFieldListFromQuery(query);
        String objectName = getObjectNameFromQuery(query);
        queriedFields=getRefrenceFieldForQueriedFields(queriedFields,objectName);
        String[] fieldsArray = new List<String>(queriedFields);
        String newQuery = 'SELECT ' + String.join(fieldsArray, ', ') + ' ';
        String   modquery = query.replaceFirst(DynamicDataTableConstant.fieldsListRegex, newQuery + ' FROM');
        return modquery;
    }
    
    
    
    public static String getReferenceObjectName(String firstPart,String referencedObjectName1){
        if(firstPart.contains(DynamicDataTableConstant.underscoreRSuffix)){
            if(referencedObjectName1.contains(DynamicDataTableConstant.underscoreCSuffix)){
                referencedObjectName1=referencedObjectName1.replace(DynamicDataTableConstant.underscoreCSuffix,DynamicDataTableConstant.underscoreRSuffix);   
            }
            else{
                referencedObjectName1=referencedObjectName1 + DynamicDataTableConstant.underscoreRSuffix;  
            }
        }    
        return referencedObjectName1;
    }
    
    
    
    public static Map<String,Object> getReferenceFieldDescribe(String field,SObjectType objToken){
        
        List<String> fieldParts = field.split('\\.');
        String firstPart=fieldParts[0];
        if(fieldParts[0].contains(DynamicDataTableConstant.underscoreRSuffix)){
            fieldParts[0] = fieldParts[0].replace(DynamicDataTableConstant.underscoreRSuffix,DynamicDataTableConstant.underscoreCSuffix); 
        }
        else{
            fieldParts[0]= fieldParts[0] + DynamicDataTableConstant.idString;
        }           
        Schema.DescribeFieldResult parentFieldResult = getFieldDescribe(objToken,fieldParts[0]);
        
        Schema.SObjectType referencedObjectName = parentFieldResult.getReferenceTo()[0];
        String referencedObjectName1=referencedObjectName.getDescribe().getName();             
        Schema.DescribeFieldResult relatedFieldDescribe = getFieldDescribe(referencedObjectName,fieldParts[1]);
        
        Map<String,Object> result = new Map<String,Object>();
        result.put('referencedObjectName1',referencedObjectName1);
        result.put('relatedFieldDescribe',relatedFieldDescribe);
        return result;
    }
    
    
    
    
    @AuraEnabled(cacheable=true)
    public static  Map<String,String> getMapofTypeForFields(String query){
        String   modquery=getModifiedQuery(query);
        String objectName = getObjectNameFromQuery(query);
        
        Map<String,String> fieldMap=new Map<String,String>();
        SObjectType objToken = schemaGlobalObject(objectName);       
        Set<String> fields=getFieldListFromQuery(query);
        Set<String> fieldsOfModQuery=getFieldListFromQuery(modquery);
        fields.addAll(fieldsOfModQuery);
        
        for (String field : fields) {             
            if(field.contains('.')){    
                List<String> fieldParts = field.split('\\.');
                String firstPart=fieldParts[0];
                Map<String,Object> resultMap =getReferenceFieldDescribe(field,objToken);
                Schema.DescribeFieldResult relatedFieldDescribe = (Schema.DescribeFieldResult)resultMap.get('relatedFieldDescribe');
                String referencedObjectName1 = (String)resultMap.get('referencedObjectName1');
                
                if(relatedFieldDescribe != null){  
                    referencedObjectName1= getReferenceObjectName(firstPart,referencedObjectName1);                                             
                    String name = referencedObjectName1+'.'+relatedFieldDescribe.getName();                                 
                    String type = String.valueOf(relatedFieldDescribe.getType());  
                    fieldMap.put(name,type);
                }              
            }
            Schema.DescribeFieldResult fieldResult = getFieldDescribe(objToken,field);          
            if(fieldResult != null){
                String name = fieldResult.getName();
                String type = String.valueOf(fieldResult.getType());              
                fieldMap.put(name,type);
            }   
        }  
        return fieldMap;    
    }
    
    
    
    
    @AuraEnabled(cacheable=true)
    public static List<String> getPicklistValue(String query,String field){
        List<String> picklistValues = new List<String>();
        try{
            String objectName = getObjectNameFromQuery(query);
            SObjectType objToken = schemaGlobalObject(objectname);
            Schema.DescribeFieldResult fieldResult = getFieldDescribe(objToken,field);
            if(fieldResult !=null){
                String type = String.valueOf(fieldResult.getType());
                if(type==DynamicDataTableConstant.picklistString){
                    for (Schema.PicklistEntry entry : fieldResult.getPicklistValues()) {
                        picklistValues.add(entry.getLabel());
                    }
                } 
            }
        }
        catch(Exception e){ 
            throw e;
        }
        return picklistValues;
    }
    
    
    
    
    @AuraEnabled(cacheable=true)
    public static  Map<String,Boolean> getMapofRequiredField(String query){
        
        String   modquery=getModifiedQuery(query);
        String objectName = getObjectNameFromQuery(query);
        
        Map<String,Boolean> fieldMap=new Map<String,Boolean>();
        SObjectType objToken = schemaGlobalObject(objectName);       
        Set<String> fields=getFieldListFromQuery(query);
        Set<String> fieldsOfModQuery=getFieldListFromQuery(modquery);
        fields.addAll(fieldsOfModQuery);
        
        for (String field : fields) {                  
            if(field.contains('.')){  
                List<String> fieldParts = field.split('\\.');
                String firstPart=fieldParts[0];
                Map<String,Object> resultMap =getReferenceFieldDescribe(field,objToken);
                Schema.DescribeFieldResult relatedFieldDescribe = (Schema.DescribeFieldResult)resultMap.get('relatedFieldDescribe');
                String referencedObjectName1 = (String)resultMap.get('referencedObjectName1');
                
                if(relatedFieldDescribe != null){ 
                    referencedObjectName1= getReferenceObjectName(firstPart,referencedObjectName1);                     
                    String name = referencedObjectName1+'.'+relatedFieldDescribe.getName();
                    Boolean type =  !relatedFieldDescribe.isNillable() && relatedFieldDescribe.isCreateable() && !relatedFieldDescribe.isDefaultedOnCreate();                    
                    fieldMap.put(name,type);
                }            
            }
            
            Schema.DescribeFieldResult fieldResult = getFieldDescribe(objToken,field);           
            if(fieldResult != null){
                String name = fieldResult.getName();
                Boolean type = !fieldResult.isNillable() && fieldResult.isCreateable() && !fieldResult.isDefaultedOnCreate();             
                fieldMap.put(name,type);
            }   
        }  
        return fieldMap;       
    }
    
    
    
    
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getNamesOfObject(String sObjectName,String field,String searchKey) {
        
        if(sObjectName.endsWith(DynamicDataTableConstant.underscoreRSuffix)){
            sObjectName=sObjectName.substring(0,sObjectName.length()-3);
            Schema.SObjectType sObjectType = schemaGlobalObject(sObjectName);
            
            if (sObjectType == null) {
                sObjectName=sObjectName+DynamicDataTableConstant.underscoreCSuffix;
                
            }
        }         
        List<Map<String, String>> objectNames = new List<Map<String, String>>();
        
        String query='Select id,'+field+' from '+sObjectName+' where '+field+' Like \''+ searchKey + '%\'';
        List<SObject> results= Database.query(query);     
        for(SObject record:results){
            Map<String,String> val=new Map<String,String>();
            val.put('id',(String)record.get(DynamicDataTableConstant.fieldLabelIdSuffix.toLowerCase()));
            val.put('label',(String)record.get(field));
            objectNames.add(val);
        }
        return objectNames;
    }
    
    
    
    
    @AuraEnabled
    public static List<SObject> getRelatedRecords(List<Map<String, String>> referenceData) {
        
        List<SObject> relRecords = new List<SObject>();
        for(Map<String,String> data: referenceData){
            String queryy= data.get(DynamicDataTableConstant.queryString);
            String recordId = data.get(DynamicDataTableConstant.fieldLabelIdSuffix.toLowerCase());
            String fields= data.get(DynamicDataTableConstant.fieldString);    
            String objName=getObjectNameFromQuery(queryy);                    
            String escapedRecordId = String.escapeSingleQuotes(recordId);
            String query = 'SELECT ' + fields + ' FROM ' + objName + ' WHERE Id = \'' + escapedRecordId + '\' LIMIT 1';         
            List<SObject> queryResult = Database.query(query);          
            if (!queryResult.isEmpty()) {
                relRecords.add(queryResult[0]);
            }          
        }            
        return relRecords;    
    }
    
    
    
    @AuraEnabled(cacheable=true)
    public static List<String> getRelatedPicklistValue(String objectName,String field){
        
        if(objectName.endsWith(DynamicDataTableConstant.underscoreRSuffix)){
            objectName=objectName.substring(0,objectName.length()-3);
            Schema.SObjectType sObjectType = schemaGlobalObject(objectName);
            if (sObjectType == null) {
                objectName=objectName+DynamicDataTableConstant.underscoreCSuffix;
            }
        } 
        
        List<String> picklistValues = new List<String>();
       
        try{
            SObjectType objToken = schemaGlobalObject(objectname);
            Schema.DescribeFieldResult fieldResult = getFieldDescribe(objToken,field);
            if(fieldResult !=null){
                String type = String.valueOf(fieldResult.getType());
                if(type==DynamicDataTableConstant.picklistString){
                    for (Schema.PicklistEntry entry : fieldResult.getPicklistValues()) {
                        picklistValues.add(entry.getLabel());
                    }
                } 
            }
        }
        catch(Exception e){ 
            throw e;
        }
        return picklistValues;
    }

     @AuraEnabled
    public static Map<String,String> getQueryValues(){
        Map<String,String> values = new Map<String,String>();
        List<SObject> queryList = [Select Id,Name,Query__c, Active__c from Query__c where Active__c=true];
        
        if (queryList.isEmpty()) {
    
    return values; 
}
        
        for(SObject queryData:queryList){
           values.put((String)queryData.get('Name'),(String)queryData.get('Query__c'));
        }
        
       
        return values;
    }
    
    
    @AuraEnabled
public static String getQueryByName(String name) {
    if (String.isBlank(name)) {
        return null;
    }

     List<Query__c> queryRecord = [
        SELECT Query__c 
        FROM Query__c 
        WHERE Name = :name AND Active__c = true 
        LIMIT 1
    ];
     if (queryRecord.isEmpty()) {
        return null;
    } 
    
System.debug('query is ::'+queryRecord[0].Query__c);
    return queryRecord[0].Query__c;
}

    
 
     @AuraEnabled(cacheable = true)
    public static Boolean hasPermissionSet(String permissionSetName) {
        Id currentUserId = UserInfo.getUserId();

        List<PermissionSetAssignment> psa = [SELECT Id FROM PermissionSetAssignment WHERE AssigneeId = :currentUserId AND PermissionSet.Name = :permissionSetName LIMIT 1];
        return !psa.isEmpty();
    }
    
}