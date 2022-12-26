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

export type PaginationList<T> = {
  items: T[];
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

export type RecipeListItem = {
  id: string;
  title: string;
  dateCreatedUtc: string;
  author: string;
  rating: number;
  difficulty: number;
  mainImage: string;
  products: string[];
};
export type RecipeProduct = {
  product: Product;
  amount: number;
};
export type Recipe = {
  id: string;
  dateUtc: string;
  title: string;
  introdution: string;
  text: string;
  rating: number;
  portion: string;
  preparingTime: string;
  difficulty: number;
  author: RecipeUser;
  products: RecipeProduct[];
  categories: Category[];
  mainImage: string;
  images: string[];
  tags: Category[];
};
export type RecipeUser = {
  id: string;
  firstName: string;
  surname: string;
  email: string;
};

export type RecipeComment = {
  id: string;
  text: string;
  dateCreatedUtc: string;
  author: string;
  authorProfile: string;
};

export type RecipeFilters = {
  dateCreatedUtc: string;
  rating: number;
  difficulty: number;
  categoryNames: string[];
  products: string[];
};

export type AddRecipe = {
  title: string;
  introdution: string;
  text: string;
  portion: string;
  authorId: string;
  preparingTime: string;
  difficulty: number;
  products: Array<AddRecipeProduct>;
  categoriesIds: Array<string>;
  tags: Array<string>;
};
export type AddRecipeProduct = {
  productId: string;
  amount: number;
};

export type UserProducts = {
  id: string;
  product: Product;
  expirationDate: string;
  amount: number;
  isOnShoppingList: boolean;
};

export type AddUserProducts = {
  productId: string;
  expirationDate: string;
  amount: number;
  isOnShoppingList: boolean;
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
