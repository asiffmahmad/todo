import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  page: 0,
  size: 8,
  sort: 'createdAt,desc',
  filters: {
    status: '',
    priority: '',
    dueDate: '',
    search: '',
  },
  loading: false,
  error: null,
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    tasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    tasksSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.page = action.payload.number;
    },
    tasksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 0; // Reset to first page when filtering
    },
    resetFilters: (state) => {
      state.filters = { status: '', priority: '', dueDate: '', search: '' };
      state.page = 0;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.page = 0;
    },
    addTaskSuccess: (state, action) => {
      // Typically we re-fetch to keep pagination and ordering correct,
      // but adding to items list helps instant response.
      state.items = [action.payload, ...state.items].slice(0, state.size);
      state.totalElements += 1;
    },
    updateTaskSuccess: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    deleteTaskSuccess: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalElements -= 1;
    },
  },
})

export const {
  tasksStart,
  tasksSuccess,
  tasksFailure,
  setFilters,
  resetFilters,
  setPage,
  setSort,
  addTaskSuccess,
  updateTaskSuccess,
  deleteTaskSuccess,
} = tasksSlice.actions

export default tasksSlice.reducer
