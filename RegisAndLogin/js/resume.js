window.onload = pageLoad;

function pageLoad()
{      
    // alert('หน้าเว็บโหลดเสร็จสมบูรณ์!');
    getData();
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
            if (data[keys[0]]["img"]) {
                document.getElementById('profileImage').src = 'img/' + data[keys[0]]["img"];
            }
              
            document.getElementById("name").innerText = data[keys[0]]["name"];
            document.getElementById("surname").innerText = data[keys[0]]["surname"];
            document.getElementById("email").innerText = data[keys[0]]["email"];
            document.getElementById("phonenumber").innerText = data[keys[0]]["phonenumber"];
            
            
            // ตอนนี้ data ควรจะประกอบด้วยอ็อบเจคที่ถูกแปลงมาแล้ว
            // คุณสามารถใช้ข้อมูลนี้ในหน้าเว็บได้
        } else {
            console.error('Server response was not ok.');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
   
}


