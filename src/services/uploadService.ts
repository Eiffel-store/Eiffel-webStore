import { apiClient } from './apiClient';
import { ApiResponse } from '../types';

export interface FileUploadResult {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export const uploadService = {
  uploadImage: async (file: File): Promise<FileUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<FileUploadResult>>('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  uploadMultipleImages: async (files: File[]): Promise<FileUploadResult[]> => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    const response = await apiClient.post<ApiResponse<FileUploadResult[]>>('/uploads/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
