/**
 * Created by benseager on 06/05/2015.
 */
var entGen = require('azure-storage').TableUtilities.entityGenerator;
var tableHelper = {
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
                    return (value === 'entityMapping' ||
                    value === entity.entityMapping.partitionKey ||
                    entity.entityMapping.rowKey.identifier.indexOf(value) != -1) ? false : true;
            }
        };

        //Iterate over the keys and map the values
        Object.keys(entity).filter(keyFilter).forEach(function(key){
            target[key] = convertToTableValue(entity[key]);
        });

        return target;
    },
    convertFromTableEntity : function(source, mapping){

    }
};

function convertToTableValue(rawValue){
    switch (typeof rawValue) {
        case 'string':
            return entGen.String(rawValue);
        case 'number':
            return entGen.Int32(rawValue);
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