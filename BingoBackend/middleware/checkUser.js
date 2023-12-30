const databasePromise = require('../apiHandler/databaseConnector');

// checkUser functions returns the userId if the user is authorized
// if the user is not authorized, it returns false.
// it checks whether the user is valid or not based on the jtw token we get from the client.

async function checkUser(token) {
    const database = await databasePromise;
	const collection =  database.collection('users');
    let result  = await  collection.find({jwt:token},{_id:1}).toArray();
    if(result.length > 0) {
        // user is authorized. Return the user's ID.
        return result[0]._id.toString().replace('New ObjectId("','').replace('")','');
    }
    else {
        return false;
        //user is not registered
        // return res.status(401).json({ message: 'User is not authorized' }); 
    }
}

module.exports = checkUser;