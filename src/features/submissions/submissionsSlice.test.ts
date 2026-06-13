import { describe, expect, it } from 'vitest';
import { COUNTRIES } from '../../constants/countries';
import {
  addSubmission,
  selectCountries,
  selectSubmissions,
  submissionsReducer,
} from './submissionsSlice';
import type { FormSubmission } from './submissionTypes';

const submission: FormSubmission = {
  id: 'submission-1',
  source: 'uncontrolled',
  submittedAt: '2026-06-07T12:00:00.000Z',
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  gender: 'female',
  acceptedTerms: true,
  country: 'Canada',
  image: 'data:image/png;base64,image',
};

describe('submissions slice', () => {
  it('starts with an empty history and the country list', () => {
    const state = submissionsReducer(undefined, { type: 'init' });

    expect(state.items).toEqual([]);
    expect(state.countries).toEqual(COUNTRIES);
  });

  it('keeps every submission', () => {
    const firstState = submissionsReducer(undefined, addSubmission(submission));
    const secondSubmission = {
      ...submission,
      id: 'submission-2',
      source: 'react-hook-form',
    } as const;
    const secondState = submissionsReducer(firstState, addSubmission(secondSubmission));

    expect(secondState.items).toEqual([submission, secondSubmission]);
  });

  it('selects submissions and countries', () => {
    const rootState = {
      submissions: submissionsReducer(undefined, addSubmission(submission)),
    };

    expect(selectSubmissions(rootState)).toEqual([submission]);
    expect(selectCountries(rootState)).toEqual(COUNTRIES);
  });
});
