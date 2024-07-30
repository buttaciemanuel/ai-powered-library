import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grow
} from '@mui/material';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

export interface Book {
    id: number;
    title: string;
    author: string;
    publication_year: number;
    price: number;
    currency: string;
    genre: string;
}

interface DeleteBookConfimationDialogProps {
    key: React.Key;
    isOpen: boolean;
    handleClose: () => void;
    confirmDeletion: () => void;
}

export default function DeleteBookConfimationDialog({ key, isOpen, handleClose, confirmDeletion }: DeleteBookConfimationDialogProps) {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    
    return <Dialog
        key={key}
        keepMounted
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Grow}
    >
        <Box sx={{ padding: isTabletOrMobile ? 2 : 3 }}>
            <DialogTitle 
                sx={{ fontWeight: 700, color: 'black' }} 
                fontSize={isTabletOrMobile ? '1.25rem' : '1.5rem'}
            >Delete book from catalog</DialogTitle>
            <DialogContent>
                <DialogContentText 
                    sx={{ fontWeight: 300, color: 'black' }} 
                    fontSize={isTabletOrMobile ? '0.9rem' : '1rem'}
                    align='justify'
                >
                    Are you sure you want to delete the selected book from the collection? This is an irreversible action.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} size={isTabletOrMobile ? 'small' : 'medium'}>
                    Cancel
                </Button>

                <Button onClick={confirmDeletion} color='error' size={isTabletOrMobile ? 'small' : 'medium'}>
                    Delete this book
                </Button>
            </DialogActions>
        </Box>
    </Dialog>;
}