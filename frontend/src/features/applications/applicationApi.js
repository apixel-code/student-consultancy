import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const applicationApi = createApi({
  reducerPath: 'applicationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/applications`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Application'],
  endpoints: (builder) => ({
    createApplication: builder.mutation({
      query: (body) => ({ url: '/', method: 'POST', body }),
      invalidatesTags: ['Application'],
    }),

    getAllApplications: builder.query({
      query: (params = {}) => ({ url: '/', params }),
      providesTags: ['Application'],
    }),

    getAllApplicationsForKanban: builder.query({
      query: (params = {}) => ({ url: '/kanban', params }),
      providesTags: ['Application'],
    }),

    getMyApplications: builder.query({
      query: () => '/my',
      providesTags: ['Application'],
    }),

    getApplicationStats: builder.query({
      query: (params = {}) => ({ url: '/stats', params }),
      providesTags: ['Application'],
    }),

    getApplicationById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Application', id }],
    }),

    updateApplication: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Application'],
    }),

    updateApplicationStatus: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/${id}/status`, method: 'PATCH', body }),
      invalidatesTags: ['Application'],
    }),

    assignCounselor: builder.mutation({
      query: ({ id, counselorId }) => ({
        url: `/${id}/assign-counselor`,
        method: 'PATCH',
        body: { counselorId },
      }),
      invalidatesTags: ['Application'],
    }),

    deleteApplication: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Application'],
    }),
  }),
});

export const {
  useCreateApplicationMutation,
  useGetAllApplicationsQuery,
  useGetAllApplicationsForKanbanQuery,
  useGetMyApplicationsQuery,
  useGetApplicationStatsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationMutation,
  useUpdateApplicationStatusMutation,
  useAssignCounselorMutation,
  useDeleteApplicationMutation,
} = applicationApi;
