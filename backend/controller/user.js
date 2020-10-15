const User = require('../models/user.js')
const expressJwt = require('express-jwt')
const _ = require('lodash')
const { OAth2Client } = require('google-auth-library')
const fetch = require('node-fetch')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { errorHandler } = require('../helpers/dbErrorHandling.js')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

const requireSignin = expressJwt({
    secret: process.env.JWT_SECRET, // req.user._id
    algorithms: ['HS256'],
    getToken: function fromCookie (req) {
        var token = req.cookies.access_token || req.body.access_token || req.query.access_token || req.headers['x-access-token'] ;
        if (token) {
          return token;
        } 
        return null;
      }
  });


const registerUser = (req, res) => {
    const { name, email, password } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        User.findOne({ email })
            .exec((err, user) => {
                if (user) {
                    return res.status(400).json({
                        error: "Email is taken"
                    })
                }
            })
        const token = jwt.sign({
            name,
            email,
            password
        },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: "15m"
            }
        )
        //activate LESSSECUREAPPS on gmail first
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.PASSWORD
            }
        })
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Account actication link",
            html: `
                <h1>Please Click th link to activate your account</h1>
                <a href="${process.env.CLIENT_URL}/activate/${token}">${process.env.CLIENT_URL}/activate/${token}</a>
                <hr/>
                <p>This email contains sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
                `
        }
        transporter.sendMail(emailData).then(sent => {
            return res.json({
                message: "Email verification sent!"
            })
        }).catch(err => {
            return res.status(400).json({
                error: errorHandler(err)
            })
        })
    }
}

const activateAccount = (req, res) => {
    const { token } = req.body;

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
            if (err) {
                console.log('Activation error');
                return res.status(401).json({
                    errors: 'Expired link. Signup again' + err
                });
            } else {
                const { name, email, password } = jwt.decode(token);

                const user = new User({
                    name,
                    email,
                    password
                });

                user.save((err, user) => {
                    if (err) {
                        console.log('Save error', errorHandler(err));
                        return res.status(401).json({
                            errors: errorHandler(err)
                        });
                    } else {
                        return res.json({
                            success: true,
                            message: user,
                            message: 'Account verified! You can now login.'
                        });
                    }
                });
            }
        });
    } else {
        return res.json({
            message: 'error happening please try again'
        });
    }
}

const login = (req, res) => {
    const { email, password } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        User.findOne({
            email
        }).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "User with this email does not exist. Please sign up!"
                })
            }
            //authentication
            if (!user.authenticate(password)) {
                return res.status(400).json({
                    error: "Wrong email or password"
                })
            }
            //generate token
            const token = jwt.sign(
                {
                    _id: user._id,
                }, process.env.JWT_SECRET,
                {
                    expiresIn: "7d" //token valid for 7 days
                }
            )

            const { _id, name, email, role } = user
            return res.json({
                token,
                user: {
                    _id,
                    name,
                    email,
                    role
                }
            })
        })
    }
}

const forgotPassword = (req, res) => {
    const { email } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        //Check if user exists
        User.findOne({ email }, (err, user) => {
            console.log(user)
            if (err || !user) {
                return res.status(400).json({
                    error: "Email does not exist"
                })
            }
            //if user exists, generate token
            const token = jwt.sign({
                _id: user._id
            },
                process.env.JWT_RESET_PASSWORD,
                {
                    expiresIn: "10m"
                })
            //send email with this token
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_FROM,
                    pass: process.env.PASSWORD
                }
            })
            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Password reset link",
                html: `
                        <h1>Please Click the link to reset your password</h1>
                        <a href="${process.env.CLIENT_URL}/password/reset/${token}">${process.env.CLIENT_URL}/activate/${token}</a>
                        <hr/>
                        <p>This email contains sensetive information</p>
                        <p>${process.env.CLIENT_URL}</p>
                        `
            }

            return user.updateOne({
                resetPasswordLink: token
            }, (err, success) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                } else {
                    console.log(user.resetPasswordLink)
                    transporter.sendMail(emailData).then(sent => {
                        return res.json({
                            message: `Email sent to ${email}!`
                        })
                    }).catch(err => {
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    })
                }
            })
        })
    }
}


const resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        if (resetPasswordLink) {
            jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (err, decoded) {
                if (err) {
                    return res.status(400).json({
                        error: 'Expired link. Try again'
                    });
                }

                User.findOne({ resetPasswordLink }, (err, user) => {
                    console.log(user)
                    if (err || !user) {
                        return res.status(400).json({
                            error: 'Something went wrong. Try later'
                        });
                    }

                    const updatedFields = {
                        password: newPassword,
                        resetPasswordLink: ''
                    };

                    user = _.extend(user, updatedFields);

                    user.save((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: 'Error resetting user password'
                            });
                        }
                        res.json({
                            message: `Great! Now you can login with your new password`
                        });
                    });
                });
            });
        }
    }
}

const getUsers = (req, res) => {
    User.find()
        .then(user => res.json(user))
        .catch(err => res.status(404).json("ERROR: " + err))
}

const getUser = (req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(404).json("ERROR: " + err))
}

const deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => res.json(user._id + " deleted!"))
        .catch(err => res.status(404).json("ERROR: " + err))
}

const updateUser = (req, res) => {
    User.findByIdAndUpdate(req.params.id)
        .then(user => {
            console.log(user.token)
            user.name = req.body.name,
                user.email = req.body.email,
                user.avatar = req.body.avatar,
                user.role = req.body.role,
                user.save()
                    .then(user => res.json(user._id + " updated!"))
                    .catch(err => res.status(400).json("ERROR: " + err))
        })
        .catch(err => res.status(404).json("ERROR: " + err))
}

module.exports = { requireSignin, registerUser, activateAccount, login, forgotPassword, resetPassword, getUsers, getUser, deleteUser, updateUser }