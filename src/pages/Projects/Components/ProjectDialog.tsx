import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { Project } from '../../../types/project_types'

import dagre from 'dagre'
import { Edge, Node, Position } from 'reactflow'
import 'reactflow/dist/style.css'
import { ProjectNodeData } from '../../../components/ProjectNode/ProjectNode'
import { getShadowCardDOMRect } from '../../../utils/func/project'
import NodeDialog from './NodeDialog'
import ProjectDefinitionFlow from './ProjectDefinitionFlow'
import { useProjectDialogState } from './useProjectDialogState'

export type ProjectDialogProps = {
    dialogData: Project
    setDialogData: Dispatch<SetStateAction<Project | undefined>>
    onConfirm: (dialogData: Project) => void
}

const getLayoutedElements = (
    nodes: Node<ProjectNodeData>[],
    edges: Edge<any>[],
    direction: 'LR' | 'TB' = 'TB',
    dagreGraph: dagre.graphlib.Graph<Record<string, never>>,
) => {
    const isHorizontal = direction === 'LR'
    dagreGraph.setGraph({ rankdir: direction })

    nodes.forEach((node) => {
        const shadowCard = getShadowCardDOMRect({
            description: node.data.description,
            expertiseAreas: node.data.expertiseAreas,
            name: node.data.name,
            id: node.id,
            x: node.position.x,
            y: node.position.y,
        })
        dagreGraph.setNode(node.id, { width: shadowCard?.width || 50, height: shadowCard?.height || 50 })
    })

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id)
        node.targetPosition = isHorizontal ? Position.Left : Position.Top
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom

        const shadowCard = getShadowCardDOMRect({
            description: node.data.description,
            expertiseAreas: node.data.expertiseAreas,
            name: node.data.name,
            id: node.id,
            x: node.position.x,
            y: node.position.y,
        })

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - (shadowCard?.width || 50) / 2,
            y: nodeWithPosition.y - (shadowCard?.height || 50) / 2,
        }

        return node
    })

    return { nodes, edges }
}

const dagreGraph = new dagre.graphlib.Graph()

const ProjectDialog = (props: ProjectDialogProps) => {
    const { dialogData, setDialogData, onConfirm } = props

    const closeHandler = () => setDialogData(undefined)
    const disableDialog = !dialogData || dialogData.name === '' || dialogData.description === ''
    const confirmHandler = () => onConfirm(dialogData as Project)

    const {
        data: { handleCreateNodeClick, updateDescriptionHandler, updateNameHandler },
        nodeDialog: {
            nodeDialogData,
            closeNodeDialogHandler,
            toggleExpertiseAreaHandler,
            updateNodeDescriptionHandler,
            updateNodeNameHandler,
            disableNodeDialogSaveButton,
            saveNodeDialogHandler,
        },
        reactFlow: {
            edges,
            setEdges,
            nodes,
            setNodes,
            onConnect,
            onEdgesChange,
            onNodesChange,
            onMouseDoubleClick,
            createArea,
        },
    } = useProjectDialogState({
        dialogData,
        setDialogData,
    })

    dagreGraph.setDefaultEdgeLabel(() => ({}))

    const onLayout = useCallback(
        (direction: 'LR' | 'TB') => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                nodes,
                edges,
                direction,
                dagreGraph,
            )

            setNodes([...layoutedNodes])
            setEdges([...layoutedEdges])
        },
        [nodes, edges, setNodes, setEdges],
    )

    return (
        <>
            <Dialog open={true} onClose={closeHandler} fullScreen>
                <DialogTitle>
                    <Button
                        sx={{
                            marginRight: 2,
                        }}
                        variant={'outlined'}
                        onClick={handleCreateNodeClick}
                    >
                        Add Node
                    </Button>
                    {`Project${dialogData.name.length > 0 ? ` - ${dialogData.name}` : ''}`}
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <Grid direction={'column'} container spacing={2} height={1}>
                        <Grid item xs={'auto'} container spacing={2}>
                            <Grid item xs>
                                <TextField
                                    size="small"
                                    variant={'filled'}
                                    autoFocus
                                    fullWidth
                                    id={'name'}
                                    label={'Name'}
                                    value={dialogData.name}
                                    onChange={updateNameHandler}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    size={'small'}
                                    variant={'filled'}
                                    fullWidth
                                    id={'description'}
                                    label={'Description'}
                                    value={dialogData.description}
                                    onChange={updateDescriptionHandler}
                                />
                            </Grid>
                        </Grid>
                        {dialogData && (
                            <ProjectDefinitionFlow
                                edges={edges}
                                nodes={nodes}
                                onConnect={onConnect}
                                onEdgesChange={onEdgesChange}
                                onNodeDoubleClick={onMouseDoubleClick}
                                onNodesChange={onNodesChange}
                                onLayout={onLayout}
                                onBrushEnd={createArea}
                            />
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button size={'small'} onClick={closeHandler}>
                        Cancel
                    </Button>
                    <Button size={'small'} disabled={disableDialog} onClick={confirmHandler}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Node editing dialog */}
            {nodeDialogData && (
                <NodeDialog
                    closeNodeDialogHandler={closeNodeDialogHandler}
                    disableNodeDialogSaveButton={disableNodeDialogSaveButton}
                    nodeDialogData={nodeDialogData}
                    saveNodeDialogHandler={saveNodeDialogHandler}
                    toggleExpertiseAreaHandler={toggleExpertiseAreaHandler}
                    updateNodeDescriptionHandler={updateNodeDescriptionHandler}
                    updateNodeNameHandler={updateNodeNameHandler}
                />
            )}
        </>
    )
}

export default ProjectDialog
