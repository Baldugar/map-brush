import { ChevronLeft, Edit, RemoveOutlined } from '@mui/icons-material'
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UsersContext, UsersContextType } from '../../context/UserContext'
import { User } from '../../types/user_types'

const UsersList = () => {
    const userContext = useContext<UsersContextType | null>(UsersContext)
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogData, setDialogData] = useState<User>()
    const navigate = useNavigate()

    useEffect(() => {
        if (openDialog && userContext && !dialogData) {
            setDialogData({
                expertiseAreas: {
                    backend: false,
                    frontend: false,
                    devOps: false,
                    mobile: false,
                    other: false,
                    qa: false,
                },
                id: '',
                name: '',
            })
        } else if (!openDialog && dialogData) {
            setDialogData(undefined)
        }
    }, [openDialog])

    if (!userContext) {
        throw new Error('You probably forgot to put <UsersProvider>.')
    }
    const { users, addUser, deleteUser, editUser } = userContext

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
                        <Typography variant="h1">Users</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        size={'large'}
                        onClick={() => {
                            setOpenDialog(true)
                        }}
                    >
                        Add User
                    </Button>
                </Grid>
                {users.map((user) => (
                    <Grid key={user.id} item xs={12} sm={3}>
                        <UserCard
                            onDeleteClick={() => {
                                deleteUser(user.id)
                            }}
                            onEditClick={() => {
                                setDialogData(user)
                                setOpenDialog(true)
                            }}
                            user={user}
                        />
                    </Grid>
                ))}
            </Grid>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>User</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} direction={'column'} height={1}>
                        <Grid item xs={'auto'}>
                            <TextField
                                variant={'filled'}
                                autoFocus
                                margin="dense"
                                fullWidth
                                id={'name'}
                                label={'Name'}
                                value={dialogData?.name || ''}
                                onChange={(e) =>
                                    setDialogData((newUserData) => {
                                        if (newUserData) {
                                            return {
                                                ...newUserData,
                                                name: e.target.value,
                                            }
                                        }
                                        return newUserData
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Typography>Expertise Areas</Typography>
                            <Grid container spacing={1} marginTop={0.5}>
                                {Object.entries(dialogData?.expertiseAreas || {}).map(
                                    ([key, value]: [string, boolean]) => (
                                        <Grid item xs={'auto'} key={key}>
                                            <Chip
                                                label={
                                                    key.length < 3
                                                        ? key.toUpperCase()
                                                        : key[0].toUpperCase() + key.slice(1)
                                                }
                                                color={value ? 'primary' : 'default'}
                                                onClick={() =>
                                                    setDialogData((newUserData) => {
                                                        if (newUserData) {
                                                            return {
                                                                ...newUserData,
                                                                expertiseAreas: {
                                                                    ...newUserData.expertiseAreas,
                                                                    [key]: !value,
                                                                },
                                                            }
                                                        }
                                                        return newUserData
                                                    })
                                                }
                                            />
                                        </Grid>
                                    ),
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenDialog(false)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={
                            !dialogData ||
                            dialogData.name === '' ||
                            Object.values(dialogData.expertiseAreas).every((value) => !value)
                        }
                        onClick={() => {
                            if (
                                !dialogData ||
                                dialogData.name === '' ||
                                Object.values(dialogData.expertiseAreas).every((value) => !value)
                            ) {
                                return
                            }
                            if (dialogData.id) {
                                editUser(dialogData)
                            } else {
                                addUser(dialogData)
                            }
                            setOpenDialog(false)
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

const UserCard = ({
    user,
    onEditClick,
    onDeleteClick,
}: {
    user: User
    onEditClick: () => void
    onDeleteClick: () => void
}) => {
    return (
        <Card>
            <CardHeader
                title={user.name}
                action={
                    <Grid container spacing={2}>
                        <Grid item xs>
                            <IconButton onClick={onEditClick}>
                                <Edit />
                            </IconButton>
                        </Grid>
                        <Grid item xs>
                            <IconButton onClick={onDeleteClick}>
                                <RemoveOutlined />
                            </IconButton>
                        </Grid>
                    </Grid>
                }
            />
            <CardContent>
                <Grid container spacing={1}>
                    {Object.entries(user.expertiseAreas)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => (
                            <Grid item xs={'auto'} key={key}>
                                <Chip label={key} />
                            </Grid>
                        ))}
                </Grid>
            </CardContent>
        </Card>
    )
}

export default UsersList
