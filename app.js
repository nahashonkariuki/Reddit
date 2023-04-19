// import libraries
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./router/router");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const user = require('./models/users/User');
// initialise express
const app = express();

// initialise global variables
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());

// serve static files

app.use(express.static(__dirname+'/public'));

// ports and mongo
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const start = (port,mongo_uri) => {
    try {
        mongoose.connect(mongo_uri).then(()=> {
            app.listen(port, () => {
                console.log("server running on port: "+`http://localhost:${port}`);
            });
        }).catch((e)=>new Error(e));
    } catch (error) {
        throw new Error(error);
    }
}

start(PORT,MONGO_URI);


/// serve basic routes

app.get('/',(req,res)=> {
    try {
        res.sendFile(__dirname+'/public/index.html');
    } catch (error) {
        throw new Error(error);
    }
});
const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;

    // check json jwt exists & is verified
    if(token) {
        jwt.verify(token,'jwt secret key123', (err, decodedToken) => {
            if(err) {
                res.redirect('/');
                console.log(err.message);
            }else {
                console.log(decodedToken);
                next();
            }
        });
    }else {
        res.redirect('/');
    }  
}
app.get('/getloggedinuser',requireAuth, (req,res)=> {
    try {
        const token = req.cookies.jwt;
        jwt.verify(token,'jwt secret key123', async (err, decodedToken) => {
            if(err) {
                res.status(404).json({status: "resource not found"});
                console.log(err.message);
            }else {
                console.log("loggin current users");
                let currentUserId = decodedToken[Object.keys(decodedToken)[0]];
                // email
                await mongoose.connect(process.env.MONGO_URI).then(async ()=> {
                    await user.findOne({_id: currentUserId}).then(d=> {
                    res.status(200).json({id: d._id.toString(),email: d.email});
                })
                });
            }
        });
    } catch (error) {
        throw new Error(error);
    }
});
app.get('/landingpage',requireAuth,(req,res)=> {
    try {
        console.log("sending landingpage");
        res.sendFile(__dirname+'/public/secretPage.html');
    } catch (error) {
        throw new Error(error);
    }
});

app.get('/logout',(req,res)=> {
    res.cookie('jwt',' ', {maxAge: 1});
    res.redirect('/');
});
// import service routers

app.use('/api',router);
