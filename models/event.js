const mongoose = require("mongoose");
mongoose.connect("mongodb://tarek:tareksalem1@ds159235.mlab.com:59235/mongotarek");
//mongoose.connect("localhost:27017/school");
const Schema = mongoose.Schema;

var eventSchema = new Schema({
	eventname: {type: String, required: true},
	eventdate : {type: String, required: true},
	eventimage: {type: String, required: true}
});

var event = module.exports = mongoose.model("event", eventSchema, "infos");