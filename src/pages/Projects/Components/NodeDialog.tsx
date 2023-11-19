import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import { ProjectNodeType } from '../../../types/project_types'
import { ExpertiseArea } from '../../../types/user_types'
import { capitalizeExpertiseArea } from '../../../utils/func/project'

export interface NodeDialogProps {
    closeNodeDialogHandler: () => void
    nodeDialogData: ProjectNodeType
    updateNodeNameHandler: (e: ChangeEvent<HTMLInputElement>) => void
    updateNodeDescriptionHandler: (e: ChangeEvent<HTMLInputElement>) => void
    toggleExpertiseAreaHandler: (area: ExpertiseArea) => void
    disableNodeDialogSaveButton: boolean
    saveNodeDialogHandler: () => void
}

const NodeDialog = (props: NodeDialogProps) => {
    const {
        closeNodeDialogHandler,
        nodeDialogData,
        updateNodeNameHandler,
        updateNodeDescriptionHandler,
        toggleExpertiseAreaHandler,
        disableNodeDialogSaveButton,
        saveNodeDialogHandler,
    } = props

    const renderExpertiseAreaChip = ([key, value]: [string, boolean]) => {
        const toggle = () => toggleExpertiseAreaHandler(key as ExpertiseArea)

        return (
            <Grid item xs={'auto'} key={key}>
                <Chip label={capitalizeExpertiseArea(key)} color={value ? 'primary' : 'default'} onClick={toggle} />
            </Grid>
        )
    }

    return (
        <Dialog open={true} onClose={closeNodeDialogHandler}>
            <DialogTitle>{`Node${nodeDialogData.name.length > 0 ? ` - ${nodeDialogData.name}` : ''}`}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} direction={'column'} height={1}>
                    <Grid item xs={'auto'}>
                        <TextField
                            size={'small'}
                            variant={'filled'}
                            autoFocus
                            fullWidth
                            id={'name'}
                            label={'Name'}
                            value={nodeDialogData.name}
                            onChange={updateNodeNameHandler}
                        />
                    </Grid>
                    <Grid item xs={'auto'}>
                        <TextField
                            size={'small'}
                            variant={'filled'}
                            fullWidth
                            id={'description'}
                            label={'Description'}
                            value={nodeDialogData.description}
                            onChange={updateNodeDescriptionHandler}
                        />
                    </Grid>
                    <Grid item xs={'auto'} container spacing={1}>
                        {Object.entries(nodeDialogData.expertiseAreas).map(renderExpertiseAreaChip)}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeNodeDialogHandler}>Cancel</Button>
                <Button disabled={disableNodeDialogSaveButton} onClick={saveNodeDialogHandler}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default NodeDialog
