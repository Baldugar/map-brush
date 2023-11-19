import { createContext, useEffect, useState } from 'react'
import { Project } from '../types/project_types'

export type ProjectsContextType = {
    projects: Project[]
    addProject: (project: Project) => void
    editProject: (project: Project) => void
    deleteProject: (id: string) => void
}

const localStorageKey = 'projects'

export const ProjectsContext = createContext<ProjectsContextType | null>(null)

export const ProjectsProvider = ({ children }: { children: React.ReactNode }) => {
    const [projects, setProjects] = useState<Project[]>(() => {
        const data = localStorage.getItem(localStorageKey)
        if (data) {
            return JSON.parse(data)
        }
        return []
    })

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(projects))
    }, [projects])

    const addProject = (project: Project) => {
        const newId = Math.random().toString(36).substr(2, 9)
        setProjects([...projects, { ...project, id: newId }])
    }

    const editProject = (project: Project) => {
        const newProjects = projects.map((p) => (p.id === project.id ? project : p))
        setProjects(newProjects)
    }

    const deleteProject = (id: string) => {
        const newProjects = projects.filter((p) => p.id !== id)
        setProjects(newProjects)
    }

    return (
        <ProjectsContext.Provider value={{ projects, addProject, deleteProject, editProject }}>
            {children}
        </ProjectsContext.Provider>
    )
}
