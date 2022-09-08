import {combineReducers} from '@reduxjs/toolkit';

import authReducer from './features/auth/slice';
import processReducer from './features/processes/slice';

const rootReducer = combineReducers({
  auth: authReducer,
  process: processReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
