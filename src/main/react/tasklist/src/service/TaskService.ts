import store, { AppThunk } from '../store';
import formService from './FormService';
import { remoteLoading, assignTask, unassignTask, remoteTasksLoadingSuccess, remoteLoadingFail, prependTaskIntoList, setTask, setFormSchema, removeCurrentTask, setTaskSearch, before, after } from '../store/features/processes/slice';
import { ITask, ITaskSearch } from '../store/model';
import api from './api';
import { Stomp, StompSubscription } from '@stomp/stompjs';
import { env } from '../env';

const connectStompClient = () => {
  let myStompClient = Stomp.client(`ws://${env.ws}/ws`);

  myStompClient.onStompError = function (frame) {
    console.log('STOMP error');
  };

  return myStompClient;
}

const stompClient = connectStompClient();

export class TaskService {

  lastFetchTasks: number = 0;
  stompSubscriptions: StompSubscription[] = [];

  connectToWebSockets = (username: string): AppThunk => async dispatch => {
    try {
      const callback = (message: any) => {
        let task = JSON.parse(message.body);
        // Update the list of tasks
        dispatch(this.insertNewTask(task));
      }
      const subs = this.stompSubscriptions;
      stompClient.onConnect = function (frame) {
        subs.push(stompClient!.subscribe("/topic/" + username + "/userTask", callback));
        subs.push(stompClient!.subscribe("/topic/userTask", callback));
      };
      stompClient.activate();
    } catch (error: any) {
      console.warn(error);
    }
  }

  disconnectFromWebScokets = () => {
    try {
    for (let i = 0; i < this.stompSubscriptions.length; i++) {
      stompClient.unsubscribe(this.stompSubscriptions[i].id);
    }
    this.stompSubscriptions = [];
    stompClient.deactivate();
    } catch (error: any) {
      console.warn(error);
  }
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
  setTask = (task: ITask | null): AppThunk => async dispatch => {
    if (task) {
      if (task.formKey === "processVariableFormKey") {
        task = Object.assign({}, task);
        task.formKey = task.variables.formKey;
      }
      if (!formService.customFormExists(task.formKey)) {
        let ln = localStorage.getItem('camundLocale');
        let url = '/forms/' + task.processName + '/' + task.processDefinitionId + '/' + task.formKey + '/' + ln;
        api.get(url).then(response => {
          dispatch(setFormSchema(response.data));
        }).catch(error => {
          alert(error.message);
        })
      }
    }
    dispatch(setTask(task));
  };

  getCurrentTask = (): ITask | null => {
    return store.getState().process.currentTask;
  }

  fetchTasks = (): AppThunk => async dispatch => {
    if (this.lastFetchTasks < Date.now() - 1000) {
      this.lastFetchTasks = Date.now();
      try {
        dispatch(remoteLoading());
        const { data } = await api.post<ITask[]>('/tasks/search', store.getState().process.taskSearch);
        dispatch(remoteTasksLoadingSuccess(data));
      } catch (err:any) {
        dispatch(remoteLoadingFail(err.toString()));
      }
    }
  }
  
  claim = (): AppThunk => async dispatch => {
    let url = '/tasks/' + store.getState().process.currentTask!.id + '/claim/';
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
