export interface User {
  id?: number;
  name?: string;
  gender?: string;
  age_group?: string;
  role?: string;
  category?: string;
  uuid?: string;
  errors?: string;
  //The ? is for make it optionals
}

export enum UserRoleName {
  branch = "Branch",
  client = "Client",
  user = "User",
}

export enum UserRoleValue {
  branch = "BRANCH",
  client = "CLIENT",
  user = "USER",
}
