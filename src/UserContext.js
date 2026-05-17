import React, { createContext, useState } from "react";
import { updateUserScore, fetchUserScore } from "./data/firebaseFunctions";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState("");

  const updateScore = async (user, delta) => {
    await updateUserScore(user, delta);
  };

  const getScore = async (user) => {
    return await fetchUserScore(user);
  };

  return (
    <UserContext.Provider value={{ username, setUsername, updateScore, getScore }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;