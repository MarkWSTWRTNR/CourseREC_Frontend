import apiClient from "@/service/AxiosClient";

const CourseService = {
  getCourses(perPage, page) {
    return apiClient.get(`http://localhost:8080/courses?_limit=${perPage}&_page=${page}`);
  },
  getAllCourse(){
    return apiClient.get('http://localhost:8080/allCourse')
  },
  addCourse(course) {
    return apiClient.post('http://localhost:8080/addCourse', course);
  },

  deleteCourse(id) {
    return apiClient.delete(`http://localhost:8080/deleteCourse/${id}`);
  },

  updateCourse(updatedCourse) {
    return apiClient.put(`http://localhost:8080/updateCourse`, updatedCourse);
  }
}

export default CourseService;
