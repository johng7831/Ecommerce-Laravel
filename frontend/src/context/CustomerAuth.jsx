import { createContext, useState } from "react";

export const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
  const customerInfo = localStorage.getItem("customerInfo");

  const [user, setUser] = useState(
    customerInfo ? JSON.parse(customerInfo) : null
  );

  const login = (data) => {
    setUser(data);
    localStorage.setItem("customerInfo", JSON.stringify(data));
  };

  const logout = () => {
    localStorage.removeItem("customerInfo");
    setUser(null);
  };

  return (
    <CustomerAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};
