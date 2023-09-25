<template>
  <div class="faculty-page">
    <div class="table-section">
      <h2>Faculty List</h2>
      <div class="back">
        <button class="btn btn-secondary mb-3" @click="goBack">← Back to previous page</button>
      </div>
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
              <div class="e-d">
                <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-danger"
                  @click="deleteFaculty(record.facultyId)">Delete</button>
                <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-info"
                  @click="editFaculty(record)">Edit</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-primary" @click="openForm">Add Faculty</button>
    </div>

    <div v-if="showForm" class="overlay">
      <div class="popup">
        <h3>{{ selectedFaculty ? 'Edit Faculty' : 'Create Faculty' }}</h3>
        <form @submit.prevent="addFaculty">
          <div class="form-group">
            <input type="text" v-model="facultyId" placeholder="Faculty ID" required class="form-control">
          </div>
          <div class="form-group">
            <input type="text" v-model="name" placeholder="Faculty Name" required class="form-control">
          </div>
          <div class="form-actions">
            <button v-if="selectedFaculty" class="btn btn-success" @click="updateFaculty">Update</button>
            <button v-else class="btn btn-primary" type="submit">Create</button>
            <button @click="cancelForm" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script scoped>
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
    }, goBack() {
      this.$router.go(-1);
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
<style lang="scss" scoped>
.faculty-page {
  padding: 150px;

  h2 {
    font-size: 1.5em;
    margin-bottom: 20px;
  }
}

.table-section {
  margin-bottom: 30px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background-color: #fff;
  padding: 20px;
  width: 80%;
  max-width: 500px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 15px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1em;
}

.e-d {
  display: flex;
  justify-content: center;
  gap: 1em;
}

.back {
  display: flex;
  justify-content: end;
}
</style>