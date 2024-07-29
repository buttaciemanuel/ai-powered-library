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
import React from 'react';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ReviewsIcon from '@mui/icons-material/Reviews';
import AddBookDialog, { Book } from './AddBookDialog';
import DeleteBookConfimationDialog from './DeleteBookConfimationDialog';
import BookSummaryDialog, { BookSummaryInformation } from './BookSummaryDialog';
import BookReviewsDialog, { BookReview } from './BookReviewsDialog';
import { UserAuthenticationSession } from './UserAuthenticateDialog';

interface BookItemProps {
    id: number;
    title: string;
    author: string;
    publicationYear: number;
    price: number;
    currency: string;
    genre: string;
    editBook: (book: Book) => void;
    deleteBook: (book: Book) => void;
    summarizeBook: (book: Book, onSuccess: (summary: BookSummaryInformation) => void) => void;
    getReviews: (book: Book, onSuccess: (reviews: BookReview[]) => void) => void;
    submitReview?: (book: Book, nStars: number, content: string, onSuccess: () => void) => void;
    currentUser?: UserAuthenticationSession;
    reviewedByCurrentUser?: boolean;
}

export default function BookItem({ id, title, author, publicationYear, price, currency, genre, editBook, deleteBook, summarizeBook, getReviews, submitReview, currentUser, reviewedByCurrentUser }: BookItemProps) {
    const [editBookDialogOpen, setEditBookDialogOpen] = React.useState<boolean>(false);
    const [deleteBookDialogOpen, setDeleteBookDialogOpen] = React.useState<boolean>(false);
    const [summarizeBookDialogOpen, setSummarizeBookDialogOpen] = React.useState<boolean>(false);
    const [reviewsBookDialogOpen, setReviewsBookDialogOpen] = React.useState<boolean>(false);

    return <Card key={`${id}-card`} variant='outlined' sx={{ padding: 3, boxShadow: 'none', borderRadius: '8pt', marginBottom: 3 }}>
        <AddBookDialog
            key={`${id}-edit-dialog`}
            isOpen={editBookDialogOpen}
            handleClose={() => setEditBookDialogOpen(false)}
            editableBook={{
                id: id,
                title: title,
                author: author,
                publication_year: publicationYear,
                price: price,
                currency: currency,
                genre: genre
            }}
            saveBook={editBook}
        />

        <DeleteBookConfimationDialog
            key={`${id}-delete-dialog`}
            isOpen={deleteBookDialogOpen}
            handleClose={() => setDeleteBookDialogOpen(false)}
            confirmDeletion={() => {
                setDeleteBookDialogOpen(false);
                deleteBook({
                    id: id,
                    title: title,
                    author: author,
                    publication_year: publicationYear,
                    price: price,
                    currency: currency,
                    genre: genre
                });
            }}
        />

        <BookSummaryDialog
            key={`${id}-summary-dialog`}
            isOpen={summarizeBookDialogOpen}
            handleClose={() => setSummarizeBookDialogOpen(false)}
            summarizeBook={summarizeBook}
            book={{
                id: id,
                title: title,
                author: author,
                publication_year: publicationYear,
                price: price,
                currency: currency,
                genre: genre
            }}
        />

        {currentUser === undefined ?
            <></> :
            <BookReviewsDialog
                key={`${id}-reviews-dialog`}
                isOpen={reviewsBookDialogOpen}
                handleClose={() => setReviewsBookDialogOpen(false)}
                getReviews={getReviews}
                reviewedByCurrentUser={reviewedByCurrentUser}
                submitReview={submitReview}
                book={{
                    id: id,
                    title: title,
                    author: author,
                    publication_year: publicationYear,
                    price: price,
                    currency: currency,
                    genre: genre
                }}
            />}

        <CardContent>
            <Grid container direction='row' >
                <Grid item sx={{ alignContent: 'center' }}>
                    <Typography color="text.secondary" gutterBottom>
                        {id}
                    </Typography>
                </Grid>

                <Box sx={{ flexGrow: 1 }} />


                {currentUser === undefined ?
                    <></> :
                    <Grid item sx={{ paddingRight: 3 }}>
                        <Button
                            startIcon={<ReviewsIcon />}
                            size='medium'
                            color='inherit'
                            disableElevation
                            onClick={() => setReviewsBookDialogOpen(true)}
                        >
                            See reviews
                        </Button>
                    </Grid>
                }

                <Grid item sx={{ paddingRight: 3 }}>
                    <Button
                        startIcon={<EditIcon />}
                        size='medium'
                        color='primary'
                        disableElevation
                        onClick={() => setEditBookDialogOpen(true)}
                    >
                        Edit
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        startIcon={<DeleteForeverIcon />}
                        size='medium'
                        color='error'
                        disableElevation
                        onClick={() => setDeleteBookDialogOpen(true)}
                    >
                        Delete
                    </Button>
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
                    <Button
                        sx={{ textTransform: 'none' }}
                        startIcon={<AutoAwesomeIcon />}
                        size='medium'
                        color='secondary'
                        onClick={() => setSummarizeBookDialogOpen(true)}
                    >
                        Is this for you?
                    </Button>
                </Grid>
            </Grid>
        </CardActions>
    </Card>;
}