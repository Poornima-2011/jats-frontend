import { useEffect, useState } from "react";
import { getOpenJobs, searchJobs, applyToJob, getApplicationsByCandidate } from "../api";

function CandidateView({ currentUser }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [message, setMessage] = useState("");

  async function loadJobs() {
    const data = await getOpenJobs();
    setJobs(data);
  }

  async function loadApplications() {
    const data = await getApplicationsByCandidate(currentUser.id);
    setApplications(data);
  }

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    const data = await searchJobs(titleFilter, locationFilter);
    setJobs(data);
  }

  async function handleApply(jobId) {
    setMessage("");
    try {
      await applyToJob({ jobId, candidateId: currentUser.id });
      setMessage("Application submitted!");
      loadApplications();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="view">
      <section className="panel">
        <h2>Browse open jobs</h2>
        <form className="filter-bar" onSubmit={handleSearch}>
          <input
            placeholder="Title keyword"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
          <input
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
          <button type="submit">Search</button>
          <button type="button" onClick={loadJobs}>Reset</button>
        </form>

        {message && <p className="info-text">{message}</p>}

        <div className="card-list">
          {jobs.map((job) => (
            <div className="card" key={job.id}>
              <h3>{job.title}</h3>
              <p className="muted">{job.location} · Deadline: {job.deadline}</p>
              <p>{job.description}</p>
              <p className="muted">Posted by {job.recruiterName}</p>
              <button onClick={() => handleApply(job.id)}>Apply</button>
            </div>
          ))}
          {jobs.length === 0 && <p>No open jobs found.</p>}
        </div>
      </section>

      <section className="panel">
        <h2>My applications</h2>
        <table>
          <thead>
            <tr>
              <th>Job</th>
              <th>Status</th>
              <th>Applied on</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.jobTitle}</td>
                <td><span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span></td>
                <td>{app.appliedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && <p>You haven't applied to any jobs yet.</p>}
      </section>
    </div>
  );
}

export default CandidateView;