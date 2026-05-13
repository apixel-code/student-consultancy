import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const successStoryApi = createApi({
  reducerPath: 'successStoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/success-stories`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['SuccessStory'],
  endpoints: (builder) => ({
    getAllSuccessStories: builder.query({
      query: () => '/',
      providesTags: ['SuccessStory'],
    }),
    createSuccessStory: builder.mutation({
      query: (body) => ({ url: '/', method: 'POST', body }),
      invalidatesTags: ['SuccessStory'],
    }),
    updateSuccessStory: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/${id}`, method: 'PUT', body }),
      invalidatesTags: ['SuccessStory'],
    }),
    deleteSuccessStory: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: 'DELETE' }),
      invalidatesTags: ['SuccessStory'],
    }),
  }),
});

export const {
  useGetAllSuccessStoriesQuery,
  useCreateSuccessStoryMutation,
  useUpdateSuccessStoryMutation,
  useDeleteSuccessStoryMutation,
} = successStoryApi;
