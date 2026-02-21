import type { Applicant } from "../types/Applicant";
import type { Job } from "../types/Job";

export function calculateMatchScore(job: Job, applicant: Applicant): number {
  let score = 0;
  const maxScore = 100;

  const jobKeywords = job.keywords.map((k) => k.toLowerCase());
  const applicantSkills = (applicant.skills ?? []).map((s) =>
  s.toLowerCase()
);

  let matchedSkills = 0;

  for (const keyword of jobKeywords) {
    if (
      applicantSkills.some(
        (skill) =>
          skill.includes(keyword) || keyword.includes(skill)
      )
    ) {
      matchedSkills++;
    }
  }

  const skillScore =
    jobKeywords.length > 0
      ? (matchedSkills / jobKeywords.length) * 60
      : 0;

  score += skillScore;

  if (applicant.experience >= 5) {
    score += 20;
  } else {
    score += (applicant.experience / 5) * 20;
  }

if ((applicant.skills ?? []).length >= job.keywords.length){
    score += 20;
  } else if (job.keywords.length > 0) {
    score +=
      ((applicant.skills ?? []).length / jobKeywords.length) * 20;
  }

  return Math.min(Math.round(score), maxScore);
}

export function rankApplicants(
  job: Job,
  applicants: Applicant[]
): Applicant[] {
  return applicants
    .map((applicant) => ({
      ...applicant,
      matchScore: calculateMatchScore(job, applicant),
    }))
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
}