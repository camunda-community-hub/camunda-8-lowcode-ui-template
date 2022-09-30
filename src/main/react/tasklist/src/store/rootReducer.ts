import {combineReducers} from '@reduxjs/toolkit';

import authReducer from './features/auth/slice';
import processReducer from './features/processes/slice';
import adminOrgReducer from './features/adminOrgs/slice';
import adminFormsReducer from './features/adminForms/slice';
import adminMailsReducer from './features/adminMails/slice';

const rootReducer = combineReducers({
  auth: authReducer,
  process: processReducer,
  adminOrg: adminOrgReducer,
  adminForms: adminFormsReducer,
  adminMails: adminMailsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
