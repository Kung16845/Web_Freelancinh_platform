// script.js

// Function to fetch job data from the server (Node.js)
function fetchJobData(callback) {
    // For simplicity, let's assume the server responds with a JSON array

    // For demonstration purposes, we'll fetch data from the jobs.json file
    fetch('jobs.json')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error fetching job data:', error));
}

// Function to display job panels
function displayJobPanels(jobs) {
    const jobPanelsSection = document.getElementById('job-panels');
    jobPanelsSection.innerHTML = ''; // Clear previous content

    jobs.forEach(job => {
        const panel = createJobPanel(job);
        jobPanelsSection.appendChild(panel);
    });
}
function fetchJobData(callback) {

    // For demonstration purposes, we'll fetch data from the jobs.json file
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

    const img = document.createElement('img');
    img.src = job.image;
    img.alt = job.name;
    img.id = 'job-image';
    panel.appendChild(img);

    const h3 = document.createElement('h3');
    h3.textContent = job.name;
    h3.id = 'job-name';
    panel.appendChild(h3);

    const details = document.createElement('p');
    details.textContent = job.details;
    details.id = 'job-details';
    panel.appendChild(details);

    const difficulty = document.createElement('p');
    difficulty.textContent = `Difficulty: ${job.difficulty}`;
    difficulty.id = 'job-difficulty';
    panel.appendChild(difficulty);

    const reward = document.createElement('p');
    reward.textContent = `Reward: ${job.Reward}`;
    reward.id = 'job-reward';
    panel.appendChild(reward);

    const type = document.createElement('p');
    type.textContent = `Contact Type: ${job.type}`;
    type.id = 'job-type';
    panel.appendChild(type);

    const ghostType = document.createElement('p');
    ghostType.textContent = `Ghost Type: ${job['Ghost type']}`;
    ghostType.id = 'job-ghost-type';
    panel.appendChild(ghostType);

    const button = document.createElement('button');
    button.textContent = 'More!';
    button.onclick = () => applyForJob(job.id);
    panel.appendChild(button);

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
    fetchJobData(jobs => displayJobPanels(jobs));
};
