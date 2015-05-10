# azure-table-mapper
[![Build Status](https://travis-ci.org/bense4ger/azure-table-mapper.svg)](https://travis-ci.org/bense4ger/azure-table-mapper) [![Coverage Status](https://coveralls.io/repos/bense4ger/azure-table-mapper/badge.svg)](https://coveralls.io/r/bense4ger/azure-table-mapper) [![Dependency Status](https://david-dm.org/bense4ger/azure-table-mapper.svg)](https://david-dm.org/bense4ger/azure-table-mapper) [![devDependency Status](https://david-dm.org/bense4ger/azure-table-mapper/dev-status.svg)](https://david-dm.org/bense4ger/azure-table-mapper#info=devDependencies)

A simple helper which maps objects so they can be stored in Azure Table Storage.  I found myself needing to do this a lot, so thought I'd share my code.

## Installation
```
npm install azure-table-mapper
```

## Usage

### Mapping

In order to correctly convert an object for storage in an Azure table, some mapping information is required.

```javascript
var entityMapping = {
    partitionKey : '',
    rowKey : {
        identifier: [],
        format: ''
    }
}
```

The ```partitionKey``` is a string which corresponds to the name of the property which is to be the partition key.

The ```rowKey``` is an object.  ```identifier``` is an array of strings, each of which corresponds to property which will form the row key.  ```format``` is a string which defines what shape the row key will take.

### Converting To Table Storage

```javascript
var azure = require('azure-storage');
var mapper = require('azure-table-mapper');

var _entity = {
    id : 1234,
    name : 'foo',
    date : new Date(2015, 0, 1),
    bool : true,
    object: {value : 'bar'},
    double: 123.45,
    entityMapping: {
        partitionKey : 'id',
        rowKey : {
            identifier : ['name'],
            format : '{name}_rk'
        }
    }
};

var _mapped = mapper.convertToTableEntity(_entity)

var tableSvc = azure.createTableService()
tableSvc.insertEntity('mytable',_mapped, function (error, result, response) {
    if(!error){
        // Entity inserted
    }
});
```

### Converting From Table Storage

```javascript

var mapper = require('azure-table-mapper');

converted = mapper.convertFromTableEntity(entity, mapping);

```

In the above example ```entity``` is the object returned from Azure Table Storage, and ```mapping``` is the mapping object which describes how the partition and row keys are mapped.

### API
#### convertToTableEntity(entity, preserveKeys)
* entity

The object to be converted.  Must contain an ```entityMapping``` key in the format described above.
* preserveKeys (optional, defaults to true)

Boolean flag to indicate whether the original values for the Partition and Row keys are retained.  E.g. if entityMapping.partitionKey = 'id' and preserveKeys is true the output will have a PartitionKey property and an id property.

#### convertFromTableEntity(source, mapping)
* source
... The object returned from Azure Table Storage
* mapping
... The object that describes the destination object's mapping

## Contributions and Issues
Contributions are most welcome, and if you notice any issues then please raise them!
