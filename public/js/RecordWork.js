window.onload = pageLoad;

function pageLoad()
{   
    document.getElementById('displayPic').onclick = fileUpload;
    document.getElementById('fileField').onchange = fileSubmit;   
    getData();

    showImg('img/'+getCookie('img'));
}

async function getData() {
    try {
        const response = await fetch('/showDataresume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // ตรวจสอบว่าคุณต้องการส่งข้อมูลอื่น ๆ ไปพร้อมกับคำขอหรือไม่
        });

        if (response.ok) {
            const data = await response.json();
            var keys = Object.keys(data);
              
            document.getElementsByName("profileInfo")[0].innerText = data[keys[0]]["personal_profile"];
            document.getElementsByName("experienceInfo")[0].innerText = data[keys[0]]["experience"];
            document.getElementsByName("educationInfo")[0].innerText = data[keys[0]]["education_history"];
            document.getElementsByName("skillsInfo")[0].innerText = data[keys[0]]["skills"];
            document.getElementsByName("rewardInfo")[0].innerText = data[keys[0]]["award"];
            
            
            // ตอนนี้ data ควรจะประกอบด้วยอ็อบเจคที่ถูกแปลงมาแล้ว
            // คุณสามารถใช้ข้อมูลนี้ในหน้าเว็บได้
        } else {
            console.error('Server response was not ok.');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
   
}

function fileUpload(){
	document.getElementById('fileField').click();
}

function fileSubmit(){
	document.getElementById('formId').submit();
}

function showImg(filename){
    if (filename !==""){
        var showpic = document.getElementById('displayPic');
        showpic.innerHTML = ""; // Clear existing content
        var temp = document.createElement("img");
        temp.src = filename;
        showpic.appendChild(temp);
    }
}
function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}
