import { useEffect, useState, type JSX } from "react";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import "../pages/JobList.css";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  postedDate: string;
  keywords: string;
}

export default function JobList(): JSX.Element {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Filter logic
  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        locationFilter === "all" || job.location === locationFilter;

      const matchesType = typeFilter === "all" || job.type === typeFilter;

      return matchesSearch && matchesLocation && matchesType;
    });

    setFilteredJobs(filtered);
  }, [searchQuery, locationFilter, typeFilter, jobs]);

  if (loading) return <p className="text-center mt-20">Loading jobs...</p>;

  // Get unique locations and types
  const locations = Array.from(new Set(jobs.map((job) => job.location)));
  const types = Array.from(new Set(jobs.map((job) => job.type)));

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="header-container">
          <div className="header-text">
            <h1 className="title">Job Openings</h1><br></br>
            <p className="subtitle">
              Browse available positions and view applicants
            </p>
          </div>

          <Link to="/add-job">
            <button className="addJob">+ Add Job</button>
          </Link>
        </div>

        {/* Search + Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            {/* <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" /> */}
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
            />
          </div>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
<br></br>
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </div>

        {/* Job Cards */}
        {filteredJobs.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow">
            <p className="text-gray-600 mb-4">
              No jobs found matching your criteria
            </p>
            <button
              className="border px-4 py-2 rounded-lg"
              onClick={() => {
                setSearchQuery("");
                setLocationFilter("all");
                setTypeFilter("all");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                 p-6 h-[380px] max-w-[320px] flex flex-col justify-between border border-gray-200"
              >
                <div>
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
                    {job.type}
                  </span>

                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {job.title}
                  </h2>

                  <div className="space-y-3 text-gray-600 text-sm">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {job.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                    {job.description}
                  </p>
                </div>

                <div className="mt-6">
                  <Link to={`/job/${job._id}`}>
                    <button className="w-full bg-blue-600 text-white py-1 px-3 mt-2 text-sm rounded-lg hover:bg-blue-700 transition">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
