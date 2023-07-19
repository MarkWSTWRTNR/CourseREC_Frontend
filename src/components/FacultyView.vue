<template>
  <div>
    <div>
      <div class="row">
        <div class="col-md-12">
          <table class="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Faculty ID</th>
                <th>Faculty Name</th>
                <th v-if="userRole === ROLES.ADMIN">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in faculties" :key="record.facultyId">
                <td>{{ record.facultyId }}</td>
                <td>{{ record.name }}</td>
                <td>
                  <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                    @click="deleteFaculty(record.facultyId)">Delete</button>
                  <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                    @click="editFaculty(record)">Edit</button>
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
                    <input type="text" v-model="selectedFaculty.facultyId" placeholder="Faculty ID" required>
                    <input type="text" v-model="selectedFaculty.name" placeholder="Faculty Name" required>
                    <button v-if="selectedFaculty" class="btn btn-outline-success" type="submit">Update</button>
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
  </div>
</template>

<script>
import axios from 'axios';
import { userRole, ROLES } from '@/service/roles';
import searchTools from '@/service/searchTools';

export default {
  name: 'faculty',
  mixins: [searchTools],
  data() {
    return {
      userRole: userRole,
      ROLES: ROLES,
      faculties: [],
      showForm: false,
      selectedFaculty: null,
    };
  },
  methods: {
    fetchFaculties() {
      axios
        .get('http://localhost:8080/facultys')
        .then(response => {
          this.faculties = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    addFaculty() {
      axios
        .post('http://localhost:8080/addFaculty', this.selectedFaculty)
        .then(response => {
          console.log(response.data);
          this.fetchFaculties();
          this.cancelForm();
        })
        .catch(error => {
          console.error(error);
        });
    },
    deleteFaculty(id) {
      axios
        .delete(`http://localhost:8080/deleteFaculty/${id}`)
        .then(response => {
          console.log(response.data);
          this.fetchFaculties();
        })
        .catch(error => {
          console.error(error);
        });
    },
    editFaculty(record) {
      this.selectedFaculty = { ...record };
      this.showForm = true;
    },
    updateFaculty() {
      axios
        .put(`http://localhost:8080/updateFaculty`, this.selectedFaculty)
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
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.selectedFaculty = null;
    },
  },
  mounted() {
    this.fetchFaculties();
  }
};
</script>
