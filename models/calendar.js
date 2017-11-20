const mongoose = require("mongoose");
mongoose.connect("mongodb://tarek:tareksalem1@ds159235.mlab.com:59235/mongotarek");
//mongoose.connect("localhost:27017/school");
const Schema = mongoose.Schema;

var calendarSchema = new Schema({
	eventname: {type: String, required: true},
	eventdate : {type: Date, required: true}
});

var Calendar = module.exports = mongoose.model("calendar", calendarSchema, "infos");