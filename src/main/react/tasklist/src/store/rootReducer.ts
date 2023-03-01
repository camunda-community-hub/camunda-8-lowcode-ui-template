import {combineReducers} from '@reduxjs/toolkit';

import authReducer from './features/auth/slice';
import processReducer from './features/processes/slice';
import adminOrgReducer from './features/adminOrgs/slice';
import adminFormsReducer from './features/adminForms/slice';
import adminDmnsReducer from './features/adminDmns/slice';
import adminMailsReducer from './features/adminMails/slice';
import adminThemesReducer from './features/adminThemes/slice';
import translationsReducer from './features/translations/slice';
import workersReducer from './features/workers/slice';

const rootReducer = combineReducers({
  auth: authReducer,
  process: processReducer,
  adminOrg: adminOrgReducer,
  adminForms: adminFormsReducer,
  adminDmns: adminDmnsReducer,
  adminMails: adminMailsReducer,
  adminThemes: adminThemesReducer,
  translations: translationsReducer,
  workers: workersReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
