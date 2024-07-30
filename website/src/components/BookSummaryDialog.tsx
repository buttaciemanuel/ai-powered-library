import {
    Box,
    Button,
    Container,
    Dialog,
    IconButton,
    Slide,
    Typography,
    Toolbar,
    Skeleton
} from '@mui/material';
import React from 'react';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import { Book } from './AddBookDialog';
import { useMediaQuery } from 'react-responsive';

export interface BookSummaryInformation {
    summary: string;
    recommendation: string;
}

interface BookSummaryDialogProps {
    key: React.Key;
    isOpen: boolean;
    book: Book;
    handleClose: () => void;
    summarizeBook: (book: Book, onSuccess: (summary: BookSummaryInformation) => void) => void;
}

export default function BookSummaryDialog({ key, isOpen, book, handleClose, summarizeBook }: BookSummaryDialogProps) {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    
    const [bookSummary, setBookSummary] = React.useState<undefined | BookSummaryInformation>(undefined);

    const summarizeCallback = React.useCallback(() => {
        summarizeBook(book, (summary) => {
            setBookSummary(summary);
        });
    }, []);

    React.useEffect(() => {
        if (isOpen && bookSummary === undefined) {
            summarizeCallback();
        }
    }, [ isOpen ]);

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
                    onClick={handleClose}
                    aria-label='close'
                >
                    <CloseIcon />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                    size={isTabletOrMobile ? 'medium' : 'large'}
                    color='secondary'
                    disableElevation
                    startIcon={<AutoAwesomeIcon />}
                    sx={{ borderRadius: '8pt' }}
                    onClick={() => {
                        setBookSummary(undefined);
                        summarizeCallback();
                    }}
                >
                    Regenerate all
                </Button>
            </Toolbar>
            
            <Typography fontSize={isTabletOrMobile ? '1.75rem' : '3rem'} fontWeight={700}>
                {book.title}
            </Typography>

            <Typography variant={isTabletOrMobile ? 'body2' : 'body1'} paddingTop={5} color='text.secondary' fontWeight={300} gutterBottom>
                Author
            </Typography>

            <Typography fontSize={isTabletOrMobile ? '1.1rem' : '1.5rem'} fontWeight={300} gutterBottom>
                {book.author}
            </Typography>

            <Typography variant={isTabletOrMobile ? 'body2' : 'body1'} paddingTop={3} color='text.secondary' fontWeight={300} gutterBottom>
                Summary
            </Typography>

            {
                bookSummary !== undefined ?
                    <Typography fontSize={isTabletOrMobile ? '0.9rem' : '1.15rem'} fontWeight={300} align='justify' gutterBottom>
                        {bookSummary.summary}
                    </Typography>
                    :
                    <Skeleton variant='rounded' height='10vh' />
            }

            <Typography variant={isTabletOrMobile ? 'body2' : 'body1'} paddingTop={3} color='text.secondary' fontWeight={300} gutterBottom>
                Recommendation for you
            </Typography>

            {
                bookSummary !== undefined ?
                    <Typography fontSize={isTabletOrMobile ? '0.9rem' : '1.15rem'} fontWeight={300} align='justify' gutterBottom paddingBottom={5}>
                        {bookSummary.recommendation}
                    </Typography>
                    :
                    <Skeleton variant='rounded' height='20vh' />
            }
        </Container>
    </Dialog>;
}