import axiosClient from './axiosClient';
import type { User, ApproveUserResponse } from '../types/user.types';

export const requestAccess = async (): Promise<User> => {
  const response = await axiosClient.post('/users/request-access');
  return response.data;
};

export const getPendingUsers = async (): Promise<User[]> => {
  const response = await axiosClient.get('/admin/users?status=pending');
  return response.data;
};

export const getApprovedUsers = async (): Promise<User[]> => {
  const response = await axiosClient.get('/admin/users?status=approved');
  return response.data;
};

export const approveUser = async (id: string): Promise<ApproveUserResponse> => {
  const response = await axiosClient.post(`/admin/users/${id}/approve`);
  return response.data;
};

export const rejectUser = async (id: string): Promise<User> => {
  const response = await axiosClient.post(`/admin/users/${id}/reject`);
  return response.data;
};
