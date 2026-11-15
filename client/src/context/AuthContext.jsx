
import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = async (email, password, isAdmin = false) => {
  const response = await api.post("/auth/login", {
    email: email.trim().toLowerCase(),
    password,
    isAdmin,
  });

  const { token: newToken, user: loggedInUser } = response.data;

  if (!newToken || !loggedInUser) {
    throw new Error("Invalid login response from server.");
  }

  if (isAdmin && loggedInUser.role !== "admin") {
    throw new Error("Access denied. Administrators only.");
  }

  localStorage.setItem("token", newToken);
  localStorage.setItem("user", JSON.stringify(loggedInUser));

  setToken(newToken);
  setUser(loggedInUser);

  return loggedInUser;
};

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

