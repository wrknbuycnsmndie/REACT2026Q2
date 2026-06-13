import type { FormSubmission } from './submissionTypes';

interface SubmissionCardProps {
  submission: FormSubmission;
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  return (
    <article className='submission-card submission-card--new'>
      <img
        alt={`${submission.name} profile`}
        className='submission-card__image'
        src={submission.image}
      />
      <div>
        <h3>{submission.name}</h3>
        <p>Email: {submission.email}</p>
        <p>Age: {submission.age}</p>
        <p>Gender: {submission.gender}</p>
        <p>Country: {submission.country}</p>
        <p>Form: {submission.source}</p>
      </div>
    </article>
  );
}
