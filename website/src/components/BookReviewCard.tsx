import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Rating,
    Typography
} from '@mui/material';
import { BookReview } from './BookReviewsDialog';
import { UserAuthenticationSessionKeys } from './UserAuthenticateDialog';
import Cookies from 'js-cookie';

interface BookReviewCardProps {
    key: string;
    review: BookReview;
}

export default function BookReviewCard({ key, review }: BookReviewCardProps) {
    return <Card key={key} variant='outlined' sx={{ padding: 3, boxShadow: 'none', borderRadius: '8pt', marginBottom: 3 }}>
        <CardContent>
            <Grid container direction='row' >
                <Rating defaultValue={review.n_stars} precision={1} readOnly />

                <Box sx={{ flexGrow: 1 }} />

                <Typography color="text.secondary" variant='body2'>
                    {review.creation_timestamp}
                </Typography>
            </Grid>

            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

            <Typography color="text.secondary" variant='body2' sx={{ marginBottom: 1 }}>
                {Cookies.get(UserAuthenticationSessionKeys.Email) === review.email ? 'You' : review.email}
            </Typography>

            <Typography variant='body1'>
                {review.content}
            </Typography>
        </CardContent>
    </Card>;
}