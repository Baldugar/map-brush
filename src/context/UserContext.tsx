import { createContext, useEffect, useState } from 'react'
import { User } from '../types/user_types'

export type UsersContextType = {
    users: User[]
    addUser: (user: User) => void
    editUser: (user: User) => void
    deleteUser: (id: string) => void
}

const localStorageKey = 'users'

export const UsersContext = createContext<UsersContextType | null>(null)

export const UsersProvider = ({ children }: { children: React.ReactNode }) => {
    const [users, setUsers] = useState<User[]>(() => {
        const data = localStorage.getItem(localStorageKey)
        if (data) {
            return JSON.parse(data)
        }
        return []
    })

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(users))
    }, [users])

    const addUser = (user: User) => {
        const newId = Math.random().toString(36).substr(2, 9)
        setUsers([...users, { ...user, id: newId }])
    }

    const editUser = (user: User) => {
        const newUsers = users.map((u) => (u.id === user.id ? user : u))
        setUsers(newUsers)
    }

    const deleteUser = (id: string) => {
        const newUsers = users.filter((u) => u.id !== id)
        setUsers(newUsers)
    }

    return <UsersContext.Provider value={{ users, addUser, deleteUser, editUser }}>{children}</UsersContext.Provider>
}
