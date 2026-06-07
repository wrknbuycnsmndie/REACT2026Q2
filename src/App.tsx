import { useState } from 'react';
import './App.css';
import { FormModal } from './features/forms/FormModal';
import { SubmissionList } from './features/submissions/SubmissionList';
import type { FormSource } from './features/submissions/submissionTypes';

function App() {
  const [activeForm, setActiveForm] = useState<FormSource | null>(null);

  return (
    <main className='app'>
      <section className='app__hero' aria-labelledby='page-title'>
        <h1 className='app__title' id='page-title'>
          Forms practice
        </h1>

        <div className='app__actions'>
          <button
            className='button button--secondary'
            type='button'
            onClick={() => setActiveForm('uncontrolled')}
          >
            Uncontrolled form
          </button>
          <button
            className='button button--primary'
            type='button'
            onClick={() => setActiveForm('react-hook-form')}
          >
            React Hook Form
          </button>
        </div>
      </section>

      <SubmissionList />

      {activeForm && (
        <FormModal formType={activeForm} onClose={() => setActiveForm(null)} />
      )}
    </main>
  );
}

export default App;
