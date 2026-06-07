import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { SubmissionList } from './SubmissionList';
import { addSubmission, submissionsReducer } from './submissionsSlice';

function renderSubmissionList() {
  const store = configureStore({ reducer: { submissions: submissionsReducer } });

  store.dispatch(
    addSubmission({
      id: 'submission-1',
      source: 'react-hook-form',
      submittedAt: '2026-06-07T12:00:00.000Z',
      name: 'Alice',
      age: 30,
      email: 'alice@example.com',
      gender: 'female',
      acceptedTerms: true,
      country: 'Canada',
      image: 'data:image/png;base64,image',
    }),
  );

  render(
    <Provider store={store}>
      <SubmissionList />
    </Provider>,
  );
}

describe('SubmissionList', () => {
  it('renders submissions from Redux', () => {
    renderSubmissionList();

    expect(screen.getByRole('heading', { name: 'Submissions' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.getByText('Email: alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Age: 30')).toBeInTheDocument();
    expect(screen.getByText('Gender: female')).toBeInTheDocument();
    expect(screen.getByText('Country: Canada')).toBeInTheDocument();
  });

  it('marks a newly displayed submission for CSS highlighting', () => {
    renderSubmissionList();

    expect(screen.getByRole('article')).toHaveClass('submission-card--new');
  });
});
