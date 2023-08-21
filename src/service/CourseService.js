import apiClient from '@/service/AxiosClient.js'

export default {
  getCourses(perPage, page) {
    return apiClient.get('http://localhost:8080/courses?_limit=' + perPage + '&_page=' + page)
  },

}
