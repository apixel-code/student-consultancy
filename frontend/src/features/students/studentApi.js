import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const studentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/students`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Student'],
  endpoints: (builder) => ({
    getAllStudents: builder.query({
      query: (params = {}) => ({ url: '/', params }),
      providesTags: ['Student'],
    }),
    getStudentById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Student', id }],
    }),
    getMyProfile: builder.query({
      query: () => '/me/profile',
    }),
    getMyCounselor: builder.query({
      query: () => '/me/counselor',
    }),
  }),
});

export const {
  useGetAllStudentsQuery,
  useGetStudentByIdQuery,
  useGetMyProfileQuery,
  useGetMyCounselorQuery,
} = studentApi;
