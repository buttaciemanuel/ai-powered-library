import {
    Alert,
    Slide,
    Snackbar
} from '@mui/material';

export enum MessageToUserSnackbarType {
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error'
}

export interface MessageToUserSnackbarProps {
    isOpen: boolean;
    handleClose: () => void;
    messageType: MessageToUserSnackbarType | undefined;
    messageContent: string;
}

export interface MessageToUserSnackbarState {
    isOpen: boolean;
    messageType: MessageToUserSnackbarType | undefined;
    messageContent: string;
}

export default function MessageToUserSnackbar({ isOpen, handleClose, messageType, messageContent }: MessageToUserSnackbarProps) {
    return <Snackbar
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Slide}
        key={Slide.name}
        autoHideDuration={3000}
    >
        <Alert severity={messageType} onClose={handleClose}>
            {messageContent}
        </Alert>
    </Snackbar>;
}