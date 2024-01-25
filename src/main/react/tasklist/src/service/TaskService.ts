import store, { AppThunk } from '../store';
import formService from './FormService';
import { setTasklistConf, remoteLoading, assignTask, unassignTask, remoteTasksLoadingSuccess, remoteLoadingFail, prependTaskIntoList, setTask, setFormSchema, removeCurrentTask, setTaskSearch, before, after } from '../store/features/processes/slice';
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

  stompSubscriptions: StompSubscription[] = [];

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
  setTask = (task: ITask | null, callback?: any): AppThunk => async dispatch => {
    if (task) {
      task = Object.assign({}, task);
      const { data } = await api.get('/tasks/' + task.id + '/variables');
      task.variables = data;
      if (task.formKey === "processVariableFormKey") {
        task.formKey = task.variables.formKey;
      }
      if (!formService.customFormExists(task.formKey)) {
        let ln = localStorage.getItem('camundLocale');
        let url = '/forms/' + task.processDefinitionKey + '/' + task.formKey + '/' + ln;
        if (task.formId) {
          url = '/forms/' + task.processDefinitionKey + '/linked/' + task.formId + '/' + ln;
        } else if (task.formKey.startsWith("camunda-forms:bpmn:")) {
          url = '/forms/' + task.processDefinitionKey + '/embedded/' + task.formKey + '/' + ln;
        }
        api.get(url).then(response => {
          dispatch(setFormSchema(response.data));
          if (callback) {
            callback();
          }
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
    
      try {
        dispatch(remoteLoading());
        const { data } = await api.post<ITask[]>('/tasks/search', store.getState().process.taskSearch);
        dispatch(remoteTasksLoadingSuccess(data));
      } catch (err:any) {
        dispatch(remoteLoadingFail(err.toString()));
      }
  }
  
  claim = (): AppThunk => async dispatch => {
    let url = '/tasks/' + store.getState().process.currentTask!.id + '/claim';
    api.get(url).then(response => {
      dispatch(assignTask(store.getState().auth.data!.username));
    }).catch(error => {
      alert(error.message);
    })
  }

  unclaim = (): AppThunk => async dispatch => {
    let url = '/tasks/' + store.getState().process.currentTask!.id + '/unclaim';
    api.get(url).then(response => {
      dispatch(unassignTask());
    }).catch(error => {
      alert(error.message);
    })
  }

  submitTask = (data: any, callback?: any): AppThunk => async dispatch => {
    api.post('/tasks/' + store.getState().process.currentTask!.id, data).then(response => {
      dispatch(removeCurrentTask());
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
        dispatch(prependTaskIntoList(task));
      }
    }
  };
}

const taskService = new TaskService();

export default taskService;
