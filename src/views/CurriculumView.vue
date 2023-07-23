<template>
  <div>
    <router-link to="/faculty"><button> Create Faculty</button></router-link>
    <router-link to="/courseprogram"><button> Create Program</button></router-link>
  </div>

  <h3>Select Faculty:</h3>
  <select v-model="selectedFaculty">
    <option value="">-- Select Faculty --</option>
    <option v-for="faculty in faculties" :value="faculty.name" :key="faculty.facultyId">
      {{ faculty.name }}
    </option>
  </select>

  <h3 v-if="selectedFaculty">Select Program:</h3>
  <select v-if="selectedFaculty" v-model="selectedProgram">
    <option value="">-- Select Program --</option>
    <option v-for="program in filteredPrograms" :value="program.programId" :key="program.programId">
      {{ program.name }}
    </option>
  </select>


  <div v-if="selectedProgram">
    <div>
      <div @click="toggleAccordion(1)" :class="{ 'accordion': true, 'active': isActive(1) }">
        <h3>Curriculum</h3>
      </div>
      <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(1) }"></i>



      <div v-show="isActive(1, index)" class="content">

      </div>
    </div>

    <div>
      <div @click="toggleAccordion(3)" :class="{ 'accordion': true, 'active': isActive(3) }">
        <h3>Study Plan</h3>
      </div>
      <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(3) }"></i>

      <div v-show="isActive(3)" class="content">


      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/AxiosClient';
import { userRole, ROLES } from '@/service/roles';
import vSelect from 'vue-select';
export default {
  components: {
    'v-select': vSelect,
  },
  name: 'Curriculum',
  data() {
    return {
      userRole: userRole,
      ROLES: ROLES,
      selectedFaculty: '',
      selectedProgram: '',
      faculties: [],
      programs: [],
      records: [],
    
      activeAccordionIndices: [], // Initially set the first accordion as active

    }
  },
  computed: {
    filteredPrograms() {
      if (this.selectedFaculty) {
        const filteredPrograms = this.programs.filter(program => program.faculty && program.faculty.name === this.selectedFaculty);
        console.log("Filtered programs:", filteredPrograms);
        console.log("sf", this.selectedFaculty);
        return filteredPrograms;
      }
      // If no faculty is selected or there are no matching programs, return an empty array.
      return [];
    },
  },
  methods: {
    fetchData() {
      apiClient
        .get('http://localhost:8080/facultys')
        .then(response => {
          this.faculties = response.data; console.log('f', this.faculties)
        })

        .catch(error => {
          alert('Error fetching faculties:', error);
        });

      apiClient
        .get('http://localhost:8080/programs')
        .then(response => {
          this.programs = response.data; console.log('p', this.programs)
        })
        .catch(error => {
          console.log('Error fetching programs:', error);
        });
      apiClient
        .get('http://localhost:8080/courses')
        .then(response => {
          this.records = response.data; console.log(this.records)
        })
        .catch(error => {
          console.log('Error fetching courses:', error)
        })
    },
    toggleAccordion(accordionLevel, index = null) {
      if (accordionLevel === 1) {
        // Toggle the first accordion
        if (this.activeAccordionIndices.includes(1)) {
          // First accordion is active, so deactivate it
          this.activeAccordionIndices = [];
        } else {
          // First accordion is inactive, so activate it and deactivate all other accordions
          this.activeAccordionIndices = [1];
        }
      } else if (accordionLevel === 2 && index !== null) {
        // Toggle the second accordion within a section
        if (this.activeAccordionIndices.includes(index + 2)) {
          // Second accordion is active, so deactivate it
          this.activeAccordionIndices = this.activeAccordionIndices.filter(i => i !== index + 2);
        } else {
          // Second accordion is inactive, so activate it
          this.activeAccordionIndices.push(index + 2);
        }
      } else if (accordionLevel === 3) {
        // Check if the clicked accordion is already open
        if (this.activeAccordionIndices.includes(3)) {
          // If it's open, close it by removing its index from the activeAccordionIndices
          this.activeAccordionIndices = this.activeAccordionIndices.filter(i => i !== 3);
        } else {
          // If it's closed, add its index to the activeAccordionIndices to open it
          this.activeAccordionIndices.push(3);
        }
      }
    },
    isActive(accordionLevel, index = null) {
      if (accordionLevel === 1) {
        // Check if the first accordion is active
        return this.activeAccordionIndices.includes(1);
      } else if (accordionLevel === 2 && index !== null) {
        // Check if a second accordion within a section is active
        return this.activeAccordionIndices.includes(index + 2);
      }
      else if (accordionLevel === 3) {
        return this.activeAccordionIndices.includes(3);
      }

      return false;
    },
    getPrerequisiteInfo(prerequisites) {
      if (!prerequisites || prerequisites.length === 0) {
        return; 
      }
      // Extract courseId and name from the prerequisites array and return as a string
      return prerequisites.map(prerequisite => `${prerequisite.courseId} - ${prerequisite.name}`).join(", ");
    },
    
  },

  mounted() {
    this.fetchData();
  }
}
</script>

<style>
.accordion {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  cursor: pointer;
  padding: 10px;
  background-color: #a297c0;
}

.accordion.active {
  background-color: #0b6902;
}

.accordion h3 {
  margin: 0;
}

.accordion i {
  float: right;
  transition: transform 0.3s;
}

.accordion i.fa-rotate-180 {
  transform: rotate(180deg);
}
</style>
