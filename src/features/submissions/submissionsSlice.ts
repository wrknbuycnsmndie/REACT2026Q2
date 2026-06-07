import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { COUNTRIES } from '../../constants/countries';
import type { FormSubmission } from './submissionTypes';

interface SubmissionsState {
  items: FormSubmission[];
  countries: readonly string[];
}

const initialState: SubmissionsState = {
  items: [],
  countries: COUNTRIES,
};

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    addSubmission(state, action: PayloadAction<FormSubmission>) {
      state.items.push(action.payload);
    },
  },
  selectors: {
    selectCountries: (state) => state.countries,
    selectSubmissions: (state) => state.items,
  },
});

export const { addSubmission } = submissionsSlice.actions;
export const { selectCountries, selectSubmissions } = submissionsSlice.selectors;
export const submissionsReducer = submissionsSlice.reducer;
