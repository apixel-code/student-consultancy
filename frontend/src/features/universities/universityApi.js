import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const universityApi = createApi({
  reducerPath: 'universityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/universities`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['University'],
  endpoints: (builder) => ({
    createUniversity: builder.mutation({
      query: (formData) => ({ url: '/', method: 'POST', body: formData }),
      invalidatesTags: ['University'],
    }),
    getAllUniversities: builder.query({
      query: (params = {}) => ({ url: '/', params }),
      providesTags: ['University'],
    }),
    getUniversityById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'University', id }],
    }),
    updateUniversity: builder.mutation({
      query: ({ id, formData }) => ({ url: `/${id}`, method: 'PUT', body: formData }),
      invalidatesTags: ['University'],
    }),
    deleteUniversity: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: 'DELETE' }),
      invalidatesTags: ['University'],
    }),
  }),
});

export const {
  useCreateUniversityMutation,
  useGetAllUniversitiesQuery,
  useGetUniversityByIdQuery,
  useUpdateUniversityMutation,
  useDeleteUniversityMutation,
} = universityApi;
