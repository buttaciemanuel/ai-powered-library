import {
    Box,
    Button,
    Drawer,
    FormControlLabel,
    Grid,
    IconButton,
    Switch,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import React from 'react';

import CancelRoundedIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import LoginIcon from '@mui/icons-material/Login';
import PasswordIcon from '@mui/icons-material/Password';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useMediaQuery } from 'react-responsive';

export interface UserAuthenticationSession {
    email: string;
    token: string;
}

export enum UserAuthenticationSessionKeys {
    Email = 'email',
    Token = 'token'
}

interface UserAuthenticateDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    signInCallback: (email: string, password: string, onResult: () => void) => void;
    signUpCallback: (email: string, password: string, onResult: () => void) => void;
}

export default function UserAuthenticateDialog({ isOpen, handleClose, signInCallback, signUpCallback }: UserAuthenticateDialogProps) {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    const [firstTimeUser, setFirstTimeUser] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

    const clearState = () => {
        setFirstTimeUser(false);
        setEmail('');
        setPassword('');
        setPasswordVisible(false);
    }

    return <Drawer
        anchor='bottom'
        open={isOpen}
        onClose={() => {
            handleClose();
            clearState();
        }}
    >
        <Box sx={{ padding: 5 }}>
            <Typography fontWeight={700} fontSize='1.5rem' paddingBottom={2}>
                {firstTimeUser ? 'Welcome!' : 'Welcome back!'}
            </Typography>

            <Typography fontWeight={300} fontSize='1rem'>
                {
                    firstTimeUser ?
                        'Register and begin using extended functionalities.' :
                        'Sign in using your personal account to keep using extended functionalities.'
                }
            </Typography>

            <Box
                sx={isTabletOrMobile ? {
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 5
                } : {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    direction: "ltr",
                    paddingTop: 5
                }}
            >
                <TextField
                    id='outlined-basic'
                    placeholder='Email'
                    variant='outlined'
                    type='email'
                    size={isTabletOrMobile ? 'small' : 'medium'}
                    fullWidth
                    autoComplete='off'
                    InputProps={{
                        style: { borderRadius: '10pt', backgroundColor: 'white' },
                        startAdornment: (
                            <InputAdornment position='start'>
                                <EmailIcon />
                            </InputAdornment>
                        ),
                        endAdornment: true && (
                            <IconButton
                                onClick={() => { setEmail(''); }}
                            ><CancelRoundedIcon /></IconButton>
                        )
                    }}
                    InputLabelProps={{ shrink: false }}
                    sx={isTabletOrMobile ? {
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white'
                        },
                        '& .MuiInputLabel-root': { display: 'none' },
                        paddingBottom: 2
                    } : {
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white'
                        },
                        '& .MuiInputLabel-root': { display: 'none' },
                        paddingRight: 3
                    }}
                    onChange={(e) => { setEmail(e.target.value); }}
                    value={email}
                />

                <TextField
                    id='outlined-basic'
                    placeholder='Password'
                    variant='outlined'
                    type={passwordVisible ? 'text' : 'password'}
                    size={isTabletOrMobile ? 'small' : 'medium'}
                    fullWidth
                    autoComplete='off'
                    InputProps={{
                        style: { borderRadius: '10pt', backgroundColor: 'white' },
                        startAdornment: (
                            <InputAdornment position='start'>
                                <PasswordIcon />
                            </InputAdornment>
                        ),
                        endAdornment: true && (
                            <IconButton
                                onClick={() => { setPasswordVisible(!passwordVisible); }}

                            >
                                {passwordVisible ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        )
                    }}
                    InputLabelProps={{ shrink: false }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white'
                        },
                        '& .MuiInputLabel-root': { display: 'none' }
                    }}
                    onChange={(e) => { setPassword(e.target.value); }}
                    value={password}
                />
            </Box>

            <Grid container direction='row' sx={{ paddingTop: 2 }}>
                <FormControlLabel
                    label='I am new around here'
                    control={<Switch
                        checked={firstTimeUser}
                        onChange={(event) => setFirstTimeUser(event.target.checked)}
                    />}
                />

                <Box sx={{ flexGrow: 1 }} />
            </Grid>

            <Grid container direction='row' sx={{ paddingTop: 5 }}>
                <Box sx={{ flexGrow: 1 }} />

                <Button
                    disabled={email.trim().length === 0 || password.trim().length === 0}
                    size={isTabletOrMobile ? 'medium' : 'large'}
                    disableElevation
                    startIcon={<LoginIcon />}
                    sx={{ borderRadius: '8pt' }}
                    onClick={() => {
                        if (firstTimeUser) {
                            signUpCallback(email, password, () => {
                                handleClose();
                                clearState();
                            });
                        }
                        else {
                            signInCallback(email, password, () => {
                                handleClose();
                                clearState();
                            });
                        }
                    }}
                >
                    {firstTimeUser ? 'Sign up' : 'Sign in'}
                </Button>
            </Grid>
        </Box>
    </Drawer>;
}