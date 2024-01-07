import { Box, Grid } from '@mui/material'
import { MouseEventHandler, useState } from 'react'
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
    OnSelectionChangeFunc,
    Panel,
    SelectionMode,
} from 'reactflow'
import ProjectNode, { ProjectNodeData } from '../../../components/ProjectNode/ProjectNode'
import { ProjectNodeLink } from '../../../types/project_types'

export interface ProjectDefinitionFlowProps {
    nodes: Node<ProjectNodeData>[]
    edges: Edge<ProjectNodeLink>[]
    onNodesChange: OnNodesChange
    onConnect: OnConnect
    onEdgesChange: OnEdgesChange
    onNodeDoubleClick: NodeMouseHandler
    onLayout: (layout: 'LR' | 'TB') => void
    onBrushEnd: (nodes: Node<ProjectNodeData>[]) => void
}

const nodeTypes: NodeTypes = {
    projectNode: ProjectNode,
}

const ProjectDefinitionFlow = (props: ProjectDefinitionFlowProps) => {
    const { nodes, edges, onNodesChange, onConnect, onEdgesChange, onNodeDoubleClick, onLayout, onBrushEnd } = props
    const [selectedNodes, setSelectedNodes] = useState<Node<ProjectNodeData>[]>([])

    const onSelectionChange: OnSelectionChangeFunc = ({ nodes }) => {
        setSelectedNodes(nodes)
    }
    const onSelectionEnd: (event: React.MouseEvent<Element, MouseEvent>) => void = (event) => {
        event.stopPropagation()
        event.preventDefault()
        onBrushEnd(selectedNodes)
    }

    const onLayoutHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
        const layout = e.currentTarget.id as 'LR' | 'TB'
        onLayout(layout)
    }

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
                onSelectionChange={onSelectionChange}
                onSelectionEnd={onSelectionEnd}
                selectionMode={SelectionMode.Full}
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
                <Panel position="top-right">
                    <button id={'TB'} onClick={onLayoutHandler}>
                        vertical layout
                    </button>
                    <button id={'LR'} onClick={onLayoutHandler}>
                        horizontal layout
                    </button>
                </Panel>
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
