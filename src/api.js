const BASE_URL = "http://localhost:8099/api";

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || "Something went wrong";
    throw new Error(message);
  }

  return data;
}

// ---- Users ----
export function registerUser(payload) {
  return request(`${BASE_URL}/users`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getUser(id) {
  return request(`${BASE_URL}/users/${id}`);
}

// ---- Jobs ----
export function createJob(payload) {
  return request(`${BASE_URL}/jobs`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOpenJobs() {
  return request(`${BASE_URL}/jobs`);
}

export function searchJobs(title, location) {
  const params = new URLSearchParams();
  if (title) params.append("title", title);
  if (location) params.append("location", location);
  return request(`${BASE_URL}/jobs/search?${params.toString()}`);
}

export function getJobsByRecruiter(recruiterId) {
  return request(`${BASE_URL}/jobs/recruiter/${recruiterId}`);
}

export function closeJob(jobId, recruiterId) {
  return request(`${BASE_URL}/jobs/${jobId}/close?recruiterId=${recruiterId}`, {
    method: "PUT",
  });
}

// ---- Applications ----
export function applyToJob(payload) {
  return request(`${BASE_URL}/applications`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getApplicationsByCandidate(candidateId) {
  return request(`${BASE_URL}/applications/candidate/${candidateId}`);
}

export function getApplicationsByJob(jobId, recruiterId) {
  return request(`${BASE_URL}/applications/job/${jobId}?recruiterId=${recruiterId}`);
}

export function updateApplicationStatus(applicationId, status) {
  return request(`${BASE_URL}/applications/${applicationId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}