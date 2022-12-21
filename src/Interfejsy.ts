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

export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  calories: number;
  unitType: number;
  unitName: string;
  category: Category;
};
export type UpdateProduct = {
  id: string;
  name: string;
  calories: number;
  unitType: number;
  categoryId: string;
};
// export type UnitTypes = "item" | "ml" | "l" | "g" | "kg";
export const UnitTypes = ["item", "ml", "l", "g", "kg"] as const;
export type Role = "Admin" | "User";

export type ResetPasswordModel = {
  userId: string;
  resetToken: string;
  newPassword: string;
  newPasswordConfirm: string;
};
