<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Program ID</th>
              <th>Program</th>
              <th>Faculty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in displayProgram" :key="record.id">
              <td>{{ record.program_id }}</td>
              <td>{{ record.program_name }}</td>
              <td>{{ record.faculty }}</td>
              <td>
                <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger" @click="deleteProgram(record.id)">
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
                  <input type="text" v-model="program_id" placeholder="Program ID" required>
                  <input type="text" v-model="program_name" placeholder="Program Name" required>
                  <select v-model="selectedFaculty" required>
                    <option v-for="faculty in faculties" :key="faculty.id" :value="faculty.faculty_id">{{
                      faculty.faculty_name }}</option>

                  </select>
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
      faculties: [], // Holds the faculties for the select dropdown
      program_id: '', // Holds the program ID
      program_name: '', // Holds the new program data
      selectedFaculty: '', // Holds the selected faculty ID
      selectedProgram: null,
      showForm: false // Controls the visibility of the form
    };
  },
  methods: {
    // Fetches the programs and faculties from the server
    fetchData() {
      axios.get('http://localhost:5000/api/faculties')
        .then(response => {
          console.log(response.data); // Add this line to check the data received
          this.faculties = response.data;
          console.log(this.faculties);
        })
        .catch(error => {
          alert('Error fetching faculties:', error);
        });

      axios.get('http://localhost:5000/api/programs')
        .then(response => {
          this.displayProgram = response.data;
        })
        .catch(error => {
          console.log('Error fetching programs:', error);
        });

    },
    // Adds a new program
    addProgram() {
      console.log('Data to send:', {
        id: this.program_id,
        name: this.program_name,
        faculty_id: this.selectedFaculty
      });

      axios
        .post('http://localhost:5000/api/programs', {
          id: this.program_id,
          name: this.program_name,
          faculty_id: this.selectedFaculty
        })
        .then(response => {
          console.log('Response:', response.data);
          alert('Program created successfully');
          this.fetchData();
          this.cancelForm();
          this.selectedFaculty = ''; // Reset selectedFaculty
          this.program_id = ''; // Reset program_id
        })
        .catch(error => {
          console.error('Error creating program:', error);
          alert('Error creating program. Please check the console for more details.');
        });
    },

    // Deletes a program
    deleteProgram(programId) {
      const confirmed = confirm('Are you sure you want to delete this program?');
      if (confirmed) {
        axios.delete(`http://localhost:5000/api/programs/${programId}`)
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
        this.program_id = program.id; // Assign the program ID
        this.program_name = program.name;
        this.selectedFaculty = program.faculty_id.toString(); // Assign the faculty ID as a string
        this.showForm = true;
      } else {
        alert('Invalid program selected:', program);
      }
    },

    updateProgram() {
      if (!this.selectedProgram) {
        return;
      }
      const updatedProgram = {
        id: this.program_id,
        name: this.program_name,
        faculty_id: this.selectedFaculty
      };
      axios
        .put(`http://localhost:5000/api/programs/${this.selectedProgram.id}`, updatedProgram)
        .then(response => {
          alert('Program updated successfully');
          this.fetchData();
          this.cancelForm();
          this.selectedFaculty = ''; // Reset selectedFaculty
          this.program_id = ''; // Reset program_id
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
      this.program_id = ''; // Reset program_id
      this.program_name = '';
      this.selectedFaculty = '';
      this.selectedProgram = null;
    },
  },
  mounted() {
    this.fetchData();
  }
};
</script>
