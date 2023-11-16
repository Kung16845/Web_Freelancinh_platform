const express = require('express');
const app = express();
const fs = require('fs');

const hostname = 'localhost';
const port = 3000;
const mysql = require('mysql');

const multer = require('multer');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

const path = require('path');
const { count, Console } = require('console');

const jobsFilePath = path.join(__dirname, './public/jobs.json');
const jobs = require(jobsFilePath);

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/img/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = (req, file, cb) => {
    // Accept images only

    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ktn_website_find_works"
})

con.connect(err => {
    if (err) throw (err);
    else {
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve, reject) => {
        // query method
        con.query(sql, (err, result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post('/regisDB', async (req, res) => {
    let sql = "CREATE TABLE IF NOT EXISTS Userdatabase (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(100),password VARCHAR(100),name VARCHAR(100),surname VARCHAR(100),phonenumber VARCHAR(10),img VARCHAR(100))";
    let result = await queryDB(sql);

    sql = `SELECT email , password ,img FROM Userdatabase WHERE email = '${req.body.email}'`;
    result = await queryDB(sql);

    if (result.length === 0) {
        if (req.body.password === req.body.repassword) {
            sql = `INSERT INTO Userdatabase (email, password ,name,surname,phonenumber,img) VALUES ("${req.body.email}", "${req.body.password}" , "${req.body.name}" , "${req.body.surname}" ,"${req.body.phonenumber}" ,"avatar.png")`;
            result = await queryDB(sql);
            console.log("New record created successfullyone");
            return res.redirect("login.html");
        }
    }

})

app.post('/checkLogin', async (req, res) => {

    let { email, password } = req.body;

    let sql = `SELECT email,name,surname, phonenumber, password ,img FROM Userdatabase WHERE email = '${email}' AND password = '${password}'`;
    let result = await queryDB(sql);

    if (result.length !== 0) {
        res.cookie('email', email);
        res.cookie('name', result[0].name);
        res.cookie('surname', result[0].surname);
        res.cookie('idjob',);
        // res.cookie('phonenumber', result[0].phonenumber );
        res.cookie('img', result[0].img);
        return res.redirect("profile.html");

    }
    else {

        return res.redirect('login.html?error=1');
    }

})
const upload = multer({ storage: storage, fileFilter: imageFilter });
//ทำให้สมบูรณ์
app.post('/profilepic', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.redirect('resume.html?error=1');
    }

    const email = req.cookies.email;

    updateImg(email, req.file.filename);

    res.cookie('img', req.file.filename);

    return res.redirect('resume.html');
})

const updateImg = async (email, filen) => {

    let sql = `UPDATE Userdatabase SET img = '${filen}' WHERE email = '${email}'`
    let result = await queryDB(sql);

};

app.post('/profile', async (req, res) => {
    res.redirect("profile.html");

})

app.post('/resume', async (req, res) => {
    res.redirect("resume.html");

})
app.post('/RecordWork', async (req, res) => {
    res.redirect("Recordwork.html");

})
app.post('/logout',async (req,res) => 
{   
    res.clearCookie("email");
    res.clearCookie("name");
    res.clearCookie("surname");
    res.clearCookie("idjob");
    res.clearCookie("img");
    res.redirect("index.html");
})

app.post('/showDataProfile', express.json(), async (req, res) => {

    let email = req.cookies.email;
    // console.log(email);
    let sql = `SELECT email , name,surname,phonenumber ,img FROM Userdatabase WHERE email = '${email}'`;
    let result = await queryDB(sql);
    result = result.map(row => Object.assign({}, row));
    // console.log(result);
    res.json(result);
})

app.post('/resumeDB', async (req, res) => {
    let sql = "CREATE TABLE IF NOT EXISTS resume (email VARCHAR(100),personal_profile TEXT,experience TEXT,education_history TEXT,skills TEXT,award TEXT)";
    let result = await queryDB(sql);

    let email = req.cookies.email;
    sql = `SELECT email,personal_profile,experience,education_history,skills,award FROM resume WHERE email = '${email}'`;
    result = await queryDB(sql);

    if (result.length === 0) {
        sql = `INSERT INTO resume (email, personal_profile, experience, education_history, skills, award) VALUES ("${email}", "${req.body.profileInfo}", "${req.body.experienceInfo}", "${req.body.educationInfo}", "${req.body.skillsInfo}", "${req.body.rewardInfo}")`;
        result = await queryDB(sql);
    } else {
        // แก้ไข SQL UPDATE statement ตรงนี้
        sql = `UPDATE resume SET personal_profile = '${req.body.profileInfo}', experience = "${req.body.experienceInfo}", education_history = "${req.body.educationInfo}", skills = "${req.body.skillsInfo}", award = "${req.body.rewardInfo}" WHERE email = '${email}'`;
        result = await queryDB(sql);
    }

    return res.redirect("resume.html");
});


app.post('/showDataresume', express.json(), async (req, res) => {
    try {
        let email = req.cookies.email;
        let sql = `SELECT personal_profile, experience, education_history, skills, award FROM resume WHERE email = '${email}'`;
        let result = await queryDB(sql);

        result = result.map(row => Object.assign({}, row));
        // console.log(result);
        res.json(result);
    } catch (error) {
        console.error('Error while querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/readPost', async (req, res) => {
    let sql = "CREATE TABLE IF NOT EXISTS postjob (idjob INT(11),name VARCHAR(255),surname VARCHAR(255),post VARCHAR(255))";
    let result = await queryDB(sql);
    let idjob = req.cookies.idjob;
    sql = `SELECT name,surname,post from postjob WHERE idjob = '${idjob}'`;
    result = await queryDB(sql);
    res.json(result);

})

app.post('/writePost', async (req, res) => {
    let sql = "CREATE TABLE IF NOT EXISTS postjob (idjob INT(11),name VARCHAR(255),surname VARCHAR(255),post VARCHAR(255))";
    let result = await queryDB(sql);
    let name = req.cookies.name;
    let surname = req.cookies.surname;
    let idjob = req.cookies.idjob;
    sql = `INSERT INTO postjob (idjob,name,surname,post ) VALUES ( "${idjob}","${name}","${surname}", "${req.body.message}" )`;
    result = await queryDB(sql);
    res.json(result);

})

app.post('/saveJobId', express.json(), async (req, res) => {
    try {
        const { email, jobId } = req.body;

        // Decode the email
        const decodedEmail = decodeURIComponent(email);

        // Check if the decoded email exists in the SavedJobs table
        const checkEmailSql = `SELECT savedJobIds FROM SavedJobs WHERE email = '${decodedEmail}'`;
        const result = await queryDB(checkEmailSql);

        let savedJobIds = result.length > 0 ? JSON.parse(result[0].savedJobIds) : [];

        // Ensure savedJobIds is an array
        if (!Array.isArray(savedJobIds)) {
            savedJobIds = [];
        }

        // Check if jobId is already in savedJobIds
        if (!savedJobIds.includes(jobId)) {
            // If not present, add the new job ID to the array
            savedJobIds.push(jobId);

            if (result.length > 0) {
                // If the decoded email exists, update the saved job IDs
                const updateSql = `UPDATE SavedJobs SET savedJobIds = '${JSON.stringify(savedJobIds)}' WHERE email = '${decodedEmail}'`;
                await queryDB(updateSql);
            } else {
                // If the decoded email doesn't exist, insert a new row
                const insertSql = `INSERT INTO SavedJobs (email, savedJobIds) VALUES ('${decodedEmail}', '${JSON.stringify(savedJobIds)}')`;
                await queryDB(insertSql);
            }

            res.json({ success: true, message: 'Job ID saved successfully' });
        } else {
            res.json({ success: false, message: 'Job ID already saved' });
        }
    } catch (error) {
        console.error('Error saving job ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Modify this route in server.js
app.get('/getRecordedJobs', express.json(), async (req, res) => {
    try {
        const email = req.cookies.email;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        // Decode the email
        const decodedEmail = decodeURIComponent(email);

        // Fetch the saved job IDs from the SavedJobs table
        const sql = `SELECT savedJobIds FROM SavedJobs WHERE email = '${decodedEmail}'`;
        const result = await queryDB(sql);

        if (result.length > 0) {
            const savedJobIds = JSON.parse(result[0].savedJobIds);

            if (savedJobIds.length > 0) {
                // Fetch job details for the saved job IDs
                const recordedJobs = jobs.filter(job => savedJobIds.includes(String(job.id)));
                res.json(recordedJobs);
            } else {
                res.json({ message: 'No recorded jobs found.' });
            }
        } else {
            res.json({ message: 'No recorded jobs found.' });
        }
    } catch (error) {
        console.error('Error fetching recorded jobs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(port, hostname, () => {
    
    console.log(`Server running at   http://${hostname}:${port}/index.html`);
});