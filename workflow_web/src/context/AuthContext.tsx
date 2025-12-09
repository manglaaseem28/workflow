import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, AuthResponse } from "../types";
import api from "../api/client";

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    companyName: string,
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(false);

  // optional: you could hit /me here if you create that endpoint
  useEffect(() => {
    // For now, we just keep token; user will be set on login/signup
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>("/auth/sign_in", {
        email,
        password,
      });
      handleAuthSuccess(res.data);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    companyName: string,
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>("/auth/sign_up", {
        company_name: companyName,
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      handleAuthSuccess(res.data);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
