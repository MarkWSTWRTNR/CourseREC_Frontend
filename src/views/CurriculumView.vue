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
        <option v-for="faculty in faculties" :value="faculty.faculty_id" :key="faculty.faculty_id">
          {{ faculty.faculty_name }}
        </option>
      </select>

      <h3 v-if="selectedFaculty">Select Program:</h3>
      <select v-if="selectedFaculty" v-model="selectedProgram">
        <option value="">-- Select Program --</option>
        <option v-for="program in programs" :value="program.program_id" :key="program.program_id">
          {{ program.program_name }}
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
                        <option value="">-- Select Course Type --</option>
                        <option v-for="course in records" :key="course.course_id" :value="course.course_id">
                          {{ course.course_id }} {{ course.coursename }}
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
            <h5>1. General Education</h5>
            <h5>1.1Required courses</h5>
            <h5>1.1.1 Learner Pereson</h5>
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
                    <tr v-for="record in    displayCourses   " :key="record.course_id">
                      <td>{{ record.course_id }}</td>
                      <td>{{ record.coursename }}</td>
                      <td>{{ record.credit }}</td>
                      <td><button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                          @click="deleteCourse(record.course_id)">Delete</button>
                        <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                          @click="editCourse(record); openForm()">Edit</button><br>
                        <router-link :to="'/courses/' + record.course_id">Description</router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                    <tr v-for="record in    displayCourses   " :key="record.course_id">
                      <td>{{ record.course_id }}</td>
                      <td>{{ record.coursename }}</td>
                      <td>{{ record.credit }}</td>
                      <td><button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                          @click="deleteCourse(record.course_id)">Delete</button>
                        <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                          @click="editCourse(record); openForm()">Edit</button><br>
                        <router-link :to="'/courses/' + record.course_id">Description</router-link>
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
      faculties: [],
      programs: [],
      selectedFaculty: '',
      selectedProgram: '',
      activeIndices: [],
      activeAccordionIndices1: [], // Initialize with an empty array
      activeAccordionIndices2: [], // Initialize with an empty array
      selectedCourse: '',
      displayCourses: [],
      course_id: '',
      course_name: '',
      courseType: '',
      showForm: false
    };
  },
  methods: {
    async fetchFacultiesAndPrograms() {
      try {
        const facultiesResponse = await axios.get('http://localhost:5000/api/faculties');
        this.faculties = facultiesResponse.data;
        console.log(this.faculties);

        if (this.selectedFaculty) {
          const programsResponse = await axios.get('http://localhost:5000/api/programs', {
            params: {
              faculty_id: this.selectedFaculty,
            },
          });
          this.programs = programsResponse.data;
          console.log(this.programs);
        }
      } catch (error) {
        console.error(error);
      }
    }, async fetchCourses() {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        this.records = response.data.map(course => ({
          course_id: course.course_id,
          coursename: course.coursename,
          credit: course.credit,
          gradingtype: course.gradingtype,
          prereq: course.prereq.map(prerequisite => ({
            course_id: prerequisite.course_id,
            coursename: prerequisite.coursename
          })),
          description: course.description,
          label: `${course.course_id} - ${course.coursename}`
        }));
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
          const response = await axios.post('http://localhost:5000/api/coursetypes', {
            course_id: this.selectedCourse,
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
