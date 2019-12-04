const User = require('../models/user');
const shortId = require('shortid');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const bcrypt = require('bcryptjs');

exports.signup = (req,res) => {
    const {name,email,password} = req.body
    User.findOne({email}).exec((err, user) => {
        if(user){
            return res.status(400).json({error: "Email is already taken"});
        }
        let username = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;

        let newUser = new User({name,email,password,profile,username});

        const salt =  bcrypt.genSaltSync(10);
        newUser.password = bcrypt.hashSync(password, salt)

        newUser.save((err, success) => {
            if(err){
                return res.status(400).json({error: err})
            }
            res.json({message: "Signup Success! Please Sign in."})
        })

    })
}

exports.signin = (req,res) => {
    const {email,password} = req.body;
    //check if user exist
    User.findOne({email}).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({error: "User with that email does not exist. Please Sign Up"});
        }
        // authenticate
        const isMatch = bcrypt.compareSync(password, user.password);
        if(!isMatch){
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        //generate a token and send to client
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        res.cookie("token", token, {expiresIn: "1d"});
        const {_id, username,name,email,role}=user;
        return res.json({
            token,
            user:{_id, username,name,email,role}
        })
    })
}