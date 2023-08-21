import apiClient from '@/service/AxiosClient.js'

export default {
  getAccessToken(formData) {
    return apiClient.post('http://localhost:8080/callback', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  getStoredAccessToken() {
    return localStorage.getItem('access_token')
  },
  fetchUserInfo(accessToken) {
    return apiClient.get('http://localhost:8080/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },
  login() {
    return apiClient.get('http://localhost:8080/login')
  },
  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }
}
