import { isEqual } from 'lodash'
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { Connection, Edge, Node, NodeMouseHandler, addEdge, useEdgesState, useNodesState, useStoreApi } from 'reactflow'
import { ProjectNodeData } from '../../../components/ProjectNode/ProjectNode'
import { Project, ProjectNodeType } from '../../../types/project_types'
import { getShadowCardDOMRect } from '../../../utils/func/project'

export interface UseProjectDialogStateParams {
    dialogData: Project
    setDialogData: Dispatch<SetStateAction<Project | undefined>>
}

export const useProjectDialogState = (params: UseProjectDialogStateParams) => {
    const { dialogData, setDialogData } = params

    /* MAIN DIALOG DATA */

    const handleCreateNodeClick = () => {
        setNodeDialogData({
            id: '',
            name: '',
            description: '',
            expertiseAreas: {
                backend: false,
                devOps: false,
                frontend: false,
                mobile: false,
                other: false,
                qa: false,
            },
            x: 0,
            y: 0,
        })
    }

    const updateNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNodeDialogData((node) => {
            if (node) {
                return {
                    ...node,
                    name: e.target.value,
                }
            }
            return node
        })
    }

    const updateDescriptionHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNodeDialogData((node) => {
            if (node) {
                return {
                    ...node,
                    description: e.target.value,
                }
            }
            return node
        })
    }

    /* NODE DIALOG DATA */

    const [nodeDialogData, setNodeDialogData] = useState<ProjectNodeType | undefined>(undefined)

    const closeNodeDialogHandler = () => setNodeDialogData(undefined)

    const updateNodeNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNodeDialogData((node) => {
            if (node) {
                return {
                    ...node,
                    name: e.target.value,
                }
            }
            return node
        })
    }

    const updateNodeDescriptionHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNodeDialogData((node) => {
            if (node) {
                return {
                    ...node,
                    description: e.target.value,
                }
            }
            return node
        })
    }

    const toggleExpertiseAreaHandler = (area: keyof ProjectNodeData['expertiseAreas']) => {
        setNodeDialogData((newNodeData) => {
            if (newNodeData) {
                return {
                    ...newNodeData,
                    expertiseAreas: {
                        ...newNodeData.expertiseAreas,
                        [area]: !newNodeData.expertiseAreas[area],
                    },
                }
            }
            return newNodeData
        })
    }

    const store = useStoreApi()

    const saveNodeDialogHandler = () => {
        if (!nodeDialogData) {
            return
        }
        let nodeID = nodeDialogData.id
        if (nodeID === '') {
            const {
                height,
                width,
                transform: [transformX, transformY, zoomLevel],
            } = store.getState()
            const zoomMultiplier = 1 / zoomLevel
            const centerX = -transformX * zoomMultiplier + (width * zoomMultiplier) / 2
            const centerY = -transformY * zoomMultiplier + (height * zoomMultiplier) / 2
            const shadowCardSize = getShadowCardDOMRect(nodeDialogData)
            const nodeWidthOffset = (shadowCardSize?.width || 0) / 2
            const nodeHeightOffset = (shadowCardSize?.height || 0) / 2

            nodeID = Math.random().toString(36).substr(2, 9)
            setDialogData((newDialogData) => {
                if (newDialogData) {
                    return {
                        ...newDialogData,
                        nodes: [
                            ...newDialogData.nodes,
                            {
                                ...nodeDialogData,
                                id: nodeID,
                                x: centerX - nodeWidthOffset,
                                y: centerY - nodeHeightOffset,
                            },
                        ],
                    }
                }
                return newDialogData
            })
        } else {
            setDialogData((newDialogData) => {
                if (newDialogData) {
                    return {
                        ...newDialogData,
                        nodes: newDialogData.nodes.map((node) => {
                            if (node.id === nodeID) {
                                return nodeDialogData
                            }
                            return node
                        }),
                    }
                }
                return newDialogData
            })
        }
        setNodeDialogData(undefined)
    }

    const disableNodeDialogSaveButton =
        !nodeDialogData ||
        nodeDialogData.name === '' ||
        nodeDialogData.description === '' ||
        Object.values(nodeDialogData.expertiseAreas).every((value) => !value)

    /* REACT FLOW */

    const [nodes, setNodes, onNodesChange] = useNodesState<ProjectNodeData | {}>(
        dialogData.nodes.map((node) => ({
            type: 'projectNode',
            id: node.id,
            data: {
                name: node.name,
                description: node.description,
                expertiseAreas: node.expertiseAreas,
                label: node.name,
            },
            position: {
                x: node.x,
                y: node.y,
            },
        })),
    )

    const [edges, setEdges, onEdgesChange] = useEdgesState(dialogData.links)

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

    const onMouseDoubleClick: NodeMouseHandler = (_, node) => {
        setNodeDialogData(dialogData.nodes.find((n) => n.id === node.id))
    }

    /* CONSISTENCY CHECKS */

    useEffect(() => {
        const currentDialogNodes: Node<ProjectNodeData>[] = dialogData.nodes.map((node) => ({
            id: node.id,
            type: 'projectNode',
            data: {
                name: node.name,
                description: node.description,
                expertiseAreas: node.expertiseAreas,
                label: node.name,
            },
            position: {
                x: node.x,
                y: node.y,
            },
        }))
        // Find nodes that are in the dialog but not in the current nodes
        const missingNodes = currentDialogNodes.filter((node) => !nodes.some((n) => n.id === node.id))
        // Find nodes that have name, description, or expertiseAreas that are different
        const changedNodes = currentDialogNodes.filter((node) =>
            nodes.some((n) => n.id === node.id && !isEqual(n.data, node.data)),
        )
        // Find nodes that are in the current nodes but not in the dialog
        const removedNodes = nodes.filter((node) => !currentDialogNodes.some((n) => n.id === node.id))

        // Add missing nodes
        if (missingNodes.length > 0) {
            setNodes((newNodes) => [...newNodes, ...missingNodes])
        }
        // Update changed nodes
        if (changedNodes.length > 0) {
            setNodes((newNodes) =>
                newNodes.map((node) => {
                    const changedNode = changedNodes.find((n) => n.id === node.id)
                    if (changedNode) {
                        return {
                            ...node,
                            data: changedNode.data,
                        }
                    }
                    return node
                }),
            )
        }
        // Remove removed nodes
        if (removedNodes.length > 0) {
            setNodes((newNodes) => newNodes.filter((node) => !removedNodes.some((n) => n.id === node.id)))
        }
    }, [dialogData.nodes])

    useEffect(() => {
        const currentNodes: ProjectNodeType[] = (nodes as Node<ProjectNodeData>[]).map((node) => ({
            id: node.id,
            name: node.data.name,
            description: node.data.description,
            expertiseAreas: node.data.expertiseAreas,
            x: node.position.x,
            y: node.position.y,
        }))
        if (!isEqual(dialogData.nodes, currentNodes)) {
            setDialogData((newDialogData) => {
                if (newDialogData) {
                    return {
                        ...newDialogData,
                        nodes: currentNodes,
                    }
                }
                return newDialogData
            })
        }
    }, [nodes])

    useEffect(() => {
        if (!isEqual(edges, dialogData.links)) {
            setEdges(dialogData.links)
        }
    }, [dialogData.links])

    useEffect(() => {
        if (!isEqual(edges, dialogData.links)) {
            setDialogData((newDialogData) => {
                if (newDialogData) {
                    return {
                        ...newDialogData,
                        links: edges,
                    }
                }
                return newDialogData
            })
        }
    }, [edges])

    return {
        data: {
            updateNameHandler,
            updateDescriptionHandler,
            handleCreateNodeClick,
        },
        nodeDialog: {
            nodeDialogData,
            closeNodeDialogHandler,
            updateNodeNameHandler,
            updateNodeDescriptionHandler,
            toggleExpertiseAreaHandler,
            disableNodeDialogSaveButton,
            saveNodeDialogHandler,
        },
        reactFlow: {
            onConnect,
            onNodesChange,
            onEdgesChange,
            nodes,
            edges,
            onMouseDoubleClick,
        },
    }
}
