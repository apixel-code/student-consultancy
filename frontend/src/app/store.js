import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice.js';
import { authApi } from '../features/auth/authApi.js';
import { userApi } from '../features/users/userApi.js';
import { studentApi } from '../features/students/studentApi.js';
import { applicationApi } from '../features/applications/applicationApi.js';
import { universityApi } from '../features/universities/universityApi.js';
import { courseApi } from '../features/courses/courseApi.js';
import { documentApi } from '../features/documents/documentApi.js';
import { dashboardApi } from '../features/dashboard/dashboardApi.js';
import { successStoryApi } from '../features/successStories/successStoryApi.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
    [universityApi.reducerPath]: universityApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [successStoryApi.reducerPath]: successStoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      studentApi.middleware,
      applicationApi.middleware,
      universityApi.middleware,
      courseApi.middleware,
      documentApi.middleware,
      dashboardApi.middleware,
      successStoryApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
