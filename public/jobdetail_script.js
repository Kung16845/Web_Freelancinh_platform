// jobdetail_script.js
function checkCookie(){
	var email = "";
	if(getCookie("email")==false){
		window.location = "login.html";
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
function updateCookie(name, value, expirationDays) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    const updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;

    document.cookie = updatedCookie;
}

// Function to fetch job details by ID from the server (Node.js)
function fetchJobDetails(jobId, callback) {
    // You would typically make an API call to the server here
    // For simplicity, let's assume the server responds with a JSON array

    // For demonstration purposes, we'll fetch data from the jobs.json file
    fetch('jobs.json')
        .then(response => response.json())
        .then(data => {
            const job = data.find(job => job.id == jobId);
            callback(job);
        })
        .catch(error => console.error('Error fetching job details:', error));
}

// Function to display job details on the page
function displayJobDetails(job) {
    if (!job) {
        console.error('Job not found.');
        return;
    }
    document.getElementById('job-image').src = job.image;
    document.getElementById('job-name').textContent = job.name;
    document.getElementById('job-difficulty').textContent = `Difficulty: ${job.difficulty}`;
    document.getElementById('job-reward').textContent = `Reward: ${job.Reward}`;
    document.getElementById('job-ghost-type').textContent = `Ghost Type: ${job['Ghost type']}`;
    document.getElementById('job-contact-type').textContent = `Contact Type: ${job.type}`;
    document.getElementById('job-moredetail-type').textContent = `More-detail: ${job.moredetail}`
    document.getElementById('job-requirement-type').textContent = `Requirement: ${job.Requirement}`
    document.getElementById('job-Contactus-type').textContent = `Contactus: ${job.Contactus}`
    ;
}

// Extract job ID from the URL query parameters
function getJobIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    
    return urlParams.get('id');
}

// Fetch and display job details when the page is loaded
window.onload = function () {
    document.getElementById('save-button').onclick = checkCookie;
    document.getElementById('postbutton').onclick = getData;

    const jobId = getJobIdFromUrl();
    
    updateCookie('idjob', jobId, 7);
    if (jobId) {
        fetchJobDetails(jobId, job => displayJobDetails(job));
    } else {
        console.error('Job ID not provided in the URL.');
    }
    readPost();
};

function getData(){
	var msg = document.getElementById("textmsg").value;
	document.getElementById("textmsg").value = "";
	writePost(msg);
}

async function writePost(msg){
	const response = await fetch('/writePost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: msg, user: getCookie('name') + getCookie('surname')})
    });

    if (response.status === 200) {
        readPost();
    }
}
async function readPost(){
	const response = await fetch('/readPost');
    const data = await response.json();
	console.log(data);
    if (data && typeof data === 'object') {
        showPost(data);
    }
	
}

function showPost(data){
	var keys = Object.keys(data);
	var divTag = document.getElementById("feed-container");
	divTag.innerHTML = "";
	for (var i = keys.length-1; i >=0 ; i--) {

		var temp = document.createElement("div");
		temp.className = "newsfeed";
		divTag.appendChild(temp);
		var temp1 = document.createElement("div");
		temp1.className = "postmsg";
		temp1.innerHTML = data[keys[i]]["post"];
		temp.appendChild(temp1);
		var temp1 = document.createElement("div");
		temp1.className = "postuser";
		
		temp1.innerHTML = "Posted by: "+data[keys[i]]["name"] + "  "+data[keys[i]]["surname"];
		temp.appendChild(temp1);
		
	}
}