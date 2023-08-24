<template>
  <div class="container">
    <div>
      <div class="row">
        <div class="col-md-12">
          <table class="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Faculty ID</th>
                <th>Faculty Name</th>
                <th v-if="userRole === ROLES.ROLE_ADMIN">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in faculties" :key="record.facultyId">
                <td>{{ record.facultyId }}</td>
                <td>{{ record.name }}</td>
                <td>
                  <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-outline-danger"
                    @click="deleteFaculty(record.facultyId)">Delete</button>
                  <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-outline-info"
                    @click="editFaculty(record)">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-outline-primary" @click="openForm">Add Faculty</button>
        <div v-if="showForm">
          <div class="overlay">
            <div class="popup">
              <div class="row">
                <div class="col-md-12">
                  <h3>{{ selectedFaculty ? 'Edit Faculty' : 'Create Faculty' }}</h3>
                  <form @submit.prevent="addFaculty">
                    <input type="text" v-model="facultyId" placeholder="Faculty ID" required>
                    <input type="text" v-model="name" placeholder="Faculty Name" required>
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
      facultyId: '',
      name: '',
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
      if (this.isSubmitting) return; // Prevent multiple submissions
      this.isSubmitting = true;
      const faculty = {
        facultyId: this.facultyId,
        name: this.name
      }
      axios
        .post('http://localhost:8080/addFaculty', faculty)
        .then(response => {
          alert('Add Faculty successfully');
          console.log(response.data);
          this.fetchFaculties();
          this.cancelForm();
        })
        .catch(error => {
          alert('Error to add faculty')
          console.error(error);
        })
        .finally(() => {
          this.isSubmitting = false; // Reset the submission flag
          this.showForm = false;
          this.clearForm;
        });
      this.showForm = false;
      this.selectedFaculty = false;
      this.clearForm;
    },
    deleteFaculty(id) {
      const confirmDelete = confirm("Are you sure you want to delete this faculty?");
            if (!confirmDelete) {
                return;
            }
      axios
        .delete(`http://localhost:8080/deleteFaculty/${id}`)
        .then(response => {
          alert('Faculty deleted successfully');
          this.fetchFaculties();
        })
        .catch(error => {
          console.error(error);
        });
    },
    editFaculty(faculty) {
      if (faculty && faculty.facultyId) {
        this.selectedFaculty = faculty;
        this.facultyId = faculty.facultyId;
        this.name = faculty.name;
        this.showForm = true;
      } else {
        alert('Invalid course object:', faculty);
      }
    },
    updateFaculty() {
      if (!this.selectedFaculty || this.isSubmitting) return; // Prevent multiple submissions
      this.isSubmitting = true;
      const updateFaculty = {
        facultyId: this.selectedFaculty.facultyId,
        name: this.name
      }
      axios
        .put(`http://localhost:8080/updateFaculty`, updateFaculty)
        .then(response => {
          alert('Update Faculty successfully');
          console.log(response.data);
          this.fetchFaculties();
          this.selectedFaculty = null;
          this.cancelForm();
        })
        .catch(error => {
          alert('Error Update Faculty');
          console.error(error);
        })
        .finally(() => {
          this.isSubmitting = false; // Reset the submission flag
          this.showForm = false;
        });
    },
    openForm() {
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.clearForm();
      this.selectedFaculty = null;
    },
    clearForm() {
      this.facultyId = '';
      this.name = '';
    }
  },
  mounted() {
    this.fetchFaculties();
  }
};
</script>
