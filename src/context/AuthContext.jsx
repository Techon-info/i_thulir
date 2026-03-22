import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = [
  { id: 1, email: 'admin@ithulir.com',   password: 'admin123',   role: 'admin',   name: 'Admin'  },
  { id: 2, email: 'cashier@ithulir.com', password: 'cashier123', role: 'cashier', name: 'Cashier'},
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ithulir_user')) || null; }
    catch { return null; }
  });

  const login = (email, password, role) => {
    // Allow any password for demo — just match email + role
    const found = MOCK_USERS.find(u =>
      u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );
    if (found) {
      localStorage.setItem('ithulir_user', JSON.stringify(found));
      setUser(found);
      return { success: true, user: found };
    }
    // Fallback — allow any email if role matches for demo
    const demoUser = { id: Date.now(), email, role, name: role === 'admin' ? 'Admin' : 'Cashier' };
    localStorage.setItem('ithulir_user', JSON.stringify(demoUser));
    setUser(demoUser);
    return { success: true, user: demoUser };
  };

  const register = (name, email, role) => {
    const newUser = { id: Date.now(), name, email, role };
    localStorage.setItem('ithulir_user', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('ithulir_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
