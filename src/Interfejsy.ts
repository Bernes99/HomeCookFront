export type Testowy = {
  test1: string;
  test2: number;
};

export type User = {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  lastLogin: string;
  isDeleted: boolean;
};

export type PaginationModel = {
  pageSize: number;
  currentPage: number;
  searchPhrase: string;
  sortBy: string;
  sortDirection: string;
};

export type UserPaginationList = {
  items: User[];
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
  itemsCount: number;
};

export type IsLogin = {
  email: string | null;
  id: string;
  isAuthenticated: boolean;
  role: Role;
};

export type Role = "Admin" | "User";
