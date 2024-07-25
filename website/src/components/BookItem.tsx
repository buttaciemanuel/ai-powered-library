import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Grid,
    Typography
} from '@mui/material';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

interface BookItemProps {
    id: number;
    title: string;
    author: string;
    publicationYear: number;
    price: number;
    currency: string;
    genre: string;
}

export default function BookItem({ id, title, author, publicationYear, price, currency, genre }: BookItemProps) {
    return <Card variant='outlined' sx={{ padding: 3, boxShadow: 'none', borderRadius: '8pt', marginBottom: 3 }}>
        <CardContent>
            <Grid container direction='row' >
                <Grid item sx={{ alignContent: 'center' }}>
                    <Typography color="text.secondary" gutterBottom>
                        {id}
                    </Typography>
                </Grid>

                <Box sx={{ flexGrow: 1 }} />

                <Grid item sx={{ paddingRight: 3 }}>
                    <Button startIcon={<EditIcon />} size='medium' color='primary' disableElevation>Edit</Button>
                </Grid>

                <Grid item>
                    <Button startIcon={<DeleteForeverIcon />} size='medium' color='error' disableElevation>Delete</Button>
                </Grid>

            </Grid>

            <Divider sx={{ marginTop: 1, marginBottom: 2 }} />

            <Grid container direction='row'>
                <Grid item sx={{ backgroundColor: 'none' }}>
                    <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                        {author}
                    </Typography>
                    <Typography variant='h5' component='div' sx={{
                        width: '50vw',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '1',
                        WebkitBoxOrient: 'vertical',
                    }}>
                        {title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                        {publicationYear}
                    </Typography>
                </Grid>

                <Box sx={{ flexGrow: 1 }} />

                <Grid item sx={{ backgroundColor: 'none', alignContent: 'center' }}>
                    <Typography variant='h5' color='text.secondary' gutterBottom>
                        {price} {currency}
                    </Typography>
                </Grid>
            </Grid>

            <Typography variant='body2'>
                {genre}
            </Typography>
        </CardContent>

        <CardActions>
            <Grid container direction='row'>
                <Grid item>
                    <Button sx={{ textTransform: 'none' }} startIcon={<AutoAwesomeIcon />} size='medium' color='secondary'>Is this for you?</Button>
                </Grid>
            </Grid>
        </CardActions>
    </Card>;
}