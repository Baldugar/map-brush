import { ChevronLeft } from '@mui/icons-material'
import { Container, Grid, IconButton, Typography } from '@mui/material'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProjectsContext, ProjectsContextType } from '../../context/ProjectContext'
import ProjectCard from '../Projects/Components/ProjectCard'

const Planning = () => {
    const projectsContext = useContext<ProjectsContextType | null>(ProjectsContext)
    const navigate = useNavigate()

    if (!projectsContext) {
        throw new Error('You probably forgot to put <ProjectsProvider>.')
    }

    return (
        <Container>
            <Grid container spacing={3}>
                <Grid container item xs={12} alignItems={'center'} spacing={3}>
                    <Grid item xs={'auto'}>
                        <IconButton onClick={() => navigate(-1)}>
                            <ChevronLeft
                                sx={{
                                    fontSize: '4rem',
                                }}
                            />
                        </IconButton>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h1">Planning</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} container spacing={4}>
                    {projectsContext.projects.map((project) => (
                        <Grid key={project.id} item xs={12} sm={3}>
                            <ProjectCard
                                project={project}
                                onEditClick={() => {
                                    navigate(`/projects/${project.id}`)
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Container>
    )
}

export default Planning
