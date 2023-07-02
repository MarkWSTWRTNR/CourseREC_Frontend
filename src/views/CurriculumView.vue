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
          <div @click="toggleAccordion(index)" :class="{ 'active': isActive(index) }">
            <h3>{{ item.title }}</h3>
            <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(index) }"></i>
          </div>
          <div v-show="isActive(index)" class="content">
            <h4>1. General Education</h4>
            <h4>Required courses</h4>
            <h4>1.1 Learner Pereson</h4>
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
            <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm">Add courses</button>
            <h2></h2>
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
