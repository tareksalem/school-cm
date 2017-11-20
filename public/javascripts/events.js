//function to click on upload image btn
function uploadImg(uploadimgBtn, eventimage) {
	$(uploadimgBtn).on("click", function () {
		$(this).parent().find(eventimage).click();
	});
}
uploadImg($(".uploadimgBtn"), $(".addeventimage"));
//uploadImg($(".uploadimgBtn"), $(".form-event input[name=eventimage]"));
//end upload image function
function showImage(img, uploadImgInput) {
    var reader = new FileReader();
    $(uploadImgInput).on("change", function (event, thiss) {
        thiss = this;
        console.log(this);
    	reader.addEventListener("load", function () {
            $(thiss).parents(".form-event").find(img).attr("src", reader.result);
    		console.log(event.target);
		});
        reader.readAsDataURL(event.target.files[0])
	});

}

showImage($(".edit-img"), $(".addeventimage"));
//end showimage function
//function to submit adding the event
function addingEvent() {
	var addEvent = document.getElementById("addEvent");
	var calendarForm = document.querySelector(".form-calendar");
	var submitForm = document.querySelector(".form-calendar input[type=submit]");
	addEvent.addEventListener("click", function () {
		submitForm.click();
	});
}
addingEvent();
//function to check if the fields doesn't empty
function validateForm(eventdate, eventdate, img, calendarForm) {
	calendarForm.addEventListener("submit", function (event) {
		if ((eventdate.value == "") || (eventname.value == "") || (img.src == "")) {
			event.preventDefault();
			alert("من فضلك أدخل البيانات المطلوبة");
		}
	});
}
validateForm(document.querySelector(".form-calendar input[name=eventdate]"), document.querySelector(".form-calendar input[name=eventname]"), document.querySelector(".edit-img"), document.querySelector(".form-calendar"));

validateForm(document.querySelector(".eventdate"), document.querySelector(".eventname"), document.querySelectorAll(".edit-img")[1], document.getElementById("editForm"));

//function to make a toggle container for editing the event
function editingEvent() {
	$(".edit-form-btn").on("click", function () {
		$(this).parents(".container-loop-events").children(".container-form-edit-event").slideToggle(500);
    });
}
editingEvent();


