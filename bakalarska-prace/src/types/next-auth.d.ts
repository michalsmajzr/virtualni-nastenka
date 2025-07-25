import { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: string;
  }
}

declare module "next-auth" {
  interface User {
    id: number;
    role: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: number;
      role: string;
    };
  }
}
