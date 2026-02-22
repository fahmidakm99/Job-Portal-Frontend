import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/AddJob.css";

export default function AddJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    level: "",
    salary: "",
    experience: "",
    description: "",
    responsibilities: "",
    requirements: "",
    keywords: "",
    deadline: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jobData = {
      ...formData,
      keywords: formData.keywords.split(",").map((k) => k.trim()),
      requirements: formData.requirements.split("\n"),
      responsibilities: formData.responsibilities.split("\n"),
      postedDate: new Date().toISOString(),
    };

    try {
      await fetch("https://job-portal-backend-qxvd.onrender.com/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="add-job-container">
      <div className="add-job-card">
        <h2>Add New Job</h2>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="company"
            placeholder="Company"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            onChange={handleChange}
            required
          />

          <select name="type" onChange={handleChange} required>
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Contract">Contract</option>
          </select>

          <select name="level" onChange={handleChange} required>
            <option value="">Experience Level</option>
            <option value="Junior">Junior</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
          </select>

          <input
            type="text"
            name="salary"
            placeholder="Salary Range (e.g. 8L - 12L)"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="experience"
            placeholder="Experience Required (Years)"
            onChange={handleChange}
            required
          />
<p>Deadline</p>
          <input
            type="date"
            name="deadline"
            onChange={handleChange}
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Job Description"
            onChange={handleChange}
            required
          />

          <textarea
            name="responsibilities"
            placeholder="Responsibilities (one per line)"
            onChange={handleChange}
            required
          />

          <textarea
            name="requirements"
            placeholder="Requirements (one per line)"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="keywords"
            placeholder="Skills (comma separated)"
            onChange={handleChange}
            required
          />

          <button type="submit">Save Job</button>
        </form>
      </div>
    </div>
  );
}
