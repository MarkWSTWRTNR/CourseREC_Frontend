<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Faculty ID</th>
              <th>Faculty Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in displayFaculty" :key="record.faculty_id">
              <td>{{ record.faculty_id }}</td>
              <td>{{ record.faculty_name }}</td>
              <td>
                <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger" @click="deleteFaculty(record.faculty_id)">Delete</button>
                <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info" @click="editFaculty(record)">Edit</button>
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
                <h3>{{ selectedFaculty ? 'Edit Faculty' : 'Create Faculty' }}</h3>
                <form @submit.prevent="selectedFaculty ? updateFaculty() : addFaculty()">
                  <input type="text" v-model="newFaculty.faculty_id" placeholder="Faculty ID" required>
                  <input type="text" v-model="newFaculty.name" placeholder="Faculty Name" required> <br>
                  <button v-if="selectedFaculty" class="btn btn-outline-success" @click="updateFaculty">Update</button>
                  <button v-else class="btn btn-primary" type="submit">Create</button>
                  <button @click="cancelForm">Cancel</button>
                </form>
              </div>
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
      displayFaculty: [],
      showForm: false,
      selectedFaculty: null,
      newFaculty: {
        faculty_id: '',
        name: ''
      }
    };
  },
  methods: {
    fetchFaculties() {
      axios
        .get('http://localhost:5000/api/faculties')
        .then(response => {
          this.faculties = response.data;
          this.displayFaculty = this.faculties;
        })
        .catch(error => {
          console.error(error);
        });
    },
    addFaculty() {
      axios
        .post('http://localhost:5000/api/faculties', {
          faculty_id: this.newFaculty.faculty_id,
          name: this.newFaculty.name
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
      this.selectedFaculty = record;
      this.newFaculty.faculty_id = record.faculty_id;
      this.newFaculty.name = record.faculty_name;
      this.showForm = true;
    },
    updateFaculty() {
      axios
        .put(`http://localhost:5000/api/faculties/${this.selectedFaculty.faculty_id}`, {
          name: this.newFaculty.name
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
    openForm() {
      this.selectedFaculty = null;
      this.newFaculty.faculty_id = '';
      this.newFaculty.name = '';
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.selectedFaculty = null;
      this.newFaculty.faculty_id = '';
      this.newFaculty.name = '';
    }
  },
  created() {
    this.fetchFaculties();
  }
};
</script>
