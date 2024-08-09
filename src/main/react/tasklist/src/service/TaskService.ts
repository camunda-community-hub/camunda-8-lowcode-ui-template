import store, { AppThunk } from '../store';
import formService from './FormService';
import { setTasklistConf, remoteLoading, assignTask, unassignTask, remoteTasksLoadingSuccess, remoteLoadingFail, setTask, setTaskSearch, before, after } from '../store/features/processes/slice';
import { ITask, ITaskSearch } from '../store/model';
import api from './api';
import { env } from '../env';


export class TaskService {

  taskSource?: EventSource;
  tasks: ITask[] = [];
  listVariables = async () => {
    const { data } = await api.get<any>('/tasklistconf/variables');
    return data;
  }

  loadTasklistConf = (): AppThunk => async dispatch => {
    if (!store.getState().process.tasklistConf) {
      api.get('/tasklistconf').then(response => {
        dispatch(setTasklistConf(response.data));
      }).catch(error => {
        alert(error.message);
      })
    }
  }

  saveTasklistConf = (tasklistConf: any): AppThunk => async dispatch => {
      api.post('/tasklistconf', tasklistConf).then(response => {
        dispatch(setTasklistConf(response.data));
      }).catch(error => {
        alert(error.message);
      })
  }

  subscribeTasks = (username: string): AppThunk => async dispatch => {
    this.taskSource = new EventSource(env.backend +"/api/jobKey/tasks/" + username);
    this.taskSource.onmessage = event => {
      let task = JSON.parse(event.data);
      //dispatch(taskService.loadJobKeyForm(task));
      console.log('received event', event);
      //navigate("/tasklist");
      //dispatch(taskService.setTask(task, navigate("/tasklist/taskForm")));
      dispatch(this.insertNewTask(task));
    }
  }

  disconnectFromTasks = () => {
    this.taskSource!.close();
  }

  filterOnAssignee = (assignee: string): AppThunk => async dispatch => {
    let { data } = await api.get<any>('/tasklistconf');
    dispatch(setTasklistConf(data));
    let conf = data;
    let taskSearch: ITaskSearch = {
      assigned: undefined, assignee: undefined, group: undefined, state: 'CREATED', filterVariables: {}, pageSize: 10, search: undefined, direction: undefined, numPage: 0
    }
    if (conf.filterOnAssignee) {
      taskSearch.assigned = "true";
      taskSearch.assignee = assignee;
    }
    dispatch(setTaskSearch(taskSearch));
  }

  getTasks = (): ITask[] => {
    return store.getState().process.tasks;
  }
  setTaskSearch = (taskSearch: ITaskSearch): AppThunk => async dispatch => {
    dispatch(setTaskSearch(taskSearch));
  }
  before = (): AppThunk => async dispatch => {
    dispatch(before());
  }
  after = (): AppThunk => async dispatch => {
    dispatch(after());
  }
  setTask = (task: ITask | null, callback?: any): AppThunk => async dispatch => {
    if (task) {
      task = Object.assign({}, task);
      if (!task.jobKey) {
        const { data } = await api.get('/tasks/' + task.id + '/variables');
        task.variables = data;
      }
      dispatch(formService.loadForm(task));

      if (callback) {
        callback();
      }
    }
    dispatch(setTask(task));
  };

  getCurrentTask = (): ITask | null => {
    return store.getState().process.currentTask;
  }

  fetchTasks = (): AppThunk => async dispatch => {
    
      try {
        dispatch(remoteLoading());
        const { data } = await api.post<ITask[]>('/tasks/search', store.getState().process.taskSearch);
        this.tasks = data;
        dispatch(this.storeTasks(this.tasks));
      } catch (err:any) {
        dispatch(remoteLoadingFail(err.toString()));
      }
  }
  
  claim = (): AppThunk => async dispatch => {
    if (store.getState().process.currentTask!.jobKey) {
      dispatch(assignTask(store.getState().auth.data!.username));
    } else {
    let url = '/tasks/' + store.getState().process.currentTask!.id + '/claim';
    api.get(url).then(response => {
      dispatch(assignTask(store.getState().auth.data!.username));
    }).catch(error => {
      alert(error.message);
    })
    }
  }

  unclaim = (): AppThunk => async dispatch => {
    if (store.getState().process.currentTask!.jobKey) {
      dispatch(unassignTask());
    } else {
      let url = '/tasks/' + store.getState().process.currentTask!.id + '/unclaim';
      api.get(url).then(response => {
        dispatch(unassignTask());
      }).catch(error => {
        alert(error.message);
      })
    }
  }

  submitTask = (data: any, callback?: any): AppThunk => async dispatch => {
    let url = '/tasks/' + store.getState().process.currentTask!.id
    if (store.getState().process.currentTask!.jobKey) {
      url = '/jobKey/' + store.getState().process.currentTask!.jobKey;
    }

    let indexTask = 0;
    for (; indexTask < this.tasks.length; indexTask++) {
      if (this.tasks[indexTask].id === store.getState().process.currentTask!.id) {
        break;
      }
    }
    api.post(url, data).then(response => {
      this.tasks.splice(indexTask, 1);
      dispatch(this.storeTasks(this.tasks));
      //dispatch(removeTask(indexTask));
      //dispatch(removeCurrentTask());
      if (callback) {
        callback();
      }
    }).catch(error => {
      alert(error.message);
    })
  }

  insertNewTask = (task: ITask): AppThunk => async dispatch => {
    const taskSearch = store.getState().process.taskSearch;
    if (taskSearch != null) {
      let shouldInsert = true;
      if (taskSearch.assignee != null) {
        if (taskSearch.assignee !== task.assignee) {
          shouldInsert = false;
        }
      }
      if (taskSearch.state != null) {
        if (taskSearch.state !== task.taskState) {
          shouldInsert = false;
        }
      }
      if (taskSearch.group != null) {
        if (task.candidateGroups.indexOf(taskSearch.group) < 0) {
          shouldInsert = false;
        }
      }
      if (shouldInsert) {

        this.tasks = [task, ...this.tasks];
        if (taskSearch && taskSearch.pageSize && this.tasks.length > taskSearch.pageSize) {
          this.tasks.splice(-1);
        }
        dispatch(this.storeTasks(this.tasks));
        //dispatch(prependTaskIntoList(task));
      }
    }
  };

  storeTasks = (tasks: ITask[]): AppThunk => async dispatch => {
    let store = Object.assign([], this.tasks);
    dispatch(remoteTasksLoadingSuccess(store));
  }
}

const taskService = new TaskService();

export default taskService;
