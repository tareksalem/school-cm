//function to initialize the calendar
window.addEventListener('load', function () {
  vanillacalendar.init();
})
//function to get time of the spicified date
function getDate() {
	var datePicker = document.getElementById("date-picker");
	var eventdate = document.querySelector(".form-calendar input[name=eventdate]");
	console.log(eventdate)
	document.querySelector(".cal").addEventListener("click", function () {
		console.log(datePicker.textContent);
		eventdate.value = datePicker.textContent;
	});
}
getDate();

//function to submit adding the event
function addingEvent() {
	var addEvent = document.getElementById("addEvent");
	var calendarForm = document.querySelector(".form-calendar");
	var submitForm = document.querySelector(".form-calendar input[type=submit]");
	addEvent.addEventListener("click", function () {
		submitForm.click();
	});
}
addingEvent()
//function to check if the fields doesn't empty
function validateForm() {
	var eventdate = document.querySelector(".form-calendar input[name=eventdate]");
	var eventname = document.querySelector(".form-calendar input[name=eventname]");
	var calendarForm = document.querySelector(".form-calendar");
	calendarForm.addEventListener("submit", function (event) {
		if ((eventdate.value == "") || (eventname.value == "")) {
			event.preventDefault();
			alert("من فضلك أدخل البيانات المطلوبة");
		}
	});
}
validateForm();