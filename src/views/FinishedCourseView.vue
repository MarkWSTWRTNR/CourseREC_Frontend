<!-- FinishedCourseView.vue -->
<template>
  <div class="home">
    <section class="hero">
      <div class="hero-text container">

        <div class="right-side">
          <button class="btn btn-primary " @click="openForm">Add Finished Course</button>
        </div>
        <div v-if="showForm">
          <div class="overlay">
            <div class="popup">
              <div class="row">
                <div class="col-md-12">
                  <h3>{{ selectedFinishedCourse ? 'Edit FinishedCourse' : 'Add FinishedCourse' }}</h3>
                  <form @submit.prevent="addCourseToFinishedCourse">
                    <div class="form-group">
                      <label for="courseId">Course</label>
                      <v-select class="form-control left-align" v-model="selectedCourse" :options="records.map(record => ({
                        label: record.courseId + ' - ' + record.name,
                        value: record.courseId
                      }))" multiple :reduce="option => option.value" :placeholder="'Select a course'">
                      </v-select>
                    </div>

                    <div class="form-group">
                      <label for="year">Year:</label>
                      <input type="text" class="form-control" id="year" v-model="year" required>
                    </div>

                    <div class="form-group">
                      <label for="semester">Semester:</label>
                      <input type="text" class="form-control" id="semester" v-model="semester" required>
                    </div>

                    <div class="form-bottons">
                      <button v-if="selectedFinishedCourse" class="btn btn-success" @click="updateFinishedCourse">
                        Update
                      </button>
                      <button v-else class="btn btn-primary" type="submit">Add Course</button>
                      <button class="btn btn-secondary" @click="cancelForm">Cancel</button>
                    </div>

                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div v-if="finishedCourses && finishedCourses.length > 0" class="col-md-12"
            v-for="finishedCourse in finishedCourses" :key="finishedCourse.id">

            <p class="">Year: {{ finishedCourse.year }}</p>
            <p class="">Semester: {{ finishedCourse.semester }}</p>
            <div class="table-responsive">
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
                  <tr v-for="course in finishedCourse.courses" :key="`${finishedCourse.id}-${course.courseId}`">
                    <td>{{ course.courseId }}</td>
                    <td>{{ course.name }}</td>
                    <td>{{ course.credit }}</td>
                    <td>
                      {{ getGrade(finishedCourse.id, course.courseId) }}

                    </td>
                    <td class="e-d">
                      <select v-model="selectedGrade[`${finishedCourse.id}-${course.courseId}`]"
                        @change="setGradeForCourse(finishedCourse.id, course.courseId, selectedGrade[`${finishedCourse.id}-${course.courseId}`])">
                        <option value="">-- Select Grade --</option>
                        <option value="A">A</option>
                        <option value="B_PLUS">B+</option>
                        <option value="B">B</option>
                        <option value="C_PLUS">C+</option>
                        <option value="C">C</option>
                        <option value="D_PLUS">D+</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                        <option value="S">S</option>
                        <option value="U">U</option>
                        <!-- <option value="V">V</option>
                  <option value="W">W</option>
                  <option value="CE">CE</option>
                  <option value="CP">CP</option>
                  <option value="CS">CS</option>
                  <option value="CT">CT</option>
                  <option value="CX">CX</option>
                  <option value="I">I</option>
                  <option value="P">P</option> -->

                      </select>
                      <button class="btn btn-danger"
                        @click="removeCourseFromFinishedCourse(finishedCourse, course.courseId)">
                        Remove
                      </button>
                      <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class=""> GPA: {{ finishedCourse.groupGPA }}</p>
            <p class=""> Credit: {{ finishedCourse.groupEarnedCredit }}</p>
            <div class="e-d">
              <button class="btn btn-info " @click="editFinishedCourse(finishedCourse)">
                Edit Group
              </button>
              <button class="btn btn-danger" @click="removeGroupFinishedCourse(finishedCourse.id)">
                Delete Group
              </button>
            </div>
            <hr class="">
          </div>
          <div v-else class="col-md-12">
            <p>No finished courses available.</p>
          </div>
        </div>
        <p class="">GPAX : {{ gpax }}</p>
        <p class="">Accumulate credit: {{ credit }}</p>
        <div class="">
          <h3>Course Credit Tracking</h3>
          <ul>
            <li v-for="(credit, program) in courseCreditTracking" :key="program">
              {{ program }}: {{ credit }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import apiClient from '@/service/AxiosClient';
import vSelect from 'vue-select';
import { userRole, ROLES } from '@/service/roles';
export default {
  name: 'FinishedCourseView',
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
      gpax: 0,
      credit: 0,
      courseCreditTracking: {},
      userCourseGrades: [],
    };
  },
  components: {
    'v-select': vSelect,
  },
  mounted() {

    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      this.cmuitaccount_name = userInfo.cmuitaccount_name; // Store cmuitaccount_name as a data property
      this.fetchCompletedCourses(this.cmuitaccount_name); // Fetch completed courses using cmuitaccount_name as username
      this.fetchCourseCreditTracking();
      this.fetchData();

    } else {
      // Handle other cases or leave as is
    }
    this.calculateGPAAndCreditForEachGroup();
    this.calculateGPAXAndAccumulateCredit();
    this.fetchUserCourseGrades();
  },
  methods: {
    fetchCourseCreditTracking() {
      // Make an API request to fetch the course credit tracking data
      apiClient.get(`http://localhost:8080/users/${this.cmuitaccount_name}/course-credit-tracking`)
        .then(response => {
          this.courseCreditTracking = response.data;
          console.log("Course Credit Tracking Data:", this.courseCreditTracking);
        })
        .catch(error => {
          console.error("Error fetching course credit tracking data:", error);
        });
    },
    fetchData() {
      apiClient.get('http://localhost:8080/allCourse')
        .then(response => {
          this.records = response.data; console.log("course", this.records);
        })
        .catch(error => {
          console.log(error);
        });

    },
    fetchUserCourseGrades() {
      apiClient.get('http://localhost:8080/users/userCourseGrades')
        .then(response => {
          this.userCourseGrades = response.data;
        })
        .catch(error => {
          console.error("Error fetching user course grades:", error);
        });
    },
    fetchCompletedCourses(username) {
      apiClient.get(`http://localhost:8080/users/${username}/completedCourses`)
        .then(response => {
          this.finishedCourses = response.data;

          this.finishedCourses.forEach(finishedCourse => {
            finishedCourse.courses.forEach(course => {
              const uniqueKey = `${finishedCourse.id}-${course.courseId}`;

              // Find the grade for the specific course and finished group
              const gradeEntry = this.userCourseGrades.find(entry =>
                entry.finishedGroupCourse.id === finishedCourse.id &&
                entry.course.courseId === course.courseId
              );

              // Set the grade in the selectedGrade object
              this.selectedGrade[uniqueKey] = gradeEntry ? gradeEntry.grade : '';

            });
          });

          console.log(this.selectedGrade); // Print to console for debugging
          this.fetchUserCourseGrades();
          this.getGrade();
          this.fetchCourseCreditTracking();
          this.calculateGPAAndCreditForEachGroup();
          this.calculateGPAXAndAccumulateCredit();
          console.log("Finished Courses:", this.finishedCourses);
        }).catch(error => {
          if (error.response && error.response.status === 404) {
            this.showNoCoursesMessage = true;
          }
          console.log(error);
        });
    }
    ,
    getGrade(finishedCourseId, courseId) {
      const gradeEntry = this.userCourseGrades.find(entry =>
        entry.finishedGroupCourse.id === finishedCourseId &&
        entry.course.courseId === courseId
      );
      return gradeEntry ? gradeEntry.grade : 'N/A';
    },
    setGradeForCourse(finishedGroupCourseId, courseId, grade) {
      const uniqueKey = `${finishedGroupCourseId}-${courseId}`;
      console.log(`Setting grade for key ${uniqueKey} to ${grade}`);

      apiClient.post(`http://localhost:8080/users/${this.cmuitaccount_name}/finishedGroupCourses/${finishedGroupCourseId}/courses/${courseId}/setGrade`, {
        grade: grade
      })
        .then(response => {
          alert('Grade set successfully');
          this.fetchCompletedCourses(this.cmuitaccount_name);
          // Update the userCourseGrades array
          const gradeEntryIndex = this.userCourseGrades.findIndex(entry =>
            entry.finishedGroupCourse.id === finishedGroupCourseId &&
            entry.course.courseId === courseId
          );

          if (gradeEntryIndex !== -1) {
            this.userCourseGrades[gradeEntryIndex].grade = grade;
          } else {
            // If the grade entry doesn't exist, add a new one
            this.userCourseGrades.push({
              finishedGroupCourse: { id: finishedGroupCourseId },
              course: { courseId: courseId },
              grade: grade
            });
          }

          // Update the selectedGrade object
          this.selectedGrade[uniqueKey] = grade;

        })
        .catch(error => {
          alert('Error setting grade');
          console.error('Error setting grade:', error);
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
          alert('Add finished group course successfully');
          console.log('Finished course added:', response.data);
          this.fetchCompletedCourses(this.cmuitaccount_name);
          this.clearForm();
          this.showForm = false;
        })
        .catch(error => {
          alert('Error finished group course');
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
          alert('Updated finished group course successfully');
          console.log('Finished course updated:', response.data);
          this.fetchCompletedCourses(this.cmuitaccount_name);
          this.clearForm();
          this.showForm = false;
        })
        .catch(error => {
          alert('Error Updated finished group course');
          console.error('Error updating finished course:', error);
        })
        .finally(() => {
          this.isSubmitting = false; // Reset the submission flag
          this.showForm = false;
        });
    },
    removeCourseFromFinishedCourse(finishedCourse, courseId) {
      apiClient
        .delete(`http://localhost:8080/users/${this.cmuitaccount_name}/finishedGroupCourses/${finishedCourse.id}/courses/${courseId}/removeCourse`)
        .then(response => {
          alert('Course and its grade removed from finished group course');
          console.log('Course and its grade removed:', response.data);
          this.fetchCompletedCourses(this.cmuitaccount_name);
        })
        .catch(error => {
          alert('Error removing course or its grade from finished group course');
          console.error('Error:', error);
        });
    },
    removeGroupFinishedCourse(groupId) {
      const confirmDelete = confirm("Are you sure you want to delete this finished group course?");
      if (!confirmDelete) {
        return;
      }
      // Send a DELETE request to the server to delete the group of finished courses
      apiClient
        .delete(`http://localhost:8080/users/${this.cmuitaccount_name}/completedCourses/${groupId}`)
        .then(response => {
          alert('Group of finished courses deleted');
          console.log('url', groupId)
          console.log('Group of finished courses deleted:', response.data);
          // After successful deletion, fetch the updated list of finished courses
          this.fetchCompletedCourses(this.cmuitaccount_name);
          this.calculateGPAXAndAccumulateCredit()
          window.location.reload();
        })
        .catch(error => {
          console.error('Error deleting group of finished courses:', error);
        });
    },
    calculateGPAAndCreditForEachGroup() {
      apiClient.get(`http://localhost:8080/calculateAllGroupGPAAndCredit`)
        .then(response => {
          const groupGPAAndCreditMap = response.data;
          console.log("Group GPA and credit data:", groupGPAAndCreditMap);
          this.groupGPAAndCreditMap = groupGPAAndCreditMap;

          // Call a method to update the GPA and credit values for each finished course
          this.updateGPAAndCreditForFinishedCourses();
        })
        .catch(error => {
          console.error("Error calculating GPA and credit:", error);
        });
    },
    updateGPAAndCreditForFinishedCourses() {
      this.finishedCourses.forEach(finishedCourse => {
        const groupResults = this.groupGPAAndCreditMap[finishedCourse.id];
        if (groupResults) {
          finishedCourse.groupGPA = groupResults.groupGPA || 'N/A';
          finishedCourse.groupEarnedCredit = groupResults.groupEarnedCredit || 'N/A';
        }
      });
    },
    calculateGPAXAndAccumulateCredit() {
      apiClient.get(`http://localhost:8080/users/${this.cmuitaccount_name}/calculateGPAAndCredit`).then(response => {
        const result = response.data;
        this.gpax = result.gpa;
        this.credit = result.earnedCredit;

        this.calculateGPAAndCreditForEachGroup()
      }).catch(error => {
        console.error("Error getting gpax and credit", error);
      })

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

<style scoped lang="scss">
.home {
  padding-top: 200px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  z-index: 1000;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.pagination-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination-buttons button:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.left-button {
  justify-content: flex-start;
}

.right-button {
  justify-content: flex-end;
}

.right-side {
  display: flex;
  justify-content: end;
}

.popup {
  /* ... (rest of the styles remain unchanged) */
  padding: 30px;
  width: 80%;
  max-width: 600px;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.center-side {
  display: flex;
  justify-content: center;
  margin-bottom: 1em;
}

.e-d {
  display: flex;
  justify-content: center;
  gap: 1em;
}

.d-e-d {
  display: flex;
  justify-content: center;
  gap: 1em;
}</style>
