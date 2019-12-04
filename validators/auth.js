const {check} = require('express-validator');

exports.userSignUpValidator = [
    check("name")
        .not()
        .isEmpty()
        .withMessage("Name is Required"),
    check("email")
    .isEmail()
    .withMessage("Must be a valid E-mail address"),
    check("password")
        .isLength({min: 6})
        .withMessage("Password Must be at least 6 Characters long")
];

exports.userSignInValidator = [
    check("email")
        .isEmail()
        .withMessage("Must be a valid E-mail Address"),
    check("password")
        .isLength({min: 6})
        .withMessage("Password Must be at least 6 characters long")
]