
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

function resetDataBase(callback){
    const documents = [{"modelName":"A.Mostes Pegaso 22","manufacturingYear":2020,"price":20000000,"sailboat":false,"url":"https://api.boatvertizer.com/catalog/thumbs/small/6147-1597850018.jpg","motor":true},{"modelName":"C-Yacht 1250i","manufacturingYear":2018,"price":12000000,"sailboat":true,"url":"https://api.boatvertizer.com/catalog/thumbs/small/244032-1598003898.jpg","motor":true},{"modelName":"C-Yacht 42ac","manufacturingYear":2018,"price":1159999,"sailboat":true,"url":"https://api.boatvertizer.com/catalog/thumbs/small/244481-1598003903.jpg","motor":true},{"modelName":"Malibu Sunscape 20 LSV","manufacturingYear":2011,"price":999999,"sailboat":false,"url":"https://api.boatvertizer.com/catalog/thumbs/small/9412-1314013380.jpg","motor":true},{"modelName":"Malibu Wakesetter VLX","manufacturingYear":2011,"price":1299999,"sailboat":false,"url":"https://api.boatvertizer.com/catalog/thumbs/small/9411-1314013377.jpg","motor":true},{"modelName":"Malibu Wakesetter 22 VLX","manufacturingYear":2016,"price":1799999,"sailboat":false,"url":"https://api.boatvertizer.com/catalog/thumbs/small/243576-1411488050.jpg","motor":true},{"modelName":"RS RS Zest","manufacturingYear":2020,"price":59999,"sailboat":true,"url":"https://api.boatvertizer.com/catalog/thumbs/small/245079-1598003769.jpg","motor":false},{"modelName":"Solaris Solaris 47","manufacturingYear":2019,"price":2999999,"sailboat":true,"url":"https://api.boatvertizer.com/catalog/thumbs/small/244296-1598000643.jpg","motor":true},{"modelName":"Solaris Solaris 44","manufacturingYear":2016,"price":2499999,"sailboat":true,"url":"https://api.boatvertizer.com/catalog/thumbs/small/193496-1453123841.jpg","motor":true},{"modelName":"Corsair Cruze 970","manufacturingYear":2016,"price":1499999,"sailboat":true,"url":"https://api.boatvertizer.com/catalog/thumbs/small/243658-1598006404.jpg","motor":false},{"modelName":"Corsair Pulse 600","manufacturingYear":2015,"price":1299999,"sailboat":true,"url":"https://api.boatvertizer.com/catalog/thumbs/small/243838-1598006419.jpg","motor":false},{"modelName":"Pius Ticino","manufacturingYear":2013,"price":1659999,"sailboat":true,"url":"https://api.boatvertizer.com/catalog/thumbs/small/9023-1598002083.jpg","motor":false},{"modelName":"Viking Convertible 42","manufacturingYear":2017,"price":8599999,"sailboat":false,"url":"https://api.boatvertizer.com/catalog/thumbs/small/8679-1597997496.jpg","motor":true},{"modelName":"Viking Open 42 SC","manufacturingYear":2016,"price":12599999,"sailboat":false,"url":"https://api.boatvertizer.com/catalog/thumbs/small/192435-1597997583.jpg","motor":true},{"modelName":"Viking Convertible 50","manufacturingYear":2011,"price":9599999,"sailboat":false,"url":"https://api.boatvertizer.com/catalog/thumbs/small/8681-1313136844.jpg","motor":true},{"modelName":"Rio 34 Espera","manufacturingYear":2020,"price":16599999,"sailboat":false,"url":"https://api.boatvertizer.com/catalog/thumbs/small/10162-1597851286.jpg","motor":true},{"modelName":"Rio Sport Coupé 44","manufacturingYear":2020,"price":18999999,"sailboat":false,"url":"https://api.boatvertizer.com/catalog/thumbs/small/245134-1597851326.jpg","motor":true},{"modelName":"J Boats J 80","manufacturingYear":2017,"price":2999999,"sailboat":true,"url":"https://api.boatvertizer.com/catalog/thumbs/small/6357-1309184368.jpg","motor":false},{"modelName":"J Boats J 105","manufacturingYear":2017,"price":1999999,"sailboat":true,"url":"https://api.boatvertizer.com/catalog/thumbs/small/6371-1309184408.jpg","motor":true},{"modelName":"A. Mostes Venere 255","manufacturingYear":2020,"price":20000000,"sailboat":false,"url":"https://api.boatvertizer.com/catalog/thumbs/small/10391-1597850025.jpg","motor":true}]
    MongoClient.connect(url, {useUnifiedTopology:true},
        async (error, client) => {
            if (error){
                callback("'Error! Couldnt connect'");
                return;
            }
            const col = client.db(dbName).collection(collectionName);
            try {
                if(client.db(dbName).collection(collectionName))
                    client.db(dbName).collection(collectionName).drop();
                const result = await col.insertMany(documents);
                callback({
                    result: result.result,
                    ops: result.ops
                })
            } catch(error){
                console.error('Failed to fill Db: ' + error.message);
                callback('"ERROR! query error"');
            } finally{
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
        searchFilter.modelName = { "$regex": `.*${query.word}.*`, '$options': 'i'};
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
    getAllBoats, addBoat, getOneBoat, deleteBoat, editBoat, search, resetDataBase
}