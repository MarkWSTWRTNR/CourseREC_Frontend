<template>
  <div>
    <router-link to="/faculty"><button> Create Faculty</button></router-link>
    <router-link to="/courseprogram"><button> Create Program</button></router-link>
  </div>
  <div>
    <select v-model="selectedFaculty" @change="updatePrograms">
      <option value="">Select Faculty</option>
      <option v-for="faculty in faculties" :value="faculty.id">{{ faculty.name }}</option>
    </select>
    <select v-model="selectedProgram">
      <option value="">Select Program</option>
      <option v-for="program in filteredPrograms" :value="program.id">{{ program.name }}</option>
    </select>
  </div>
  <div>
    <div v-for="(item, index) in items" :key="index">
      <div @click="toggleAccordion(index)" :class="{ 'active': isActive(index) }">
        <h3>{{ item.title }}</h3>
        <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(index) }"></i>
      </div>
      <div v-show="isActive(index)" class="content">
        <!-- Content for each accordion item -->
        <p>{{ getProgramContent(item.content) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: 'Curriculum structure', content: 'Content for Accordion Item 1' },
        { title: 'Study plan', content: 'Content for Accordion Item 2' },
      ],
      activeIndices: [],
      faculties: [
        { id: 1, name: 'Faculty 1' },
        { id: 2, name: 'Faculty 2' },
        { id: 3, name: 'Faculty 3' },
      ],
      programs: [
        { id: 1, name: 'Program 1', facultyId: 1 },
        { id: 2, name: 'Program 2', facultyId: 1 },
        { id: 3, name: 'Program 3', facultyId: 2 },
        { id: 4, name: 'Program 4', facultyId: 3 },
      ],
      selectedFaculty: '',
      selectedProgram: '',
      acticeIndices:[]
    };
  },
  methods: {
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
    onFacultyChange() {
      this.selectedProgram = ''; // Reset selected program when faculty changes
    },
    onProgramChange() {
      this.activeIndices = []; // Reset active indices when program changes
    },
    getProgramContent(content) {
      // Logic to retrieve program-specific content based on selected faculty and program
      // You can modify this logic based on your specific requirements
      if (this.selectedFaculty && this.selectedProgram) {
        // Retrieve the program-specific content based on selected faculty and program
        // For example, you can use an object or API call to fetch the content
        // Replace the placeholder content with the actual program-specific content
        return `Content for ${this.selectedFaculty}, ${this.selectedProgram}: ${content}`;
      }
      return content;
    }

  },
  computed: {
    filteredPrograms() {
      if (this.selectedFaculty) {
        return this.programs.filter(program => program.facultyId === this.selectedFaculty);
      }
      return [];
    },
  },
};
</script>

<style>
.active {
  background-color: #f0f0f0;
}

.content {
  padding: 10px;
}
</style>
