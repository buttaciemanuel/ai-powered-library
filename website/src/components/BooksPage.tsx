import axios, { AxiosError } from 'axios';
import {
    Autocomplete,
    Box,
    Button,
    Container,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputAdornment,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import CancelRoundedIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import BookItem from './BookItem';
import AddBookDialog, { Book } from './AddBookDialog';
import MessageToUserSnackbar, {
    MessageToUserSnackbarState,
    MessageToUserSnackbarType
} from './MesageToUserSnackbar';
import MultiplePagesCollection from './MultiplePagesCollection';

interface ResponseError {
    error: string;
}

const api = axios.create({
    baseURL: "http://localhost:8000"
});

function BooksPage() {
    const [messageSnackbarState, setMessageSnackbarState] = React.useState<MessageToUserSnackbarState>({
        isOpen: false,
        messageType: undefined,
        messageContent: ''
    });
    const [addBookDialogOpen, setAddBookDialogOpen] = React.useState<boolean>(false);
    const [filterTitle, setFilterTitle] = React.useState<string>('');
    const [filterAuthor, setFilterAuthor] = React.useState<string>('');
    const [filterGenre, setFilterGenre] = React.useState<string>('');
    const [filterPublicationYear, setFilterPublicationYear] = React.useState<string>('');
    const [countLimit, setCountLimit] = React.useState<string>('');
    const [sortBy, setSortBy] = React.useState<string>('');
    const [reversed, setReversed] = React.useState<boolean>(false);
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [books, setBooks] = React.useState<Book[]>([]);

    const fetchBooks = React.useCallback(() => {
        let requestParameters = []

        if (filterTitle != null && filterTitle.trim().length > 0) {
            requestParameters.push(`title=${filterTitle.trim()}`)
        }

        if (filterAuthor != null && filterAuthor.trim().length > 0) {
            requestParameters.push(`author=${filterAuthor.trim()}`)
        }

        if (filterGenre != null && filterGenre.trim().length > 0) {
            requestParameters.push(`genre=${filterGenre.trim()}`)
        }

        if (filterPublicationYear != null && filterPublicationYear.trim().length > 0) {
            requestParameters.push(`publication_year=${filterPublicationYear.trim()}`)
        }

        if (countLimit.length === 0) {
            requestParameters.push(`count=10`)
        }
        else if (countLimit !== 'All') {
            requestParameters.push(`count=${countLimit}`)
        }

        if (sortBy != null && sortBy.trim().length > 0) {
            requestParameters.push(`sortby=${sortBy.trim().toLowerCase().replaceAll(' ', '_')}`)
        }

        if (reversed) {
            requestParameters.push(`reverse=1`)
        }

        api.get(`/books/show?${requestParameters.join('&')}`).then((response) => {
            console.log(response.data);
            setCurrentPage(0);
            setBooks(response.data);
        }).catch((error) => {
            showNotification(MessageToUserSnackbarType.Error, 'An error occurred while requesting the catalog of books');
        });
    }, [filterTitle, filterAuthor, filterGenre, filterPublicationYear, countLimit, sortBy, reversed]);

    React.useEffect(() => {
        fetchBooks();
    }, []);

    React.useEffect(() => {
        const delayDebounceFn = setTimeout(fetchBooks, 250);
        return () => clearTimeout(delayDebounceFn);
    }, [fetchBooks, filterTitle, filterAuthor, filterGenre, filterPublicationYear, countLimit, sortBy, reversed]);

    const addBook = React.useCallback((book: Book) => {
        let requestParameters = [];

        let key: keyof Book;

        for (key in book) {
            requestParameters.push(`${key}=${book[key]}`)
        }

        api.post(`/books/add?${requestParameters.join('&')}`).then(() => {
            showNotification(MessageToUserSnackbarType.Success, 'Your book has been added to the collection');
            fetchBooks();
        }).catch((error: AxiosError) => {
            if (error.response) {
                showNotification(MessageToUserSnackbarType.Error, (error.response.data as ResponseError).error);
            }
            else {
                showNotification(MessageToUserSnackbarType.Error, 'An error occurred while trying to add the book to the collection');
            }
        });
    }, [fetchBooks]);

    const editBook = React.useCallback((book: Book) => {
        let requestParameters = [];

        let key: keyof Book;

        for (key in book) {
            requestParameters.push(`${key}=${book[key]}`)
        }

        api.post(`/books/edit/${book.id}?${requestParameters.join('&')}`).then(() => {
            showNotification(MessageToUserSnackbarType.Success, 'Your book has been successfully updated');
            fetchBooks();
        }).catch((error: AxiosError) => {
            if (error.response) {
                showNotification(MessageToUserSnackbarType.Error, (error.response.data as ResponseError).error);
            }
            else {
                showNotification(MessageToUserSnackbarType.Error, 'An error occurred while trying to edit the book');
            }
        });
    }, [fetchBooks]);

    const deleteBook = React.useCallback((book: Book) => {
        api.delete(`/books/delete/${book.id}`).then(() => {
            showNotification(MessageToUserSnackbarType.Success, 'Your book has been successfully deleted from the collection');
            fetchBooks();
        }).catch((error: AxiosError) => {
            if (error.response) {
                showNotification(MessageToUserSnackbarType.Error, (error.response.data as ResponseError).error);
            }
            else {
                showNotification(MessageToUserSnackbarType.Error, 'An error occurred while trying to delete the book from the collection');
            }
        });
    }, [fetchBooks]);

    const showNotification = (messageType: MessageToUserSnackbarType, messageContent: string) => {
        setMessageSnackbarState({
            isOpen: true,
            messageType: messageType,
            messageContent: messageContent
        });
    };

    const clearNotification = () => {
        setMessageSnackbarState({
            isOpen: false,
            messageType: messageSnackbarState.messageType,
            messageContent: messageSnackbarState.messageContent
        });
    };

    return <Container sx={{ paddingTop: '5vh', backgroundColor: 'none' }}>
        <Typography sx={{ backgroundColor: 'none' }} variant='h1' fontWeight={700} paddingBottom={2}>
            Discover all the books
        </Typography>

        <Typography sx={{ backgroundColor: 'none', paddingLeft: 0.5 }} variant='h5' fontWeight={300} paddingBottom={5}>
            You can freely add, edit and delete the books from this catalog.
        </Typography>

        <TextField
            id='outlined-basic'
            placeholder='Search any book title'
            variant='outlined'
            type='text'
            fullWidth
            autoComplete='off'
            InputProps={{
                style: { borderRadius: '10pt', backgroundColor: 'white' },
                startAdornment: (
                    <InputAdornment position='start'>
                        <SearchIcon />
                    </InputAdornment>
                ),
                endAdornment: true && (
                    <IconButton
                        onClick={() => { setFilterTitle(''); }}
                    ><CancelRoundedIcon /></IconButton>
                )
            }}
            InputLabelProps={{ shrink: false }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white'
                },
                '& .MuiInputLabel-root': { display: 'none' }
            }}
            onChange={(e) => { setFilterTitle(e.target.value); }}
            value={filterTitle}
        />

        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                direction: "ltr",
                paddingTop: 2
            }}
        >
            <TextField
                id='outlined-basic'
                placeholder='Author'
                variant='outlined'
                type='text'
                fullWidth
                autoComplete='off'
                InputProps={{
                    style: { borderRadius: '10pt', backgroundColor: 'white' },
                    startAdornment: (
                        <InputAdornment position='start'>
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: true && (
                        <IconButton
                            onClick={() => { setFilterAuthor(''); }}
                        ><CancelRoundedIcon /></IconButton>
                    )
                }}
                InputLabelProps={{ shrink: false }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white'
                    },
                    '& .MuiInputLabel-root': { display: 'none' },
                    paddingRight: 1
                }}
                onChange={(e) => { setFilterAuthor(e.target.value); }}
                value={filterAuthor}
            />

            <TextField
                id='outlined-basic'
                placeholder='Genre'
                variant='outlined'
                type='text'
                fullWidth
                autoComplete='off'
                InputProps={{
                    style: { borderRadius: '10pt', backgroundColor: 'white' },
                    startAdornment: (
                        <InputAdornment position='start'>
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: true && (
                        <IconButton
                            onClick={() => { setFilterGenre(''); }}
                        ><CancelRoundedIcon /></IconButton>
                    )
                }}
                InputLabelProps={{ shrink: false }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white'
                    },
                    '& .MuiInputLabel-root': { display: 'none' }
                }}
                onChange={(e) => { setFilterGenre(e.target.value); }}
                value={filterGenre}
            />


            <Autocomplete
                fullWidth
                disableClearable
                options={Array(2024 - 1000 + 1).fill(undefined).map((v, i) => 2024 - i)}
                sx={{ paddingLeft: 1 }}
                onChange={(_, value) => { setFilterPublicationYear(value.toString()); }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder='Publication year'
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'white',
                                borderRadius: '10pt'
                            },
                            '& .MuiInputLabel-root': { display: 'none' },
                            "& fieldset": { borderRadius: '10pt' },
                        }}
                    />
                )}
            />
        </Box>

        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                direction: "ltr",
                paddingTop: 2,
                paddingBottom: 5
            }}
        >
            <Autocomplete
                disableClearable
                options={[
                    '10',
                    '25',
                    '50',
                    '100',
                    'All'
                ]}
                sx={{ paddingRight: 1, width: '15vw' }}
                onChange={(_, value) => { setCountLimit(value); }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder='Number of results'
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SortIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'white',
                                borderRadius: '10pt'
                            },
                            '& .MuiInputLabel-root': { display: 'none' },
                            "& fieldset": { borderRadius: '10pt' },
                        }}
                    />
                )}
            />

            <Autocomplete
                disableClearable
                options={[
                    'Title',
                    'Author',
                    'Publication year',
                    'Price',
                    'Currency',
                    'Genre'
                ]}
                sx={{ paddingRight: 3, width: '15vw' }}
                onChange={(_, value) => { setSortBy(value); }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder='Sort by'
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SortIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'white',
                                borderRadius: '10pt'
                            },
                            '& .MuiInputLabel-root': { display: 'none' },
                            "& fieldset": { borderRadius: '10pt' },
                        }}
                    />
                )}
            />

            <FormGroup>
                <FormControlLabel control={<Switch />} label='Reverse' onChange={(e) => setReversed((e.target as HTMLInputElement).checked)} />
            </FormGroup>

            <Box sx={{ flexGrow: 1 }} />

            <Button
                variant='contained'
                size='large'
                disableElevation
                startIcon={<AddIcon />}
                sx={{ marginLeft: 3, width: '15vw', borderRadius: '8pt' }}
                onClick={() => setAddBookDialogOpen(true)}
            >
                Add new book
            </Button>
        </Box>

        <AddBookDialog
            key={'add-new-book-dialog'}
            isOpen={addBookDialogOpen}
            handleClose={() => setAddBookDialogOpen(false)}
            saveBook={addBook}
        />

        {/* {books.map(function (book) {
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
            />;
        })} */}

        <MultiplePagesCollection
            currentPage={currentPage}
            changePage={setCurrentPage}
            books={books} 
            editBook={editBook}
            deleteBook={deleteBook} 
        />

        <MessageToUserSnackbar
            isOpen={messageSnackbarState.isOpen}
            handleClose={clearNotification}
            messageType={messageSnackbarState.messageType}
            messageContent={messageSnackbarState.messageContent}
        />
    </Container>;
}

export default BooksPage;