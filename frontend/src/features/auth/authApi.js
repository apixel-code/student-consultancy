import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout, setLoading } from './authSlice.js';

const authBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/auth`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    // ─── Mutations ─────────────────────────────────────────────────────────
    login: builder.mutation({
      query: (credentials) => ({ url: '/login', method: 'POST', body: credentials }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        dispatch(setLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data));
        } catch {
          dispatch(setLoading(false));
        }
      },
    }),

    register: builder.mutation({
      query: (userData) => ({ url: '/register', method: 'POST', body: userData }),
    }),

    logout: builder.mutation({
      query: () => ({ url: '/logout', method: 'POST' }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } finally {
          // Clear state regardless of server response
          dispatch(logout());
        }
      },
    }),

    refreshToken: builder.mutation({
      query: () => ({ url: '/refresh-token', method: 'POST' }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.data.accessToken }));
        } catch {
          // Refresh failed → force logout
          dispatch(logout());
        }
      },
    }),

    updateProfile: builder.mutation({
      query: (data) => ({ url: '/update-profile', method: 'PUT', body: data }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ user: data.data }));
      },
    }),

    changePassword: builder.mutation({
      query: (data) => ({ url: '/change-password', method: 'PUT', body: data }),
    }),

    // ─── Queries ────────────────────────────────────────────────────────────
    getMe: builder.query({
      query: () => '/me',
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data }));
        } catch {
          dispatch(logout());
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetMeQuery,
} = authApi;
