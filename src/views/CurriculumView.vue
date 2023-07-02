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
        <div v-for="(item, index) in items" :key="index">
          <div @click="toggleAccordion(index)" :class="{ 'accordion': true, 'active': isActive(index) }">
            <h3>{{ item.title }}</h3>
            <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(index) }"></i>
        </div>

        <div v-show="isActive(index)" class="content">
          <h4>1. General Education</h4>
          <h4>1.1Required courses</h4>
          <h4>1.1.1 Learner Pereson</h4>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-striped tanle-bordered">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course Name</th>
                    <th>Credit</th>
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
          <h4>1.1.2 Innovative Co-creator</h4>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-striped tanle-bordered">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course Name</th>
                    <th>Credit</th>
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
          <h4>1.1.3 Active Citizen</h4>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-striped tanle-bordered">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course Name</th>
                    <th>Credit</th>
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
          <h4>1.2 Elective courses</h4>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-striped tanle-bordered">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course Name</th>
                    <th>Credit</th>
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
          <h4>2. Feild of Specialization</h4>
          <h4>2.1 Core Courses</h4>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-striped tanle-bordered">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course Name</th>
                    <th>Credit</th>
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
          <h4>2.2 Major Courses</h4>
          <h4>2.2.1 Required Courses</h4>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-striped tanle-bordered">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course Name</th>
                    <th>Credit</th>
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
          <h4>2.2.2 Major Elective</h4>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-striped tanle-bordered">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course Name</th>
                    <th>Credit</th>
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
          <h4>3. Free Elective</h4>
          <h5>Text</h5>
          <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm">Add courses</button>
          <h2></h2>
        </div>
      </div>
    </div>
  </div>
</div></template>

<script>
import axios from 'axios';
import { userRole, ROLES } from '@/service/roles';
export default {
  data() {
    return {
      userRole: userRole,
      ROLES: ROLES,
      items: [
        {
          title: 'Curriculum structure',
        },
      ],
      faculties: [],
      programs: [],
      selectedFaculty: '',
      selectedProgram: '',
      activeIndices: [],
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
    },
    toggleAccordion(index) {
      if (this.isActive(index)) {
        this.activeIndices = this.activeIndices.filter(i => i !== index);
      } else {
        this.activeIndices.push(index);
      }
    },
    isActive(index) {
      return this.activeIndices.includes(index);
    },
  },
  watch: {
    selectedFaculty() {
      this.fetchFacultiesAndPrograms();
    },
  },
  mounted() {
    this.fetchFacultiesAndPrograms();
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
