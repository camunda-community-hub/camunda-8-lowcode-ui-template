

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
  name: string;
  processName: string;
  creationTime: string;
  assignee: string | null;
  candidateGroups: string[];
  taskState: string;
  formKey: string;
  variables: IVariable[];
  processDefinitionId: string;
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
  assignee: string | null;
  group: string | null;
  taskState: string | null;
  pageSize: number | null;
}

export interface IFormViewer {
  schema: string;
  variables: IVariable[] | undefined;
  disabled: boolean;
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
