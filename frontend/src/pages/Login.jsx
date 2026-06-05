import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { login } from '../services/authService'
import { clearError } from '../features/authSlice'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState({})

  const validate = () => {
    const errors = {}
    if (!email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid'
    }
    if (!password) {
      errors.password = 'Password is required'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    if (!validate()) return

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      // Handled by authSlice and displayed via state
    }
  }

  const handleQuickLogin = async (role) => {
    dispatch(clearError())
    const credentials =
      role === 'admin'
        ? { email: 'admin@example.com', pass: 'Admin@123' }
        : { email: 'user@example.com', pass: 'User@123' }

    try {
      await login(credentials.email, credentials.pass)
      navigate('/dashboard')
    } catch (err) {
      // Error is stored in redux and rendered
    }
  }

  return (
    <Card sx={{ borderRadius: 4, boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'primary.main', py: 3, textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <DoneAllIcon sx={{ fontSize: 40 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit' }}>
          Sign In to TaskMaster
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Manage your tasks efficiently
        </Typography>
      </Box>

      <CardContent sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              placeholder="name@example.com"
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!formErrors.password}
              helperText={formErrors.password}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              sx={{ py: 1.5, mt: 1 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
              Create Account
            </Link>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }}>Or Quick Demo Login</Divider>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => handleQuickLogin('user')}
          >
            Regular User
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => handleQuickLogin('admin')}
          >
            Admin User
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default Login
