import { ChevronLeft } from '@mui/icons-material'
import { Button, Container, Grid, IconButton, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'
import { ProjectsContext } from '../../context/ProjectContext'
import { Project } from '../../types/project_types'
import ProjectCard from './Components/ProjectCard'
import ProjectDialog from './Components/ProjectDialog'

const ProjectsList = () => {
    const projectsContext = useContext(ProjectsContext)
    const [dialogData, setDialogData] = useState<Project>()
    const navigate = useNavigate()

    const handleCreateProjectClick = () => {
        setDialogData({
            id: '',
            name: '',
            description: '',
            links: [],
            nodes: [],
            userAreas: [],
        })
    }

    if (!projectsContext) {
        throw new Error('You probably forgot to put <ProjectsProvider>.')
    }
    const { projects, addProject, deleteProject, editProject } = projectsContext

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
                        <Typography variant={'h1'}>Projects</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button variant={'contained'} color={'primary'} size={'large'} onClick={handleCreateProjectClick}>
                        Add Project
                    </Button>
                </Grid>
                {projects.map((project) => (
                    <Grid key={project.id} item xs={12} sm={3}>
                        <ProjectCard
                            project={project}
                            onEditClick={() => {
                                setDialogData(project)
                            }}
                            onDeleteClick={() => deleteProject(project.id)}
                        />
                    </Grid>
                ))}
            </Grid>
            {dialogData && (
                <ReactFlowProvider>
                    <ProjectDialog
                        dialogData={dialogData}
                        setDialogData={setDialogData}
                        onConfirm={(dialogData) => {
                            if (dialogData?.id) {
                                editProject(dialogData)
                            } else {
                                addProject(dialogData)
                            }
                            setDialogData(undefined)
                        }}
                    />
                </ReactFlowProvider>
            )}
        </Container>
    )
}

export default ProjectsList
