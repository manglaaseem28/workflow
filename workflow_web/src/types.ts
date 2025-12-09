export type Company = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
  company: Company;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Workflow = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: "initial" | "planning" | "review" | "closed";
  workflow_id: number;
  created_at?: string;
  updated_at?: string;
};
