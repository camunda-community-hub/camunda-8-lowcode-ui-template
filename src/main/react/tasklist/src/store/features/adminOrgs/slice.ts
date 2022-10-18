import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Organization} from '../../model';

interface AdminOrgState {
  enabled: boolean | null,
  organizations: Organization[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminOrgState = {
  enabled: null,
  organizations: null,
  loading: false,
  error: null,
};

const adminOrgSlice = createSlice({
  name: 'adminOrg',
  initialState,
  reducers: {
    loadStart: (state: AdminOrgState) => {
      state.loading = true;
    },
    fail: (state: AdminOrgState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    silentfail: (state: AdminOrgState) => {
      state.loading = false;
    },
    enabled: (state: AdminOrgState, action: PayloadAction<any>) => {
      state.loading = false;
      state.enabled = action.payload.enabled;
    },
    loadSuccess: (state: AdminOrgState, action: PayloadAction<Organization[]>) => {
      state.loading = false;
      state.organizations = action.payload;
      for (let i = 0; i < state.organizations.length; i++) {
        state.organizations[i].oldname = state.organizations[i].name;
      }

    },
    addOrganization: (state: AdminOrgState, action: PayloadAction<Organization>) => {
      state.loading = false;
      action.payload.oldname = action.payload.name;
      state.organizations!.push(action.payload);
    },
    updateOrganization: (state: AdminOrgState, action: PayloadAction<Organization>) => {
      state.loading = false;
      for (let i = 0; i < state.organizations!.length; i++) {
        if (state.organizations![i].oldname === action.payload.oldname) {
          state.organizations![i] = action.payload;
          break;
        }
      }
    }
  },
});

export const {
  loadStart,
  loadSuccess,
  addOrganization,
  updateOrganization,
  enabled,
  fail,
  silentfail
} = adminOrgSlice.actions;

export default adminOrgSlice.reducer;
