const User = require('../models/users/User');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email:'', password:''};

//incorrect email
if(err.message == 'incorrect email') {
    errors.email = 'that email is not registered';
}
//incorrect password
if(err.message == 'incorrect password') {
    errors.password = 'that password is incorrect';
}

    // duplicate error code
    if(err.code==11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if(err.message.includes('Please enter valid email')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}



const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id},'jwt secret key123', {expiresIn: maxAge});
}





const signup_post = async (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        });
        const createdUser = await user.save();
        if (!createdUser){
            res.status(401).send({
                message: 'Invalid User Data',
            });
        }else{
            res.send({
                _id: createdUser._id,
                email: createdUser.email,
                token: createToken(createdUser),
            });
        }
    }
            

const update_password = async (req,res) => {
    const {id,password} = req.body;
    console.log("trying to change password",req.body);
    const salt = await bcrypt.genSalt();
    let passwordNew = await bcrypt.hash(password, salt);
    console.log(req.body,passwordNew);
    try {
        mongoose.connect(process.env.MONGO_URI).then(async()=> {
            let password = passwordNew;
            const user = await User.findOneAndUpdate({_id:id},{password}, {new: true});
                
            res.status(200).json({user: {email: user.email}, status: 'password changed!!!'});
            
        }).catch(e=>new Error(e));

        // after creating a new user
        // create a jwt and send it in a cookie
        
        // 
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json(errors);
    }
}

const login_post = async(req, res) => {
    const {email,password} = req.body;
    
    try {
        const user = await User.login(email, password);
        // after creating a new user
        // create a jwt and send it in a cookie
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: {email: user.email}, status: 'user logged in'});
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
}


module.exports = {signup_post,login_post,update_password};