<template>
  <div>
    <router-link to="/faculty"><button> Create Faculty</button></router-link>
    <router-link to="/courseprogram"><button> Create Program</button></router-link>
  </div>

  <h3>Select Faculty:</h3>
  <select v-model="selectedFaculty">
    <option value="">-- Select Faculty --</option>
    <option v-for="faculty in faculties" :value="faculty.facultyId" :key="faculty.facultyId">
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
    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm">Add courses</button>
    <div @click="toggleAccordion(1)" :class="{ 'accordion': true, 'active': isActive(1) }">
      <h3>Curriculum</h3>
      <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(1) }"></i>
    </div>
    <div v-show="isActive(1)" class="content">
      <div v-for="section in sections" :key="section.type">
        <div @click="toggleAccordion(2, section.index)"
          :class="{ 'accordion': true, 'active': isActive(2, section.index) }">
          <h3>{{ section.title }}</h3>
          <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(2, section.index) }"></i>
        </div>
        <div v-show="isActive(2, section.index)" class="content">
          <div class="row">
            <div class="col-md-12">
              <table class="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course Name</th>
                    <th>Credit</th>
                    <th v-if="userRole === ROLES.ADMIN">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="course in section.courses" :key="course.courseId">
                    <td>{{ course.courseId }}</td>
                    <td>{{ course.courseName }}</td>
                    <td>{{ course.credit }}</td>
                    <td>
                      <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                        @click="deleteCourse(course.courseId)">Delete</button>
                      <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                        @click="editCourse(course); openForm()">Edit</button>
                      <router-link :to="'/courses/' + course.courseId">Description</router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showForm" class="overlay">
    <div class="popup">
      <form @submit.prevent="submitForm">
        <div class="row">
          <div class="col-md-12">
            <label for="courseId">Course</label>
            <select v-model="selectedCourse" required>
              <option value="">-- Select Course --</option>
              <option v-for="course in records" :key="course.courseId" :value="course.courseId">
                {{ course.courseId }} {{ course.name }}
              </option>
            </select>
            <label for="courseType">Course Type:</label>
            <select v-model="selectedCourseType" id="courseType" required>
              <option value="">-- Select Course Type --</option>
              <option v-for="type in courseTypes" :value="type.value" :key="type.value">
                {{ type.label }}
              </option>
            </select>
            <button class="btn btn-primary" type="submit">Submit</button>
            <button @click="cancelForm"> Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/AxiosClient';
import { userRole, ROLES } from '@/service/roles';
export default {
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
      showForm: false,
      sections: [
        {
          type: 'gerclp',
          title: 'General Education | Required courses | Learner',
          index: 1,
          courses: [], // Initialize with empty array for the type
        },
        {
          type: 'gercic',
          title: 'General Education | Required courses | Innovative Co-creator',
          index: 2,
          courses: [], // Initialize with empty array for the type
        },
        {
          type: 'gercac',
          title: 'General Education | Required courses | Active Citizen',
          index: 3,
          courses: [], // Initialize with empty array for the type
        },
        {
          type: 'geec',
          title: 'General Education | Elective courses',
          index: 4,
          courses: [], // Initialize with empty array for the type
        },
        {
          type: 'foscc',
          title: 'Field of Specialization | Core Courses',
          index: 5,
          courses: [], // Initialize with empty array for the type
        },
        {
          type: 'fosmcrc',
          title: 'Field of Specialization | Major Courses | Required Courses',
          index: 6,
          courses: [], // Initialize with empty array for the type
        },
        {
          type: 'fosme',
          title: 'Field of Specialization | Major Elective',
          index: 7,
          courses: [], // Initialize with empty array for the type
        },
        // Add more sections as needed...
      ],
      activeAccordionIndices: [1], // Initially set the first accordion as active
      selectedCourse: '',
      selectedCourseType: '',
      courseTypes: [
        {
          label: 'General Education | Required courses | Learner Person',
          value: 'gerclp',
        },
        {
          label: 'General Education | Required courses | Innovative Co-creator',
          value: 'gercic',
        },
        {
          label: 'General Education | Required courses | Active Citizen',
          value: 'gercac',
        },
        {
          label: 'General Education | Elective courses',
          value: 'geec',
        },
        {
          label: 'Field of Specialization | Core Courses',
          value: 'foscc',
        },
        {
          label: 'Field of Specialization | Major Courses | Required Courses',
          value: 'fosmcrc',
        },
        {
          label: 'Field of Specialization | Major Elective',
          value: 'fosme',
        },
      ],
    }
  },
  computed: {
    filteredPrograms() {
      if (this.selectedFaculty) {
        return this.programs.filter(program => program.facultyId === this.selectedFaculty);
      }
      return this.programs;
    },
  },
  methods: {
    fetchData() {
      apiClient
        .get('http://localhost:8080/facultys')
        .then(response => {
          this.faculties = response.data;
        })
        .catch(error => {
          alert('Error fetching faculties:', error);
        });

      apiClient
        .get('http://localhost:8080/programs')
        .then(response => {
          this.programs = response.data;
        })
        .catch(error => {
          console.log('Error fetching programs:', error);
        });
      apiClient
        .get('http://localhost:8080/courses')
        .then(response => {
          this.records = response.data;
        })
        .catch(error => {
          console.log('Error fetching courses:', error)
        })
    },
    addCourseToProgram(sectionType, course) {
      const programId = this.selectedProgram;
      const requestData = {
        programId,
        course,
        courseType: this.selectedCourseType,
      };

      apiClient
        .put('http://localhost:8080/addCourseToProgram', requestData)
        .then(response => {
          // Find the corresponding section and update its courses array
          const section = this.sections.find(section => section.type === sectionType);
          if (section) {
            section.courses.push(response.data);
          }
        })
        .catch(error => {
          console.error('Error adding course to program:', error);
        });
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
      return false;
    },
    openForm() {
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
    },
    submitForm() {
      const sectionType = this.selectedCourseType;
      const course = this.selectedCourse;
      this.addCourseToProgram(sectionType, course);
      this.closeForm();
    },
    cancelForm() {
      this.closeForm();
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
  background-color: #a890e0;
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
