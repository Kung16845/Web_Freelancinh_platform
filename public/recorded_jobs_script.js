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
                <!-- Add more job details as needed -->
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
