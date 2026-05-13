import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/documents`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Document'],
  endpoints: (builder) => ({
    // Student: fetch own documents (returns { documents, grouped })
    getMyDocuments: builder.query({
      query: () => '/my',
      providesTags: ['Document'],
    }),

    // Staff: fetch a student's documents
    getDocumentsByStudent: builder.query({
      query: (studentId) => `/student/${studentId}`,
      providesTags: (_result, _err, studentId) => [{ type: 'Document', id: studentId }],
    }),

    // Download URL
    getDownloadUrl: builder.query({
      query: (id) => `/${id}/download`,
    }),

    // Staff: verify
    verifyDocument: builder.mutation({
      query: (id) => ({ url: `/${id}/verify`, method: 'PATCH' }),
      invalidatesTags: ['Document'],
    }),

    // Staff: reject with reason
    rejectDocument: builder.mutation({
      query: ({ id, reason }) => ({ url: `/${id}/reject`, method: 'PATCH', body: { reason } }),
      invalidatesTags: ['Document'],
    }),

    // Soft delete
    deleteDocument: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Document'],
    }),
  }),
});

export const {
  useGetMyDocumentsQuery,
  useGetDocumentsByStudentQuery,
  useGetDownloadUrlQuery,
  useVerifyDocumentMutation,
  useRejectDocumentMutation,
  useDeleteDocumentMutation,
} = documentApi;
