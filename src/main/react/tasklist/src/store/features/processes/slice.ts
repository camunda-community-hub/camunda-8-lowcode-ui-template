import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { IProcess, ITask, ITaskSearch } from '../../model';

export interface ProcessListState {
  processes: IProcess[];
  previousSearch: ITaskSearch;
  taskSearch: ITaskSearch;
  tasks: ITask[];
  currentTask: ITask|null;
  currentProcess: IProcess | null;
  currentFormSchema: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ProcessListState = {
  processes:[],
  tasks: [],
  previousSearch: {
    assigned: undefined, assignee: undefined, group: undefined, state: 'CREATED', pageSize: 10, search: undefined, direction: undefined, numPage:0
  },
  taskSearch: {
    assigned: undefined, assignee: undefined, group: undefined, state: 'CREATED', pageSize: 10, search: undefined, direction: undefined, numPage: 0
  },
  currentTask: null,
  currentProcess: null,
  currentFormSchema: null,
  loading: false,
  error: null,
};

const serverListSlice = createSlice({
  name: 'serverListSlice',
  initialState,
  reducers: {
    remoteLoading: (state: ProcessListState) => {
      state.loading = true;
    },
    remoteLoadingFail: (state: ProcessListState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    remoteProcessesLoadingSuccess: (
      state: ProcessListState,
      action: PayloadAction<IProcess[]>,
    ) => {
      state.loading = false;
      state.processes = action.payload;
    },
    remoteTasksLoadingSuccess: (
      state: ProcessListState,
      action: PayloadAction<ITask[]>,
    ) => {
      state.loading = false;
      state.tasks = action.payload;
    },
    prependTaskIntoList: (
      state: ProcessListState,
      action: PayloadAction<ITask>,
    ) => {
      state.tasks = [action.payload, ...state.tasks];
      if (state.taskSearch.pageSize && state.tasks.length > state.taskSearch.pageSize) {
        state.tasks.splice(-1);
      }
      //state.tasks.splice(0, 0, action.payload);
      //state.tasks.unshift(action.payload);
    },
    setTaskSearch: (
      state: ProcessListState,
      action: PayloadAction<ITaskSearch>,
    ) => {
      state.taskSearch = action.payload;
      state.taskSearch.search = undefined;
      state.taskSearch.direction = undefined;
      state.taskSearch.numPage = 0;
    },
    before: (
      state: ProcessListState
    ) => {
      if (state.taskSearch.numPage > 0) {
        if (state.tasks && state.tasks.length > 0) {
          state.taskSearch.direction = 'BEFORE';
          state.taskSearch.search = state.tasks[0].sortValues;
          state.taskSearch.numPage = state.taskSearch.numPage - 1;
        } else {
          state.taskSearch = state.previousSearch;
        }
      }
    },
    after: (
      state: ProcessListState
    ) => {
      if (state.tasks && state.tasks.length == state.taskSearch.pageSize) {
        state.previousSearch = Object.assign({}, state.taskSearch);
        state.taskSearch.direction = 'AFTER';
        state.taskSearch.search = state.tasks[state.tasks.length - 1].sortValues;
        state.taskSearch.numPage = state.taskSearch.numPage + 1;
      }
    },
    setTask: (
      state: ProcessListState,
      action: PayloadAction<ITask | null>,
    ) => {
      state.currentTask = action.payload;
    },
    assignTask: (
      state: ProcessListState,
      action: PayloadAction<string>,
    ) => {
      state.currentTask!.assignee = action.payload;
    },
    unassignTask: (
      state: ProcessListState
    ) => {
      state.currentTask!.assignee = null;
    },
    setFormSchema: (
      state: ProcessListState,
      action: PayloadAction<string>,
    ) => {
      state.currentFormSchema = action.payload;
    },
    setProcess: (
      state: ProcessListState,
      action: PayloadAction<IProcess|null>,
    ) => {
      state.currentProcess = action.payload;
    },
    removeCurrentTask: (
      state: ProcessListState
    ) => {
      let i = 0;
      for (; i < state.tasks.length; i++) {
        if (state.tasks[i].id === state.currentTask!.id) {
          state.tasks.splice(i, 1);
          break;
        }
      }
      state.currentTask = null;
    }
  },
});

export const {
  remoteLoading,
  remoteLoadingFail,
  remoteProcessesLoadingSuccess,
  remoteTasksLoadingSuccess,
  setTask,
  setProcess,
  setFormSchema,
  assignTask,
  unassignTask,
  removeCurrentTask,
  prependTaskIntoList,
  setTaskSearch,
  before,
  after,
} = serverListSlice.actions;

export default serverListSlice.reducer;

