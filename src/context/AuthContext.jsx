import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Hardcoded users (Replace with real authentication later)
  const users = [
    { username: "dev", password: "1234", role: "Developer" },
    { username: "manager", password: "admin", role: "Manager" },
  ];

  // Persist user state in local storage on page load
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = (username, password) => {
    const foundUser = users.find((u) => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser)); // Save to local storage
      return true;
    }
    return false; // Invalid credentials
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove from local storage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
