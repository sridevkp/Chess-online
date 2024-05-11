import { createContext, useState } from "react";

const UserContext = createContext({})

export function UserProvider({ children }) {
  const [ user, setUser ] = useState({ playing: true })

  const resetUser = () => {
    setUser({ playing: true })
  }

  return (
    <UserContext.Provider value={{ user, setUser, resetUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext