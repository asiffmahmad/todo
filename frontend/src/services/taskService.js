import api from './api'
import store from '../store'
import {
  tasksStart,
  tasksSuccess,
  tasksFailure,
  addTaskSuccess,
  updateTaskSuccess,
  deleteTaskSuccess,
} from '../features/tasksSlice'

export const fetchTasks = async () => {
  store.dispatch(tasksStart());
  const state = store.getState();
  const { page, size, sort, filters } = state.tasks;
  
  const params = {
    page,
    size,
    sort,
  };

  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.dueDate) params.dueDate = filters.dueDate;
  if (filters.search) params.search = filters.search;

  try {
    const response = await api.get('/api/tasks', { params });
    store.dispatch(tasksSuccess(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch tasks';
    store.dispatch(tasksFailure(message));
    throw new Error(message);
  }
}

export const fetchTaskById = async (id) => {
  try {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch task details');
  }
}

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/api/tasks', taskData);
    store.dispatch(addTaskSuccess(response.data));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create task');
  }
}

export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    store.dispatch(updateTaskSuccess(response.data));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update task');
  }
}

export const deleteTask = async (id) => {
  try {
    await api.delete(`/api/tasks/${id}`);
    store.dispatch(deleteTaskSuccess(id));
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete task');
  }
}

export const updateTaskStatus = async (id, status) => {
  try {
    const response = await api.patch(`/api/tasks/${id}/status`, null, {
      params: { status }
    });
    store.dispatch(updateTaskSuccess(response.data));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update task status');
  }
}
