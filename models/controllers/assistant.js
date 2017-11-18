const mongoose = require("mongoose");
mongoose.connect("mongodb://tarek:tareksalem1@ds159235.mlab.com:59235/mongotarek");
//mongoose.connect("localhost:27017/school");
var bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

var assistantSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    passwordResetToken: {type: String, default: ""},
    passwordResetExpires: {type: String, default: Date.now},
    confirmPassword: {type: String},
    userimage: {type: String},
    userBiography: {type: String},
    email: {type: String}
});
assistantSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
assistantSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

var Assistant = module.exports = mongoose.model("assistant", assistantSchema, "controllers");
