import { ref } from 'vue';

export const userRole = ref(localStorage.getItem('userRole') || '');
export const ROLES = {
  ROLE_ADMIN: 'ROLE_ADMIN',
  ROLE_STUDENT: 'ROLE_STUDENT',
};
