// script.js

// Function to display job panels
function displayJobPanels(jobs) {
    const jobPanels = document.getElementById('job-panels');
    jobPanels.innerHTML = ''; // Clear previous content

    jobs.forEach(job => {
        const panel = createJobPanel(job);
        jobPanels.appendChild(panel);
    });
}
function fetchJobData(callback) {
    fetch('jobs.json')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error fetching job data:', error));
}

// Function to filter jobs based on ghost hunting type
function filterJobs(contactType) {
    fetchJobData(jobs => {
        // Example: Filtering jobs based on contact type
        const filteredJobs = jobs.filter(job => job.type === contactType);
        displayJobPanels(filteredJobs); // Display a maximum of 3 panels
    });
}

// Function to search for jobs
function searchJobs() {
    const searchTerm = document.getElementById('job-search').value.toLowerCase();

    fetchJobData(jobs => {
        // Example: Searching jobs by name
        const searchResults = jobs.filter(job => job.name.toLowerCase().includes(searchTerm));
        displayJobPanels(searchResults);
    });
}

// Function to simulate applying for a job
function applyForJob(jobId) {
    // Find the job by id and perform the application logic
    fetchJobData(jobs => {
        const selectedJob = jobs.find(job => job.id === jobId);
        if (selectedJob) {
            alert(`You have applied for ${selectedJob.name}`);
        }
    });
}

// Function to get a specified number of random jobs from the array
function getRandomJobs(jobs, num) {
    const shuffledJobs = jobs.sort(() => 0.5 - Math.random());
    return shuffledJobs.slice(0, num);
}

// Function to create a job panel HTML element
function createJobPanel(job) {
    const panel = document.createElement('div');
    panel.className = 'job-panel';
    panel.innerHTML = `
        <img src="${job.image}" alt="${job.name}">
        <h3>${job.name}</h3>
        <p>${job.details}</p>
        <p>Difficulty: ${job.difficulty}</p>
        <p>Reward: ${job.Reward}</p>
        <p>ContactType: ${job.type}</p>
        <p>Ghost Type: ${job['Ghost type']}</p>
        <button onclick="applyForJob(${job.id})">More!</button>
    `;
    return panel;
}

// Function to filter jobs based on ghost type (dropdown)
function filterJobsByGhostType() {
    const selectedGhostType = document.getElementById('ghost-type-dropdown').value;
    fetchJobData(jobs => {
        if (selectedGhostType) {
            const filteredJobs = jobs.filter(job => job['Ghost type'] === selectedGhostType);
            displayJobPanels(filteredJobs);
        } else {
            // If no ghost type selected, display all jobs
            displayJobPanels(jobs);
        }
    });
}
function displayLimitedJobPanels(jobs, numToShow) {
    const jobPanels = document.getElementById('job-panels');
    jobPanels.innerHTML = ''; // Clear previous content

    // Display a maximum of numToShow job panels
    const panelsToShow = jobs.slice(0, numToShow);
    panelsToShow.forEach(job => {
        const panel = createJobPanel(job);
        jobPanels.appendChild(panel);
    });
}
// Function to simulate applying for a job and move to the next page
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
function updateOrDeleteCookie(name, value, expirationDays) {
    if (value === null) {
        // Delete the cookie
        const expiredCookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = expiredCookie;
    } else {
        // Update the cookie
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expirationDays);

        const updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;

        document.cookie = updatedCookie;
    }
}

// Fetch and display 3 random job panels when the page is loaded
window.onload = function () {
    
    fetchJobData(jobs => displayJobPanels(jobs, 3));
};
