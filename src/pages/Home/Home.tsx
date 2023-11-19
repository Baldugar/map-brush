import { Button, Container, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h1">Home</Typography>
                </Grid>
                <Grid item xs={12} container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Link to={'/users'}>
                            <Button fullWidth variant={'contained'} color={'primary'} size={'large'}>
                                User List
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Link to={'/projects'}>
                            <Button fullWidth variant={'contained'} color={'primary'} size={'large'}>
                                Project List
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Home
