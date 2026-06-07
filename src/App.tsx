import { useState } from 'react';
import './App.css';
import { Modal } from './components/Modal/Modal';
import { HookForm } from './features/forms/HookForm';
import { UncontrolledForm } from './features/forms/UncontrolledForm';
import { SubmissionList } from './features/submissions/SubmissionList';

type FormKind = 'uncontrolled' | 'react-hook-form';

function App() {
  const [activeForm, setActiveForm] = useState<FormKind | null>(null);
  const modalTitle =
    activeForm === 'uncontrolled' ? 'Uncontrolled form' : 'React Hook Form';

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
        <Modal title={modalTitle} onClose={() => setActiveForm(null)}>
          {activeForm === 'uncontrolled' ? (
            <UncontrolledForm />
          ) : (
            <HookForm />
          )}
        </Modal>
      )}
    </main>
  );
}

export default App;
