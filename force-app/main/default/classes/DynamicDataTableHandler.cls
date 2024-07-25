public with sharing class DynamicDataTableHandler {
    
    
    @AuraEnabled(cacheable=true)
    public static String getObjectName(Id recordId) {
        String nameById;
        String sObjName = recordId.getSObjectType().getDescribe().getName(); 
        String query = 'SELECT Name FROM ' + sObjName + ' WHERE Id = :recordId';  
        List<SObject> records = Database.query(query);
        if (!records.isEmpty()) {
            SObject objRecord = records[0];
            nameById = (String)objRecord.get('Name');    
        } 
        return nameById;
    }
    
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
    
    @AuraEnabled(cacheable=true)
    public static String getFieldName(String query,String fieldName){
        String fieldLabel;
        String objectName = '';
        Matcher objectMatcher = Pattern.compile('(?i)FROM\\s+(\\w+)').matcher(query);
        if (objectMatcher.find()) {
            objectName = objectMatcher.group(1);
        }
        Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();
        if(fieldMap.containsKey(fieldName)){
            Schema.DescribeFieldResult fieldResult = fieldMap.get(fieldName).getDescribe();
            fieldLabel = fieldResult.getLabel(); 
            Schema.DisplayType fieldType = fieldMap.get(fieldName).getDescribe().getType();
            if(fieldType == Schema.DisplayType.REFERENCE){
                boolean objectApiName = getObjectApiNameByLabel(fieldName);
                if(objectApiName){
                    fieldLabel=fieldLabel+' ID';
                }
            }
            SObjectType objToken = Schema.getGlobalDescribe().get(objectname);
            if(fieldName=='Name' && !fieldLabel.contains(objectname)){
                fieldLabel=objToken+' '+fieldLabel;
            }   
        }
        return fieldLabel;    
    } 
    
    
    @AuraEnabled(cacheable=true)
    public static String getrelatedFieldName(String objectName,String fieldName){
        String fieldLabel;
        If(objectName=='Owner' || objectName=='CreatedBy' || objectName=='ModifiedBy'){  
            String name=objectName+' Name';
            return name;   
        }
        if(objectName.endsWith('__r')){
            objectName=objectName.substring(0,objectName.length()-3);
            Schema.SObjectType sObjectType = Schema.getGlobalDescribe().get(objectName);
            if (sObjectType == null) {
                objectName=objectName+'__c';
            }
        }
        Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();
        if(fieldMap.containsKey(fieldName)){
            Schema.DescribeFieldResult fieldResult = fieldMap.get(fieldName).getDescribe();
            fieldLabel = fieldResult.getLabel();
            Schema.DescribeSObjectResult describeResult = Schema.getGlobalDescribe().get(objectName).getDescribe(); 
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
        String objectName;
        Matcher objectMatcher = Pattern.compile('(?i)FROM\\s+(\\w+)').matcher(query);
        if (objectMatcher.find()) {
            objectName = objectMatcher.group(1);
        }
        Schema.DescribeSObjectResult objectDescribe = Schema.getGlobalDescribe().get(objectName).getDescribe();
        Schema.DescribeFieldResult fieldResult = objectDescribe.fields.getMap().get(fieldName).getDescribe();
        System.debug('field :'+fieldResult.isUpdateable());
        return fieldResult.isUpdateable(); 
    }
    
    @AuraEnabled(cacheable=true)
    public static String getDataFromQuery(String query,Integer limitSize,Integer offset){
        Set<String> queriedFields = new Set<String>();
        Matcher matcher = Pattern.compile('(?i)SELECT\\s+(.*?)\\s+FROM').matcher(query);
        if (matcher.find()) {
            String[] fields = matcher.group(1).split('\\s*,\\s*');
            for (String field : fields) {  
                queriedFields.add(field.toLowerCase());
            }  
        }
        String objectName;
        Matcher objectMatcher = Pattern.compile('(?i)FROM\\s+(\\w+)').matcher(query);
        if (objectMatcher.find()) {
            objectName = objectMatcher.group(1);
        }
        for (String field : queriedFields) {
            SObjectType objectType = Schema.getGlobalDescribe().get(objectName); 
            if (objectType != null) {
                Map<String, Schema.SObjectField> fieldMap = objectType.getDescribe().fields.getMap();
                if (fieldMap.containsKey(field)) {
                    Schema.DescribeFieldResult fieldDescribe = fieldMap.get(field).getDescribe();
                    if (fieldDescribe.getType() == Schema.DisplayType.REFERENCE) {
                        if (fieldDescribe.isCustom()) {
                            if(field.endsWith('__c')){
                                queriedFields.remove(field);
                                if(getReferenceField(objectName, field) != null ){
                                    field=field.substring(0,field.length()-3)+'__r.name';
                                }
                                queriedFields.add(field);
                            }
                        }
                        else{
                            if(field.endsWith('id')){
                                queriedFields.remove(field);
                                if(getReferenceField(objectName, field) != null ){
                                    field = field.substring(0, field.length() - 2)+'.name';
                                }
                                queriedFields.add(field);
                            }
                        }
                        
                    } else {
                        
                    }
                }
            }
        }
        
        String[] fieldsArray = new List<String>(queriedFields);
        String newQuery = 'SELECT ' + String.join(fieldsArray, ', ') + ' ';
        String modquery = query.replaceFirst('(?i)SELECT\\s+(.*?)\\s+FROM', newQuery + ' FROM');
        modquery=modquery+' LIMIT '+limitSize+' OFFSET '+offset;
        List<sObject> queriedRecords = Database.query(modquery);
        for (sObject record : queriedRecords) {
            Map<String, Object> populatedFieldsMap = new Map<String, Object>();
            for (String key : record.getPopulatedFieldsAsMap().keySet()) {
                if(record.getPopulatedFieldsAsMap().get(key) instanceof sObject){
                    SObject relatedObject = (SObject)record.getSObject(key);
                    Map<String,Object> relatedFieldMap =relatedObject.getPopulatedFieldsAsMap();
                    for(String relatedKey: relatedFieldMap.keySet()){
                        populatedFieldsMap.put(key.toLowerCase()+'.'+relatedKey.toLowerCase(),relatedFieldMap.get(relatedKey));
                    }   
                }
                else{
                    populatedFieldsMap.put(key.toLowerCase(), record.get(key));
                }  
            }
            for(String field :queriedFields){
                if (!populatedFieldsMap.containsKey(field) ) {
                    if(!field.contains('.') && getUpdateStatus(query,field)){
                        record.put(field, null);
                    }
                }   
            }  
        }
        return JSON.serialize(queriedRecords); 
    }
    
    @AuraEnabled(cacheable=true)
    public static String getObjectLabelName(String query){
        String objectName;
        Matcher objectMatcher = Pattern.compile('(?i)FROM\\s+(\\w+)').matcher(query);
        if (objectMatcher.find()) {
            objectName = objectMatcher.group(1);
        }
        Schema.DescribeSObjectResult describeResult = Schema.getGlobalDescribe().get(objectName).getDescribe();
        String objectLabel = describeResult.getLabelPlural();
        return objectLabel;
    }
    
    @AuraEnabled(cacheable=true)
    public static String iconNamesForObjects(String query){
        String iconName;
        String objectName;
        Matcher objectMatcher = Pattern.compile('(?i)FROM\\s+(\\w+)').matcher(query);
        if (objectMatcher.find()) {
            objectName = objectMatcher.group(1);
        }
        SObjectType objToken = Schema.getGlobalDescribe().get(objectname);
        
        if(objToken  != null && objToken.getDescribe().isCustom()) {
            iconName='custom:';
        } else {
            iconName='standard:';
        }
        String iconQuery='SELECT (SELECT Url FROM Icons WHERE ContentType LIKE \'image/svg%\') FROM TabDefinition WHERE SobjectName =\'' + objToken + '\'';
        TabDefinition tabDefinitionRecord = (TabDefinition)Database.query(iconQuery)[0];
        if (tabDefinitionRecord.Icons != null ) {
            String iconUrl = tabDefinitionRecord.Icons[0].Url; 
            List<String> urlParts = iconUrl.split('/');
            String lastPart = urlParts[urlParts.size() - 1];
            lastPart = lastPart.replace('.svg', '');
            iconName=iconName+lastPart;    
        }
        return iconName;   
    }
    
    
    @TestVisible 
    private static String getReferenceField(String sObjectName, String fieldAPIName){
        String referenceFieldToAppend = null;
        Schema.DescribeFieldResult f = Schema.getGlobalDescribe()
            .get(sObjectName)
            .getDescribe()
            .fields
            .getMap()
            .get(fieldAPIName)
            .getDescribe();
        String referencedObjectName = f.getReferenceTo()
            .get(0)
            .getDescribe()
            .getName();
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(referencedObjectName);
        Map<String, Schema.SObjectField> fieldMap = targetType.getDescribe().fields.getMap();
        if(fieldMap.containsKey('Name')){
            referenceFieldToAppend = 'name';
        }
        else{ 
            referenceFieldToAppend = null;   
        }
        return referenceFieldToAppend;
    }
    
    
    
    
     @AuraEnabled
    public static String updateSObject(String jsonData) {
          try {
        System.debug('json Data ::'+jsonData);
        List<SObject> recordsToUpdate = new List<SObject>();
        
        List<Object> requestDataList = (List<Object>) JSON.deserializeUntyped(jsonData);
        for (Object item : requestDataList) {
            Map<String, Object> requestData = (Map<String, Object>) item;
            System.debug('items are :'+requestData);
            Id recordId = (Id) requestData.get('Id');
            
            String sObjectApiName = recordId.getSObjectType().getDescribe().getName();
            System.debug('sObjectApiName  ::'+sObjectApiName);  
            
            SObject sObj = Schema.getGlobalDescribe().get(sObjectApiName).newSObject(recordId);
            System.debug('sObj   object  ::'+sObj); 
            
            for(String fieldName: requestData.keySet()){
                System.debug('sobj list inside :'+sObj);
                System.debug('fieldName :'+fieldName);
                 Object fieldValue = requestData.get(fieldName);
                
                if (fieldValue == '--None--') {
                    fieldValue = ''; 
                }
                
                
                Schema.DescribeFieldResult fieldResult = sObj.getSObjectType().getDescribe().fields.getMap().get(fieldName).getDescribe();
                System.debug('field is updatable :'+fieldResult.isUpdateable());
                
                
               // if(fieldResult.isUpdateable()  ){    // && !fieldName.endsWith('Id')
                    
                //    sObj.put(fieldName, requestData.get(fieldName));
                    
              // }
              //  
             
               if (fieldResult.isUpdateable()) {
               // Object fieldValue = requestData.get(fieldName);
                if (fieldResult.getType() == Schema.DisplayType.Date && fieldValue != null) {
                   System.debug('date');
                    sObj.put(fieldName, Date.valueOf((String) fieldValue));
                } else if (fieldResult.getType() == Schema.DisplayType.DateTime && fieldValue != null ) {
                   System.debug('datenTime');
                     String dateTimeString = (String) fieldValue;
                    System.debug('field value :'+dateTimeString);
                     if ( !dateTimeString.contains(' ')) {
                            dateTimeString = dateTimeString.replace('T', ' ') + ':00';
                            
                        }
                 
                    sObj.put(fieldName, DateTime.valueOf(dateTimeString));

                   
                } else if (fieldResult.getType() == Schema.DisplayType.Boolean && fieldValue != null) {
                   System.debug('boolean');
                    sObj.put(fieldName, Boolean.valueOf((String) fieldValue));
                }
                    else if (fieldResult.getType() == Schema.DisplayType.DOUBLE && fieldValue != null) {
                  System.debug('boolean');
                    sObj.put(fieldName, DOUBLE.valueOf((String) fieldValue));
                }
                       else if (fieldResult.getType() == Schema.DisplayType.CURRENCY && fieldValue != null) {
                  System.debug('boolean');
                    sObj.put(fieldName, DOUBLE.valueOf((String) fieldValue));
                }
                else {
                    sObj.put(fieldName, fieldValue);
                }
            }
                
                
                
                /*
else {
System.debug('field ends with Id'+fieldName);
}
*/
                
                
                
            }
            recordsToUpdate.add(sObj);
            
        }
        System.debug('record to update ::'+recordsToUpdate);
        if(!recordsToUpdate.isEmpty()){
            Database.update(recordsToUpdate);
            return 'Record Saved Successfully';
        }
        else{
            return 'Failed';
            
        }
          }
         catch (DmlException dmlEx) {
      
             System.debug('dml exception :'+dmlEx);
        System.debug('DmlException Error: ' + dmlEx.getMessage());
             String message=dmlEx.getMessage();
            System.debug(message.substring(message.indexOf('[')+1,message.indexOf(']'))) ;
        return 'Failed:The row you are trying to update is missing required fields. Please include these required fields in your SOQL query or ensure they are populated in the backend before updating. Required Fields are:- '+ message.substring(message.indexOf('[')+1,message.indexOf(']')) ;
    }
        catch(Exception e){
             System.debug('Error  ' + e.getMessage());
        return 'Failed  :'+e.getMessage();
        }
        
    }
    
    
    
    
    @AuraEnabled(cacheable=true)
    public static  Map<String,String> getMapofTypeForFields(String query){
        System.debug('query :'+query);
        Map<String,String> fieldMap=new Map<String,String>();
        
          String objectName;
        Matcher objectMatcher = Pattern.compile('(?i)FROM\\s+(\\w+)').matcher(query);
        if (objectMatcher.find()) {
            objectName = objectMatcher.group(1);
        }
        SObjectType objToken = Schema.getGlobalDescribe().get(objectname);
        System.debug('Object name :'+objToken);
        
         Set<String> queriedFields = new Set<String>();
        Matcher matcher = Pattern.compile('(?i)SELECT\\s+(.*?)\\s+FROM').matcher(query);
        if (matcher.find()) {
            String[] fields = matcher.group(1).split('\\s*,\\s*');
            for (String field : fields) {  
                 Schema.DescribeFieldResult fieldResult = objToken.getDescribe().fields.getMap().get(field).getDescribe();
            
            String name = fieldResult.getName();
                 String type = String.valueOf(fieldResult.getType());
                  Boolean isRequired = !fieldResult.isNillable() && fieldResult.isCreateable() && !fieldResult.isDefaultedOnCreate();
                if(isRequired){
                System.debug('reuired field :'+name +'  type :'+type);
                    }
                // Schema.DisplayType type=fieldResult.getType();
          //  System.debug('names :'+name);
             //   System.debug('types :'+type);
                queriedFields.add(name);
                fieldMap.put(name,type);
            }  
        }
        
        System.debug('fields :'+queriedFields);
        
        System.debug('field Map :'+fieldMap);
        return fieldMap;
       /* 
        for(String fieldName:queriedFields){

             Schema.DescribeFieldResult fieldResult = objToken.getDescribe().fields.getMap().get(fieldName).getDescribe();
            
            String name = fieldResult.getName();
            System.debug('names :'+name);
        }*/
        
        
        
        
        
        
    }
    
    
    
    @AuraEnabled(cacheable=true)
    public static List<String> getPicklistValue(String query,String field){
         List<String> picklistValues = new List<String>();
        try{
            
              String objectName;
        Matcher objectMatcher = Pattern.compile('(?i)FROM\\s+(\\w+)').matcher(query);
        if (objectMatcher.find()) {
            objectName = objectMatcher.group(1);
        }
        SObjectType objToken = Schema.getGlobalDescribe().get(objectname);
        System.debug('Object name :'+objToken);
            
              Schema.DescribeFieldResult fieldResult = objToken.getDescribe().fields.getMap().get(field).getDescribe();
            String type = String.valueOf(fieldResult.getType());
            System.debug('type is :'+type);
            if(type=='PICKLIST'){
                 for (Schema.PicklistEntry entry : fieldResult.getPicklistValues()) {
                     System.debug('entry :'+entry);
                picklistValues.add(entry.getLabel());
            }
            }
            System.debug('picklist val :'+picklistValues);
            
        }
        catch(Exception e){
            System.debug('error  :'+e.getMessage());
            
        }
        return picklistValues;
        
    
        
    }
    
    
    
      @AuraEnabled(cacheable=true)
    public static  Map<String,Boolean> getMapofRequiredField(String query){
        System.debug('query :'+query);
        Map<String,Boolean> fieldMap=new Map<String,Boolean>();
        
          String objectName;
        Matcher objectMatcher = Pattern.compile('(?i)FROM\\s+(\\w+)').matcher(query);
        if (objectMatcher.find()) {
            objectName = objectMatcher.group(1);
        }
        SObjectType objToken = Schema.getGlobalDescribe().get(objectname);
        System.debug('Object name :'+objToken);
        
        // Set<String> queriedFields = new Set<String>();
        Matcher matcher = Pattern.compile('(?i)SELECT\\s+(.*?)\\s+FROM').matcher(query);
        if (matcher.find()) {
            String[] fields = matcher.group(1).split('\\s*,\\s*');
            for (String field : fields) {  
                 Schema.DescribeFieldResult fieldResult = objToken.getDescribe().fields.getMap().get(field).getDescribe();
            
            String name = fieldResult.getName();
                // String type = String.valueOf(fieldResult.getType());
                  Boolean isRequired = !fieldResult.isNillable() && fieldResult.isCreateable() && !fieldResult.isDefaultedOnCreate() ;
                System.debug('name :'+name+'  isRequired  :'+isRequired);
              //  if(isRequired){
               // System.debug('reuired field :'+name );
               //     }
                // Schema.DisplayType type=fieldResult.getType();
          //  System.debug('names :'+name);
             //   System.debug('types :'+type);
              //  queriedFields.add(name);
                fieldMap.put(name,isRequired);
            }  
        }
        
        //System.debug('fields :'+queriedFields);
        
        System.debug('field Map :'+fieldMap);
        return fieldMap;
       /* 
        for(String fieldName:queriedFields){

             Schema.DescribeFieldResult fieldResult = objToken.getDescribe().fields.getMap().get(fieldName).getDescribe();
            
            String name = fieldResult.getName();
            System.debug('names :'+name);
        }*/
        
        
        
        
        
        
    }
    
    
    
}