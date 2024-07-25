import axios from 'axios';
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

interface Book {
    id: number;
    title: string;
    author: string;
    publication_year: number;
    price: number;
    currency: string;
    genre: string;
}

const api = axios.create({
    baseURL: "http://localhost:8000"
});

function BooksPage() {
    const [filterTitle, setFilterTitle] = React.useState<string>('');
    const [filterAuthor, setFilterAuthor] = React.useState<string>('');
    const [filterGenre, setFilterGenre] = React.useState<string>('');
    const [filterPublicationYear, setFilterPublicationYear] = React.useState<string>('');
    const [countLimit, setCountLimit] = React.useState<string>('');
    const [sortBy, setSortBy] = React.useState<string>('');
    const [reversed, setReversed] = React.useState<boolean>(false);
    const [books, setBooks] = React.useState<Book[]>([]);

    React.useEffect(() => {
        fetchBooks();
    }, [ filterTitle, filterAuthor, filterGenre, filterPublicationYear, countLimit, sortBy, reversed ]);

    const fetchBooks = () => {
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
            console.log(response.data)
            setBooks(response.data);
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
                        onClick={() => { setFilterTitle(''); } }
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
                        onClick={() => { setFilterAuthor(''); } }
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
                        onClick={() => { setFilterGenre(''); } }
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

            <Button variant='contained' size='large' disableElevation startIcon={<AddIcon />} sx={{ marginLeft: 3, width: '15vw', borderRadius: '8pt' }}>
                Add new book
            </Button>
        </Box>

        {books.map(function(book) {
            return <BookItem 
                id={book.id} 
                title={book.title} 
                author={book.author} 
                publicationYear={book.publication_year}
                price={book.price}
                currency={book.currency}
                genre={book.genre}
            />;
        })}

    </Container>;
}

export default BooksPage;