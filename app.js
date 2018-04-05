/*
* Controller file used to call and implement REST API functionality based on url provided
* @Version 1.0
* @author Nikita Bahl
*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');
var cors = require('cors');
var path = require('path');
User = require('./models/user');

mongoose.connect('mongodb://mongo:27017/userInformation');
var db = mongoose.connection;

/*
* Checking the connection
*/
db.on('error', console.error.bind(console, 'MongoDB Connection Error'));
db.once('open', function(){
	console.log('Connected to MongoDB!');
});


app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('etag');

/*
* REST API 'get' method to open home page
*/
app.get('/', (req, res) => {
	res.render('index');
});

/*
* REST API 'get' method to open home page from http://localhost:8000/index
*/
app.get('/index', (req, res) => {
	res.render('index');
});

/*
* REST API 'get' method to display all users
*/
app.get('/users', (req, res) => {
	User.getUsers((err, users) => {
		if(err)
		{
			throw err;
		}
		res.render('allUsers',{ "users": users });
		//res.json({ "users": users });
	});
});

/*
* REST API 'get' method to show a specific user information or show error 404 if not found
*/
app.get('/users/:username', (req, res) => {
	User.getUserByName(req.params.username, (err, user) => {
		if(err){
			throw err;
		}
		if(!user){
			res.render('notFoundUser');
		}
		else {
      res.render('displayUser',{ "user": user });
			//res.json(user);
		}
	});
});

/*
* REST API 'get' method to open display page where user can enter a username and fetch a record
*/
app.get('/display', (req, res) => {
      res.render('display');
	});

/*
* REST API 'post' method to add a user
*/
app.post('/users/:username', (req, res) => {
   User.addUser(req.body, (err, user) => {
		var response = {statusCode: 409, message: "User already exists!!"};
    if(err) {
      var error = new Error('Already exists!');
      error.status = 409;
			res.status(409);
			res.send(response);
    }
	  else {
			response.statusCode = 200;
		  response.message = "Successfully Added the User!!!";
		  res.status(200);
		  res.send(response);
	  }
	});
});

/*
* REST API 'delete' method to delete a user
*/
app.delete('/users/:username', (req, res) => {
    User.removeUser(req.params.username, (err, user) => {
		var response = {statusCode: 404, message: "User doesn't exist!!!"};
    if(err) {
			var error = new Error('Does not exist!');
      error.status = 404;
		  res.status(404);
			res.send(response);
    }
	  else {
			response.statusCode = 200;
			response.message = "Successfully Deleted the User!!!";
			res.status(200);
			res.send(response);
	  }
	});
});

/*
* REST API 'get' method to load the delete user view
*/
app.get('/delete', (req, res) => {
  res.render('delete');
	});

/*
* REST API 'get' method to load the add user view
*/
app.get('/add',(req,res) => {
	res.render('add');
});

app.listen(8000);
console.log('Running on port 8000');
