import { Autocomplete, Box, Button, Container, FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, Switch, TextField, Typography } from '@mui/material';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import CancelRoundedIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

function BooksPage() {
    return <Container sx={{ paddingTop: '5vh', backgroundColor: 'purple' }}>
        <Typography sx={{ backgroundColor: 'yellow' }} variant='h1' fontWeight={700} paddingBottom={2}>
            Discover all the books
        </Typography>

        <Typography sx={{ backgroundColor: 'green', paddingLeft: 0.5 }} variant='h5' fontWeight={300} paddingBottom={5}>
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
                        onClick={() => { }}
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
            onChange={(e) => { }}
            value={null}
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
                            onClick={() => { }}
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
                onChange={(e) => { }}
                value={null}
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
                            onClick={() => { }}
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
                onChange={(e) => { }}
                value={null}
            />


            <Autocomplete
                fullWidth
                disableClearable
                options={Array(2024 - 1000 + 1).fill(undefined).map((v, i) => 2024 - i)}
                sx={{ paddingLeft: 1 }}
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
                paddingTop: 2
            }}
        >
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
                <FormControlLabel control={<Switch />} label='Reverse' />
            </FormGroup>

            <Box sx={{ flexGrow: 1 }} />

            <Button variant="contained" size='large' startIcon={<AddIcon />} sx={{ marginLeft: 3, width: '15vw' }}>
                Add new book
            </Button>


        </Box>

    </Container>;
}

export default BooksPage;