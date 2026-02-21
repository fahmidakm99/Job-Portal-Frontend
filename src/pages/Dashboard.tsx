import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Dashboard.css";

interface Job {
  _id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  salary?: string;
  postedDate: string;
}

interface Applicant {
  _id: string;
  jobId: string;
  name: string;
  status: "applied" | "reviewing" | "interview" | "hired" | "rejected";
}

export function Dashboard() {
  const { jobId } = useParams();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const totaljobRes = await fetch(`http://localhost:5000/api/jobs`);
        const totaljobData = await totaljobRes.json();
        setAllJobs(totaljobData);
        const jobRes = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
        const jobData = await jobRes.json();
        setJob(jobData);

        const applicantRes = await fetch(
          `http://localhost:5000/api/applicants`
        );
        const applicantData = await applicantRes.json();
        setApplicants(applicantData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  if (loading) return <div className="center-text">Loading...</div>;
  if (!job) return <div className="center-text">Job not found</div>;

  // Stats for this single job
  const totalJobs = allJobs.length;
  const totalApplicants = applicants.length;

  const applicantsByStatus = applicants.reduce(
    (acc: Record<string, number>, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const recentJobs = [...allJobs]
  .sort(
    (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
  )
  .slice(0, 5);

const jobsWithApplicants = allJobs
  .map((j) => ({
    ...j,
    applicantCount: applicants.filter((a) => a.jobId === j._id).length,
  }))
  .sort((a, b) => b.applicantCount - a.applicantCount);
  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Overview of job postings and applications</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <span>Total Jobs</span>
              <span>📁</span>
            </div>
            <div className="card-content">{totalJobs}</div>
            <p className="card-subtext">Active positions</p>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <span>Total Applicants</span>
              <span>👥</span>
            </div>
            <div className="card-content">{totalApplicants}</div>
            <p className="card-subtext">All applications</p>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <span>In Review</span>
              <span>⏳</span>
            </div>
            <div className="card-content">{applicantsByStatus.reviewing || 0}</div>
            <p className="card-subtext">Being reviewed</p>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <span>Hired</span>
              <span>✅</span>
            </div>
            <div className="card-content">{applicantsByStatus.hired || 0}</div>
            <p className="card-subtext">Successful hires</p>
          </div>
        </div>

        {/* Row with 2 columns */}
        <div className="two-cols-grid">
          {/* Application Status */}
          <div className="section-card">
            <h2>Application Status</h2>
            <div className="status-grid">
              {["applied", "reviewing", "interview", "hired", "rejected"].map(
                (status) => {
                  let label = "";
                  let color = "";
                  switch (status) {
                    case "applied":
                      label = "Applied";
                      color = "#6b7280";
                      break;
                    case "reviewing":
                      label = "Reviewing";
                      color = "#3b82f6";
                      break;
                    case "interview":
                      label = "Interview";
                      color = "#8b5cf6";
                      break;
                    case "hired":
                      label = "Hired";
                      color = "#22c55e";
                      break;
                    case "rejected":
                      label = "Rejected";
                      color = "#ef4444";
                      break;
                  }
                  return (
                    <div key={status} className="status-card">
                      <span
                        className="status-label"
                        style={{ backgroundColor: color }}
                      >
                        {label}
                      </span>
                      <span className="status-count">
                        {applicantsByStatus[status] || 0}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Top Jobs */}
          <div className="section-card">
            <h2>Top Jobs by Applications 📈</h2>
            <div className="jobs-list">
              {jobsWithApplicants.slice(0, 5).map((job) => (
                <Link key={job._id} to={`/job/${job._id}`} className="job-link">
                  <div>
                    <p className="job-title">{job.title}</p>
                    <p className="job-company">{job.company}</p>
                  </div>
                  <span className="badge">{job.applicantCount} applicants</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="section-card">
          <div className="section-header">
            <h2>Recent Job Postings 📅</h2>
            <Link to="/jobs">
              <button className="btn">View All</button>
            </Link>
          </div>
          <div className="jobs-list">
            {recentJobs.map((job) => (
              <Link key={job._id} to={`/job/${job._id}`} className="job-link">
                <div>
                  <p className="job-title">{job.title}</p>
                  <p className="job-company">
                    {job.company} • {job.location}
                  </p>
                  {job.salary && <p className="job-salary">{job.salary}</p>}
                </div>
                <span className="badge">
                  {applicants.filter((a) => a.jobId === job._id).length}{" "}
                  applicants
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}