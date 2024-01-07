import { isEqual, uniqueId } from 'lodash'
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { Connection, Edge, Node, NodeMouseHandler, addEdge, useEdgesState, useNodesState, useStoreApi } from 'reactflow'
import { ProjectNodeData } from '../../../components/ProjectNode/ProjectNode'
import { Project, ProjectNodeLink, ProjectNodeType } from '../../../types/project_types'
import { getShadowCardDOMRect } from '../../../utils/func/project'

export interface UseProjectDialogStateParams {
    dialogData: Project
    setDialogData: Dispatch<SetStateAction<Project | undefined>>
}

export const useProjectDialogState = (params: UseProjectDialogStateParams) => {
    const { dialogData, setDialogData } = params

    /* #region Main Dialog Data */
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
        setDialogData((dialog) => {
            if (dialog) {
                return {
                    ...dialog,
                    name: e.target.value,
                }
            }
            return dialog
        })
    }

    const updateDescriptionHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setDialogData((dialog) => {
            if (dialog) {
                return {
                    ...dialog,
                    description: e.target.value,
                }
            }
            return dialog
        })
    }

    /* #endregion */

    /* #region Node Dialog Data */
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
    /* #endregion */

    /* #region React Flow */
    const [nodes, setNodes, onNodesChange] = useNodesState<ProjectNodeData | any>(
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

    console.log(nodes.findIndex((node) => node.id === 'area'))

    const [edges, setEdges, onEdgesChange] = useEdgesState<ProjectNodeLink>(dialogData.links)

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

    const onMouseDoubleClick: NodeMouseHandler = (_, node) => {
        setNodeDialogData(dialogData.nodes.find((n) => n.id === node.id))
    }

    const createArea = (allNodes: Node<ProjectNodeData>[]) => {
        const nodes = allNodes.filter((n) => n.type === 'projectNode')
        if (nodes.length === 0) {
            return
        }
        console.log(nodes)
        const minX = Math.min(...nodes.map((node) => node.position.x))
        const minY = Math.min(...nodes.map((node) => node.position.y))
        const maxX = Math.max(...nodes.map((node) => node.position.x + (node.width ?? 0)))
        const maxY = Math.max(...nodes.map((node) => node.position.y + (node.height ?? 0)))

        const width = maxX - minX
        const height = maxY - minY

        setNodes((nodes) => {
            const newNodes = [
                {
                    id: uniqueId('area'),
                    position: {
                        x: minX - 100,
                        y: minY - 100,
                    },
                    data: {},
                    style: {
                        backgroundColor: 'transparent',
                        width: width + 200,
                        height: height + 200,
                    },
                    draggable: false,
                } as Node<any>,
                ...nodes,
            ]

            return newNodes
        })
    }
    /* #endregion */

    /* #region Consistency Checks */
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes])

    useEffect(() => {
        if (!isEqual(edges, dialogData.links)) {
            setEdges(dialogData.links)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edges])
    /* #endregion */

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
            setNodes,
            edges,
            setEdges,
            onMouseDoubleClick,
            createArea,
        },
    }
}
