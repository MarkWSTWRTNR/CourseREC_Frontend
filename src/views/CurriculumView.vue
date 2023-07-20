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
    <div>

      <div @click="toggleAccordion(1, index)" :class="{ 'accordion': true, 'active': isActive(1, index) }">
        <h3>Curriculum</h3>
      </div>
      <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(1, index) }"></i>
      <div v-show="isActive(1, index)" class="content">
        <h3>General Education | Required courses | Learner person</h3>
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
                <tr v-for="course in getLearnerPersonCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.credit }}</td>
                  <!-- <td v-for="course in program.gerclp" :key="course.id"> -->
                    <!-- <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="deleteCourse(course.courseId)">Delete</button>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                      @click="editCourse(course); openForm()">Edit</button>
                    <router-link :to="'/courses/' + course.courseId">Description</router-link> -->
                  <!-- </td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>General Education | Required courses | Innovative Co-creator</h3>
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
                <tr v-for="course in getInnovativeCoCreatorCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.credit }}</td>
                  <!-- <td v-for="course in program.gercic" :key="course.id"> -->
                    <!-- <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="deleteCourse(course.courseId)">Delete</button>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                      @click="editCourse(course); openForm()">Edit</button>
                    <router-link :to="'/courses/' + course.courseId">Description</router-link> -->
                  <!-- </td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>General Education | Required courses | Active Citizen</h3>
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
                <!-- Add courses for Active Citizen section here -->
                <tr v-for="course in getActiveCitizenCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.credit }}</td>
                  <!-- <td v-for="course in program.gercac" :key="course.id"> -->
                    <!-- <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="deleteCourse(course.courseId)">Delete</button>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                      @click="editCourse(course); openForm()">Edit</button>
                    <router-link :to="'/courses/' + course.courseId">Description</router-link> -->
                  <!-- </td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>General Education | Elective courses</h3>
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
                <!-- Add courses for Elective courses section here -->
                <tr v-for="course in getElectiveCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.credit }}</td>
                  <!-- <td v-for="course in program.geec" :key="course.id"> -->
                    <!-- <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="deleteCourse(course.courseId)">Delete</button>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                      @click="editCourse(course); openForm()">Edit</button>
                    <router-link :to="'/courses/' + course.courseId">Description</router-link> -->
                  <!-- </td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>Field of Specialization | Core Courses</h3>
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
                <!-- Add core courses for Field of Specialization section here -->
                <tr v-for="course in getCoreCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.credit }}</td>
                  <!-- <td v-for="course in program.foscc" :key="course.id"> -->
                    <!-- <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="deleteCourse(course.courseId)">Delete</button>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                      @click="editCourse(course); openForm()">Edit</button>
                    <router-link :to="'/courses/' + course.courseId">Description</router-link> -->
                  <!-- </td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>Field of Specialization | Major Courses | Required Courses</h3>
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
                <!-- Add required courses for Major Courses in Field of Specialization section here -->
                <tr v-for="course in getMajorCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.credit }}</td>
                  <!-- <td v-for="course in program.fosmcrc" :key="course.id"> -->
                    <!-- <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="deleteCourse(course.courseId)">Delete</button>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                      @click="editCourse(course); openForm()">Edit</button>
                    <router-link :to="'/courses/' + course.courseId">Description</router-link> -->
                  <!-- </td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>Field of Specialization | Major Elective</h3>
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
                <!-- Add major elective courses for Field of Specialization section here -->
                <tr v-for="course in getMajorElectiveCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.credit }}</td>
                  <!-- <td v-for="course in program.fosme" :key="course.id"> -->
                    <!-- <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="deleteCourse(course.courseId)">Delete</button>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                      @click="editCourse(course); openForm()">Edit</button>
                    <router-link :to="'/courses/' + course.courseId">Description</router-link> -->
                  <!-- </td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
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

      activeAccordionIndices: [1], // Initially set the first accordion as active
    }
  },
  computed: {
    filteredPrograms() {
      if (this.selectedFaculty) {
        return this.programs.filter(program => program.programId === this.selectedFaculty);
      }
      return [];
    }, getLearnerPersonCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.gerclp || [];
    },getInnovativeCoCreatorCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.gercic || [];
    },getActiveCitizenCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.gercac || [];
    },getElectiveCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.geec || [];
    },getCoreCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.foscc || [];
    },getMajorCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.fosmcrc || [];
    },getMajorElectiveCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.fosme || [];
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
          this.programs = response.data; console.log('p', this.programs[0].gercac)
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
    },
    addCourseToProgram(sectionType, course) {
      const programId = this.selectedProgram;
      const requestData = {
        programId,
        course,
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
    }, openForm() {
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
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
