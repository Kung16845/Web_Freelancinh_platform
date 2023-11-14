window.onload = pageLoad;

function pageLoad()
{      
    alert('หน้าเว็บโหลดเสร็จสมบูรณ์!');
    getData();
}

async function getData()
{   
    // alert('เริ่ม getData ');
    // try {
    //     const response = await fetch('/showDataProfile');
    //     alert('จบ await fetch ');

    //     console.log(response);

    //     const content = await response.json();
    //     console.log('getData เสร็จสมบูรณ์!');
    //     console.log(content);
    //     alert('getData เสร็จสมบูรณ์!');
    // } catch (error) {
    //     console.error('เกิดข้อผิดพลาด:', error);
    // }
    try {
        const response = await fetch('/showDataProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        
        if (response.ok) {
            const content = await response.json();
            console.log(content);
            console.log('getData เสร็จสมบูรณ์!');
            alert('getData เสร็จสมบูรณ์!');
        } else {
            console.error('การเรียก fetch ไม่สำเร็จ:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการ fetch:', error);
    }
}