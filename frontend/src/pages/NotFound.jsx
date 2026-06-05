import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Button, Container } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import DoneAllIcon from '@mui/icons-material/DoneAll'

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(0, 0, 0, 0.95) 90.2%)'
            : 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.1) 0%, rgba(243, 244, 246, 1) 90.2%)',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3 }}>
          <DoneAllIcon sx={{ color: 'primary.main', fontSize: 48 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: 'Outfit',
              letterSpacing: '-1.5px',
              background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            TaskMaster
          </Typography>
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '6rem', sm: '8rem' },
            lineHeight: 1,
            mb: 2,
            fontFamily: 'Outfit',
            color: 'primary.main',
          }}
        >
          404
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Oops! Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>

        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<HomeIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    </Box>
  )
}

export default NotFound
