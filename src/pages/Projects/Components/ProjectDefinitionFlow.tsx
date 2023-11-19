import { Box, Grid } from '@mui/material'
import ReactFlow, {
    Background,
    BackgroundVariant,
    ConnectionMode,
    Controls,
    Edge,
    Node,
    NodeMouseHandler,
    NodeTypes,
    OnConnect,
    OnEdgesChange,
    OnNodesChange,
} from 'reactflow'
import ProjectNode from '../../../components/ProjectNode/ProjectNode'

export interface ProjectDefinitionFlowProps {
    nodes: Node<any>[]
    edges: Edge<any>[]
    onNodesChange: OnNodesChange
    onConnect: OnConnect
    onEdgesChange: OnEdgesChange
    onNodeDoubleClick: NodeMouseHandler
}

const nodeTypes: NodeTypes = {
    projectNode: ProjectNode,
}

const ProjectDefinitionFlow = (props: ProjectDefinitionFlowProps) => {
    const { nodes, edges, onNodesChange, onConnect, onEdgesChange, onNodeDoubleClick } = props
    return (
        <Grid item xs position={'relative'}>
            <Box
                id={'center'}
                position={'absolute'}
                width={2}
                height={2}
                borderRadius={'50%'}
                top={'calc(50% - 1px)'}
                left={'calc(50% - 1px)'}
                sx={{
                    backgroundColor: 'red',
                    zIndex: 50,
                }}
            />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={{
                    type: 'smoothstep',
                }}
                onNodeDoubleClick={onNodeDoubleClick}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                connectionMode={ConnectionMode.Loose}
                onConnect={onConnect}
                fitView={true}
                fitViewOptions={{
                    padding: 1,
                    maxZoom: 1,
                }}
                style={{
                    border: '1px solid #ddd',
                }}
                proOptions={{
                    hideAttribution: true,
                }}
            >
                <Controls
                    fitViewOptions={{
                        padding: 1,
                        maxZoom: 1,
                    }}
                />
                <Background variant={BackgroundVariant.Dots} gap={10} size={0.5} />
            </ReactFlow>
        </Grid>
    )
}

export default ProjectDefinitionFlow
