import { useAppSelector } from '../../app/hooks';
import { SubmissionCard } from './SubmissionCard';
import { selectSubmissions } from './submissionsSlice';
import './SubmissionList.css';

export function SubmissionList() {
  const submissions = useAppSelector(selectSubmissions);

  if (submissions.length === 0) {
    return null;
  }

  return (
    <section className='submissions' aria-labelledby='submissions-title'>
      <h2 id='submissions-title'>Submissions</h2>
      <div className='submissions__grid'>
        {submissions.map((submission) => (
          <SubmissionCard key={submission.id} submission={submission} />
        ))}
      </div>
    </section>
  );
}
