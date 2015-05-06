/**
 * Created by benseager on 06/05/2015.
 */
var entGen = require('azure-storage').TableUtilities.entityGenerator;
var tableHelper = {
    convertToTableEntity : function(entity){

    },
    convertFromTableEntity : function(source, mapping){

    }
};

var entityProto = {
    entityMapping: {
        partitionKey : '',
        rowKey : {
            identifier : '',
            format : ''
        }
    }
};

var helpers = {
    tableHelper : tableHelper,
    entityProto : entityProto
};

module.exports = helpers;