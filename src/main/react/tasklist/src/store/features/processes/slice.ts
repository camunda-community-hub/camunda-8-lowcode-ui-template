import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { IProcess, ITask, ITaskSearch } from '../../model';

export interface ProcessListState {
  processes: IProcess[];
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
  taskSearch: {
    assignee: null, group: null, taskState: 'CREATED', pageSize: null
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
      //state.tasks.splice(0, 0, action.payload);
      //state.tasks.unshift(action.payload);
    },
    setTaskSearch: (
      state: ProcessListState,
      action: PayloadAction<ITaskSearch>,
    ) => {
      state.taskSearch = action.payload;
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
  setTaskSearch
} = serverListSlice.actions;

export default serverListSlice.reducer;

