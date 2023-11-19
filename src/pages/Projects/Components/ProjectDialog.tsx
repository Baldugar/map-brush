import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { Project } from '../../../types/project_types'

import 'reactflow/dist/style.css'
import NodeDialog from './NodeDialog'
import ProjectDefinitionFlow from './ProjectDefinitionFlow'
import { useProjectDialogState } from './useProjectDialogState'

export type ProjectDialogProps = {
    dialogData: Project
    setDialogData: Dispatch<SetStateAction<Project | undefined>>
    onConfirm: (dialogData: Project) => void
}

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
        reactFlow: { edges, nodes, onConnect, onEdgesChange, onNodesChange, onMouseDoubleClick },
    } = useProjectDialogState({
        dialogData,
        setDialogData,
    })

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
