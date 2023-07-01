<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>

              <th>Program</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in displayProgram" :key="record.program_id">

              <td>{{ record.program_name }}</td>
              <td>
                <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                  @click="deleteProgram(record.program_id)">
                  Delete
                </button>
                <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                  @click="editProgram(record); openForm()">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm">Add Program</button>
      <div v-if="showForm">
        <div class="overlay">
          <div class="popup">
            <div class="row">
              <div class="col-md-12">
                <h3>{{ selectedProgram ? 'Edit Program' : 'Create Program' }}</h3>
                <form @submit.prevent="selectedProgram ? updateProgram() : addProgram()">
                  <input type="text" v-model="program_name" placeholder="Program Name" required>
                  <button v-if="selectedProgram" class="btn btn-outline-success" @click="updateProgram">Update</button>
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
import { userRole, ROLES } from '@/service/roles';
import axios from 'axios';

export default {
  name: 'courseprogram',
  data() {
    return {
      userRole: userRole,
      ROLES: ROLES,
      displayProgram: [], // Holds the programs to display
      program_name: '', // Holds the new program data
      selectedProgram: null,
      showForm: false // Controls the visibility of the form
    };
  },
  methods: {
    // Fetches the programs from the server
    fetchPrograms() {
      axios.get('http://localhost:5000/api/programs')
        .then(response => {
          this.displayProgram = response.data;
        })
        .catch(error => {
          alert('Error fetching programs:', error);
        });
    },
    // Adds a new program
    addProgram() {
      axios.post('http://localhost:5000/api/programs', {
        name: this.program_name
      })
        .then(response => {
          alert('Program created successfully');
          this.fetchPrograms();
          this.cancelForm();
        })
        .catch(error => {
          alert('Error creating program:', error);
        });
    },
    // Deletes a program
    deleteProgram(programId) {
      const confirmed = confirm('Are you sure you want to delete this program?');
      if (confirmed) {
        axios.delete(`http://localhost:5000/api/programs/${programId}`)
          .then(response => {
            alert('Program deleted successfully');
            this.fetchPrograms();
          })
          .catch(error => {
            alert('Error deleting program:', error);
          });
      }
    },
    editProgram(program) {
      if (program && program.program_id) {
        this.selectedProgram = program;
        this.program_name = program.program_name;
        this.showForm = true;
      } else {
        alert('Invalid program select:', program);
      }
    },
    updateProgram() {
      if (!this.selectedProgram) {
        return;
      }
      const updatedProgram = {
        name: this.program_name
      };
      axios.put(`http://localhost:5000/api/programs/${this.selectedProgram.program_id}`, updatedProgram)
        .then(response => {
          alert('Program updated successfully');
          this.fetchPrograms();
          this.cancelForm();
        })
        .catch(error => {
          alert('Error updating program:', error);
        });
    },

    // Opens the form to add a new program
    openForm() {
      this.showForm = true;
    },
    // Cancels the form and hides it
    cancelForm() {
      this.showForm = false;
      this.program_name = '';
      this.selectedProgram = null;
    }
  },
  mounted() {
    this.fetchPrograms();
  }
};
</script>
