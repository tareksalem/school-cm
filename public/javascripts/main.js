// function to make validation of the login form

function validationLoginForm() {
    var loginForm = document.querySelector("#form-login");
    var password = document.querySelector("#form-login input[name=password]");
    var username = document.querySelector("#form-login input[name=username]");
    $(loginForm).on("submit", function (event) {
        if ((username.value == "") || (password.value == "")) {
            event.preventDefault()
        }
    });
}
validationLoginForm();
//end function to make validation of the login form
//function to make validation for reset password form

function validateResetPage() {
    var resetPasswordForm = document.getElementById("resetpassword");
    var password = document.querySelector("#resetpassword input[name=password]");
    var confirmPassword = document.querySelector("#resetpassword input[name=confirmPassword]");
    var groupalerts = document.querySelector(".group-alerts");
    var passwordVal = $(password).val();
    var confirmPasswordVal = $(confirmPassword).val();
    $(resetPasswordForm).on("submit", function (event) {
        if (password.value === "" || confirmPassword.value === "") {
            event.preventDefault();
            groupalerts.style.display = "block";
            var danger = document.createElement("div");
            danger.setAttribute("class", "alert alert-danger");
            danger.textContent = "يرجى ادخال كلمة المرور وتأكيدها"
            $(groupalerts).html(danger);
        }
        if (password.value !== confirmPassword.value) {
            event.preventDefault();
            groupalerts.style.display = "block";
            var danger = document.createElement("div");
            danger.setAttribute("class", "alert alert-danger");
            danger.textContent = "كلمتي المرور غير متطابقتين"
            $(groupalerts).html(danger);
        }

    });
}
validateResetPage();
//function to get the dat

function dateNow() {
    var date_now = document.getElementById("date-now");
    var d = new Date();
    var year = d.getFullYear();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    date_now.innerHTML = ` التاريخ  ${year}-${month}-${day} `;
}
dateNow();
