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
import { useMediaQuery } from 'react-responsive';

interface BookReviewCardProps {
    key: string;
    review: BookReview;
}

export default function BookReviewCard({ key, review }: BookReviewCardProps) {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    
    return <Card key={key} variant='outlined' sx={{ padding: 3, boxShadow: 'none', borderRadius: '8pt', marginBottom: 3 }}>
        <CardContent>
            <Grid container direction='row' >
                <Rating size={isTabletOrMobile ? 'small' : 'medium'} defaultValue={review.n_stars} precision={1} readOnly />

                <Box sx={{ flexGrow: 1 }} />

                <Typography color="text.secondary" variant='body2'>
                    {isTabletOrMobile ? new Date(Date.parse(review.creation_timestamp)).toLocaleDateString() : review.creation_timestamp}
                </Typography>
            </Grid>

            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

            <Typography color="text.secondary" variant='body2' sx={{ marginBottom: 1 }}>
                {Cookies.get(UserAuthenticationSessionKeys.Email) === review.email ? 'You' : review.email}
            </Typography>

            <Typography variant={isTabletOrMobile ? 'body2' : 'body1'} align='justify'>
                {review.content}
            </Typography>
        </CardContent>
    </Card>;
}