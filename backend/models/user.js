const mongoose = require('mongoose')
const crypto = require('crypto')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    avatar: {
        type: String,
        default: "uploads/userdefault.jpg"
    },
    role: {
        type: Number,
        default: 0,
        required: true
    },
    cart: {
        type: Array,
        default: []
    },
    resetPasswordLink: {
        data: String,
        default: ""
    },
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
},
{timeStamp: true}
)

UserSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

UserSchema.methods = {
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random() + "")
    },
    encryptPassword: function (password) {
        if(!password) return ""
        try{
            return crypto
            .createHmac("sha1", this.salt)
            .update(password)
            .digest('hex')
        }catch(err){
            return ""
        }
    },
    authenticate: function (plainPassword){
        return this.encryptPassword(plainPassword) === this.hashed_password
    },
}


module.exports = mongoose.model("User", UserSchema)