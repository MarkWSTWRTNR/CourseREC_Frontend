<template>
  <div>
    <router-link to="/faculty"><button> Create Faculty</button></router-link>
    <router-link to="/courseprogram"><button> Create Program</button></router-link>
  </div>

  <h3>Select Faculty:</h3>
  <select v-model="selectedFaculty">
    <option value="">-- Select Faculty --</option>
    <option v-for="faculty in faculties" :value="faculty.name" :key="faculty.facultyId">
      {{ faculty.name }}
    </option>
  </select>

  <h3 v-if="selectedFaculty">Select Program:</h3>
  <select v-if="selectedFaculty" v-model="selectedProgram">
    <option value="">-- Select Program --</option>
    <option v-for="program in filteredPrograms" :value="program.programId" :key="program.programId">
      {{ program.name }}
    </option>
  </select>


  <div v-if="selectedProgram">
    <div>
      <div @click="toggleAccordion(1)" :class="{ 'accordion': true, 'active': isActive(1) }">
        <h3>Curriculum</h3>
      </div>
      <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(1) }"></i>


      <div v-show="isActive(1, index)" class="content">
        <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm">Add courses</button>
        <div v-if="showForm">
          <div class="overlay">
            <div class="popup">
              <div class="row">
                <div class="col-md-12">
                  <form @submit.prevent="addCourseToGroupCourse">
                    <h3>{{ selectedGroupCourse ? 'Edit GroupCourse' : 'Add GroupCourse' }}</h3>
                    <label for="courseId">Course</label>
                    <v-select class="form-control left-align" v-model="selectedCourse" :options="records.map(record => ({
                      label: record.courseId + ' - ' + record.name,
                      value: record.courseId
                    }))" :reduce="option => option.value" :placeholder="'Select a course'">
                    </v-select>

                    <label for="groupName">Group Name:</label>
                    <select v-model="groupName" id="groupName">
                      <option value="">-- Select Group Course --</option>
                      <option>General Education | Required courses | Learner Pereson</option>
                      <option>General Education | Required courses | Innovative Co-creator</option>
                      <option>General Education | Required courses | Active Citizen</option>
                      <option>General Education | Elective courses</option>
                      <option>Feild of Specialization| Core Courses</option>
                      <option>Feild of Specialization | Major Courses | Required Courses</option>
                      <option>Feild of Specialization | Major Elective</option>
                    </select>
                    <button v-if="selectedGroupCourse" class="btn btn-outline-success"
                      @click="updateGroupCourse">Update</button>
                    <button v-else class="btn btn-primary" type="submit">Add Course</button>
                    <button @click="cancelForm">Cancel</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12" v-for="(groupCourse, groupCourseIndex) in filteredGroupCourses" :key="groupCourseIndex">
            <h4>Group Course: {{ groupCourse.groupName }}</h4>
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

                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <div>
      <div @click="toggleAccordion(3)" :class="{ 'accordion': true, 'active': isActive(3) }">
        <h3>Study Plan</h3>
      </div>
      <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(3) }"></i>

      <div v-show="isActive(3)" class="content">


      </div>
    </div>
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
      faculties: [],
      programs: [],
      records: [],
      groupCourse: [],
      groupName: '',
      activeAccordionIndices: [], // Initially set the first accordion as active
      showForm: false,
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
      // If no faculty is selected or there are no matching programs, return an empty array.
      return [];
    },
    filteredGroupCourses() {
      if (this.selectedProgram) {
        // Filter the groupCourse based on the selected programId
        return this.groupCourse.filter(groupCourse => groupCourse.programs && groupCourse.programs.programId === this.selectedProgram);
      }
      // If no program is selected or there are no matching groupCourses, return an empty array.
      return [];
    },
  },
  methods: {
    fetchData() {
      apiClient
        .get('http://localhost:8080/facultys')
        .then(response => {
          this.faculties = response.data; console.log('f', this.faculties)
        })

        .catch(error => {
          alert('Error fetching faculties:', error);
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
        .get('http://localhost:8080/courses')
        .then(response => {
          this.records = response.data; console.log(this.records)
        })
        .catch(error => {
          console.log('Error fetching courses:', error)
        })
      apiClient
        .get('http://localhost:8080/groupCourses')
        .then(response => {
          this.groupCourse = response.data; console.log('gc', this.groupCourse);
        })
    },
    addCourseToGroupCourse() {
      if (this.selectedCourse && this.groupName && this.selectedProgram) {
        const isDuplicate = this.filteredGroupCourses.some(groupCourse => groupCourse.groupName === this.groupName);

        if (isDuplicate) {
          alert('Group name already exists. Please enter a different group name.');
        } else {
          const courseToAdd = {
            courses: [
              {
                courseId: this.selectedCourse
              }
            ],
            groupName: this.groupName,
            programs: {
              programId: this.selectedProgram
            }
            
          };

          apiClient
            .post('http://localhost:8080/addGroupCourse', courseToAdd)
            .then(response => {
              console.log('Course group created:', response.data);
              this.fetchData();
              this.clearForm();
              this.showForm = false;
            })
            .catch(error => {
              console.error('Error creating course group:', error);
            });
        }
      }
    },

    deleteCourseFromGroupCourse() {

    },
    updateCourseFromGroupCourse() {

    },
    toggleAccordion(accordionLevel, index = null) {
      if (accordionLevel === 1) {
        // Toggle the first accordion
        if (this.activeAccordionIndices.includes(1)) {
          // First accordion is active, so deactivate it
          this.activeAccordionIndices = [];
        } else {
          // First accordion is inactive, so activate it and deactivate all other accordions
          this.activeAccordionIndices = [1];
        }
      } else if (accordionLevel === 2 && index !== null) {
        // Toggle the second accordion within a section
        if (this.activeAccordionIndices.includes(index + 2)) {
          // Second accordion is active, so deactivate it
          this.activeAccordionIndices = this.activeAccordionIndices.filter(i => i !== index + 2);
        } else {
          // Second accordion is inactive, so activate it
          this.activeAccordionIndices.push(index + 2);
        }
      } else if (accordionLevel === 3) {
        // Check if the clicked accordion is already open
        if (this.activeAccordionIndices.includes(3)) {
          // If it's open, close it by removing its index from the activeAccordionIndices
          this.activeAccordionIndices = this.activeAccordionIndices.filter(i => i !== 3);
        } else {
          // If it's closed, add its index to the activeAccordionIndices to open it
          this.activeAccordionIndices.push(3);
        }
      }
    },
    isActive(accordionLevel, index = null) {
      if (accordionLevel === 1) {
        // Check if the first accordion is active
        return this.activeAccordionIndices.includes(1);
      } else if (accordionLevel === 2 && index !== null) {
        // Check if a second accordion within a section is active
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
      // Extract courseId and name from the prerequisites array and return as a string
      return prerequisites.map(prerequisite => `${prerequisite.courseId} - ${prerequisite.name}`).join(", ");
    },
    openForm() {
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.clearForm();
    },
    clearForm() {
      this.selectedCourse = '';
      this.groupCourses = '';
    },
  },
  mounted() {
    this.fetchData();
  }
}
</script>

<style>
.accordion {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  cursor: pointer;
  padding: 10px;
  background-color: #a297c0;
}

.accordion.active {
  background-color: #0b6902;
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
</style>
