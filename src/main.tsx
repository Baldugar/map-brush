import { CssBaseline, ThemeProvider } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ProjectsProvider } from './context/ProjectContext.tsx'
import { UsersProvider } from './context/UserContext.tsx'
import './index.css'
import Home from './pages/Home/Home.tsx'
import ProjectsList from './pages/Projects/Projects.tsx'
import UsersList from './pages/Users/Users.tsx'
import theme from './theme.ts'

const router = createBrowserRouter([
    {
        path: '/',
        Component: Home,
    },
    {
        path: '/users',
        Component: UsersList,
    },
    {
        path: '/projects',
        Component: ProjectsList,
    },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <UsersProvider>
                <ProjectsProvider>
                    <RouterProvider router={router} />
                </ProjectsProvider>
            </UsersProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
