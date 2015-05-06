/**
 * Created by benseager on 06/05/2015.
 */
var helper = require('../lib/table-helper');

describe('helper.convertToTableEntity', function(){
    var _entity, _tableEntity;
    beforeAll(function(){
        _entity = helper.entityProto;
        _entity.entityMapping.partitionKey = 'id';
        _entity.entityMapping.rowKey.identifier = ['name'];
        _entity.entityMapping.rowKey.format = '{name}_rk';
        _entity.id = 1234;
        _entity.name = 'Test';
        _entity.date = new Date(2015, 1, 1);

        _tableEntity = helper.tableHelper.convertToTableEntity(_entity);
    });
    it('should correctly map the partition key value', function(){
        expect(_tableEntity.PartitionKey._).toEqual(_entity.id);
    });
    it('should correctly map the row key value', function(){
        expect(_tableEntity.RowKey._).toEqual(_entity.name);
    });
    it('should correctly map the object keys', function(){
        expect(_tableEntity.date._).toEqual(_entity.date.toString());
    });
    it('should correctly map the object key types', function(){
        expect(_tableEntity.date.$).toEqual('Edm.Date');
    });
});

describe('helper.convertFromTableEntity', function(){
    var _entity, _tableEntity;
    beforeAll(function(){});
    it('should correctly map the object keys and their types', function(){});
});