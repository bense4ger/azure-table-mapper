/**
 * Created by benseager on 06/05/2015.
 */
var entGen = require('azure-storage').TableUtilities.entityGenerator;
var tableHelper = {
    /**
     * @convertToTableEntity
     * @example <caption>
     *     var azure = require('azure-storage');
     *     var tableHelper = require('azure-table-mapper');
     *     var _entity = {
     *          id : 1234,
     *          name : 'test'
     *              entityMapping : {
     *                  partitionKey : 'id',
     *                  rowKey : {
     *                      identifier : ['name'],
     *                      format : '{name}_rk'
     *                  }
     *              }
     *     };
     *
     *     var _tableEntity = tableHelper.convertToTableEntity(_entity);
     *     var tableSvc = azure.createTableService()
     *     tableSvc.insertEntity('mytable',_tableEntity, function (error, result, response) {
     *          if(!error){
     *              // Entity inserted
     *          }
     *     });
     * </caption>
     * @param entity {Object}   The object to convert.  It must have a complete 'entityMapping' key in order to be proccesed
     * @param preserveKeys {Boolean} [true]     Flag to determine whether the source keys of the PartitionKey and RowKey are preserved
     * @returns {Object}   Returns a correctly formatted object ready for insertion into Azure Table Storage
     */
    convertToTableEntity : function(entity, preserveKeys){
        if(typeof(preserveKeys) === 'undefined') preserveKeys = true;
        //Get the partition and row keys
        var target = {
            PartitionKey : entGen.String(entity[entity.entityMapping.partitionKey]),
            RowKey : formatRowKey(entity)
        };

        var keyFilter = function(value){
            switch(preserveKeys){
                case true:
                    return value != 'entityMapping';
                case false:
                    return (!(value === 'entityMapping' ||
                    value === entity.entityMapping.partitionKey ||
                    entity.entityMapping.rowKey.identifier.indexOf(value) != -1));
            }
        };

        //Iterate over the keys and map the values
        Object.keys(entity).filter(keyFilter).forEach(function(key){
            target[key] = convertToTableValue(entity[key]);
        });

        return target;
    },
    /**
     * @convertFromTableEntity
     * @param source {Object}
     * @param mapping {Object}
     */
    convertFromTableEntity : function(source, mapping){
        var mapPartitionKey = function(){
            return Object.keys(source).indexOf(mapping.partitionKey) == -1;
        };

        var mapRowKey = function(){
            var map = true;
            for(var i = 0; i < mapping.rowKey.identifier.length; i++){
                if(Object.keys(source).indexOf(mapping.rowKey.identifier[i]) != -1) {
                    map = false;
                    i = mapping.rowKey.identifier.length;
                }
            }
            return map;
        };

        var newEntity = {};
        newEntity.entityMapping = mapping;
        //Map the table keys
        if(mapPartitionKey()){
            newEntity[mapping.partitionKey] = convertFromTableValue(source.PartitionKey);
        }

        if(mapRowKey()){
            var keys = convertRowKey(source.RowKey, mapping.rowKey.identifier, mapping.rowKey.format);
            Object.keys(keys).forEach(function(key){
                newEntity[key] = keys[key];
            });
        }

        var filter = function(value){
            return (!(value === 'PartitionKey' || value === 'RowKey' || value === 'TimeStamp'));
        };

        //Map the remaining keys
        Object.keys(source).filter(filter).forEach(function(key){
            newEntity[key] = convertFromTableValue(source[key]);
        });

        return newEntity;
    }
};

function convertRowKey(rowKey, identifiers, format){
    var keys = {};
    identifiers.forEach(function(ident){
        var startIndex, rex;
        rex = new RegExp('{' + ident + '}','g');
        startIndex = format.search(rex);
        keys[ident] = rowKey._.toString().substr(startIndex, ident.length);
    });
    return keys;
}

function isJson(value){
    try{
        var o = JSON.parse(value);
        return (o && typeof o === "object" && o !== null);
    }
    catch(e){
        return false;
    }
}

function convertFromTableValue(rawValue){

    switch(rawValue.$){
        case 'Edm.String':
            return isJson(rawValue._) ?
                JSON.parse(rawValue._) :
                rawValue._;
        case 'Edm.Int32':
            return parseInt(rawValue._);
        case 'Edm.Double':
            return Number(rawValue._);
        case 'Edm.Boolean':
            return Boolean(rawValue._);
        case 'Edm.DateTime':
            return new Date(rawValue._);
        default:
            return rawValue._;
    }
}

/**
 *
 * @param rawValue
 * @returns {*}
 */
function convertToTableValue(rawValue){
    switch (typeof rawValue) {
        case 'string':
            return entGen.String(rawValue);
        case 'number':
            return (Math.round(rawValue) === rawValue) ?
                entGen.Int32(rawValue) :
                entGen.Double(rawValue);
        case 'boolean':
            return entGen.Boolean(rawValue);
        default:
            //Handle dates slightly differently
            //and default to a string
            if (rawValue instanceof Date) {
                return entGen.DateTime(rawValue);
            }
            else {
                return entGen.String(rawValue);
            }
    }
}

/**
 *
 * @param sourceObject
 * @returns {*}
 */
function formatRowKey(sourceObject){
    var format = sourceObject.entityMapping.rowKey.format;
    var identifiers = sourceObject.entityMapping.rowKey.identifier;

    identifiers.forEach(function(identifier){
        var replaceRx = new RegExp('{' + identifier + '}', 'g' );
        format = format.replace(replaceRx, sourceObject[identifier]);
    });

    return entGen.String(format);
}



module.exports = tableHelper;