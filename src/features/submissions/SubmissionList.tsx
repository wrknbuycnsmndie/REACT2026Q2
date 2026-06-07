import { useAppSelector } from '../../app/hooks';
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
          <article className='submission-card' key={submission.id}>
            <img className='submission-card__image' src={submission.image} alt='' />
            <div>
              <h3>{submission.name}</h3>
              <p>Email: {submission.email}</p>
              <p>Age: {submission.age}</p>
              <p>Gender: {submission.gender}</p>
              <p>Country: {submission.country}</p>
              <p>Form: {submission.source}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
