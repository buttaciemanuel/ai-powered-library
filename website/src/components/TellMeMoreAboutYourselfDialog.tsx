import {
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

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { useMediaQuery } from 'react-responsive';

export interface UserRecommendationInformation {
    readingGoal: string;
    readingGoalDescription: string;
    readingMood: string;
}

interface TellMeMoreAboutYourselfDialogProps {
    key: React.Key;
    isOpen: boolean;
    saveInfo: (info: UserRecommendationInformation) => void;
    handleClose: () => void;
}

export default function TellMeMoreAboutYourselfDialog({ key, isOpen, saveInfo, handleClose }: TellMeMoreAboutYourselfDialogProps) {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    
    const [goal, setGoal] = React.useState<string>('');
    const [mood, setMood] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');

    const resetDialogInputs = React.useCallback(() => {
        setGoal('');
        setMood('');
        setDescription('');
    }, []);

    return <Dialog
        key={key}
        fullScreen
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Slide}
    >
        <Container>
            <Toolbar sx={{ marginBottom: 3, paddingY: 5, paddingX: '0pt !important' }}>
                <IconButton
                    edge='start'
                    color='inherit'
                    onClick={() => {
                        handleClose();
                        resetDialogInputs();
                    }}
                    aria-label='close'
                >
                    <CloseIcon />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                    size={isTabletOrMobile ? 'small' : 'large'}
                    disableElevation
                    startIcon={<DoneIcon />}
                    sx={{ borderRadius: '8pt' }}
                    disabled={
                        goal.trim().length === 0 ||
                        description.trim().length === 0
                    }
                    onClick={() => {
                        saveInfo({
                            readingGoal: goal,
                            readingGoalDescription: description,
                            readingMood: mood
                        });
                        resetDialogInputs();
                    }}
                >
                    That's me!
                </Button>
            </Toolbar>

            <Typography fontSize={isTabletOrMobile ? '1.75rem' : '3rem'}  fontWeight={700} paddingBottom={2}>
                Tell me more {isTabletOrMobile ? '' : 'about yourself'}
            </Typography>

            <Typography variant={isTabletOrMobile ? 'body1' : 'h5'} fontWeight={300} paddingBottom={5}>
                I will use this information to provide you with helpful recommendations about the books you visualize.
            </Typography>

            <Typography variant={isTabletOrMobile ? 'body2' : 'body1'} paddingTop={5} color='text.secondary' fontWeight={300} gutterBottom>
                Your goal
            </Typography>

            <TextField
                placeholder="What's your reading goal?"
                variant='standard'
                type='text'
                fullWidth
                autoComplete='off'
                InputProps={{
                    style: { borderRadius: '10pt', backgroundColor: 'white', fontSize: isTabletOrMobile ? '1.25rem' : '2rem', fontWeight: 300 },
                    disableUnderline: true,
                }}
                InputLabelProps={{ shrink: false, style: { fontSize: isTabletOrMobile ? '1.25rem' : '2rem' } }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'none'
                    },
                    '& .MuiInputLabel-root': { display: 'none' }
                }}
                onChange={(e) => setGoal(e.target.value)}
                value={goal}
            />

            <Typography variant={isTabletOrMobile ? 'body2' : 'body1'} paddingTop={3} color='text.secondary' fontWeight={300} gutterBottom>
                A detailed description of your objective
            </Typography>

            <TextField
                placeholder='Describe your reading goal in detail...'
                variant='standard'
                type='text'
                fullWidth
                autoComplete='off'
                InputProps={{
                    style: { borderRadius: '10pt', backgroundColor: 'white', fontSize: isTabletOrMobile ? '1.1rem' : '1.5rem', fontWeight: 300 },
                    disableUnderline: true,
                }}
                InputLabelProps={{ shrink: false, style: { fontSize: isTabletOrMobile ? '1.1rem' : '1.5rem' } }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'none'
                    },
                    '& .MuiInputLabel-root': { display: 'none' }
                }}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
            />

            <Typography variant={isTabletOrMobile ? 'body2' : 'body1'} paddingTop={3} color='text.secondary' fontWeight={300} gutterBottom>
                Your mood
            </Typography>

            <TextField
                placeholder="What's your mood?"
                variant='standard'
                type='text'
                fullWidth
                autoComplete='off'
                InputProps={{
                    style: { borderRadius: '10pt', backgroundColor: 'white', fontSize: isTabletOrMobile ? '1.1rem' : '1.5rem', fontWeight: 300 },
                    disableUnderline: true,
                }}
                InputLabelProps={{ shrink: false, style: { fontSize: isTabletOrMobile ? '1.1rem' : '1.5rem' } }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'none'
                    },
                    '& .MuiInputLabel-root': { display: 'none' }
                }}
                onChange={(e) => setMood(e.target.value)}
                value={mood}
            />
        </Container>
    </Dialog>;
}