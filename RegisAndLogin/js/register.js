window.onload = pageLoad;



function pageLoad() {
    var registerForm = document.getElementById("myForm");
    registerForm.onsubmit = validateForm;
}

async function validateForm() {
    var errMsg = document.getElementById("errordisplay");
    var password = document.forms["myForm"]["password"].value;
    var repassword = document.forms["myForm"]["repassword"].value;
    
    if (password != repassword) {
        errMsg.innerText = "Passwords do not match.";
        return;
    } 
    else 
    {
        errMsg.innerText = "Email already in use.";
        return;
    }

}