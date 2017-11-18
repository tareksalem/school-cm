//this file for make a functions of uploading profile image and editing the biography

function chooseImg() {
    var uploadImgBtn = document.querySelector(".edit-img-btn");
    var uploadImgInput = document.getElementById("upload-img");
    uploadImgBtn.addEventListener("click", function () {
        uploadImgInput.click()
    });
}
chooseImg();
//function to show the image before loading it
function showImage() {
    var reader = new FileReader();
    var img = document.querySelector(".edit-img");
    var uploadImgInput = document.getElementById("upload-img");
    var formUploadImg = document.getElementById("form-upload-img");
    uploadImgInput.addEventListener("change", function (event) {
        reader.addEventListener("load", function () {
            img.setAttribute("src", reader.result);
        });
        reader.readAsDataURL(event.target.files[0]);
        formUploadImg.submit();
    });
}
showImage();
