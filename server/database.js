
const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'boats';
const collectionName = 'boats'


function get(filter, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true },
        async (error, client) => {
            if (error) {
                callback('"Error! couldnt connect"');
                console.log(error);
                return;
            }
            const col = client.db(dbName).collection(collectionName);
            try {
                const cursor = await col.find(filter);
                const array = await cursor.toArray();
                callback(array)
            } catch (error) {
                console.log('Query error' + error.message);
                callback('"Query error!"');
            } finally {
                client.close();
            }
        }
    )
}
function addBoat(reqBody, callback){
    const document = reqBody;
    MongoClient.connect(url, {useUnifiedTopology:true},
        async (error, client) => {
            if (error){
                callback("'Error! Couldnt connect'");
                return;
            }
            const col = client.db(dbName).collection(collectionName);
            try {
                const result = await col.insertOne(document);
                callback({
                    result: result.result,
                    ops: result.ops
                })
            } catch(error){
                console.error('Failed to add boat: ' + error.message);
                callback('"ERROR! query error"');
            } finally{
                client.close();
            }
        }
    )
}
function deleteBoat(id, callback){
    MongoClient.connect(url, {useUnifiedTopology:true},
        async (error, client) => {
            if (error){
                callback("'Error! Couldnt connect'");
                return;
            }
            const col = client.db(dbName).collection(collectionName);
            try {
                const result = await col.deleteOne({_id: new ObjectID(id)});
                callback({
                    result: result.result,
                    ops: result.ops
                })
            } catch(error){
                console.error('Failed to delete boat: ' + error.message);
                callback('error');
            } finally{
                client.close();
            }
        }
    )
}
function editBoat(obj,id, callback){

    // Connect till databas
    MongoClient.connect(url, {useUnifiedTopology:true},
        async (error, client) => {
            if (error){
                callback("'Error! Couldnt connect'");
                return;
            }
            // Rätt databas och rätt collections (boats)
            const col = client.db(dbName).collection(collectionName);
            try {
                //Updatera ett dokument matchat på id med ett nytt obj
                const result = await col.updateOne({_id: new ObjectID(id)}, { $set: obj});
                callback({
                    result: result.result,
                    ops: result.ops
                })
            } catch(error){
                console.error('Failed to update boat: ' + error.message);
                callback('error');
            } finally{
                client.close();
            }
        }
    )
}
function search(query, callback){
    const searchFilter = {};
    let order = {};
    if( query.word ){
        // Filtrerar på modelName som innehåller query.modelName
        searchFilter.modelName = { "$regex": `.*${query.word}.*`};
    }
    if(query.maxprice){
        //filtrerar på högsta tillåtna pris
        searchFilter.price = { $lt: parseFloat(query.maxprice)};
    }
    if(query.madebefore){
        //filtrerar efter tillverkningsår
        searchFilter.manufacturingYear = { $lt: parseFloat(query.madebefore)};
    }
    if(query.madeafter){
        //filtrerar efter tillverkningsår
        searchFilter.manufacturingYear = { $gt: parseFloat(query.madeafter)};
    }
    if(query.is_sail){
        if(query.is_sail === 'yes')
            searchFilter.sailboat = true;
        else if(query.is_sail === 'no')
        searchFilter.sailboat = false;
    }
    if(query.has_motor){
        if(query.has_motor === 'yes')
            searchFilter.motor = true;
        else if(query.has_motor === 'no')
            searchFilter.motor = false; 
    }
    if(query.order){
        if(query.order === 'lowprice')
            order = { price: 1 }
        else if(query.order === 'name_asc')
            order = { modelName: 1}
        else if(query.order === 'name_desc')
            order = { modelName: -1}
        else if(query.order === 'oldest')
            order = { manufacturingYear: 1}
        else if(query.order === 'newest')
            order = { manufacturingYear: -1}
    }
    MongoClient.connect(url, {useUnifiedTopology:true},
        async (error, client) => {
            if (error){
                callback("'Error! Couldnt connect'");
                return;
            }
            // Rätt databas och rätt collections (boats)
            const col = client.db(dbName).collection(collectionName);
            try {
                // hämtar alla som matchar sök filtret
            
                const cursor = await col.find(searchFilter).sort(order);    
                const array = await cursor.toArray();
                callback(array)
            } catch(error){
                console.error('Failed search: ' + error.message);
                callback('error');
            } finally{
                client.close();
            }
        }
    )
}
function getAllBoats(callback){
    get({},callback)
}
function getOneBoat(id,callback){
    get( {_id: new ObjectID(id) }, array => callback(array[0]))
}
module.exports = {
    getAllBoats, addBoat, getOneBoat, deleteBoat, editBoat, search
}