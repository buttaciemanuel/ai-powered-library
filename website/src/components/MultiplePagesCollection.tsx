import { Book } from "./AddBookDialog";
import BookItem from "./BookItem";
import { Box, Button, Skeleton, Typography } from "@mui/material";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { BookSummaryInformation } from "./BookSummaryDialog";

interface MultiplePagesCollectionProps {
    currentPage: number;
    changePage: (newPage: number) => void;
    books: Book[] | undefined;
    editBook: (book: Book) => void;
    deleteBook: (book: Book) => void;
    summarizeBook: (book: Book, onSuccess: (summary: BookSummaryInformation) => void) => void;
}

export default function MultiplePagesCollection({ currentPage, changePage, books, editBook, deleteBook, summarizeBook }: MultiplePagesCollectionProps) {
    const itemsPerPage = 10;

    if (books === undefined) {
       return <Box sx={{ paddingTop: '15vh' }}>
            <Skeleton variant='rounded' height='30vh' sx={{ marginBottom: 3, borderRadius: '8pt' }} />
            <Skeleton variant='rounded' height='30vh' sx={{ marginBottom: 3, borderRadius: '8pt' }} />
            <Skeleton variant='rounded' height='30vh' sx={{ marginBottom: 3, borderRadius: '8pt' }} />
        </Box>;
    }
    else if (books.length === 0) {
        return <Box
            sx={{
                display: "flex",
                alignItems: "center",
                direction: "ltr",
                paddingY: 5
            }}
        >
            <Typography variant='h5' fontWeight={300} paddingBottom={5}>
                There are no books to visualize at the moment.
            </Typography>
        </Box>;
    }
    else {
        return <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    direction: "ltr",
                    paddingY: 5
                }}
            >
                <Button
                    disabled={currentPage === 0}
                    startIcon={<ArrowBackIosIcon />}
                    size='large'
                    color='primary'

                    onClick={() => { changePage(Math.max(0, currentPage - 1)); }}
                >
                    {currentPage === 0 ? '' : 1 + Math.max(0, currentPage - 1)}
                </Button>

                <Button
                    disabled={currentPage === Math.ceil(books.length / itemsPerPage) - 1}
                    endIcon={<ArrowForwardIosIcon />}
                    size='large'
                    color='primary'

                    onClick={() => { changePage(Math.min(Math.ceil(books.length / itemsPerPage) - 1, currentPage + 1)); }}
                >
                    {currentPage === Math.ceil(books.length / itemsPerPage) - 1 ? '' : 1 + Math.min(Math.ceil(books.length / itemsPerPage) - 1, currentPage + 1)}
                </Button>
            </Box>

            {books.slice(
                currentPage * itemsPerPage,
                Math.min((currentPage + 1) * itemsPerPage, books.length)
            ).map(function (book) {
                return <BookItem
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    publicationYear={book.publication_year}
                    price={book.price}
                    currency={book.currency}
                    genre={book.genre}
                    editBook={editBook}
                    deleteBook={deleteBook}
                    summarizeBook={summarizeBook}
                />;
            })}
        </>;
    }
}