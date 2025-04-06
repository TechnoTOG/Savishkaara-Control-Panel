// src/pages/ForbiddenPage.js
import React, { useEffect} from 'react';
import { Typography, Box, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForbiddenPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Update the document title when the component mounts
        document.title = 'Forbidden';
      }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f9fafb', // Light background for contrast
                textAlign: 'center',
                padding: 2,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '150%',
                    height: '150%',
                    background: 'linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%)',
                    transform: 'rotate(-15deg)',
                    zIndex: -1,
                    opacity: 0.2,
                }}
            />

            {/* Main Content */}
            <Container maxWidth="sm">
                {/* Error Code */}
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: '6rem', md: '8rem' },
                        fontWeight: 'bold',
                        color: '#d32f2f', // Red color for emphasis
                        marginBottom: 2,
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                        animation: 'fadeIn 1s ease-in-out',
                    }}
                >
                    403
                </Typography>

                {/* Error Title */}
                <Typography
                    variant="h4"
                    sx={{
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                        color: '#333',
                        marginBottom: 2,
                        animation: 'slideIn 1s ease-in-out',
                    }}
                >
                    Oops! Access Denied.
                </Typography>

                {/* Error Description */}
                <Typography
                    variant="body1"
                    sx={{
                        fontSize: '1rem',
                        color: '#666',
                        marginBottom: 4,
                        animation: 'fadeIn 1.5s ease-in-out',
                    }}
                >
                    You do not have permission to access this resource. Please contact the administrator if you believe this is an error.
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/')} // Redirect to home
                        sx={{
                            textTransform: 'none',
                            padding: '10px 20px',
                            fontSize: '1rem',
                            borderRadius: '50px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        Go to Home
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate('/login')} // Redirect to login
                        sx={{
                            textTransform: 'none',
                            padding: '10px 20px',
                            fontSize: '1rem',
                            borderRadius: '50px',
                            border: '2px solid',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        Login Again
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default ForbiddenPage;