<template>
  <div class="container">
    <button class="btn btn-outline-primary" @click="openForm">Add Finished Course</button>

    <button type="button" class="btn btn-dark" @click="calculateGPAAndCreditForUser(username)">Calculate GPA</button>
    <div v-if="showForm">
      <div class="overlay">
        <div class="popup">
          <div class="row">
            <div class="col-md-12">
              <form @submit.prevent="addCourseToFinishedCourse">
                <h3>{{ selectedFinishedCourse ? 'Edit FinishedCourse' : 'Add FinishedCourse' }}</h3>
                <label for="courseId">Course</label>
                <v-select class="form-control left-align" v-model="selectedCourse" :options="records.map(record => ({
                  label: record.courseId + ' - ' + record.name,
                  value: record.courseId
                }))" multiple :reduce="option => option.value" :placeholder="'Select a course'">
                </v-select>

                <label for="year">Year:</label>
                <input type="text" id="year" v-model="year" required>
                <label for="semester">Semester:</label>
                <input type="text" id="semester" v-model="semester" required>

                <button v-if="selectedFinishedCourse" class="btn btn-outline-success" @click="updateFinishedCourse">
                  Update
                </button>

                <button v-else class="btn btn-primary" type="submit">Add Course</button>
                <button @click="cancelForm">Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div v-if="finishedCourses && finishedCourses.length > 0" class="col-md-12"
        v-for="finishedCourse in finishedCourses" :key="finishedCourse.id">
        <button class="btn btn-outline-danger" @click="removeGroupFinishedCourse(finishedCourse.id)">
          Delete Group
        </button>
        <p>Year: {{ finishedCourse.year }}</p>
        <p>Semester: {{ finishedCourse.semester }}</p>

        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Course Credit</th>
              <th>Grade</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in finishedCourse.courses" :key="course.id">
              <td>{{ course.courseId }}</td>
              <td>{{ course.name }}</td>
              <td>{{ course.credit }}</td>
              <td>
                {{ course.userCourseGrades[0].grade }}
              </td>
              <td>
                <select v-model="selectedGrade[course.courseId]">
                  <option value="">-- Select Grade --</option>
                  <option value="A">A</option>
                  <option value="B_PLUS">B+</option>
                  <option value="B">B</option>
                  <option value="C_PLUS">C+</option>
                  <option value="C">C</option>
                  <option value="D_PLUS">D+</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
                <button class="btn btn-outline-danger"
                  @click="removeCourseFromFinishedCourse(finishedCourse, course.courseId)">
                  Remove
                </button>
                <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
              </td>
            </tr>
            <tr>
              <td colspan="4"></td>
              <td>
                <button type="button" class="btn btn-dark" @click="setGradeForCourses(finishedCourse.courses)">Set
                  Grades</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-outline-info" @click="editFinishedCourse(finishedCourse)">
          Edit
        </button>

        <hr>
      </div>
      <div v-else class="col-md-12">
        <p>No finished courses available.</p>
      </div>
    </div>

  </div>
</template>

<script>
import apiClient from '@/service/AxiosClient';
import vSelect from 'vue-select';
import { userRole, ROLES } from '@/service/roles';
export default {
  data() {
    return {
      userRole: userRole,
      ROLES: ROLES,
      showForm: false,
      records: [],
      finishedCourses: [],
      selectedCourse: [],
      selectedFinishedCourse: null,
      year: '',
      semester: '',
      isSubmitting: false,
      cmuitaccount_name: '',
      selectedGrade: {},
    };
  },
  components: {
    'v-select': vSelect,
  },
  mounted() {
    this.fetchData();
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      this.cmuitaccount_name = userInfo.cmuitaccount_name; // Store cmuitaccount_name as a data property
      this.fetchCompletedCourses(this.cmuitaccount_name); // Fetch completed courses using cmuitaccount_name as username
    } else {
      // Handle other cases or leave as is
    }

  },
  methods: {
    fetchData() {
      apiClient.get('http://localhost:8080/allCourse')
        .then(response => {
          this.records = response.data; console.log("course", this.records);
        })
        .catch(error => {
          console.log(error);
        });

    },
    fetchCompletedCourses(username) {
      apiClient.get(`http://localhost:8080/users/${username}/completedCourses`)
        .then(response => {
          this.finishedCourses = response.data;
          console.log("Finished Courses:", this.finishedCourses);
        }).catch(error => {
          if (error.response && error.response.status === 404) {
            this.showNoCoursesMessage = true;
          }
          console.log(error);
        });
    },
    addCourseToFinishedCourse() {
      if (this.isSubmitting) return; // Prevent multiple submissions
      this.isSubmitting = true;
      const coursesToAdd = this.selectedCourse.map(courseId => ({ courseId }));
      const courseToAdd = {
        courses: coursesToAdd,
        year: this.year,
        semester: this.semester,
      };
      apiClient
        .post(`http://localhost:8080/users/${this.cmuitaccount_name}/completedCourses`, courseToAdd)
        .then(response => {
          console.log('Finished course added:', response.data);
          this.fetchCompletedCourses(this.cmuitaccount_name);
          this.clearForm();
          this.showForm = false;
        })
        .catch(error => {
          console.error('Error adding finished course:', error);
        }).finally(() => {
          this.isSubmitting = false; // Reset the submission flag
          this.showForm = false;
        });
    },
    editFinishedCourse(finishedCourse) {
      console.log("Editing finished course:", finishedCourse);
      if (finishedCourse && finishedCourse.year && finishedCourse.semester) {
        // Create a shallow copy of the finishedCourse object
        this.selectedFinishedCourse = { ...finishedCourse };
        this.selectedCourse = this.selectedFinishedCourse.courses.map(course => course.courseId);
        this.year = this.selectedFinishedCourse.year;
        this.semester = this.selectedFinishedCourse.semester;
        this.showForm = true;
        console.log("Selected finished course:", this.selectedFinishedCourse);
      } else {
        console.error('Invalid finished course data:', finishedCourse);
      }
    }
    ,
    updateFinishedCourse() {
      if (!this.selectedFinishedCourse || this.isSubmitting) return; // Prevent multiple submissions
      if (!this.year || !this.semester) {
        alert('Year and semester are required.');
        return; // Prevent submission
      }
      this.isSubmitting = true;
      const coursesToAdd = this.selectedCourse.map(courseId => ({ courseId }));
      const updatedFinishedCourse = {
        id: this.selectedFinishedCourse.id,
        courses: coursesToAdd,
        year: this.year,
        semester: this.semester,
      };

      apiClient
        .put(`http://localhost:8080/users/${this.cmuitaccount_name}/completedCourses/${this.selectedFinishedCourse.id}`, updatedFinishedCourse)
        .then(response => {
          console.log('Finished course updated:', response.data);
          this.fetchCompletedCourses(this.cmuitaccount_name);
          this.clearForm();
          this.showForm = false;
        })
        .catch(error => {
          console.error('Error updating finished course:', error);
        })
        .finally(() => {
          this.isSubmitting = false; // Reset the submission flag
          this.showForm = false;
        });
    },
    removeCourseFromFinishedCourse(finishedCourse, courseId) {
      const courseIndex = finishedCourse.courses.findIndex(course => course.courseId === courseId);
      if (courseIndex !== -1) {
        finishedCourse.courses.splice(courseIndex, 1);
        apiClient
          .put(`http://localhost:8080/users/${this.cmuitaccount_name}/completedCourses/${finishedCourse.id}`, finishedCourse)
          .then(response => {
            console.log('Course removed from finished course:', response.data);
            this.fetchCompletedCourses(this.cmuitaccount_name);
          })
          .catch(error => {
            console.error('Error removing course from finished course:', error);
          });
      }
    },
    removeGroupFinishedCourse(groupId) {
      // Send a DELETE request to the server to delete the group of finished courses
      apiClient
        .delete(`http://localhost:8080/users/${this.cmuitaccount_name}/completedCourses/${groupId}`)
        .then(response => {
          console.log('url', groupId)
          console.log('Group of finished courses deleted:', response.data);
          // After successful deletion, fetch the updated list of finished courses
          this.fetchCompletedCourses(this.cmuitaccount_name);
        })
        .catch(error => {
          console.error('Error deleting group of finished courses:', error);
        });
    },
    setGradeForCourses(courses) {
      courses.forEach(course => {
        const courseId = course.courseId;
        const grade = this.selectedGrade[courseId];
        const gradeRequestBody = { grade }; // Create the request body with the selected grade

        apiClient.post(`http://localhost:8080/users/${this.cmuitaccount_name}/courses/${courseId}/setGrade`, gradeRequestBody)
          .then(response => {
            console.log("Grade set successfully:", response.data);
            // You can perform any necessary actions after setting the grade
          })
          .catch(error => {
            console.error("Error setting grade:", error);
          });
      });
    },
    calculateGPAAndCreditForUser() {
      apiClient.get(`http://localhost:8080/users/${this.cmuitaccount_name}/calculateGPAAndCredit`)
        .then(response => {
          const result = response.data;
          console.log("GPA and credit data:", result);
          // You can update your component state with the GPA and credit data
        })
        .catch(error => {
          console.error("Error calculating GPA and credit:", error);
        });
    },

    openForm() {
      this.showForm = true;

    },
    cancelForm() {
      this.showForm = false;
      this.clearForm();
    },

    clearForm() {
      this.year = '';
      this.semester = '';
      this.selectedCourse = [];
      this.selectedFinishedCourse = null;

    },
  }
};
</script>

<style scoped>
.popup {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 10px;
}
</style>
