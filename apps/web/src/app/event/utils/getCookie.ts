import { getCookie } from '../../../actions/cookies'; // Adjust the import path as needed

export const getRoleFromCookie = async () => {
  try {
    const role = await getCookie('role');
    return role;
  } catch (error) {
    console.error('Failed to get role from cookie:', error);
    return null;
  }
};