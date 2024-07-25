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
        
        String accountName=DynamicDataTableHandler.getObjectName(acc.Id);
        System.assertEquals('Test Account',accountName);  
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
        
        Account acc = new Account(Name='Test Account', AccountNumber='123');
        insert acc;
        
        Contact con = new Contact( FirstName='Test', LastName='Contact', Phone='123456', AccountId=acc.Id  );
        insert con;
        String conQuery = 'SELECT Id, FirstName, LastName, Phone FROM Contact';
        
        Test.startTest();
        Map<String, String> conFieldMap = DynamicDataTableHandler.getMapofTypeForFields(conQuery);
        Test.stopTest();
        System.assertEquals('ID', conFieldMap.get('Id'));
        System.assertEquals('STRING', conFieldMap.get('FirstName'));
        
    }
}