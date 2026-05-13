import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/courses`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Course'],
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (body) => ({ url: '/', method: 'POST', body }),
      invalidatesTags: ['Course'],
    }),
    getAllCourses: builder.query({
      query: (params = {}) => ({ url: '/', params }),
      providesTags: ['Course'],
    }),
    getCoursesByUniversity: builder.query({
      query: (universityId) => `/university/${universityId}`,
      providesTags: ['Course'],
    }),
    getCourseById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Course', id }],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Course'],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Course'],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetCoursesByUniversityQuery,
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
