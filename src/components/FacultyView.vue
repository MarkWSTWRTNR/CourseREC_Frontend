<template>
    <div>
      <input type="text" v-model="searchQuery" placeholder="Search Faculty">
      <button @click="searchCourses">Search</button>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Faculty ID</th>
              <th>Faculty</th>
              <th>Program</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in displayFaculty" :key="record.faculty_id">
              <td>{{ record.faculty_id }}</td>
              <td>{{ record.faculty_name }}</td>
              <td>{{ record.program_name }}</td>
              <td>
                <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger" @click="deleteFaculty(record.faculty_id)">Delete</button>
                <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info" @click="editFaculty(record); openForm()">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm">Add Faculty</button>
      <div v-if="showForm">
        <div class="overlay">
          <div class="popup">
            <div class="row">
              <div class="col-md-12">
                <h3>Create Faculty</h3>
                <form @submit.prevent="addFaculty">
                  <input type="text" v-model="newFaculty.name" placeholder="Faculty Name" required>
                  <select v-model="newFaculty.program_id" required>
                    <option value="">Select Program</option>
                    <option v-for="program in programs" :value="program.id">{{ program.name }}</option>
                  </select>
                  <button class="btn btn-primary" type="submit">Create</button>
                  <button @click="cancelForm">Cancel</button>
                </form>
              </div>
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
    name: 'faculty',
    data() {
      return {
        userRole: userRole,
        ROLES: ROLES,
        faculties: [],
        programs: [],
        searchQuery: '',
        displayFaculty: [],
        showForm: false,
        newFaculty: {
          name: '',
          program_id: ''
        }
      };
    },
    methods: {
      fetchFaculties() {
        axios
          .get('http://localhost:5000/api/faculties')
          .then(response => {
            this.faculties = response.data;
            this.filterFaculty();
          })
          .catch(error => {
            console.error(error);
          });
      },
      fetchPrograms() {
        axios
          .get('http://localhost:5000/api/programs')
          .then(response => {
            this.programs = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      filterFaculty() {
        if (this.searchQuery) {
          this.displayFaculty = this.faculties.filter(faculty => {
            return faculty.faculty_name.toLowerCase().includes(this.searchQuery.toLowerCase());
          });
        } else {
          this.displayFaculty = this.faculties;
        }
      },
      addFaculty() {
        axios
          .post('http://localhost:5000/api/faculties', {
            name: this.newFaculty.name,
            program_id: this.newFaculty.program_id
          })
          .then(response => {
            console.log(response.data);
            this.fetchFaculties();
            this.cancelForm();
          })
          .catch(error => {
            console.error(error);
          });
      },
      deleteFaculty(facultyId) {
        axios
          .delete(`http://localhost:5000/api/faculties/${facultyId}`)
          .then(response => {
            console.log(response.data);
            this.fetchFaculties();
          })
          .catch(error => {
            console.error(error);
          });
      },
      editFaculty(record) {
        // Add the logic to edit the faculty record here
      },
      openForm() {
        this.showForm = true;
      },
      cancelForm() {
        this.showForm = false;
        this.newFaculty.name = '';
        this.newFaculty.program_id = '';
      }
    },
    created() {
      this.fetchFaculties();
      this.fetchPrograms();
    },
    watch: {
      searchQuery() {
        this.filterFaculty();
      }
    }
  };
  </script>
  