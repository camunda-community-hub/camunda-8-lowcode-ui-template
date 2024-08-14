

export interface IUser {
  username: string;
  password: Password|null;
  firstname: string;
  lastname: string;
  token?: string;
  profile: string;
  groups: string[];
}

export interface Password {
  value: string;
  encrypted: boolean;
}

export interface ITask {
  id: number;
  jobKey: number;
  name: string;
  processName: string;
  creationDate: string;
  assignee: string | null;
  candidateGroups: string[];
  taskState: string;
  formKey: string;
  formId: string;
  isFormEmbedded: boolean;
  variables: any;
  sortValues: string[];
  processDefinitionKey: string;
  processInstanceKey: string;
  taskDefinitionId: string;
}

export interface IVariable {
  id: string;
  name: string;
  value: any;
  type: string;
}

export interface IProcess {
  key: number;
  name: string;
  version: number;
  bpmnProcessId: string;
}

export interface ITaskSearch {
  assigned: string | undefined;
  assignee: string | undefined;
  group: string | undefined;
  state: string;
  filterVariables: any | undefined;
  pageSize: number | undefined;
  search: string[] | undefined;
  direction: string | undefined;
  numPage: number;
}

export interface IFormViewer {
  id: string;
  formKey: string | null;
  schema: any | null;
  variables: any | undefined;
  disabled: boolean;
}

export interface IInstanceViewer {
  instancekey: number;
  processDefinitionKey: number;
  variables: any;
}


export interface CaseMgmtViewer {
  type: string;
  taskEltId: string | null;
  bpmnProcessId: string|null;
  processInstanceKey: number;
  processDefinitionKey: string | null;
  variables: any;
  instances: any[] | null;
  redirect: string;
}

export interface Organization {
  oldname: string;
  name: string;
  modified: string;
  active: boolean;
  users: IUser[];
  groups: string[];
  userMemberships: UserMemberships[];
}

export interface UserMemberships {
  username: string;
  profile: string;
  groups: string[];
}
