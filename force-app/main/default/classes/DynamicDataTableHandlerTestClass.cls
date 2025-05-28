@isTest
public class DynamicDataTableHandlerTestClass {
    
    @isTest
    static void testGetFieldName() {
        
        Account acc = new Account(Name='Test Account',AccountNumber='123');
        insert acc;
        Contact con = new Contact(FirstName='Test',LastName='Contact',Phone='123456', AccountId=acc.Id);
        insert con;
        
        String accQuery = 'SELECT Id, Name FROM Account';
        String conQuery = 'SELECT Id, FirstName, LastName,Name, AccountId FROM Contact';
        String accFieldLabel = DynamicDataTableHandler.getFieldName(accQuery, 'Name');
        System.assertEquals('Account Name', accFieldLabel);
        
        String conFieldLabel = DynamicDataTableHandler.getFieldName(conQuery, 'FirstName');
        System.assertEquals('First Name', conFieldLabel);
        
        String conFieldLabel2 = DynamicDataTableHandler.getFieldName(conQuery, 'AccountId');
        System.assertEquals('Account ID', conFieldLabel2);
        
        Boolean updateStatus=DynamicDataTableHandler.getUpdateStatus(conQuery,'Name');
        System.assertEquals(false,updateStatus);
        
        Boolean updateStatus2=DynamicDataTableHandler.getUpdateStatus(conQuery,'FirstName');
        System.assertEquals(true,updateStatus2);
        
        String labelName=DynamicDataTableHandler.getObjectLabelName(conQuery);
        System.assertEquals('Contacts',labelName);
        
        String iconName=DynamicDataTableHandler.iconNamesForObjects(accQuery);
        System.assert(iconName.startsWith('standard:'));
        
    }
    
    
    @IsTest
    static void testStandardObjectFieldsWithFieldMap() {
        String objectName = 'Account';
        String fieldName = 'Name';
        String result = DynamicDataTableHandler.getrelatedFieldName(objectName, fieldName);
        System.assertEquals('Account Name', result);
    }
    
    @IsTest
    static void testGetDataFromQueryStandardFields() {
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;
        String query = 'SELECT Id, Name FROM Account';
        Integer limitSize = 1;
        Integer offset = 0;
        String result = DynamicDataTableHandler.getDataFromQuery(query, limitSize, offset);
        List<Object> resultList = (List<Object>) JSON.deserializeUntyped(result);
        System.assertEquals(1, resultList.size());
        Map<String, Object> resultRecord = (Map<String, Object>) resultList.get(0);
        System.assertEquals('Test Account', resultRecord.get('Name'));
    }
    
    @isTest
    static void testReferenceFieldWithName() {
        Account acc = new Account(Name='Test Account',AccountNumber='123');
        insert acc;
        Contact con = new Contact(FirstName='Test',LastName='Contact',Phone='123456', AccountId=acc.Id);
        insert con;
        Test.startTest();
        String result = DynamicDataTableHandler.getReferenceField('Contact', 'AccountId');
        Test.stopTest();
        System.assertEquals('name', result, 'Expected to return "name" for Account reference');
    }    
    
    
    @isTest
    static void testGetMapofRequiredField() {
        
        Account acc = new Account(Name='Test Account', AccountNumber='123');
        insert acc;
        
        Contact con = new Contact( FirstName='Test', LastName='Contact',Phone='123456', AccountId=acc.Id);
        insert con;
        String accQuery = 'SELECT Id, Name, AccountNumber FROM Account';
        String conQuery = 'SELECT Id, FirstName, LastName, Phone, AccountId FROM Contact';
        Test.startTest();
        
        Map<String, Boolean> accFieldMap = DynamicDataTableHandler.getMapofRequiredField(accQuery);
        Map<String, Boolean> conFieldMap = DynamicDataTableHandler.getMapofRequiredField(conQuery);
        
        Test.stopTest();
        System.assertEquals(true, accFieldMap.containsKey('Id'));
        System.assertEquals(false, accFieldMap.get('Id'));
    }
    
    
    @isTest
    static void testGetUpdateStatusNew() {
        
        Account acc = new Account(Name='Test Account', AccountNumber='123');
        insert acc;
        
        Contact con = new Contact( FirstName='Test', LastName='Contact',Phone='123456', AccountId=acc.Id);
        insert con;
        String accQuery = 'SELECT Id, Name, AccountNumber FROM Account';
        String conQuery = 'SELECT Id, FirstName, LastName, Phone, AccountId FROM Contact';
        Test.startTest();       
        Map<String, Boolean> accFieldMap = DynamicDataTableHandler.getUpdateStatusNew(accQuery);
        Map<String, Boolean> conFieldMap = DynamicDataTableHandler.getUpdateStatusNew(conQuery);       
        Test.stopTest();
        System.assertEquals(true, accFieldMap.containsKey('Id'));
        System.assertEquals(false, accFieldMap.get('Id'));
    }
    
    
    
    @isTest
    static void testGetPicklistValue() {
        
        Contact contact = new Contact( FirstName='Test',LastName='Contact', Phone='123456'  );
        insert contact;
        String conQuery = 'SELECT Id, FirstName, LastName, Phone, LeadSource FROM Contact';
        Test.startTest();
        List<String> picklistValues = DynamicDataTableHandler.getPicklistValue(conQuery, 'LeadSource');
        Test.stopTest();       
        System.assert(picklistValues.contains('Web'), 'Picklist values should contain "Web"');
        
    }
    
    
    @isTest
    static void testUpdateSObject() {
        
        Account acc = new Account(Name='Test Account', AccountNumber='123');
        insert acc;
        
        Contact con = new Contact(  FirstName='Test', LastName='Contact',  Phone='123456', AccountId=acc.Id);
        insert con;
        
        String jsonData = '[{"Id":"' + con.Id + '", "FirstName":"Updated", "LastName":"Contact"}]';      
        Test.startTest();
        String result = DynamicDataTableHandler.updateSObject(jsonData);
        Test.stopTest();
        System.assertEquals('Record Saved Successfully', result);
        
        Contact updatedCon = [SELECT FirstName, LastName, Phone FROM Contact WHERE Id = :con.Id];
        System.assertEquals('Updated', updatedCon.FirstName);
        System.assertEquals('Contact', updatedCon.LastName);      
    }
    
    
    
    @isTest
    static void testGetMapofTypeForFields() {
        
        Account acc = new Account(Name='Test Account', AccountNumber='123',Industry = 'abc');
        insert acc;
        
        Contact con = new Contact( FirstName='Test', LastName='Contact', Phone='123456', AccountId=acc.Id  );
        insert con;
        String conQuery = 'SELECT Id, FirstName, LastName,AccountId,Account.Name, Phone FROM Contact';
        Test.startTest();
        Map<String, String> conFieldMap = DynamicDataTableHandler.getMapofTypeForFields(conQuery);
        Test.stopTest();
        System.assertEquals('ID', conFieldMap.get('Id'));
        System.assertEquals('STRING', conFieldMap.get('FirstName'));
        System.assertEquals('STRING', conFieldMap.get('Account.Name')); 
    }
    
    
    @isTest
    static void testGetAccountNames() {     
        Account acc1 = new Account(Name = 'Test Account A');
        Account acc2 = new Account(Name = 'Test Account B');
        Account acc3 = new Account(Name = 'Sample Account C');
        insert new List<Account>{acc1, acc2, acc3};
            
            String sObjectName = 'Account';
        String field = 'Name';
        String searchKey = 'Test';      
        Test.startTest();
        List<Map<String, String>> accountNames = DynamicDataTableHandler.getNamesOfObject(sObjectName, field, searchKey);
        Test.stopTest();
        System.assertEquals(2, accountNames.size(), 'There should be 2 results for "Test" search key'); 
    }
    
    
    
    @isTest
    static void testGetRelatedPicklistValue() { 
        Account acc = new Account(Name = 'Test Account');
        insert acc;
        String objectName = 'Account';
        String field = 'Industry';
        
        Test.startTest();
        List<String> picklistValues = DynamicDataTableHandler.getRelatedPicklistValue(objectName, field);
        Test.stopTest();
        System.assert(picklistValues.size() > 0, 'Positive');
        System.assert(picklistValues.contains('Agriculture'), 'Picklist value present');     
    }
    
    
    @isTest
    static void testGetRelatedRecords() {      
        Account acc1 = new Account(Name = 'Account 1', Industry = 'Technology');     
        insert acc1;
        List<Map<String, String>> referenceData = new List<Map<String, String>>();           
        Map<String, String> accountData1 = new Map<String, String>();
        accountData1.put('query', 'SELECT Id, Name FROM Account');
        accountData1.put('id', acc1.Id);
        accountData1.put('fields', 'Id, Name, Industry');
        referenceData.add(accountData1);
        Test.startTest();
        List<SObject> relatedRecords = DynamicDataTableHandler.getRelatedRecords(referenceData);  
        Test.stopTest();
        
        System.assertEquals(1, relatedRecords.size());
        Map<String, SObject> resultMap = new Map<String, SObject>();
        for (SObject record : relatedRecords) {
            resultMap.put(record.Id, record);
        }      
        Account resultAcc1 = (Account)resultMap.get(acc1.Id);  
        System.assertEquals('Account 1', resultAcc1.Name);  
    }
    
    
}