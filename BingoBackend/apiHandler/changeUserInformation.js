require('dotenv').config();
const { ObjectId } = require('mongodb');
const databasePromise = require('./databaseConnector.js');


// This function updates the user information. It takes two parameters userId which is unique for every user and the newData which is a javascript Object. Right now, the newData consists of firstName, LastName, email and phone number. For a first time user, there might not be the phone number depending on what we are asking in the signup form, if there is not a phone number field, it upsers the phone number.The functions returns true only if we successfully update the information else, it will return some string with relevant unsuccessful messages.
async function updateUsesrInformation(userId,newData) {
    try {
        const database = await databasePromise;
		const collection =  database.collection('users');
        // you might consider checking for the spaces as well as it can be still a string with non 0 length. This case is not handled here for now. Also case for the appropriate phone number and emails.
        if(newData.firstName.length ===0) {
            return "First Name can not be empty!";
        }
        else if(newData.lastName.length ===0) {
            return "Last Name can not be empty!";
        }
        else if(newData.userName.length ===0) {
            return "First Name can not be empty";
        }
        // phone can be in number. Be sure to convert it into proper string so that the length does not equal undefined
        else if(newData.phone.toString().length ===0) {
            return "Phone number can not be empty";
        }
        else {
            await collection.updateOne({_id:ObjectId(userId)},
            {$set:{
                    firstName: newData.firstName,
                    lastName: newData.lastName,
                    userName: newData.userName,
                    phone:newData.phone
                }
            });
            return true;    
        }

    }
    catch (error) {
        console.error(error);
        return "Error Occurred in updating the information. Please try again!"
    }
};
module.exports = {updateUsesrInformation};