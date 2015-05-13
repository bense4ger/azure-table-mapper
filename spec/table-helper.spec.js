/**
 * Created by benseager on 06/05/2015.
 */
var helper = require('../lib/table-helper');
var entGen = require('azure-storage').TableUtilities.entityGenerator;

describe('helper.convertToTableEntity', function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        _entity = {
            id : 1234,
            name : 'test',
            date : new Date(2015, 0, 1),
            bool : true,
            object: {value : 'someValue'},
            double: 123.45,
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
        expect(_tableEntity.double._).toEqual(_entity.double);
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

describe('helper.convertToTableEntity', function () {
    var _entity, _tableEntity;
    beforeAll(function(){
        _entity = {
            id : 1234,
            name : 'test',
            name2: 'test2',
            date : new Date(2015, 0, 1),
            bool : true,
            object: {value : 'someValue'},
            double: 123.45,
            entityMapping: {
                partitionKey : 'id',
                rowKey : {
                    identifier : ['name', 'name2'],
                    format : '{name}_{name2}_rk'
                }
            }
        };

        _tableEntity = helper.convertToTableEntity(_entity);
    });
    it('should handle RowKeys with multiple source properties', function () {
        expect(_tableEntity.RowKey._).toEqual('test_test2_rk');
    });
});

describe('helper.convertToTableEntity - preserving keys' , function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        _entity = {
            id : 1234,
            name : 'test',
            date : new Date(2015, 0, 1),
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
            date : new Date(2015, 0, 1),
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

describe('helper.convertToTableEntity - default preserving keys with multiple properties', function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        _entity = {
            id : 1234,
            name : 'test',
            name2 : 'test2',
            date : new Date(2015, 0, 1),
            entityMapping: {
                partitionKey : 'id',
                rowKey : {
                    identifier : ['name', 'name2'],
                    format : '{name}_{name2}_rk'
                }
            }
        };

        _tableEntity = helper.convertToTableEntity(_entity);
    });
    it('should keep the partiton key property on the table entity', function(){
        expect(_tableEntity.id._).toEqual(1234);
    });
    it('should keep the first row key property on the table entity', function(){
        expect(_tableEntity.name._).toEqual('test');
    });
    it('should keep the second row key property on the table entity', function(){
        expect(_tableEntity.name2._).toEqual('test2');
    });
});

describe('helper.convertToTableEntity - do not preserve keys', function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        _entity = {
            id : 1234,
            name : 'test',
            date : new Date(2015, 0, 1),
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
    it('should not preserve the original row key property', function(){
        expect(_tableEntity[_entity.entityMapping.rowKey.identifier[0]]).toBeUndefined();
    });
});

describe('helper.convertToTableEntity - do not preserve multiple keys', function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        _entity = {
            id : 1234,
            name : 'test',
            name2: 'test2',
            date : new Date(2015, 0, 1),
            entityMapping: {
                partitionKey : 'id',
                rowKey : {
                    identifier : ['name', 'name2'],
                    format : '{name}_{name2}_rk'
                }
            }
        };

        _tableEntity = helper.convertToTableEntity(_entity, false);
    });
    it('should not preserve the original partition key property', function(){
        expect(_tableEntity[_entity.entityMapping.partitionKey]).toBeUndefined();
    });
    it('should not preserve the original row key properties', function(){
        _entity.entityMapping.rowKey.identifier.forEach(function (i) {
            expect(_tableEntity[i]).toBeUndefined();
        })
    });
});

describe('helper.convertFromTableEntity', function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        var _obj = {value : 'someValue'};
        _tableEntity = {
            PartitionKey : entGen.Int32(1234),
            RowKey : entGen.String('test_rk'),
            id : entGen.Int32(1234),
            name : entGen.String('test'),
            date : entGen.DateTime(new Date(2015, 0, 1)),
            bool : entGen.Boolean(true),
            object : entGen.String(JSON.stringify(_obj)),
            int64 : entGen.Int64(9999)
        };

        var _entityMapping = {
            partitionKey : 'id',
            rowKey : {
                identifier : ['name'],
                format : '{name}_rk'
            }
        };
        _entity = helper.convertFromTableEntity(_tableEntity, _entityMapping);
    });
    it('should correctly map the object keys and their types', function(){
        expect(_entity.date).toEqual(_tableEntity.date._);
        expect(_entity.bool).toEqual(_tableEntity.bool._);
        expect(_entity.object).toEqual(JSON.parse(_tableEntity.object._));
        expect(_entity.int64).toEqual(_tableEntity.int64._);
    });
});
describe('helper.convertFromTableEntity - key mapping where keys are present', function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        var _obj = {value : 'someValue'};
        _tableEntity = {
            PartitionKey : entGen.Int32(1234),
            RowKey : entGen.String('test_rk'),
            id : entGen.Int32(1234),
            name : entGen.String('test'),
            date : entGen.DateTime(new Date(2015, 0, 1)),
            bool : entGen.Boolean(true),
            object : entGen.String(JSON.stringify(_obj))
        };

        var _entityMapping = {
            paritionKey : 'id',
            rowKey : {
                identifier : ['name'],
                format : '{name}_rk'
            }
        };

        _entity = helper.convertFromTableEntity(_tableEntity, _entityMapping);
    });
    it('should not map the row and partition keys if the original keys are present', function(){
        expect(_entity.id).toBeDefined();
        expect(_entity.name).toBeDefined();
    });
});
describe('helper.convertFromTableEntity - key mapping where keys are not present', function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        var _obj = {value : 'someValue'};
        _tableEntity = {
            PartitionKey : entGen.Int32(1234),
            RowKey : entGen.String('test_rk'),
            date : entGen.DateTime(new Date(2015, 0, 1)),
            bool : entGen.Boolean(true),
            object : entGen.String(JSON.stringify(_obj))
        };

        var _entityMapping = {
            partitionKey : 'id',
            rowKey : {
                identifier : ['name'],
                format : '{name}_rk'
            }
        };

        _entity = helper.convertFromTableEntity(_tableEntity, _entityMapping);
    });
    it('should map the partition key', function(){
        expect(_entity.id).toEqual(_tableEntity.PartitionKey._);
    });
    it('should map the row key', function(){
        expect(_entity.name).toEqual('test');
    });
});

describe('helper to and from conversion', function(){
    var _entity, _tableEntity, _result;
    beforeAll(function(){
        _entity = {
            id : 1234,
            name : 'test',
            date : new Date(2015, 0, 1),
            bool : true,
            object: {value : 'someValue'},
            double: 123.45,
            entityMapping: {
                partitionKey : 'id',
                rowKey : {
                    identifier : ['name'],
                    format : '{name}_rk'
                }
            }
        };

        _tableEntity = helper.convertToTableEntity(_entity, false);
        _result = helper.convertFromTableEntity(_tableEntity, _entity.entityMapping);
    });
    it('should convert an entity to and from a table entity correctly', function(){
        expect(_result).toEqual(_entity);
    });
});