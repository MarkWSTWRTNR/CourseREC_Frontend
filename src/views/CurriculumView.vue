<template>
  <div class="home">
    <section class="hero">
      <div class=" hero-text container">
        <div v-if="userRole === ROLES.ROLE_ADMIN" class="c-f-p">
          <router-link to="/faculty"><button class="custom-btn btn-5_2"> Create Faculty</button></router-link>
          <router-link to="/courseprogram"><button class="custom-btn btn-5_2"> Create Program</button></router-link>
        </div>

        <h3 class="">Select Faculty:</h3>
        <select v-model="selectedFaculty" class="form-control">
          <option value="">-- Select Faculty --</option>
          <option v-for="faculty in faculties" :value="faculty.name" :key="faculty.facultyId">
            {{ faculty.name }}
          </option>
        </select>

        <h3 v-if="selectedFaculty" class="">Select Program:</h3>
        <select v-if="selectedFaculty" v-model="selectedProgram" class="form-control">
          <option value="">-- Select Program --</option>
          <option v-for="program in filteredPrograms" :value="program.programId" :key="program.programId">
            {{ program.name }}
          </option>
        </select>
        <hr>

        <div v-if="selectedProgram">
          <div>
            <div @click="toggleAccordion(1)" :class="{ 'accordion': true, 'active': isActive(1) }">
              <h3>Curriculum<i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(1) }"></i></h3>
            </div>



            <div v-show="isActive(1, index)" class="container">
              <div class="right-side">
                <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-primary" @click="openForm">Add Courses To
                  Curriculum</button>
              </div>
              <div v-if="showForm">
                <div class="overlay">
                  <div class="popup">
                    <div class="row">
                      <div class="col-md-12">
                        <h3>{{ selectedGroupCourse ? 'Edit GroupCourse' : 'Add GroupCourse' }}</h3>
                        <form @submit.prevent="addCourseToGroupCourse">
                          <div class="form-group">
                            <label for="courseId">Course</label>
                            <v-select @input="required" class="form-control left-align" v-model="selectedCourse" :options="records.map(record => ({
                              label: record.courseId + ' - ' + record.name,
                              value: record.courseId
                            }))" multiple :reduce="option => option.value" :placeholder="'Select a course'">
                            </v-select>
                          </div>
                          <br>
                          <div class="form-group">
                            <label for="groupName">Group Name:</label>
                            <select class="form-control" v-model="groupName" id="groupName" required>
                              <option value="">-- Select Group Course --</option>
                              <option>General Education | Required courses | Learner Person</option>
                              <option>General Education | Required courses | Innovative Co-creator</option>
                              <option>General Education | Required courses | Active Citizen</option>
                              <option>General Education | Elective courses | Learner Person</option>
                              <option>General Education | Elective courses | Active Citizen</option>
                              <option>Field of Specialization| Core Courses</option>
                              <option>Field of Specialization | Major Courses | Required Courses</option>
                              <option>Field of Specialization | Major Courses | Free Elective</option>
                              <option>Free Electives</option>
                            </select><br>
                          </div>
                          <!-- Add the text and credit fields -->
                          <div class="form-group">
                            <label for="text">Description:</label>
                            <input class="form-control" v-model="text" type="text" id="text">
                          </div>
                          <br>
                          <div class="form-group">
                            <label for="credit">Credit:</label>
                            <input class="form-control" v-model="credit" type="number" id="credit" required>
                          </div>
                          <div class="form-buttons">
                            <button v-if="selectedGroupCourse" class="btn btn-success" @click="updateGroupCourse">
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
                <div class="col-md-12" v-for="(groupCourse, groupCourseIndex) in filteredGroupCourses"
                  :key="groupCourseIndex">

                  <h4 class="">{{ groupCourse.groupName }}</h4>
                  <h6 class="">Mininum credit required:{{ groupCourse.credit }}</h6>
                  <div class="table-responsive">
                    <table class="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Course ID</th>
                          <th>Course Name</th>
                          <th>Course Credit</th>
                          <th>Course Prerequisite</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(course, courseIndex) in groupCourse.courses" :key="courseIndex">
                          <td>{{ course.courseId }}</td>
                          <td>{{ course.name }}</td>
                          <td>{{ course.credit }}</td>
                          <td>{{ getPrerequisiteInfo(course.prerequisite) }}</td>
                          <td>
                            <div class="e-d">
                              <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-danger"
                                @click="removeCourseFromGroupCourse(groupCourse, course.courseId)">
                                Remove
                              </button>
                              <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
                            </div>
                          </td>

                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <h5 class="">Description: {{ groupCourse.text }}</h5>
                  <div class="e-d">
                    <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-info"
                      @click="editGroupCourse(groupCourse)">
                      Edit
                    </button>
                    <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-danger"
                      @click="removeGroupCourse(groupCourse.id)">
                      Delete Group
                    </button>
                  </div>
                  <hr class="">
                </div>
              </div>
            </div>
          </div>
          <div>
            <div @click="toggleAccordion(3)" :class="{ 'accordion': true, 'active': isActive(3) }">
              <h3>Standard Study Plan<i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(3) }"></i></h3>
            </div>
            <div v-show="isActive(3)" class="container">
              <div class="right-side">
                <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-primary" @click="openForm2">Add Courses To
                  StudyPlan</button>
              </div>
              <div v-if="showForm2">
                <div class="overlay">
                  <div class="popup">
                    <div class="row">
                      <div class="col-md-12">
                        <form @submit.prevent="addCourseToStudyPlan">
                          <h3>{{ selectedStudyPlan ? 'Edit StudyPlan' : 'Add StudyPlan' }}</h3>
                          <label for="courseId">Course</label>
                          <v-select @input="required" class="form-control left-align" v-model="selectedCourse" :options="records.map(record => ({
                            label: record.courseId + ' - ' + record.name,
                            value: record.courseId
                          }))" multiple :reduce="option => option.value" :placeholder="'Select a course'">
                          </v-select>

                          <label for="yearAndSemester">Group Name:</label>
                          <select v-model="yearAndSemester" id="yearAndSemester" required>
                            <option value="">-- Select Year and Semester --</option>
                            <option>Year 1 Semester 1</option>
                            <option>Year 1 Semester 2</option>
                            <option>Year 2 Semester 1</option>
                            <option>Year 2 Semester 2</option>
                            <option>Year 3 Semester 1</option>
                            <option>Year 3 Semester 2</option>
                            <option>Year 4 Semester 1</option>
                            <option>Year 4 Semester 2</option>
                            <option>Year 5 Semester 1</option>
                            <option>Year 5 Semester 2</option>
                          </select>
                          <!-- Add the text and credit fields -->
                          <label for="text">Text:</label>
                          <input v-model="text" type="text" id="text">

                          <label for="credit">Credit:</label>
                          <input v-model="credit" type="number" id="credit" required>

                          <button v-if="selectedStudyPlan" class="btn btn-success" @click="updateStudyPlan">
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
                <div class="col-md-12" v-for="(studyPlan, studyPlanIndex) in filteredStudyPlan" :key="studyPlanIndex">

                  <h4 class="">{{ studyPlan.yearAndSemester }}</h4>
                  <h6 class="">credit: {{ studyPlan.credit }}</h6>
                  <div class="table-responsive">
                    <table class="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Course ID</th>
                          <th>Course Name</th>
                          <th>Course Credit</th>
                          <th>Course Prerequisite</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(course, courseIndex) in studyPlan.courses" :key="courseIndex">
                          <td>{{ course.courseId }}</td>
                          <td>{{ course.name }}</td>
                          <td>{{ course.credit }}</td>
                          <td>{{ getPrerequisiteInfo(course.prerequisite) }}</td>
                          <td>
                            <div class="e-d">
                              <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-danger"
                                @click="removeCourseFromStudyPlan(studyPlan, course.courseId)">
                                Remove
                              </button>
                              <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
                            </div>
                          </td>

                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <h5 class="">Description: {{ studyPlan.text }}</h5>
                  <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-info" @click="editStudyPlan(studyPlan)">
                    Edit
                  </button>
                  <div class="e-d">
                    <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-danger"
                      @click="removeStudyPlan(studyPlan.id)">
                      Delete Group
                    </button>
                  </div>
                  <hr class="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import apiClient from '@/service/AxiosClient';
import { userRole, ROLES } from '@/service/roles';
import vSelect from 'vue-select';
export default {
  components: {
    'v-select': vSelect,
  },
  name: 'Curriculum',
  data() {
    return {
      userRole: userRole,
      ROLES: ROLES,
      selectedFaculty: '',
      selectedProgram: '',
      selectedCourse: [],
      faculties: [],
      programs: [],
      records: [],
      groupCourse: [],
      groupName: '',
      yearAndSemester: '',
      text: '',
      credit: 0,
      activeAccordionIndices: [], // Initially set the first accordion as active
      showForm: false,
      showForm2: false,
      isSubmitting: false,
      selectedGroupCourse: null,
      selectedStudyPlan: null,
      index: 0,
      studyPlan: [],
      isCourseSelected: false
    }
  },
  computed: {
    filteredPrograms() {
      if (this.selectedFaculty) {
        const filteredPrograms = this.programs.filter(program => program.faculty && program.faculty.name === this.selectedFaculty);
        console.log("Filtered programs:", filteredPrograms);
        console.log("sf", this.selectedFaculty);
        return filteredPrograms;
      }
      return [];
    },
    filteredGroupCourses() {
      if (this.selectedProgram) {
        // Filter the groupCourse based on the selected programId
        return this.groupCourse.filter(groupCourse => groupCourse.programs && groupCourse.programs.programId === this.selectedProgram);
      }
      return [];
    },
    filteredStudyPlan() {
      if (this.selectedProgram) {
        return this.studyPlan.filter(studyPlan => studyPlan.programs && studyPlan.programs.programId === this.selectedProgram);
      }
      return [];
    }
  },
  methods: {
    fetchData() {
      apiClient
        .get('http://localhost:8080/facultys')
        .then(response => {
          this.faculties = response.data; console.log('f', this.faculties)
        })

        .catch(error => {
          console.log('Error fetching faculties:', error);
        });

      apiClient
        .get('http://localhost:8080/programs')
        .then(response => {
          this.programs = response.data; console.log('p', this.programs)
        })
        .catch(error => {
          console.log('Error fetching programs:', error);
        });
      apiClient
        .get('http://localhost:8080/allCourse')
        .then(response => {
          this.records = response.data; console.log
        })
        .catch(error => {
          console.log('Error fetching courses:', error)
        })
      apiClient
        .get('http://localhost:8080/groupCourses')
        .then(response => {
          this.groupCourse = response.data; console.log('gc', this.groupCourse);
        })
      apiClient
        .get('http://localhost:8080/standardStudyPlans')
        .then(response => {
          this.studyPlan = response.data; console.log('stdp', this.studyPlan);
        })
    },
    validateCourseSelection() {
      // Check if at least one course is selected
      this.isCourseSelected = this.selectedCourse.length > 0;
    },
    addCourseToGroupCourse() {
      if (this.isSubmitting) return; // Prevent multiple submissions
      this.isSubmitting = true;
      this.validateCourseSelection();
      if (this.isCourseSelected) {
        const coursesToAdd = this.selectedCourse.map(course => ({
          courseId: course
        }));
        const courseToAdd = {
          courses: coursesToAdd,
          groupName: this.groupName,
          programs: {
            programId: this.selectedProgram
          },
          text: this.text,
          credit: this.credit
        };
        apiClient
          .post('http://localhost:8080/addGroupCourse', courseToAdd)
          .then(response => {
            alert('Add Course successfully');
            console.log('Course group created:', response.data);
            this.fetchData();
            this.clearForm();
            this.showForm = false;
          })
          .catch(error => {
            alert('Error to add Course');
            console.error('Error creating course group:', error);
          }).finally(() => {
            this.isSubmitting = false;
          });
      } else {
        this.isSubmitting = false;
        alert('Please fill out this field.');
      }
    },
    removeCourseFromGroupCourse(groupCourse, course) {
      const courseId = course.courseId;
      const confirmDelete = confirm("Are you sure you want to delete this course?");
      if (!confirmDelete) {
        return;
      }
      apiClient
        .put(`http://localhost:8080/removeCourseFromGroupCourse?courseId=${courseId}`, groupCourse)
        .then(response => {
          alert('Removed course successfully');
          console.log('Course removed from group course:', response.data);
          this.fetchData();
        })
        .catch(error => {
          console.error('Error removing course from group course:', error);
        });
    },
    editGroupCourse(groupCourse) {
      console.log("Editing group course:", groupCourse);
      if (groupCourse && groupCourse.id) {
        this.selectedGroupCourse = { ...groupCourse };
        this.showForm = true;
        this.selectedCourse = groupCourse.courses.map(course => course.courseId) || [];
        this.groupName = groupCourse.groupName || '';
        this.text = groupCourse.text || '';
        this.credit = groupCourse.credit || 0;
        console.log("Selected group course:", this.selectedGroupCourse);
      } else {
        console.error('Invalid group course data:', groupCourse);
      }
    },
    updateGroupCourse() {
      if (!this.selectedGroupCourse || this.isSubmitting) return; // Prevent multiple submissions
      this.isSubmitting = true;
      const coursesToAdd = Array.isArray(this.selectedCourse) ? this.selectedCourse.map(course => ({ courseId: course })) : [{ courseId: this.selectedCourse }];
      const updatedGroup = {
        id: this.selectedGroupCourse.id,
        text: this.text,
        groupName: this.groupName,
        credit: this.credit,
        courses: coursesToAdd,
        programs: { programId: this.selectedProgram }
      }
      console.log('Current id: ', this.selectedGroupCourse.id);
      console.log("Updating group course. Selected course:", this.selectedGroupCourse);
      apiClient
        .put('http://localhost:8080/updateGroupCourse', updatedGroup)
        .then(response => {
          alert('Update Course successfully');
          this.fetchData();
          console.log('Group Course updated:', response.data);
          this.selectedGroupCourse = null;
          this.showForm = false;
          this.fetchData();
          this.clearForm();
        })
        .catch(error => {
          alert('Error update Group Course');
          console.error('Error updating group course:', error);
        }).finally(() => {
          this.isSubmitting = false;
        });
    },
    removeGroupCourse(groupId) {
      const confirmDelete = confirm("Are you sure you want to delete this group course?");
      if (!confirmDelete) {
        return;
      }
      apiClient
        .delete(`http://localhost:8080/deleteGroupCourse/${groupId}`)
        .then(response => {
          alert('Removed Group Course');
          console.log('Group Course deleted:', response.data);

          this.fetchData();
        })
        .catch(error => {
          alert('Error to remove Group Course');
          console.error('Error deleting group course:', error);
        });
    },

    addCourseToStudyPlan() {
      if (this.isSubmitting) return; // Prevent multiple submissions
      this.isSubmitting = true;
      this.validateCourseSelection();
      if (this.isCourseSelected) {
        const coursesToAdd = this.selectedCourse.map(course => ({
          courseId: course
        }));
        const courseToAdd = {
          courses: coursesToAdd,
          yearAndSemester: this.yearAndSemester,
          programs: {
            programId: this.selectedProgram
          },
          text: this.text,
          credit: this.credit
        };
        apiClient
          .post('http://localhost:8080/addStandardStudyPlan', courseToAdd)
          .then(response => {
            alert('Add course successfully');
            console.log('Course group created:', response.data);
            this.fetchData();
            this.clearForm();
            this.showForm2 = false;
          })
          .catch(error => {
            alert('Error to Add course');
            console.error('Error creating course group:', error);
          }).finally(() => {
            this.isSubmitting = false;
          });
      } else {
        this.isSubmitting = false;
        alert('Please fill out this field');
      }
    },
    removeCourseFromStudyPlan(studyPlan, course) {
      const courseId = course.courseId;
      const confirmDelete = confirm("Are you sure you want to delete this course?");
      if (!confirmDelete) {
        return;
      }
      apiClient
        .put(`http://localhost:8080/removeCourseFromStandardStudyPlan?courseId=${courseId}`, studyPlan)
        .then(response => {
          console.log('Course removed from group course:', response.data);
          this.fetchData();
        })
        .catch(error => {
          console.error('Error removing course from group course:', error);
        });
    },
    editStudyPlan(studyPlan) {
      console.log("Editing group course:", studyPlan);
      if (studyPlan && studyPlan.id) {
        this.selectedStudyPlan = { ...studyPlan };
        this.showForm2 = true;
        this.selectedCourse = studyPlan.courses.map(course => course.courseId) || [];
        this.yearAndSemester = studyPlan.yearAndSemester || '';
        this.text = studyPlan.text || '';
        this.credit = studyPlan.credit || 0;
        console.log("Selected group course:", this.selectedStudyPlan);
      } else {
        console.error('Invalid group course data:', studyPlan);
      }
    },
    updateStudyPlan() {
      if (!this.selectedStudyPlan || this.isSubmitting) return; // Prevent multiple submissions
      this.isSubmitting = true;
      const coursesToAdd = Array.isArray(this.selectedCourse) ? this.selectedCourse.map(course => ({ courseId: course })) : [{ courseId: this.selectedCourse }];
      const updatedGroup = {
        id: this.selectedStudyPlan.id,
        text: this.text,
        yearAndSemester: this.yearAndSemester,
        credit: this.credit,
        courses: coursesToAdd,
        programs: { programId: this.selectedProgram }
      }
      console.log('Current id: ', this.selectedStudyPlan.id);
      console.log("Updating group course. Selected course:", this.selectedStudyPlan);
      apiClient
        .put('http://localhost:8080/updateStandardStudyPlan', updatedGroup)
        .then(response => {
          alert('Update course successfully');
          this.fetchData();
          console.log('Group Course updated:', response.data);
          this.selectedStudyPlan = null;
          this.showForm2 = false;
          this.fetchData();
          this.clearForm();
        })
        .catch(error => {
          alert('Error to update course');
          console.error('Error updating group course:', error);
        }).finally(() => {
          this.isSubmitting = false;
        });
    },
    removeStudyPlan(studyPlan) {
      const confirmDelete = confirm("Are you sure you want to delete this group?");
      if (!confirmDelete) {
        return;
      }
      apiClient
        .delete(`http://localhost:8080/deleteStandardStudyPlan/${studyPlan}`)
        .then(response => {
          alert('Removed course successfully');
          console.log('Group Course deleted:', response.data);

          this.fetchData();
        })
        .catch(error => {
          alert('Error Removed course');
          console.error('Error deleting group course:', error);
        });
    },


    toggleAccordion(accordionLevel, index = null) {
      if (accordionLevel === 1) {
        if (this.activeAccordionIndices.includes(1)) {
          this.activeAccordionIndices = [];
        } else {
          this.activeAccordionIndices = [1];
        }
      } else if (accordionLevel === 2 && index !== null) {
        if (this.activeAccordionIndices.includes(index + 2)) {
          this.activeAccordionIndices = this.activeAccordionIndices.filter(i => i !== index + 2);
        } else {
          this.activeAccordionIndices.push(index + 2);
        }
      } else if (accordionLevel === 3) {
        if (this.activeAccordionIndices.includes(3)) {
          this.activeAccordionIndices = this.activeAccordionIndices.filter(i => i !== 3);
        } else {
          this.activeAccordionIndices.push(3);
        }
      }
    },
    isActive(accordionLevel, index = null) {
      if (accordionLevel === 1) {
        return this.activeAccordionIndices.includes(1);
      } else if (accordionLevel === 2 && index !== null) {
        return this.activeAccordionIndices.includes(index + 2);
      }
      else if (accordionLevel === 3) {
        return this.activeAccordionIndices.includes(3);
      }

      return false;
    },
    getPrerequisiteInfo(prerequisites) {
      if (!prerequisites || prerequisites.length === 0) {
        return;
      }
      return prerequisites.map(prerequisite => `${prerequisite.courseId} - ${prerequisite.name}`).join(", ");
    },
    openForm() {
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.showForm2 = false;
      this.clearForm();
    },
    clearForm() {
      this.selectedCourse = '';
      this.groupCourses = '';
      this.text = '';
      this.credit = 0;
      this.groupName = '';
      this.selectedGroupCourse = '';
      this.selectedStudyPlan = '';
    },
    openForm2() {
      this.showForm2 = true;
    },
  },
  mounted() {
    this.fetchData();
  }
}
</script>

<style lang="scss" scoped>
.home {
  padding-top: 200px; // or whatever value is needed to push the content below the navbar
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
  z-index: 1000;
  padding: 30px;
  width: 80%;
  max-width: 600px;
}

.accordion {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  cursor: pointer;
  padding: 10px;
  background-color: #4c7bb9;
}

.accordion.active {
  background-color: #ff8800;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
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

.accordion h3 {
  margin: 0;
}

.accordion i {
  float: right;
  transition: transform 0.3s;
}

.accordion i.fa-rotate-180 {
  transform: rotate(180deg);
}

.c-f-p {
  display: flex;
  justify-content: end;
  gap: 1em;

}

.e-d {
  display: flex;
  justify-content: center;
  gap: 1em;
}

.right-side {
  display: flex;
  justify-content: end;

}
</style>
