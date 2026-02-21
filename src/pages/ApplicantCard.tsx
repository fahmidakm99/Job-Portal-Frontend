import { useState } from "react";
import type { Applicant, ApplicantStatus } from "../types/Applicant";

interface Props {
  applicant: Applicant;
  showScore?: boolean;
  onStatusChange?: (applicantId: string, status: ApplicantStatus) => void;
  onAddNote?: (applicantId: string, note: string) => void;
  onSelect?: (applicantId: string, selected: boolean) => void;
  isSelected?: boolean;
}

export default function ApplicantCard({
  applicant,
  showScore = false,
  onStatusChange,
  onAddNote,
  isSelected
}: Props) {
  const [newNote, setNewNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim() && onAddNote) {
      onAddNote(applicant._id.toString(), newNote);
      setNewNote("");
      setShowNoteInput(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "bg-gray-500";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusColor = (status: ApplicantStatus) => {
    switch (status) {
      case "applied":
        return "bg-gray-500";
      case "reviewing":
        return "bg-blue-500";
      case "interview":
        return "bg-purple-500";
      case "hired":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: ApplicantStatus) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div
      className={`border rounded-lg p-4 shadow hover:shadow-md ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{applicant.name}</h3>
          <p className="text-sm text-gray-600">{applicant.email}</p>
          <p className="text-sm text-gray-600">{applicant.phone ?? "N/A"}</p>
        </div>

        {showScore && applicant.matchScore !== undefined && (
          <div className="flex flex-col items-center ml-4">
            <div
              className={`${getScoreColor(applicant.matchScore)} text-white rounded-full w-16 h-16 flex items-center justify-center mb-1`}
            >
              {applicant.matchScore}
            </div>
            <span className="text-xs">Match</span>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mb-4">
        {onStatusChange ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <select
              value={applicant.status ?? "applied"}
              onChange={(e) =>
                onStatusChange(
                  applicant._id.toString(),
                  e.target.value as ApplicantStatus
                )
              }
              className="border px-2 py-1 rounded"
            >
              <option value="applied">Applied</option>
              <option value="reviewing">Reviewing</option>
              <option value="interview">Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        ) : (
          <span
            className={`text-white px-2 py-1 rounded ${getStatusColor(
              applicant.status ?? "applied"
            )}`}
          >
            {getStatusLabel(applicant.status ?? "applied")}
          </span>
        )}
      </div>

      {/* Skills */}
      {applicant.skills?.length ? (
        <div className="mb-4">
          <span className="font-semibold text-sm">Skills:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {applicant.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Notes */}
      {applicant.notes?.length ? (
        <div className="mb-4 border-l-4 border-yellow-400 bg-yellow-50 p-2 rounded">
          <span className="text-sm font-medium">Notes:</span>
          <ul className="mt-1 space-y-1">
            {applicant.notes.map((note) => (
              <li key={note.id} className="text-sm text-gray-700">
                {note.text}{" "}
                <span className="text-xs text-gray-500">({note.author})</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Add Note */}
      {onAddNote && (
        <div className="mb-4">
          {showNoteInput ? (
            <div className="space-y-2">
              <textarea
                placeholder="Add a note..."
                className="border rounded w-full p-2"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                  onClick={handleAddNote}
                >
                  Save
                </button>
                <button
                  className="px-3 py-1 border rounded text-sm"
                  onClick={() => {
                    setShowNoteInput(false);
                    setNewNote("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="px-3 py-1 border rounded text-sm"
              onClick={() => setShowNoteInput(true)}
            >
              Add Note
            </button>
          )}
        </div>
      )}

      {/* Resume */}
      <button
        className="w-full border rounded px-3 py-2 text-sm hover:bg-gray-100 transition"
        onClick={() => alert(`Open resume for ${applicant.name}`)}
      >
        View Resume
      </button>
    </div>
  );
}