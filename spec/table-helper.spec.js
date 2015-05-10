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
    it('should correctly map the partition key value', function(){
        expect(_tableEntity.PartitionKey._).toEqual(_entity.id);
    });
    it('should correctly map the row key value', function(){
        expect(_tableEntity.RowKey._).toEqual(_entity.name + '_rk');
    });
    it('should correctly map the object keys', function(){
        expect(_tableEntity.date._).toEqual(_entity.date);
    });
    it('should correctly map the object key types', function(){
        expect(_tableEntity.date.$).toEqual('Edm.DateTime');
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

describe('helper.convertFromTableEntity', function(){
    var _entity, _tableEntity;
    beforeAll(function(){});
    it('should correctly map the object keys and their types', function(){});
});