import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

// Create UserContext
export const UserContext = createContext({
  user: null,
  setUser: () => {},
  ready: false,
  setReady: () => {},
});

// UserContextProvider Component
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      axios
        .get("http://localhost:4000/profile")
        .then(({ data }) => {
          setUser(data);
          setReady(true);
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          setReady(true); // Mark ready even if there's an error
        });
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, ready, setReady }}>
      {children}
    </UserContext.Provider>
  );
}
