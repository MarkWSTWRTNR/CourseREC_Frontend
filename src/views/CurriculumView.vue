<template>
  <div>
    <div>
      <router-link to="/faculty"><button> Create Faculty</button></router-link>
      <router-link to="/courseprogram"><button> Create Program</button></router-link>
    </div>
    <div>
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
        <option v-for="program in programs" :value="program.programId" :key="program.programId">
          {{ program.name }}
        </option>
      </select>

      <div v-if="selectedProgram">
        <!-- First Accordion -->
        <div v-for="(item, index) in items1" :key="index">
          <div @click="toggleAccordion(1, index)" :class="{ 'accordion': true, 'active': isActive(1, index) }">
            <h3>{{ item.title }}</h3>
            <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(1, index) }"></i>
          </div>
          <div v-if="showForm">
            <div class="overlay">
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
                      <select v-model="courseType" id="courseType">
                        <option value="">-- Select Course Type --</option>
                        <option value="geRcLearnerPerson">General Education | Required courses | Learner Pereson</option>
                        <option value="geRcInnovativeCoCreator">General Education | Required courses | Innovative
                          Co-creator
                        </option>
                        <option value="geRcActiveCitizen">General Education | Required courses | Active Citizen</option>
                        <option value="geElective courses">General Education | Elective courses</option>
                        <option value="fosCoreCourse">Feild of Specialization| Core Courses</option>
                        <option value="fosMajorCourseRc">Feild of Specialization | Major Courses | Required Courses
                        </option>
                        <option value="fosMajorElective">Feild of Specialization | Major Elective</option>
                      </select>

                      <button class="btn btn-primary" type="submit">Submit</button>
                      <button @click="cancelForm"> Cancel</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div v-show="isActive(1, index)" class="content">
            <div v-for="courseType in courseType" :key="courseType.name">
              <h5>{{ courseType.name }}</h5>
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
                      <tr v-for="course in courseTypes" :key="course.courseId">
                        <td>{{ course.courseId }}</td>
                        <td>{{ course.coursename }}</td>
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
            <h5>Free Elective</h5>
            <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm">Add courses</button>
          </div>
        </div>
        <!-- Study Plan -->
        <!-- Second Accordion -->
        <div v-for="(item, index) in items2" :key="index">
          <div @click="toggleAccordion(2, index)" :class="{ 'accordion': true, 'active': isActive(2, index) }">
            <h3>{{ item.title }}</h3>
            <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(2, index) }"></i>
          </div>

          <div v-show="isActive(2, index)" class="content">
            <h3>First Year</h3>
            <h5>First Semester</h5>
            <div class="row">
              <div class="col-md-12">
                <table class="table table-striped tanle-bordered">
                  <thead>
                    <tr>
                      <th>Course ID</th>
                      <th>Course Name</th>
                      <th>Credit</th>
                      <th v-if="userRole === ROLES.ADMIN">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="record in    displayCourses   " :key="record.courseId">
                      <td>{{ record.courseId }}</td>
                      <td>{{ record.name }}</td>
                      <td>{{ record.credit }}</td>
                      <td><button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                          @click="deleteCourse(record.courseId)">Delete</button>
                        <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                          @click="editCourse(record); openForm()">Edit</button><br>
                        <router-link :to="'/courses/' + record.courseId">Description</router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm">Add courses</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { userRole, ROLES } from '@/service/roles';
export default {
  data() {
    return {
      userRole: userRole,
      ROLES: ROLES,
      items1: [
        {
          title: 'Curriculum structure',
        },
      ],
      items2: [
        { title: 'Study Plan' },
      ], 
      courseTypes: [],
      courseType: [{ name: 'General Education | Required courses | Learner Person', value: 'geRcLearnerPerson' },
      { name: 'General Education | Required courses | Innovative Co-creator', value: 'geRcInnovativeCoCreator' },
      { name: 'General Education | Required courses | Active Citizen', value: 'geRcActiveCitizen' },
      { name: 'General Education | Elective courses', value: 'geElectiveCourses' },
      { name: 'Feild of Specialization| Core Courses', value: 'fosCoreCourse' },
      { name: 'Feild of Specialization | Major Courses | Required Courses', value: 'fosMajorCourseRc' },
      { name: 'Feild of Specialization | Major Elective', value: 'fosMajorElective' }],
      faculties: [],
      programs: [],
      selectedFaculty: '',
      selectedProgram: '',
      activeIndices: [],
      activeAccordionIndices1: [], // Initialize with an empty array
      activeAccordionIndices2: [], // Initialize with an empty array
      selectedCourse: '',
      displayCourses: [],
      courseId: '',
      name: '',
      coursetype: [],
      showForm: false,
      records: []
    };
  },
  methods: {
    async fetchCourseTypes() {
      try {
        const response = await axios.get('http://localhost:8080/coursetypes');
        // console.log('get data coursetype: ',response.data); // Log the response data to check its structure and contents
        this.courseTypes = response.data;
        console.log('get this.course type', this.courseTypes);
      } catch (error) {
        console.log(error);
      }
    },

    filteredCourses(courseType) {
  if (!courseType || !this.selectedProgram) {
    return [];
  }
  const programCourses = this.programs.find(program => program.programId === this.selectedProgram)?.courses;
  if (!programCourses) {
    this.displayCourses = [];
  } else {
    // Filter the program courses based on the selected course type
    this.displayCourses = programCourses.filter(course => course.coursetype === courseType);
  }
},




    async fetchFacultiesAndPrograms() {
      try {
        const facultiesResponse = await axios.get('http://localhost:8080/facultys');
        this.faculties = facultiesResponse.data;
        console.log('get data faculty: ', this.faculties);

        if (this.selectedFaculty) {
          const programsResponse = await axios.get('http://localhost:8080/programs', {
            params: {
              facultyId: this.selectedFaculty,
            },
          });
          this.programs = programsResponse.data;
          console.log('get data program: ', this.programs);
        }
      } catch (error) {
        console.error(error);
      }
    }, async fetchCourses() {
      try {
        const response = await axios.get('http://localhost:8080/courses');
        this.records = response.data.map(course => ({
          courseId: course.courseId,
          name: course.name,
          credit: course.credit,
          gradingtype: course.gradingtype,
          prereq: course.prereq.map(prerequisite => ({
            courseId: prerequisite.courseId,
            name: prerequisite.name
          })),
          description: course.description,
          label: `${course.courseId} - ${course.name}`
        })); console.log('get data courses: ', this.records);
      } catch (error) {
        console.log(error);
      }
    },


    openForm() {
      this.showForm = true
    }, // ...
    submitForm() {
      (async () => {
        try {
          const response = await axios.post('http://localhost:8080/coursetypes', {
            courseId: this.selectedCourse,
            course_type: this.courseType
          });
          console.log(response.data);
          this.showForm = false;
        } catch (error) {
          console.error(error);
        }
      })();
      this.showForm = false;
    },
    cancelForm() {
      this.showForm = false;
      this.clearForm();
    },
    clearForm() {
      this.selectedCourse = '';
      this.courseType = '';
    },
    toggleAccordion(accordionNumber, index) {
      if (accordionNumber === 1) {
        const isActive = this.isActive(1, index);
        if (isActive) {
          this.activeAccordionIndices1 = this.activeAccordionIndices1.filter(i => i !== index);
        } else {
          this.activeAccordionIndices1.push(index);
        }
      } else if (accordionNumber === 2) {
        const isActive = this.isActive(2, index);
        if (isActive) {
          this.activeAccordionIndices2 = this.activeAccordionIndices2.filter(i => i !== index);
        } else {
          this.activeAccordionIndices2.push(index);
        }
      }
    },
    isActive(accordionNumber, index) {
      if (accordionNumber === 1) {
        return this.activeAccordionIndices1 && this.activeAccordionIndices1.includes(index);
      } else if (accordionNumber === 2) {
        return this.activeAccordionIndices2 && this.activeAccordionIndices2.includes(index);
      }
      return false;
    }
  },
  watch: {
    selectedFaculty() {
      this.fetchFacultiesAndPrograms();
    },
  },
  mounted() {
    this.fetchFacultiesAndPrograms();
    this.fetchCourses();
    this.fetchCourseTypes();
  }, computed: {
    groupedCourses() {
      const grouped = {};
      for (this.courseType of this.courseTypes) {
        grouped[courseType.name] = this.filteredCourses(courseType);
      }
      return grouped;
    },
  },


};
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


