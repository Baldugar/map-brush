import { Box, Card, CardContent, CardHeader, Chip, Grid } from '@mui/material'
import { Handle, NodeProps, Position } from 'reactflow'
import { ExpertiseArea } from '../../types/user_types'

export type ProjectNodeData = {
    name: string
    description: string
    expertiseAreas: Record<ExpertiseArea, boolean>
}

const ProjectNode = (props: NodeProps<ProjectNodeData>) => {
    const { data } = props
    const { name, description, expertiseAreas } = data
    return (
        <Box width={'fit-content'} maxWidth={'800px'}>
            <Handle id={'top'} position={Position.Top} type={'source'} isConnectableEnd isConnectableStart />
            <Handle id={'left'} position={Position.Left} type={'source'} isConnectableEnd isConnectableStart />
            <Card>
                <CardHeader title={name} subheader={description} />
                <CardContent>
                    <Grid container spacing={2}>
                        {Object.entries(expertiseAreas)
                            .filter(([_, v]) => v)
                            .map(([key]) => (
                                <Grid item key={key}>
                                    <Chip
                                        label={key.length > 2 ? key[0].toUpperCase() + key.slice(1) : key.toUpperCase()}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </CardContent>
            </Card>
            <Handle id={'bottom'} position={Position.Bottom} type={'source'} isConnectableEnd isConnectableStart />
            <Handle id={'right'} position={Position.Right} type={'source'} isConnectableEnd isConnectableStart />
        </Box>
    )
}

export default ProjectNode
