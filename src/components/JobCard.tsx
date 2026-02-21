import { Link } from "react-router-dom";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import type { Job } from "../types/Job";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link to={`/job/${job._id}`}>
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer h-full">
        <span className="inline-block mb-2 px-3 py-1 text-xs bg-gray-200 rounded-full">
          {job.type}
        </span>

        <h2 className="text-lg font-semibold mb-2">{job.title}</h2>

        <div className="space-y-2 text-sm text-gray-600">
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

        <p className="text-sm text-gray-500 mt-4 line-clamp-3">
          {job.description}  
        </p>
      </div>
    </Link>
  );
}
