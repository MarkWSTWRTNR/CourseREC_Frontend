<template>
  <div class="faculty-page">
    <div class="table-section">
      <h2>Program List</h2>
      <div class="back">
        <button class="btn btn-secondary mb-3" @click="goBack">← Back to previous page</button>
      </div>
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Program ID</th>
            <th>Program</th>
            <th>Faculty</th>
            <th v-if="userRole === ROLES.ROLE_ADMIN">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in programs" :key="record.id">
            <td>{{ record.programId }}</td>
            <td>{{ record.name }}</td>
            <td>{{ record.faculty ? record.faculty.name : 'N/A' }}</td>
            <td>
              <div class="e-d">
                <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-danger"
                  @click="deleteProgram(record.id)">Delete</button>
                <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-info"
                  @click="editProgram(record); openForm()">Edit</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-primary" @click="openForm">Add Program</button>
    </div>

    <div v-if="showForm" class="overlay">
      <div class="popup">
        <h3>{{ selectedProgram ? 'Edit Program' : 'Create Program' }}</h3>
        <form @submit.prevent="addProgram">
          <div class="form-group">
            <input type="text" v-model="programId" placeholder="Program ID" required class="form-control">
          </div>
          <div class="form-group">
            <input type="text" v-model="name" placeholder="Program Name" required class="form-control">
          </div>
          <div class="form-group">
            <select v-model="selectedFaculty" required class="form-control">
              <option value="" disabled selected>-- Select Faculty --</option>
              <option v-for="faculty in faculties" :key="faculty.facultyId" :value="{ facultyId: faculty.facultyId }">
                {{ faculty.name }}
              </option>
            </select>
          </div>
          <div class="form-actions">
            <button v-if="selectedProgram" class="btn btn-success" @click="updateProgram">Update</button>
            <button v-else class="btn btn-primary" type="submit">Create</button>
            <button @click="cancelForm" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { userRole, ROLES } from '@/service/roles';
import axios from 'axios';
import searchTools from '../service/searchTools';

export default {
  name: 'courseprogram',
  mixins: [searchTools],
  data() {
    return {
      userRole: userRole,
      ROLES: ROLES,
      programs: [],
      faculties: [],
      selectedProgram: null,
      programId: '',
      name: '',
      selectedFaculty: '',
      showForm: false
    };
  },
  methods: {
    fetchData() {
      axios
        .get('http://localhost:8080/facultys')
        .then(response => {
          this.faculties = response.data;
        })
        .catch(error => {
          alert('Error fetching faculties:', error);
        });

      axios
        .get('http://localhost:8080/programs')
        .then(response => {
          this.programs = response.data;
        })
        .catch(error => {
          console.log('Error fetching programs:', error);
        });
    },
    addProgram() {
      if (this.isSubmitting) return; // Prevent multiple submissions
      this.isSubmitting = true;
      const program = {
        programId: this.programId,
        name: this.name,
        faculty: this.selectedFaculty
      }

      axios
        .post('http://localhost:8080/addProgram', program)
        .then(response => {
          console.log('Response:', response.data);
          alert('Program created successfully');
          this.fetchData();
          this.cancelForm();
          this.clearForm();
          this.selectedFaculty = '';
          this.programId = '';
        })
        .catch(error => {
          console.error('Error creating program:', error);
          alert('Error creating program. Please check the console for more details.');
        }).finally(() => {
          this.isSubmitting = false; // Reset the submission flag
          this.showForm = false;
        });
    },
    deleteProgram(id) {
      const confirmed = confirm('Are you sure you want to delete this program?');
      if (confirmed) {
        axios
          .delete(`http://localhost:8080/deleteProgram/${id}`)
          .then(response => {
            alert('Program deleted successfully');
            this.fetchData();
          })
          .catch(error => {
            alert('Error deleting program:', error);
          });
      }
    },
    editProgram(program) {
      if (program && program.id) {
        this.selectedProgram = program;
        this.programId = program.programId; // Update this line
        this.name = program.name;
        this.selectedFaculty = program.facultyId ? program.facultyId.toString() : '';

        this.showForm = true;
      } else {
        alert('Invalid program selected:', program);
      }
    },
    updateProgram() {
      if (!this.selectedProgram || this.isSubmitting) return; // Prevent multiple submissions
      this.isSubmitting = true;

      const updatedProgram = {
        programId: this.programId,
        name: this.name,
        faculty: this.selectedFaculty
      };
      axios
        .put(`http://localhost:8080/updateProgram`, updatedProgram)
        .then(response => {
          alert('Program updated successfully');
          this.fetchData();
          this.cancelForm();
          this.clearForm();
          this.selectedProgram = null;
        })
        .catch(error => {
          alert('Error updating program:', error);
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
      this.selectedProgram = null;
    },
    clearForm() {
      this.programId = '';
      this.name = '';
      this.selectedFaculty = '';
    },
  },
  mounted() {
    this.fetchData();
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