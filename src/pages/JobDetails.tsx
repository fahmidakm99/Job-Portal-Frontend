import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "../pages/JobDetails.css";
import type { Applicant } from "../types/Applicant";
import { rankApplicants } from "../utils/matchingAlgorithm";
import type { Job } from "../types/Job";

export default function JobDetails() {
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-posted");
  const [showBestMatches, setShowBestMatches] = useState(false);

  // Fetch job & applicants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await fetch(`https://job-portal-backend-qxvd.onrender.com/api/jobs/${jobId}`);
        const jobData = await jobRes.json();
        setJob(jobData);

        const applicantRes = await fetch(
        `https://job-portal-backend-qxvd.onrender.com/api/applicants/job/${jobId}`
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

  // Rank applicants (based on your matching algorithm)
  const rankedApplicants = useMemo(() => {
    if (!job) return applicants;
    return rankApplicants(job, applicants);
  }, [job, applicants]);

  // Filter + sort + best 3
  const processedApplicants = useMemo(() => {
    let filtered = [...rankedApplicants];

    // Status filter (safe, string only)
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (a) => (a.status ?? "applied").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Best Match Mode
    if (showBestMatches) {
      filtered.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
      return filtered.slice(0, 3);
    }

    // Sorting
    if (sortBy === "date-posted") {
      filtered.sort((a, b) => {
  const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
  const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : 0;
  return dateB - dateA;
});
    }

    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [rankedApplicants, statusFilter, sortBy, showBestMatches]);

  // Update applicant status
  const handleStatusChange = async (
    _id: string,
    newStatus: Applicant["status"]
  ) => {
    try {
      const res = await fetch(
        `https://job-portal-backend-qxvd.onrender.com/api/applicants/${_id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      const updatedApplicant = await res.json();
      setApplicants((prev) =>
        prev.map((app) => (app._id === _id ? updatedApplicant : app))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
    }
  };

  if (loading) return <p className="center-text">Loading...</p>;
  if (!job) return <p className="center-text">Job not found</p>;

  return (
    <div className="job-layout">
      {/* LEFT SIDE */}
      <div className="job-left">
        <Link to="/jobs" className="back-link">
          ← Back to Jobs
        </Link>

        <h1 className="job-title">{job.title}</h1>

        <div className="job-meta">
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Type:</strong> {job.type}</p>
          <p><strong>Level:</strong> {job.level}</p>
          <p><strong>Salary:</strong> {job.salary}</p>
          <p><strong>Experience Required:</strong> {job.experience} yrs</p>
          <p><strong>Posted:</strong> {new Date(job.postedDate).toLocaleDateString()}</p>
          <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
        </div>

        <div className="job-section">
          <h3>Description</h3>
          <p>{job.description}</p>
        </div>

        <div className="job-section">
          <h3>Responsibilities</h3>
          <ul>
            {job.responsibilities.map((res, idx) => (
              <li key={idx}>{res}</li>
            ))}
          </ul>
        </div>

        <div className="job-section">
          <h3>Requirements</h3>
          <ul>
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="job-section">
          <h3>Skills Required</h3>
          <div className="skills">
            {job.keywords.map((skill, idx) => (
              <span key={idx} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="job-right">
        <h3>Applicants ({processedApplicants.length})</h3>
        <button
          className="match-btn"
          onClick={() => setShowBestMatches(true)}
        >
          Find Best 3 Matches
        </button>
      </div>

      {/* Applicants Section */}
      <div className="job-bottompart">
<p>All Applicants</p>
        {/* Filters */}
        <div className="filter-row">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setShowBestMatches(false);
            }}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="applied">Applied</option>
            <option value="reviewing">Reviewing</option>
            <option value="interview">Interview</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setShowBestMatches(false);
            }}
            className="filter-select"
          >
            <option value="date-posted">Date Posted</option>
            <option value="name">Name</option>
          </select>
        </div>

        {/* Applicant Cards */}
        {processedApplicants.map((applicant) => {
          const match = applicant.matchScore ?? 0;
          let matchClass = "low";
          if (match >= 70) matchClass = "high";
          else if (match >= 40) matchClass = "mid";

          return (
            <div key={applicant._id} className="applicant-card">
              <div className="applicant-header">
                <div className="applicant-info">
                  <h4>{applicant.name}</h4>
                  <span>{applicant.experience} yrs experience</span><br />
                  <span>{applicant.phone}</span><br />
                  <span>
Applied {applicant.appliedDate
  ? new Date(applicant.appliedDate).toLocaleDateString()
  : "N/A"}
                  </span>
                  <br />
                  Status:
                  <select
                    value={applicant.status}
                    onChange={(e) =>
                      handleStatusChange(
                        applicant._id,
                        e.target.value as Applicant["status"]
                      )
                    }
                    className="status-select"
                  >
                    <option value="applied">Applied</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="interview">Interview</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Show % match only after clicking button */}
                {showBestMatches && (
                  <span className={`match-badge ${matchClass}`}>
                    {match}% Match
                  </span>
                )}
              </div>

              <p>Email: {applicant.email}</p>

              <div className="skills">
               {(applicant.skills ?? []).map((skill, idx) => (
                  <span key={idx} className="skill-badge light">{skill}</span>
                ))}
              </div>

              {applicant.resumeUrl && (
                <div style={{ marginTop: "10px" }}>
                  <a
                    href={applicant.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-btn"
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}