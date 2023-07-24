<template>
  <div>
    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm">Add Finished Course</button>
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
      <div class="col-md-12" v-for="finishedCourse in finishedCourses" :key="finishedCourse.id">
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
            <tr v-for="course in finishedCourse.courses" :key="course.courseId">
              <!-- Use "course.courseId" as the key -->
              <td>{{ course.courseId }}</td>
              <td>{{ course.name }}</td>
              <td>{{ course.credit }}</td>
              <td>{{ course.grade }}</td>
              <td>
                <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info" @click="editFinishedCourse(finishedCourse)">
          Edit
        </button>
        <hr>
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
      selectedCourse: null,
      selectedFinishedCourse: null,
      year: '',
      semester: '',

    };
  },
  components: {
    'v-select': vSelect,
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      apiClient.get('http://localhost:8080/courses')
        .then(response => {
          this.records = response.data;
        })
        .catch(error => {
          console.log(error);
        });
      apiClient.get('http://localhost:8080/getStudentFinishedCourse')
        .then(response => {
          this.finishedCourses = response.data;
        }).catch(error => {
          console.log(error);
        });
    },
    addCourseToFinishedCourse() {
      if (this.isSubmitting) return; // Prevent multiple submissions
      this.isSubmitting = true;
      const courseToAdd = {
        courses: this.selectedCourse,
        year: this.year,
        semester: this.semester,
      };
      apiClient
        .post('http://localhost:8080/saveStudentFinishedCourse', courseToAdd)
        .then(response => {
          console.log('Finished course added:', response.data);
          this.fetchData();
          this.clearForm();
          this.showForm = false;
        })
        .catch(error => {
          console.error('Error adding finished course:', error);
        });
    }, 
    editFinishedCourse(finishedCourse) {
      console.log("Editing finished course:", finishedCourse);
      if (finishedCourse && finishedCourse.year && finishedCourse.semester) {
        this.selectedFinishedCourse = finishedCourse;
        this.showForm = true;
        console.log("Selected finished course:", this.selectedFinishedCourse);
      } else {
        console.error('Invalid finished course data:', finishedCourse);
      }
    },
    openForm() {
      this.showForm = true;

    },
    cancelForm() {
      this.showForm = false;
      this.resetSection();
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
