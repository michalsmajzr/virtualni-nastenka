export interface User {
  id: number;
  path: string;
  url: string;
  firstname: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  role: "teacher" | "user";
  changePassword: boolean;
}

export type UserAdministration = Pick<
  User,
  "id" | "url" | "firstname" | "surname" | "email" | "phone"
>;

export type UserPoll = Pick<User, "id" | "url" | "firstname" | "surname">;
