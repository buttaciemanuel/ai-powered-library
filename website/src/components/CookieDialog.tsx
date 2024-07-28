import {
    Box,
    Button,
    Divider,
    Drawer,
    Grid,
    IconButton,
    Typography
} from '@mui/material';
import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

interface CookieDialogPropos {
    isOpen: boolean;
    acceptCookies: () => void;
    refuseCookies: () => void;
    handleClose: () => void;
}

export default function CookieDialog({ isOpen, acceptCookies, refuseCookies, handleClose }: CookieDialogPropos) {
    return <Drawer
        anchor={'bottom'}
        open={isOpen}
        onClose={handleClose}
    >
        <Box sx={{ padding: 5 }}>
            <Typography fontWeight={700} fontSize='1.5rem' paddingBottom={2}>
                Cookies permission
            </Typography>
            
            <Typography fontWeight={300} fontSize='1rem'>
                Can I temporarily collect some information about you to provide a better AI-powered user experience? This will help me giving you enhanced recommendations for each book that better align with your reading 
                goals and expectation.
            </Typography>

            <Divider sx={{ marginY: 3 }} />

            <Typography fontWeight={300} fontSize='1rem'>
                In any case, this information will be stored within the browser cache for no more
                than 7 days, and after that it will be fully deleted.
            </Typography>

            <Grid container direction='row' sx={{ paddingTop: 5 }}>
                <Box sx={{ flexGrow: 1 }} />

                <Button
                    size='large'
                    disableElevation
                    startIcon={<CloseIcon />}
                    sx={{ borderRadius: '8pt', marginRight: 3 }}
                    color='error'
                    onClick={refuseCookies}
                >
                    Refuse
                </Button>

                <Button
                    size='large'
                    disableElevation
                    startIcon={<DoneIcon />}
                    sx={{ borderRadius: '8pt' }}
                    onClick={acceptCookies}
                >
                    Accept
                </Button>
            </Grid>
        </Box>
    </Drawer>;
}