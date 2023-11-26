function getJobIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function fetchJobDetails(jobId, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "js/data_job.json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            var jsonData = JSON.parse(xhr.responseText);
            callback(jsonData[jobId]);
        } else {
            console.error("Failed to fetch job details");
        }
    };
    xhr.onerror = function () {
        console.error("Error during the XMLHttpRequest");
    };
    xhr.send();
}

function showJobDetails(jobDetails) {
    var jobDetailsContainer = document.getElementById("job-details");
    jobDetailsContainer.innerHTML = ""; // Clear previous data

    // Display job details on the page
    for (var key in jobDetails) {
        var detailElement = document.createElement("p");
        detailElement.innerText = key + ": " + jobDetails[key];
        jobDetailsContainer.appendChild(detailElement);
    }
}

// Initial page load
window.onload = function () {
    var jobId = getJobIdFromUrl();
    if (jobId) {
        fetchJobDetails(jobId, showJobDetails);
    } else {
        console.error("Job ID not found in the URL");
    }
};
