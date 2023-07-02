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

      <div v-if="selectedProgram">
        <div v-for="(item, index) in items" :key="index">
          <div @click="toggleAccordion(index)" :class="{ 'active': isActive(index) }">
            <h3>{{ item.title }}</h3>
            <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(index) }"></i>
          </div>
          <div v-show="isActive(index)" class="content">
            <!-- Content for each accordion item -->
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      items: [
        {
          title: 'Curriculum structure',
          content: 'Content for Accordion Item 1',
        },
        {
          title: 'Study plan',
          content: 'Content for Accordion Item 2',
        },
      ],
      faculties: [],
      programs: [],
      selectedFaculty: '',
      selectedProgram: '',
      activeIndices: [],
    };
  },
  methods: {
    async fetchFacultiesAndPrograms() {
      try {
        const facultiesResponse = await axios.get('http://localhost:5000/api/faculties');
        this.faculties = facultiesResponse.data;
        console.log(this.faculties);

        if (this.selectedFaculty) {
          const programsResponse = await axios.get('http://localhost:5000/api/programs', {
            params: {
              faculty_id: this.selectedFaculty,
            },
          });
          this.programs = programsResponse.data;
          console.log(this.programs);
        }
      } catch (error) {
        console.error(error);
      }
    },
    toggleAccordion(index) {
      if (this.isActive(index)) {
        this.activeIndices = this.activeIndices.filter(i => i !== index);
      } else {
        this.activeIndices.push(index);
      }
    },
    isActive(index) {
      return this.activeIndices.includes(index);
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
