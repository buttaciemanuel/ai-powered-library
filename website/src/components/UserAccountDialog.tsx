import {
    Box,
    Button,
    Drawer,
    Grid,
    Typography
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';
import { UserAuthenticationSession } from './UserAuthenticateDialog';
import { useMediaQuery } from 'react-responsive';

interface UserAccountDialogProps {
    isOpen: boolean;
    currentUser: UserAuthenticationSession;
    handleClose: () => void;
    signOutCallback: (onResult: () => void) => void;
}

export default function UserAccountDialog({ isOpen, currentUser, handleClose, signOutCallback }: UserAccountDialogProps) {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    
    return <Drawer
        anchor='bottom'
        open={isOpen}
        onClose={handleClose}
    >
        <Box sx={{ padding: 5 }}>
            <Typography fontWeight={700} fontSize='1.5rem' paddingBottom={2}>
                Hello, {currentUser.email}!
            </Typography>
            
            <Typography fontWeight={300} fontSize='1rem'>
                You can now browse the catalog of books with better options including leaving reviews.
            </Typography>

            <Grid container direction='row' sx={{ paddingTop: 5 }}>
                <Box sx={{ flexGrow: 1 }} />

                <Button
                    size={isTabletOrMobile ? 'medium' : 'large'}
                    disableElevation
                    startIcon={<LogoutIcon />}
                    sx={{ borderRadius: '8pt' }}
                    color='warning'
                    onClick={() => {
                        signOutCallback(() => {
                            handleClose();
                        });
                    }}
                >
                    Sign out
                </Button>
            </Grid>
        </Box>
    </Drawer>;
}