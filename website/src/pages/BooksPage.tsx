import axios, { AxiosError } from 'axios';
import {
    Autocomplete,
    Box,
    Button,
    Container,
    Fab,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputAdornment,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import Cookies from 'js-cookie';

import AddIcon from '@mui/icons-material/Add';
import CancelRoundedIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddBookDialog, { Book } from './AddBookDialog';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MessageToUserSnackbar, { MessageToUserSnackbarState, MessageToUserSnackbarType } from '../components/MessageToUserSnackbar';
import MultiplePagesCollection from '../components/MultiplePagesCollection';
import TellMeMoreAboutYourselfDialog, { UserRecommendationInformation } from './TellMeMoreAboutYourselfDialog';
import CookieDialog from './CookieDialog';
import { BookSummaryInformation } from './BookSummaryDialog';
import UserAuthenticateDialog, { UserAuthenticationSessionKeys } from './UserAuthenticateDialog';
import UserAccountDialog from './UserAccountDialog';
import { BookReview } from './BookReviewsDialog';

enum UserRecommendationInformationCookieKeys {
    ReadingGoal = 'user.readingGoal',
    ReadingGoalDescription = 'user.readingGoalDescription',
    ReadingMood = 'user.readingMood',
}

interface ResponseError {
    error: string;
}

const api = axios.create({
    baseURL: "http://localhost:8000"
});

function BooksPage() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    const [signedInUser, setSignedInUser] = React.useState<boolean>(false);
    const [signInPageOpen, setSignInPageOpen] = React.useState<boolean>(false);

    const [userAccountDialogOpen, setUserAccountDialogOpen] = React.useState<boolean>(false);

    const [cookieDialogOpen, setCookieDialogOpen] = React.useState<boolean>(false);
    const [tellMeDialogOpen, setTellMeDialogOpen] = React.useState<boolean>(false);

    const [booksReviewedByCurrentUser, setBooksReviewedByCurrentUser] = React.useState<number[] | undefined>(undefined);

    const [addBookDialogOpen, setAddBookDialogOpen] = React.useState<boolean>(false);

    const [messageSnackbarState, setMessageSnackbarState] = React.useState<MessageToUserSnackbarState>({
        isOpen: false,
        messageType: undefined,
        messageContent: ''
    });

    const [filterTitle, setFilterTitle] = React.useState<string>('');
    const [filterAuthor, setFilterAuthor] = React.useState<string>('');
    const [filterGenre, setFilterGenre] = React.useState<string>('');
    const [filterPublicationYear, setFilterPublicationYear] = React.useState<string>('');
    const [countLimit, setCountLimit] = React.useState<string>('');
    const [sortBy, setSortBy] = React.useState<string>('');
    const [reversed, setReversed] = React.useState<boolean>(false);
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [books, setBooks] = React.useState<Book[] | undefined>(undefined);

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
            requestParameters.push(`count=100`)
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
            setBooks([]);
        });
    }, [filterTitle, filterAuthor, filterGenre, filterPublicationYear, countLimit, sortBy, reversed]);

    React.useEffect(() => {
        if (Cookies.get(UserRecommendationInformationCookieKeys.ReadingGoal) === undefined) {
            setCookieDialogOpen(true);
        }
    }, []);

    React.useEffect(() => {
        fetchBooks();
    }, []);

    React.useEffect(() => {
        const delayDebounceFn = setTimeout(fetchBooks, 250);
        return () => clearTimeout(delayDebounceFn);
    }, [fetchBooks, filterTitle, filterAuthor, filterGenre, filterPublicationYear, countLimit, sortBy, reversed]);

    React.useEffect(() => {
        const email = Cookies.get(UserAuthenticationSessionKeys.Email);
        const token = Cookies.get(UserAuthenticationSessionKeys.Token);

        if (email !== undefined && token !== undefined) {
            getReviewedBooks(email, token);
        }
    }, [signedInUser, books]);

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

    const summarizeBook = React.useCallback((book: Book, onSuccess: (summary: BookSummaryInformation) => void) => {
        let requestParameters: string[] = [];

        if (Cookies.get(UserRecommendationInformationCookieKeys.ReadingGoal) !== undefined) {
            requestParameters.push(`goal=${Cookies.get(UserRecommendationInformationCookieKeys.ReadingGoal)}`);
        }

        if (Cookies.get(UserRecommendationInformationCookieKeys.ReadingGoalDescription) !== undefined) {
            requestParameters.push(`description=${Cookies.get(UserRecommendationInformationCookieKeys.ReadingGoalDescription)}`);
        }

        if (Cookies.get(UserRecommendationInformationCookieKeys.ReadingMood) !== undefined) {
            requestParameters.push(`mood=${Cookies.get(UserRecommendationInformationCookieKeys.ReadingMood)}`);
        }

        api.get(`/ai/summary/${book.id}`).then((summaryResponse) => {
            api.get(`/ai/recommendation/${book.id}?${requestParameters.join('&')}`).then((recommendationResponse) => {
                onSuccess({
                    summary: summaryResponse.data['summary'],
                    recommendation: recommendationResponse.data['recommendation']
                });
            }).catch((error: AxiosError) => {
                if (error.response) {
                    showNotification(MessageToUserSnackbarType.Error, (error.response.data as ResponseError).error);
                }
                else {
                    showNotification(MessageToUserSnackbarType.Error, 'An error occurred while trying to generate the recommendation for the selected book');
                }
            });
        }).catch((error: AxiosError) => {
            if (error.response) {
                showNotification(MessageToUserSnackbarType.Error, (error.response.data as ResponseError).error);
            }
            else {
                showNotification(MessageToUserSnackbarType.Error, 'An error occurred while trying to generate the summary for the selected book');
            }
        });
    }, [fetchBooks]);

    const getReviews = React.useCallback((book: Book, onSuccess: (reviews: BookReview[]) => void) => {
        api.get(`/books/getreviews/${book.id}`).then((response) => {
            onSuccess(response.data['reviews']);
        }).catch((error: AxiosError) => {
            if (error.response) {
                showNotification(MessageToUserSnackbarType.Error, (error.response.data as ResponseError).error);
            }
            else {
                showNotification(MessageToUserSnackbarType.Error, 'An error occurred while trying to retrieve the reviews of the book');
            }
        });
    }, [fetchBooks]);

    const getReviewedBooks = React.useCallback((email: string, token: string) => {
        api.post(`/books/getreviewedbooks/${email}?token=${token}`).then((response) => {
            setBooksReviewedByCurrentUser(response.data['reviewed_books']);
        }).catch((error: AxiosError) => {
            if (error.response) {
                showNotification(MessageToUserSnackbarType.Error, (error.response.data as ResponseError).error);
            }
            else {
                showNotification(MessageToUserSnackbarType.Error, 'An error occurred while retrieving the books reviewed by signed in user');
            }
        });
    }, []);

    const reviewCallback = React.useCallback((book: Book, nStars: number, content: string, onSuccess: () => void) => {
        const email = Cookies.get(UserAuthenticationSessionKeys.Email);
        const token = Cookies.get(UserAuthenticationSessionKeys.Token);
        api.post(`/books/review/${book.id}?token=${token}&email=${email}&n_stars=${nStars}&content=${content}`).then(() => {
            onSuccess();
            showNotification(MessageToUserSnackbarType.Success, `You have successfully reviewed ${book.title}`);
            fetchBooks();
        }).catch((error: AxiosError) => {
            if (error.response) {
                showNotification(MessageToUserSnackbarType.Error, (error.response.data as ResponseError).error);
            }
            else {
                showNotification(MessageToUserSnackbarType.Error, 'An error occurred while reviewing the selected book');
            }
        });
    }, []);

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

    const saveUserInformationCookie = React.useCallback((info: UserRecommendationInformation) => {
        const options = { expires: 7 };
        Cookies.set(UserRecommendationInformationCookieKeys.ReadingGoal, info.readingGoal, options);
        Cookies.set(UserRecommendationInformationCookieKeys.ReadingGoalDescription, info.readingGoalDescription, options);
        Cookies.set(UserRecommendationInformationCookieKeys.ReadingMood, info.readingMood, options);
    }, []);

    const signIn = React.useCallback((email: string, password: string, onResult: () => void) => {
        api.post(`/auth/signin?email=${email}&password=${password}`).then((response) => {
            onResult();
            Cookies.set(UserAuthenticationSessionKeys.Email, email);
            Cookies.set(UserAuthenticationSessionKeys.Token, response.data[UserAuthenticationSessionKeys.Token]);
            showNotification(MessageToUserSnackbarType.Success, `You have successfully signed in as ${email}`);
            setSignedInUser(true);
            fetchBooks();
        }).catch((error: AxiosError) => {
            onResult();
            Cookies.remove(UserAuthenticationSessionKeys.Email);
            Cookies.remove(UserAuthenticationSessionKeys.Token);
            setSignedInUser(false);
            if (error.response) {
                showNotification(MessageToUserSnackbarType.Error, (error.response.data as ResponseError).error);
            }
            else {
                showNotification(MessageToUserSnackbarType.Error, 'An error occurred while trying to sign in');
            }
        });
    }, []);

    const signUp = React.useCallback((email: string, password: string, onResult: () => void) => {
        api.post(`/auth/signup?email=${email}&password=${password}`).then((response) => {
            onResult();
            Cookies.set(UserAuthenticationSessionKeys.Email, email);
            Cookies.set(UserAuthenticationSessionKeys.Token, response.data[UserAuthenticationSessionKeys.Token]);
            showNotification(MessageToUserSnackbarType.Success, `You have successfully signed up as ${email}`);
            setSignedInUser(true);
            fetchBooks();
        }).catch((error: AxiosError) => {
            onResult();
            Cookies.remove(UserAuthenticationSessionKeys.Email);
            Cookies.remove(UserAuthenticationSessionKeys.Token);
            setSignedInUser(false);
            if (error.response) {
                showNotification(MessageToUserSnackbarType.Error, (error.response.data as ResponseError).error);
            }
            else {
                showNotification(MessageToUserSnackbarType.Error, 'An error occurred while trying to sign uè');
            }
        });
    }, []);

    const signOut = React.useCallback((onResult: () => void) => {
        api.post(`/auth/signout?email=${Cookies.get(UserAuthenticationSessionKeys.Email)}&token=${Cookies.get(UserAuthenticationSessionKeys.Token)}`).then(() => {
            onResult();
            Cookies.remove(UserAuthenticationSessionKeys.Email);
            Cookies.remove(UserAuthenticationSessionKeys.Token);
            showNotification(MessageToUserSnackbarType.Success, 'You have successfully signed out');
            setSignedInUser(false);
            fetchBooks();
        }).catch((error: AxiosError) => {
            onResult();
            Cookies.remove(UserAuthenticationSessionKeys.Email);
            Cookies.remove(UserAuthenticationSessionKeys.Token);
            setSignedInUser(false);
            if (error.response) {
                showNotification(MessageToUserSnackbarType.Error, (error.response.data as ResponseError).error);
            }
            else {
                showNotification(MessageToUserSnackbarType.Error, 'An error occurred while trying to sign out');
            }
        });
    }, []);

    return <Container sx={{ paddingTop: '5vh', backgroundColor: 'none' }}>
        <Typography
            sx={{ backgroundColor: 'none' }}
            variant={isTabletOrMobile ? 'h4' : 'h1'}
            fontWeight={700}
            paddingBottom={2}
        >
            Browse this catalog
        </Typography>

        <Typography
            sx={{ backgroundColor: 'none', paddingLeft: 0.5 }}
            variant={isTabletOrMobile ? 'body1' : 'h5'}
            fontWeight={300}
            paddingBottom={5}
        >
            You can freely add, edit and delete the books from this catalog.
        </Typography>

        <TextField
            placeholder={isTabletOrMobile ? 'Search title' : 'Search any book title'}
            variant='outlined'
            size={isTabletOrMobile ? 'small' : 'medium'}
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
            sx={isTabletOrMobile ? {
                justifyContent: "center",
                alignItems: "center",
            } : {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                direction: "ltr",
                paddingTop: 2
            }}
        >
            <TextField
                size={isTabletOrMobile ? 'small' : 'medium'}
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
                sx={isTabletOrMobile ? {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white'
                    },
                    '& .MuiInputLabel-root': { display: 'none' },
                    paddingTop: 2
                } : {
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
                size={isTabletOrMobile ? 'small' : 'medium'}
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
                sx={isTabletOrMobile ?
                    {
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white'
                        },
                        '& .MuiInputLabel-root': { display: 'none' },
                        paddingTop: 2
                    } : {
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white'
                        },
                        '& .MuiInputLabel-root': { display: 'none' }
                    }}
                onChange={(e) => { setFilterGenre(e.target.value); }}
                value={filterGenre}
            />


            <Autocomplete
                size={isTabletOrMobile ? 'small' : 'medium'}
                fullWidth
                disableClearable
                options={Array(2024 - 1000 + 1).fill(undefined).map((v, i) => 2024 - i)}
                sx={isTabletOrMobile ? { paddingTop: 2 } : { paddingLeft: 1 }}
                onChange={(_, value) => { setFilterPublicationYear(value.toString()); }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size={isTabletOrMobile ? 'small' : 'medium'}
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
            sx={isTabletOrMobile ? {
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 5
            } : {
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
                fullWidth={isTabletOrMobile}
                size={isTabletOrMobile ? 'small' : 'medium'}
                sx={isTabletOrMobile ? { paddingTop: 2 } : { paddingRight: 1, width: '15vw' }}
                onChange={(_, value) => { setCountLimit(value); }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size={isTabletOrMobile ? 'small' : 'medium'}
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
                fullWidth={isTabletOrMobile}
                size={isTabletOrMobile ? 'small' : 'medium'}
                sx={isTabletOrMobile ? { paddingTop: 2 } : { paddingRight: 3, width: '15vw' }}
                onChange={(_, value) => { setSortBy(value); }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size={isTabletOrMobile ? 'small' : 'medium'}
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
                <FormControlLabel
                    control={<Switch disabled={sortBy.trim().length === 0} />}
                    label='Reverse'
                    sx={isTabletOrMobile ? { paddingTop: 2 } : {}}
                    onChange={(e) => setReversed((e.target as HTMLInputElement).checked)}
                />
            </FormGroup>

            {isTabletOrMobile ? <></> : <Box sx={{ flexGrow: 1 }} />}

            <Button
                variant='outlined'
                size={isTabletOrMobile ? 'medium' : 'large'}
                fullWidth={isTabletOrMobile}
                disableElevation
                startIcon={<AddIcon />}
                sx={isTabletOrMobile ? {
                    marginTop: 2,
                    borderRadius: '8pt'
                } : {
                    marginLeft: 3,
                    width: '15vw',
                    borderRadius: '8pt'
                }}
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

        <TellMeMoreAboutYourselfDialog
            key={'tell-me-dialog'}
            isOpen={tellMeDialogOpen}
            saveInfo={(info: UserRecommendationInformation) => {
                setTellMeDialogOpen(false);
                saveUserInformationCookie(info);
                showNotification(MessageToUserSnackbarType.Info, 'Your reading goal has been updated as cookie information expiring in 7 days');
            }}
            handleClose={() => {
                setTellMeDialogOpen(false);
            }}
        />

        <MultiplePagesCollection
            currentPage={currentPage}
            changePage={setCurrentPage}
            books={books}
            editBook={editBook}
            deleteBook={deleteBook}
            summarizeBook={summarizeBook}
            getReviews={getReviews}
            submitReview={
                Cookies.get(UserAuthenticationSessionKeys.Email) === undefined ||
                    Cookies.get(UserAuthenticationSessionKeys.Token) === undefined ?
                    undefined :
                    reviewCallback
            }
            booksReviewedByCurrentUser={booksReviewedByCurrentUser}
            currentUser={
                Cookies.get(UserAuthenticationSessionKeys.Email) === undefined ||
                    Cookies.get(UserAuthenticationSessionKeys.Token) === undefined ? undefined : {
                    email: Cookies.get(UserAuthenticationSessionKeys.Email) as string,
                    token: Cookies.get(UserAuthenticationSessionKeys.Token) as string
                }
            }
        />

        <MessageToUserSnackbar
            isOpen={messageSnackbarState.isOpen}
            handleClose={clearNotification}
            messageType={messageSnackbarState.messageType}
            messageContent={messageSnackbarState.messageContent}
        />

        {Cookies.get(UserAuthenticationSessionKeys.Email) === undefined || Cookies.get(UserAuthenticationSessionKeys.Token) === undefined ?
            <Fab
                color='primary'
                aria-label='authenticate'
                variant='extended'
                sx={{ position: 'fixed', bottom: 25, right: 25, borderRadius: '8pt' }}
                onClick={() => setSignInPageOpen(true)}
            >
                <LockOpenIcon sx={isTabletOrMobile ? {} : { mr: 1 }} />
                {isTabletOrMobile ? '' : 'Authenticate'}
            </Fab> :
            <>
                <Fab
                    color='success'
                    aria-label='account'
                    variant='extended'
                    sx={{ position: 'fixed', bottom: 25, right: 25, borderRadius: '8pt', textTransform: 'none' }}
                    onClick={() => setUserAccountDialogOpen(true)}
                >
                    <VerifiedUserIcon sx={isTabletOrMobile ? {} : { mr: 1 }} />
                    {isTabletOrMobile ? '' : Cookies.get(UserAuthenticationSessionKeys.Email) as string}
                </Fab>
                <UserAccountDialog
                    isOpen={userAccountDialogOpen}
                    currentUser={{
                        email: Cookies.get(UserAuthenticationSessionKeys.Email) as string,
                        token: Cookies.get(UserAuthenticationSessionKeys.Token) as string
                    }}
                    signOutCallback={signOut}
                    handleClose={() => setUserAccountDialogOpen(false)}
                />
            </>
        }

        <UserAuthenticateDialog
            isOpen={signInPageOpen}
            handleClose={() => { setSignInPageOpen(false); }}
            signInCallback={signIn}
            signUpCallback={signUp}
        />

        <CookieDialog
            isOpen={cookieDialogOpen}
            handleClose={() => setCookieDialogOpen(false)}
            acceptCookies={() => {
                setCookieDialogOpen(false);
                setTellMeDialogOpen(true);
            }}
            refuseCookies={() => setCookieDialogOpen(false)}
        />
    </Container>;
}

export default BooksPage;