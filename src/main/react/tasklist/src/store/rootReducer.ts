import {combineReducers} from '@reduxjs/toolkit';

import authReducer from './features/auth/slice';
import processReducer from './features/processes/slice';
import adminReducer from './features/admin/slice';

const rootReducer = combineReducers({
  auth: authReducer,
  process: processReducer,
  admin: adminReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
