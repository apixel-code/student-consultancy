import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  // Cache dashboard data for 5 minutes (300 seconds)
  keepUnusedDataFor: 300,
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/dashboard`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/stats',
      providesTags: ['Dashboard'],
    }),
    getActivityLog: builder.query({
      query: (limit = 20) => `/activity?limit=${limit}`,
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetActivityLogQuery } = dashboardApi;
