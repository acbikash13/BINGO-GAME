
//used to generate the bcrypt salt
const bcrypt=require('bcrypt')

function generateSalt(){
	console.log(bcrypt.genSaltSync())
}

generateSalt()