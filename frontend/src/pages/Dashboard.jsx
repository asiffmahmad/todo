import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Button,
  Avatar,
  Divider,
} from '@mui/material'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import LoadingSpinner from '../components/LoadingSpinner'
import TaskCard from '../components/TaskCard'
import ConfirmationDialog from '../components/ConfirmationDialog'
import ToastNotification from '../components/ToastNotification'
import { fetchDashboardStats } from '../services/dashboardService'
import { updateTaskStatus, deleteTask } from '../services/taskService'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const { stats, loading, error } = useSelector((state) => state.dashboard)

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState('success')

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      await fetchDashboardStats()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const showToast = (message, severity = 'success') => {
    setToastMessage(message)
    setToastSeverity(severity)
    setToastOpen(true)
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus)
      showToast('Task status updated successfully!')
      loadDashboardData() // Refresh stats
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return
    try {
      await deleteTask(taskToDelete)
      showToast('Task deleted successfully!')
      setDeleteDialogOpen(false)
      setTaskToDelete(null)
      loadDashboardData() // Refresh stats
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  if (loading && stats.totalTasks === 0) {
    return <LoadingSpinner message="Aggregating dashboard statistics..." />
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: <PlaylistPlayIcon sx={{ color: 'primary.main', fontSize: 36 }} />,
      desc: 'All managed items',
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 36 }} />,
      desc: 'Done tasks',
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks,
      icon: <HourglassEmptyIcon sx={{ color: 'info.main', fontSize: 36 }} />,
      desc: 'Active duties',
    },
    {
      title: 'Pending',
      value: stats.pendingTasks,
      icon: <PendingActionsIcon sx={{ color: 'warning.main', fontSize: 36 }} />,
      desc: 'Awaiting start',
    },
  ]

  return (
    <Box>
      {/* Welcome Banner */}
      <Box
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)'
              : 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%)',
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          border: (theme) =>
            theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              fontSize: 24,
              fontWeight: 800,
              textTransform: 'uppercase',
            }}
          >
            {user?.username?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 0.5 }}>
              Welcome back, {user?.username}!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Here is your schedule summary. You have completed {stats.completedTasks} out of{' '}
              {stats.totalTasks} tasks.
            </Typography>
          </Box>
        </Box>

        <Button
          component={Link}
          to="/tasks/create"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
        >
          Create Task
        </Button>
      </Box>

      {/* Grid of Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 0.5 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {card.desc}
                  </Typography>
                </Box>
                {card.icon}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Progress & Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Outfit' }}>
                Task Completion Ratio
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your overall efficiency based on completed tasks.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Completion Progress
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {Math.round(stats.completionPercentage)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stats.completionPercentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1f2937' : '#e5e7eb'),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
                  },
                }}
              />

              <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContext: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ flexGrow: 1, color: 'text.secondary' }}>
                    Active Completion Rate
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stats.totalTasks > 0
                      ? `${stats.completedTasks}/${stats.totalTasks} Done`
                      : 'No tasks'}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContext: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ flexGrow: 1, color: 'text.secondary' }}>
                    Unfinished Duties
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stats.inProgressTasks + stats.pendingTasks} tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit' }}>
                  Recently Added Tasks
                </Typography>
                <Button
                  component={Link}
                  to="/tasks"
                  size="small"
                  endIcon={<KeyboardArrowRightIcon />}
                >
                  View All
                </Button>
              </Box>

              {stats.recentTasks.length === 0 ? (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    You haven't created any tasks yet.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {stats.recentTasks.map((task) => (
                    <Grid item xs={12} sm={6} key={task.id}>
                      <TaskCard
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteClick}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation & Toast */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Task"
        content="Are you sure you want to permanently delete this task? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />
    </Box>
  )
}

export default Dashboard
