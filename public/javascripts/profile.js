//function to show the update information button

function updateInfo() {
	var updateInfoForm = document.querySelectorAll("#updateInfoForm input");
	var updateInfoBtn = document.querySelector(".updateInfoBtn");
	for (var i = 0; i < updateInfoForm.length; i++) {
		updateInfoForm[i].addEventListener("change", function () {
			updateInfoBtn.style.display = "block";
		});
	}

}
updateInfo();