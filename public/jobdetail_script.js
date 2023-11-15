// jobdetail_script.js
function checkCookie() {
    var email = getCookie("email");
    if (!email) {
        window.location = "login.html";
    } else {
        saveJobIdToDatabase();
    }
}

// Function to save the job ID to the database for the logged-in user
function saveJobIdToDatabase() {
    const jobId = getJobIdFromUrl();
    const email = getCookie("email");

    // Call an API endpoint on your server to save the job ID for the user
    fetch('/saveJobId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, jobId: jobId }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server if needed
        console.log('Job ID saved successfully:', data);
    })
    .catch(error => console.error('Error saving job ID:', error));
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
    return urlParams.get('id');
}

// Fetch and display job details when the page is loaded
window.onload = function () {
    document.getElementById('save-button').onclick = checkCookie;
    const jobId = getJobIdFromUrl();
    if (jobId) {
        fetchJobDetails(jobId, job => displayJobDetails(job));
    } else {
        console.error('Job ID not provided in the URL.');
    }
};
