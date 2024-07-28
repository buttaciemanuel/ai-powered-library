import {
    Autocomplete,
    Box,
    Button,
    Container,
    Dialog,
    IconButton,
    Slide,
    TextField,
    Typography,
    Toolbar
} from '@mui/material';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

export interface Book {
    id: number;
    title: string;
    author: string;
    publication_year: number;
    price: number;
    currency: string;
    genre: string;
}

interface AddBookDialogProps {
    key: React.Key;
    isOpen: boolean;
    handleClose: () => void;
    saveBook: (book: Book) => void;
    editableBook?: Book;
}

export default function AddBookDialog({ key, isOpen, handleClose, saveBook, editableBook }: AddBookDialogProps) {
    const [title, setTitle] = React.useState<string>(editableBook ? editableBook.title : '');
    const [author, setAuthor] = React.useState<string>(editableBook ? editableBook.author : '');
    const [genre, setGenre] = React.useState<string>(editableBook ? editableBook.genre : '');
    const [publicationYear, setPublicationYear] = React.useState<string>(editableBook ? editableBook.publication_year.toString() : '');
    const [price, setPrice] = React.useState<string>(editableBook ? editableBook.price.toString() : '');
    const [currency, setCurrency] = React.useState<string>(editableBook ? editableBook.currency : '');

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
                    size='large'
                    disableElevation
                    startIcon={editableBook ? <EditIcon /> : <AddIcon />}
                    sx={{ borderRadius: '8pt' }}
                    disabled={
                        title.trim().length === 0 ||
                        author.trim().length === 0 ||
                        genre.trim().length === 0 ||
                        publicationYear.trim().length === 0 ||
                        isNaN(Number(publicationYear)) ||
                        price.trim().length === 0 ||
                        isNaN(Number(price)) ||
                        currency.trim().length === 0
                    }
                    onClick={() => {
                        saveBook({
                            id: editableBook ? editableBook.id : -1,
                            title: title,
                            author: author,
                            genre: genre,
                            publication_year: parseInt(publicationYear),
                            price: parseFloat(price),
                            currency: currency
                        });
                        handleClose();
                    }}
                >
                    {editableBook ? 'Edit this book' : 'Add to catalog'}
                </Button>
            </Toolbar>

            <TextField
                placeholder='Title'
                variant='standard'
                type='text'
                fullWidth
                autoComplete='off'
                InputProps={{
                    style: { backgroundColor: 'none', border: 'none', fontSize: '3rem', fontWeight: 700 },
                    disableUnderline: true,
                }}
                InputLabelProps={{ shrink: false, style: { fontSize: '3rem' } }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'none'
                    },
                    '& .MuiInputLabel-root': { display: 'none' }
                }}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />

            <Typography variant='body1' paddingTop={5} color='text.secondary' fontWeight={300} gutterBottom>
                Author
            </Typography>

            <TextField
                placeholder='Author'
                variant='standard'
                type='text'
                fullWidth
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
                    '& .MuiInputLabel-root': { display: 'none' }
                }}
                onChange={(e) => setAuthor(e.target.value)}
                value={author}
            />

            <Typography variant='body1' paddingTop={3} color='text.secondary' fontWeight={300} gutterBottom>
                Genre
            </Typography>

            <TextField
                placeholder='Genre'
                variant='standard'
                type='text'
                fullWidth
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
                    '& .MuiInputLabel-root': { display: 'none' }
                }}
                onChange={(e) => setGenre(e.target.value)}
                value={genre}
            />

            <Typography variant='body1' paddingTop={3} color='text.secondary' fontWeight={300} gutterBottom>
                Publication year
            </Typography>


            <Autocomplete
                fullWidth
                disableClearable
                options={Array(2024 - 1000 + 1).fill(undefined).map((v, i) => 2024 - i)}
                onChange={(_, value) => { setPublicationYear(value.toString()); }}
                defaultValue={editableBook ? parseInt(publicationYear) : undefined}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder='Publication year'
                        variant='standard'
                        InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                            style: { fontSize: '1.5rem', fontWeight: 300 }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'none',
                                borderRadius: '10pt'
                            },
                            '& .MuiInputLabel-root': { display: 'none' },
                            "& fieldset": { borderRadius: '10pt' },
                        }}
                    />
                )}
            />

            <Typography variant='body1' paddingTop={3} color='text.secondary' fontWeight={300} gutterBottom>
                Price
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    direction: "ltr"
                }}>
                <TextField
                    placeholder='Price'
                    variant='standard'
                    type='number'
                    fullWidth
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
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': { display: 'none' },
                        '& input[type=number]': { MozAppearance: 'textfield' },
                    }}
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                />

                <Autocomplete
                    disableClearable
                    fullWidth
                    options={[
                        'USD',
                        'EUR'
                    ]}
                    sx={{ paddingLeft: 5, width: '15vw' }}
                    onChange={(_, value) => { setCurrency(value.toString()); }}
                    defaultValue={editableBook ? currency : undefined}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder='Currency'
                            variant='standard'
                            InputProps={{
                                ...params.InputProps,
                                style: { fontSize: '1.5rem', fontWeight: 300 },
                                disableUnderline: true
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
        </Container>
    </Dialog>;
}