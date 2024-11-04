require('dotenv').config();
const salt =  process.env.BCRYPT_SALT;
const jwtExpiration = process.env.JWT_EXPIRATION;
const jwtsalt = process.env.JWT_SALT;

//login controller
const databasePromise = require('./databaseConnector.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
async function login(req,res)  {

	// get the user credentials
	const user =  {
		userName: req.body.userName,
		password: req.body.password
	}
	try {
		const database = await databasePromise;
		const collection =  database.collection('users'); 

		// check if the user is registered
		collection.find({userName:user.userName},{_id:1,userName:1,password:1}).toArray(async function(err,result){
			if (err) throw err;
			if(result.length == 0) {
				console.log("user is " + user)
				res.status(406).json({message:'User is not registered'})
			}
			//user is registered
			else {
				// validates the password. if wrong
				if(result[0].password != bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')) {
					return res.status(406).json({message:'Wrong Password'});
				}
				// if right, generate a jwt token and send it to the client
				else {
					userId =  result[0]._id.toString().replace('New ObjectId("','').replace('")','');
					let token = jwt.sign({id:userId},jwtsalt,{expiresIn:jwtExpiration});
					await collection.updateOne({_id:ObjectId(userId)},{$set:{jwt:token}});
					res.status(200).header('Authorization',`Bearer ${token}`).json({message:'User Authenticated'});
				
				}
			}
		})
	  } catch (error) {
		console.error('Error connecting to the database:', error);
		res.status(500).json({message: 'Internal Server Error!'});
	  }
};

async function signup(userInfo){
	const firstName = userInfo.firstName;
	const lastName = userInfo.lastName;
	const userName = userInfo.userName;
	const password = userInfo.password;

	const user = {
		firstName: firstName,
		lastName: lastName,
		userName: userName,
		password: password
	};
	try{
		const database = await databasePromise;
		const collection = await database.collection('users');
		const result = await collection.find({userName: user.userName}, {userName: 1}).toArray();
		if (result.length > 0) {
			return {status: 406, message: 'User already exists with the same username'};
		} else {
			user.password = bcrypt.hashSync(user.password, salt).replace(`${salt}.`, '');
			await collection.insertOne(user);
			return {status: 201, message: 'User has been successfully created!'};
		}
	}
	catch (error) {
		console.error('Error connecting to the database: ', error);
	}
}

async function logout(jwtToken) {
	try {
		const database = await databasePromise;
		const collection =  database.collection('users');
		collection.updateOne({jwt:jwtToken},{$set:{jwt:''}});
		return true;
	}
	catch (error) {
		console.error('Error connecting to the database: ', error);
		return false
	}	
}
module.exports = {login,signup,logout};