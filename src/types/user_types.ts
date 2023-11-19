export enum ExpertiseArea {
    Frontend = 'frontend',
    Backend = 'backend',
    Mobile = 'mobile',
    DevOps = 'devOps',
    QA = 'qa',
    Other = 'other',
}

export type User = {
    id: string
    name: string
    expertiseAreas: Record<ExpertiseArea, boolean>
}
