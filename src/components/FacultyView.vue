<template>
  <div>
    <!-- <div>
      <input type="text" v-model="searchQuery" placeholder="Search Faculty">
      <button @click="searchFaculty">Search</button>
    </div> -->
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
                  <!-- Rest of the code -->

                  <form @submit.prevent="selectedFaculty ? updateFaculty() : addFaculty()">
                    <!-- Rest of the code -->
                    <input type="text" v-model="newFaculty.facultyId" placeholder="Faculty ID" required>
                    <input type="text" v-model="newFaculty.name" placeholder="Faculty Name" required>
                    <!-- Rest of the code -->
                    <button v-if="selectedFaculty" class="btn btn-outline-success" type="submit">Update</button>
                    <!-- Rest of the code -->
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
      newFaculty: {
        facultyId: '',
        name: ''
      }
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
        .post('http://localhost:8080/addFaculty', {
          facultyId: this.newFaculty.facultyId,
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
      this.selectedFaculty = record;
      this.newFaculty.facultyId = record.facultyId;
      this.newFaculty.name = record.name;
      this.showForm = true;
    },
    updateFaculty() {
      axios
        .put(`http://localhost:8080/updateFaculty`, this.newFaculty) // Send the complete Faculty object
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
      this.newFaculty.facultyId = '';
      this.newFaculty.name = '';
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.selectedFaculty = null;
      this.newFaculty.facultyId = '';
      this.newFaculty.name = '';
    },
  },
  mounted() {
    this.fetchFaculties();
  }
};
</script>
