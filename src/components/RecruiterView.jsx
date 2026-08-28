import { useEffect, useState } from "react";
import {
  createJob,
  getJobsByRecruiter,
  closeJob,
  getApplicationsByJob,
  updateApplicationStatus,
} from "../api";

function RecruiterView({ currentUser }) {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", location: "", deadline: "" });
  const [formError, setFormError] = useState("");
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [actionError, setActionError] = useState("");

  async function loadJobs() {
    const data = await getJobsByRecruiter(currentUser.id);
    setJobs(data);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePostJob(e) {
    e.preventDefault();
    setFormError("");
    try {
      await createJob({ ...form, recruiterId: currentUser.id });
      setForm({ title: "", description: "", location: "", deadline: "" });
      loadJobs();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleClose(jobId) {
    await closeJob(jobId, currentUser.id);
    loadJobs();
  }

  async function handleViewApplicants(jobId) {
    setActionError("");
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
      return;
    }
    try {
      const data = await getApplicationsByJob(jobId, currentUser.id);
      setApplicants(data);
      setExpandedJobId(jobId);
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleStatusChange(applicationId, status, jobId) {
    setActionError("");
    try {
      await updateApplicationStatus(applicationId, status);
      const data = await getApplicationsByJob(jobId, currentUser.id);
      setApplicants(data);
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <div className="view">
      <section className="panel">
        <h2>Post a new job</h2>
        <form className="job-form" onSubmit={handlePostJob}>
          <input name="title" placeholder="Job title" value={form.title} onChange={handleChange} required />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
          <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
          <textarea name="description" placeholder="Job description" value={form.description} onChange={handleChange} required />
          <button type="submit">Post job</button>
          {formError && <p className="error-text">{formError}</p>}
        </form>
      </section>

      <section className="panel">
        <h2>My posted jobs</h2>
        {actionError && <p className="error-text">{actionError}</p>}
        <div className="card-list">
          {jobs.map((job) => (
            <div className="card" key={job.id}>
              <h3>{job.title} <span className={`badge badge-${job.status.toLowerCase()}`}>{job.status}</span></h3>
              <p className="muted">{job.location} · Deadline: {job.deadline}</p>
              <div className="card-actions">
                <button onClick={() => handleViewApplicants(job.id)}>
                  {expandedJobId === job.id ? "Hide applicants" : "View applicants"}
                </button>
                {job.status === "OPEN" && (
                  <button onClick={() => handleClose(job.id)}>Close job</button>
                )}
              </div>

              {expandedJobId === job.id && (
                <table className="applicants-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Status</th>
                      <th>Applied on</th>
                      <th>Update status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app) => (
                      <tr key={app.id}>
                        <td>{app.candidateName}</td>
                        <td><span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span></td>
                        <td>{app.appliedDate}</td>
                        <td>
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) handleStatusChange(app.id, e.target.value, job.id);
                              e.target.value = "";
                            }}
                          >
                            <option value="" disabled>Change to...</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="HIRED">Hired</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {applicants.length === 0 && (
                      <tr><td colSpan="4">No applicants yet.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          ))}
          {jobs.length === 0 && <p>You haven't posted any jobs yet.</p>}
        </div>
      </section>
    </div>
  );
}

export default RecruiterView;