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

      <div v-if="selectedFaculty">
        <h4>Selected Faculty:</h4>
        <p>Faculty ID: {{ selectedFaculty }}</p>
      </div>

      <div v-if="selectedProgram">
        <h4>Selected Program:</h4>
        <p>Program ID: {{ selectedProgram }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      faculties: [],
      programs: [],
      selectedFaculty: '',
      selectedProgram: '',
    };
  },
  methods: {
    async fetchFacultiesAndPrograms() {
      try {
        const facultiesResponse = await axios.get('http://localhost:5000/api/faculties');
        this.faculties = facultiesResponse.data;
        console.log(this.faculties)

        if (this.selectedFaculty) {
          const programsResponse = await axios.get('http://localhost:5000/api/programs', {
            params: {
              faculty_id: this.selectedFaculty,
            },
          });
          this.programs = programsResponse.data;
          console.log(this.programs)
        }
      } catch (error) {
        console.error(error);
      }
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

