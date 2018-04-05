/*
* This model file contains all the Schema information along with methods that directly interact with MongoDB
* @Version 1.0
* @author Nikita Bahl
*/

const mongoose = require('mongoose');

/* User Schema for the application */
const userSchema = mongoose.Schema({
  username:{
		type: String
	},
	displayName:{
		type: String
  },
  department:{
    type: String
  }
});

/* Constants defined for model which can be found globally */
const User = module.exports = mongoose.model('User', userSchema);

/*
* getUsers method uses the find() command in mongoDB to get all users that exist
*/
module.exports.getUsers = (callback, limit) => {
  var usersProjection = {
        __v: false,
        _id: false,
    };
	User.find({}, usersProjection, callback).limit(limit);
}

/*
* getUserByName method uses the findOne() command in mongoDB to get a specific user
* It tries to find a record in the database using the username provided as a parameter
*/
module.exports.getUserByName = (user, callback) => {
  var usersProjection = {
        __v: false,
        _id: false,
        username: false
    };
	User.findOne({username: user}, usersProjection, callback);
}

/*
* addUser method creates a user, if it does not exist in the database.
* It returns an error of 'Name exists already' if the user already exists in the database
*/
module.exports.addUser = function(user, callback) {
  var usersProjection = {
        __v: false,
        _id: false,
        username: false
    };
  User.find({username : user.username}, usersProjection).exec(function(err, result) {
    if (result.length){
      callback('Name exists already', null);
    } else {
        if(user.displayName != "" && user.department != "")
        {
          console.log("user created")
        	User.create(user, callback);
        }
    }
  });
}

/*
* removeUser method removes a user, if it exists in the database.
* It returns an error of 'Name does not exists' if the user is not in the database
*/
module.exports.removeUser = function(user, callback) {
  User.find({username : user}).exec(function(err, result) {
   if (result.length){
      console.log(result);
        console.log("deleting user");
        var query = {username: user};
       	User.remove(query, callback);
    }
    else {
      console.log("not found user")
      callback('Name does not exist', null);
    }
  });
}
