import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';

const StickyTimer = ({ durationInSeconds }) => {
    const [timeLeft, setTimeLeft] = useState(durationInSeconds);

    useEffect(() => {
        // Reset timeLeft when durationInSeconds changes
        setTimeLeft(durationInSeconds);
    }, [durationInSeconds]);

    useEffect(() => {
        if (timeLeft <= 0) return; // Exit if timeLeft is 0 or less

        // Update timeLeft every second
        const intervalId = setInterval(() => {
            setTimeLeft(prevTimeLeft => {
                if (prevTimeLeft <= 1) {
                    clearInterval(intervalId);
                    return 0;
                }
                return prevTimeLeft - 1;
            });
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: 2,
                width: 200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'primary.main',
                borderRadius: 2,
                textAlign: 'center',
            }}
        >
            <Typography variant="h5">
                Time Left: {formatTime(timeLeft)}
            </Typography>
        </Paper>
    );
};

export default StickyTimer;
