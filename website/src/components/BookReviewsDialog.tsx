import {
    Box,
    Button,
    Container,
    Dialog,
    Divider,
    IconButton,
    Rating,
    Skeleton,
    Slide,
    TextField,
    Toolbar,
    Typography
} from '@mui/material';
import React from 'react';
import { Book } from './AddBookDialog';

import CloseIcon from '@mui/icons-material/Close';
import RateReviewIcon from '@mui/icons-material/RateReview';
import BookReviewCard from './BookReviewCard';

export interface BookReview {
    email: string;
    n_stars: number;
    content: string;
    creation_timestamp: string;
}

interface BookReviewsDialogProps {
    key: string;
    isOpen: boolean;
    book: Book;
    handleClose: () => void;
    getReviews: (book: Book, onSuccess: (reviews: BookReview[]) => void) => void;
    submitReview?: (book: Book, nStars: number, content: string, onSuccess: () => void) => void;
    reviewedByCurrentUser?: boolean;
}

export default function BookReviewsDialog({ key, isOpen, book, handleClose, getReviews, submitReview, reviewedByCurrentUser }: BookReviewsDialogProps) {
    const [bookReviews, setBookReviews] = React.useState<undefined | BookReview[]>(undefined);

    const [nStars, setNStars] = React.useState<number>(0);
    const [content, setContent] = React.useState<string>('');

    const clearState = React.useCallback(() => {
        setNStars(0);
        setContent('');
    }, []);

    const getReviewsCallback = React.useCallback(() => {
        getReviews(book, (reviews) => {
            setBookReviews(reviews);
        });
    }, []);

    React.useEffect(() => {
        if (isOpen) {
            getReviewsCallback();
        }
    }, [isOpen]);

    return <Dialog
        key={key}
        fullScreen
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Slide}
    >
        <Container sx={{ backgroundColor: 'none' }}>
            <Toolbar sx={{ backgroundColor: 'none', marginBottom: 3, paddingY: 5, paddingX: '0pt !important' }}>
                <IconButton
                    edge='start'
                    color='inherit'
                    onClick={() => {
                        handleClose();
                        clearState();
                    }}
                    aria-label='close'
                >
                    <CloseIcon />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />

                {
                    !reviewedByCurrentUser && submitReview !== undefined ?
                        <Button
                            size='large'
                            color='primary'
                            disabled={reviewedByCurrentUser}
                            disableElevation
                            startIcon={<RateReviewIcon />}
                            sx={{ borderRadius: '8pt' }}
                            onClick={() => {
                                submitReview(book, nStars, content, () => {
                                    handleClose();
                                    clearState();
                                });
                            }}
                        >
                            Submit your review
                        </Button> :
                        <></>
                }
            </Toolbar>

            <Typography fontSize='3rem' fontWeight={700}>
                {book.title}
            </Typography>

            <Typography variant='body1' paddingTop={5} color='text.secondary' fontWeight={300} gutterBottom>
                Author
            </Typography>

            <Typography fontSize='1.5rem' fontWeight={300} gutterBottom paddingBottom={3}>
                {book.author}
            </Typography>


            {reviewedByCurrentUser ?
                <></> :
                <>
                    <Divider />

                    <Typography variant='body1' paddingTop={4} color='text.secondary' fontWeight={300} gutterBottom>
                        Your rating
                    </Typography>

                    <Rating
                        value={nStars}
                        onChange={(_, newValue) => {
                            if (newValue !== null) {
                                setNStars(newValue);
                            }
                        }}
                    />

                    <Typography variant='body1' paddingTop={3} color='text.secondary' fontWeight={300} gutterBottom>
                        Your comment on the book
                    </Typography>

                    <TextField
                        placeholder='Write a detailed review'
                        variant='standard'
                        type='text'
                        fullWidth
                        multiline
                        maxRows={4}
                        autoComplete='off'
                        InputProps={{
                            style: { borderRadius: '10pt', backgroundColor: 'white', fontSize: '1.5rem', fontWeight: 300 },
                            disableUnderline: true,
                        }}
                        InputLabelProps={{ shrink: false, style: { fontSize: '1.5rem' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'none'
                            },
                            '& .MuiInputLabel-root': { display: 'none' },
                            paddingBottom: 3
                        }}
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                    />
                </>
            }

            <Divider />

            <Typography variant='body1' paddingTop={4} paddingBottom={1} color='text.secondary' fontWeight={300} gutterBottom>
                {reviewedByCurrentUser ? 'Reviews' : 'Other reviews'}
            </Typography>

            {
                bookReviews === undefined ?
                    <>
                        <Skeleton variant='rounded' height='30vh' sx={{ marginBottom: 3, borderRadius: '8pt' }} />
                        <Skeleton variant='rounded' height='30vh' sx={{ marginBottom: 3, borderRadius: '8pt' }} />
                        <Skeleton variant='rounded' height='30vh' sx={{ marginBottom: 3, borderRadius: '8pt' }} />
                    </> :
                    bookReviews.length > 0 ?
                        bookReviews.map((review) => {
                            return <BookReviewCard
                                key={`${key}-reviewby-${review.email}`}
                                review={review}
                            />;
                        })
                        :
                        <Typography variant='h5' fontWeight={300} paddingBottom={5}>
                            You might be the first one to review this book!
                        </Typography>
            }
        </Container>
    </Dialog>;
}