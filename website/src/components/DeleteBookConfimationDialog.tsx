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
    return <Dialog
        key={key}
        keepMounted
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Grow}
    >
        <Box sx={{ padding: 3 }}>
        <DialogTitle sx={{ fontWeight: 700, color: 'black' }}>Delete book from catalog</DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ fontWeight: 300, color: 'black' }}>
                Are you sure you want to delete the selected book from the collection? This is an irreversible action.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={confirmDeletion}>Confirm</Button>
        </DialogActions>
        </Box>
    </Dialog>;
}