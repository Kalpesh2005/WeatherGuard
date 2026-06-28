import axiosClient from './axiosClient';
import type { User } from '../types/user.types';

export const getGoogleLoginUrl = (): string => {
  return `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
};

export const fetchMe = async (): Promise<User> => {
  const response = await axiosClient.get('/users/me');
  return response.data;
};
