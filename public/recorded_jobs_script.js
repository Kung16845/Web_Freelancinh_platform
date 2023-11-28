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

// Function to display recorded jobs on the page
function displayRecordedJobs(jobs) {
    const recordedJobsSection = document.getElementById('recorded-jobs');
    const jobTemplate = document.getElementById('recorded-job-template');

    if (jobs.length === 0) {
        // Display a message when there are no recorded jobs
        recordedJobsSection.innerHTML = '<p>No recorded jobs found.</p>';
    } else {
        recordedJobsSection.innerHTML = '';

        // Create and append job elements to the recordedJobsSection
        jobs.forEach(job => {
            const jobElement = createRecordedJobElement(job, jobTemplate);
            recordedJobsSection.appendChild(jobElement);
        });
    }
}

function createRecordedJobElement(job, template) {
    const jobElement = document.createElement('div');
    jobElement.className = 'recorded-job';
    
    const img = document.createElement('img');
    img.src = job.image;
    img.alt = job.name;
    jobElement.appendChild(img);

    const h3 = document.createElement('h3');
    h3.textContent = job.name;
    jobElement.appendChild(h3);

    const details = document.createElement('p');
    details.textContent = job.details;
    jobElement.appendChild(details);

    const difficulty = document.createElement('p');
    difficulty.textContent = `Difficulty: ${job.difficulty}`;
    jobElement.appendChild(difficulty);

    const reward = document.createElement('p');
    reward.textContent = `Reward: ${job.Reward}`;
    jobElement.appendChild(reward);

    const ghostType = document.createElement('p');
    ghostType.textContent = `Ghost Type: ${job['Ghost type']}`;
    jobElement.appendChild(ghostType);

    const button = document.createElement('button');
    button.textContent = 'More!';
    button.onclick = () => applyForJob(job.id);
    jobElement.appendChild(button);

    return jobElement;
}


function fetchJobData(callback) {
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

// Function to get a cookie value by name
function getCookie(name) {
    const value = document.cookie.split(';').find(row => row.trim().startsWith(`${name}=`));
    return value ? value.split('=')[1] : null;
}
