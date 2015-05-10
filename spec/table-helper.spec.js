/**
 * Created by benseager on 06/05/2015.
 */
var helper = require('../lib/table-helper');

describe('helper.convertToTableEntity', function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        _entity = {
            id : 1234,
            name : 'test',
            date : new Date(2015, 1, 1),
            bool : true,
            object: {value : 'someValue'},
            entityMapping: {
                partitionKey : 'id',
                rowKey : {
                    identifier : ['name'],
                    format : '{name}_rk'
                }
            }
        };

        _tableEntity = helper.convertToTableEntity(_entity);
    });
    it('should correctly map the partition key value', function(){
        expect(_tableEntity.PartitionKey._).toEqual(_entity.id);
    });
    it('should correctly map the row key value', function(){
        expect(_tableEntity.RowKey._).toEqual(_entity.name + '_rk');
    });
    it('should correctly map the object keys', function(){
        expect(_tableEntity.date._).toEqual(_entity.date);
        expect(_tableEntity.bool._).toEqual(_entity.bool);
        expect(_tableEntity.object._).toEqual(_entity.object);
    });
    it('should correctly map the object keys that are dates', function(){
        expect(_tableEntity.date.$).toEqual('Edm.DateTime');
    });
    it('should correctly map the object keys that are bools', function(){
        expect(_tableEntity.bool.$).toEqual('Edm.Boolean');
    });
    it('should correctly default mapping to string', function(){
        expect(_tableEntity.object.$).toEqual('Edm.String');
    });
});

describe('helper.convertToTableEntity - preserving keys' , function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        _entity = {
            id : 1234,
            name : 'test',
            date : new Date(2015, 1, 1),
            entityMapping: {
                partitionKey : 'id',
                rowKey : {
                    identifier : ['name'],
                    format : '{name}_rk'
                }
            }
        };

        _tableEntity = helper.convertToTableEntity(_entity, true);
    });
    it('should keep the partiton key property on the table entity', function(){
        expect(_tableEntity.id._).toEqual(1234);
    });
    it('should keep the row key property on the table enttiy', function(){
        expect(_tableEntity.name._).toEqual('test');
    });
});

describe('helper.convertToTableEntity - default preserving keys', function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        _entity = {
            id : 1234,
            name : 'test',
            date : new Date(2015, 1, 1),
            entityMapping: {
                partitionKey : 'id',
                rowKey : {
                    identifier : ['name'],
                    format : '{name}_rk'
                }
            }
        };

        _tableEntity = helper.convertToTableEntity(_entity);
    });
    it('should keep the partiton key property on the table entity', function(){
        expect(_tableEntity.id._).toEqual(1234);
    });
    it('should keep the row key property on the table entity', function(){
        expect(_tableEntity.name._).toEqual('test');
    });
});

describe('helper.convertToTableEntity - do not preserve keys', function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        _entity = {
            id : 1234,
            name : 'test',
            date : new Date(2015, 1, 1),
            entityMapping: {
                partitionKey : 'id',
                rowKey : {
                    identifier : ['name'],
                    format : '{name}_rk'
                }
            }
        };

        _tableEntity = helper.convertToTableEntity(_entity, false);
    });
    it('should not preserve the original partition key property', function(){
        expect(_tableEntity[_entity.entityMapping.partitionKey]).toBeUndefined();
    });
    it('should not preserve the original row key property(ies)', function(){
        expect(_tableEntity[_entity.entityMapping.rowKey.identifier[0]]).toBeUndefined();
    });
});

describe('helper.convertFromTableEntity', function(){
    var _entity, _tableEntity;
    beforeAll(function(){});
    it('should correctly map the object keys and their types', function(){});
});