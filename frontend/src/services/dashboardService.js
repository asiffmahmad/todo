import api from './api'
import store from '../store'
import { dashboardStart, dashboardSuccess, dashboardFailure } from '../features/dashboardSlice'

export const fetchDashboardStats = async () => {
  store.dispatch(dashboardStart());
  try {
    const response = await api.get('/api/dashboard/stats');
    store.dispatch(dashboardSuccess(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch dashboard statistics';
    store.dispatch(dashboardFailure(message));
    throw new Error(message);
  }
}
