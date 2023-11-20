window.onload = function () {
    // Fetch and display recorded job details when the page is loaded
    fetchRecordedJobs();
};

// Function to fetch recorded jobs from the server
async function fetchRecordedJobs() {
    try {
        const email = getCookie('email');
        if (email) {
            const response = await fetch(`/getRecordedJobs?email=${encodeURIComponent(email)}`);
            const jobs = await response.json();

            // Display recorded jobs on the page
            displayRecordedJobs(jobs);
        } else {
            console.error('Email not found in cookies.');
        }
    } catch (error) {
        console.error('Error fetching recorded jobs:', error);
    }
}
function fetchJobData(callback) {
    // You would typically make an API call to the server here
    // For simplicity, let's assume the server responds with a JSON array

    // For demonstration purposes, we'll fetch data from the jobs.json file
    fetch('jobs.json')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error fetching job data:', error));
}
function applyForJob(jobId) {
    // Find the job by id and perform the application logic
    fetchJobData(jobs => {
        const selectedJob = jobs.find(job => job.id === jobId);
        if (selectedJob) {
            // Move to the next page with the job details
            window.location.href = `jobdetail.html?id=${selectedJob.id}`;
        }
    });
}
// Function to display recorded jobs on the page
function displayRecordedJobs(jobs) {
    const recordedJobsSection = document.getElementById('recorded-jobs');

    if (jobs.length === 0) {
        // Display a message when there are no recorded jobs
        recordedJobsSection.innerHTML = '<p>No recorded jobs found.</p>';
    } else {
        // Create HTML for each recorded job
        const jobListHTML = jobs.map(job => `
            <div class="recorded-job">
                <h3>${job.name}</h3>
                <img src="${job.image}" alt="${job.name}">
                <p>${job.details}</p>
                <p>Difficulty: ${job.difficulty}</p>
                <p>Reward: ${job.Reward}</p>
                <p>Ghost Type: ${job['Ghost type']}</p>
                <button onclick="applyForJob(${job.id})">More!</button>
            </div>
        `).join('');

        recordedJobsSection.innerHTML = jobListHTML;
    }
}

// Function to get a cookie value by name
function getCookie(name) {
    const value = document.cookie.split(';').find(row => row.trim().startsWith(`${name}=`));
    return value ? value.split('=')[1] : null;
}
