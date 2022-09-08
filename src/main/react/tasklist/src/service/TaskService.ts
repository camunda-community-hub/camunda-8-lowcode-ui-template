import store, { AppThunk } from '../store';
import { remoteLoading, assignTask, unassignTask, remoteTasksLoadingSuccess, remoteLoadingFail, prependTaskIntoList, setTask, setFormSchema, removeCurrentTask, setTaskSearch } from '../store/features/processes/slice';
import { ITask, ITaskSearch } from '../store/model';
import api from './api';

export class TaskService {

  lastFetchTasks: number = 0;

  getTasks = (): ITask[] => {
    return store.getState().process.tasks;
  }
  setTaskSearch = (taskSearch: ITaskSearch): AppThunk => async dispatch => {
    dispatch(setTaskSearch(taskSearch));
  }
  setTask = (task: ITask | null): AppThunk => async dispatch => {
    if (task) {
      let url = '/forms/' + task.processName + '/' + task.processDefinitionId + '/' + task.formKey;
      api.get(url).then(response => {
        dispatch(setFormSchema(response.data));
      }).catch(error => {
        alert(error.message);
      })
    }
    dispatch(setTask(task));

  };

  getCurrentTask = (): ITask | null => {
    return store.getState().process.currentTask;
  }

  fetchTasks = (): AppThunk => async dispatch => {
    if (this.lastFetchTasks < Date.now() - 1000) { 
      try {
        dispatch(remoteLoading());
        const { data } = await api.post<ITask[]>('/tasks/search', store.getState().process.taskSearch);
        dispatch(remoteTasksLoadingSuccess(data));
      } catch (err:any) {
        dispatch(remoteLoadingFail(err.toString()));
      }
      this.lastFetchTasks = Date.now();
    }
  }
  
  claim = (): AppThunk => async dispatch => {
    let url = '/tasks/' + store.getState().process.currentTask!.id + '/claim/' + store.getState().auth.data!.username;
    api.get(url).then(response => {
      dispatch(assignTask(store.getState().auth.data!.username));
    }).catch(error => {
      alert(error.message);
    })
  }

  unclaim = (): AppThunk => async dispatch => {
    let url = '/tasks/' + store.getState().process.currentTask!.id + '/unclaim/';
    api.get(url).then(response => {
      dispatch(unassignTask());
    }).catch(error => {
      alert(error.message);
    })
  }

  submitTask = (data: any): AppThunk => async dispatch => {
    api.post('/tasks/' + store.getState().process.currentTask!.id, data).then(response => {
      dispatch(removeCurrentTask());
    }).catch(error => {
      alert(error.message);
    })
  }

  insertNewTask = (task: ITask): AppThunk => async dispatch => {
    const taskSearch = store.getState().process.taskSearch;
    let shouldInsert = true;
    if (taskSearch.assignee != null) {
      if (taskSearch.assignee != task.assignee) {
        shouldInsert = false;
      }
    }
    if (taskSearch.taskState != null) {
      if (taskSearch.taskState != task.taskState) {
        shouldInsert = false;
      }
    }
    if (taskSearch.group != null) {
      if (task.candidateGroups.indexOf(taskSearch.group)<0) {
        shouldInsert = false;
      }
    }
    if (shouldInsert) {
      this.lastFetchTasks = Date.now();
      dispatch(prependTaskIntoList(task));
    }

  };
}

const taskService = new TaskService();

export default taskService;
