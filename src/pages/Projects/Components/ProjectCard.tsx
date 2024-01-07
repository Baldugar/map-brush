import { Edit, RemoveOutlined } from '@mui/icons-material'
import { Card, CardHeader, Grid, IconButton } from '@mui/material'
import { Project } from '../../../types/project_types'

const ProjectCard = ({
    project,
    onEditClick,
    onDeleteClick,
}: {
    project: Project
    onEditClick: () => void
    onDeleteClick?: () => void
}) => {
    return (
        <Card>
            <CardHeader
                title={project.name}
                subheader={project.description}
                action={
                    <Grid container spacing={2}>
                        <Grid item xs>
                            <IconButton onClick={onEditClick}>
                                <Edit />
                            </IconButton>
                        </Grid>
                        {onDeleteClick && (
                            <Grid item xs>
                                <IconButton onClick={onDeleteClick}>
                                    <RemoveOutlined />
                                </IconButton>
                            </Grid>
                        )}
                    </Grid>
                }
            />
        </Card>
    )
}

export default ProjectCard
