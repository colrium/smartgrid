import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading({ message = 'Loading...' }: { message?: string }) {
	return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-2">
            <CircularProgress />
            <Typography
                variant="body2"
                color="text.secondary"
            >
                {message}
            </Typography>
        </div>
	);
}
