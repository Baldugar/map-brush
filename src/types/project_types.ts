import { ExpertiseArea, User } from './user_types'

export type Project = {
    id: string
    name: string
    description: string
    nodes: ProjectNodeType[]
    links: ProjectNodeLink[]
    userAreas: ProjectUserBrush[]
}

export type ProjectNodeType = {
    id: string
    name: string
    description: string
    expertiseAreas: Record<ExpertiseArea, boolean>
    x: number
    y: number
}

export type ProjectNodeLinkEnd = {
    nodeID: string
    direction: 'in' | 'out'
}

export type ProjectNodeLink = {
    id: string
    source: string
    target: string
}

export type ProjectUserBrush = {
    user: User
    x1: number
    y1: number
    x2: number
    y2: number
}
