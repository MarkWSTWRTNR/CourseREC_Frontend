<template>
  <div>
    <button @click="showForm">Create</button>

    <div v-if="isFormVisible" class="popup">
      <h2 v-if="!isEditing">Create Section</h2>
      <h2 v-if="isEditing">Edit Section</h2>
      <form @submit.prevent="saveSection">
        <label for="year">Year:</label>
        <input type="text" id="year" v-model="section.year" required>
        <label for="semester">Semester:</label>
        <input type="text" id="semester" v-model="section.semester" required>

        <div class="buttons">
          <button v-if="!isEditing" type="submit">Create</button>
          <button v-if="isEditing" type="submit">Save</button>
          <button @click="cancelForm">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="createdSections.length > 0">
      <div v-for="(section, index) in createdSections" :key="index">
        <p>Year: {{ section.year }}</p>
        <p>Semester: {{ section.semester }}</p>

        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Course Credit</th>
              <th>Grading Type</th>
              <th>Course Prerequisite</th>
              <th>Action</th>
            </tr>
          </thead>
        </table>
        <button @click="editSection(index)">Edit</button>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFormVisible: false,
      isEditing: false,
      section: {
        year: '',
        semester: ''
      },
      createdSections: [],
      editIndex: null
    };
  },
  methods: {
    showForm() {
      this.isFormVisible = true;
      this.isEditing = false;
    },
    cancelForm() {
      this.isFormVisible = false;
      this.resetSection();
    },
    createSection() {
      this.createdSections.push({ ...this.section });
      this.isFormVisible = false;
      this.resetSection();
    },
    editSection(index) {
      this.isFormVisible = true;
      this.isEditing = true;
      this.editIndex = index; // Store the index of the section being edited
      this.section = { ...this.createdSections[index] };
    },
    saveSection() {
      if (this.isEditing) {
        // Update the edited section in the createdSections array
        Object.assign(this.createdSections[this.editIndex], this.section);
        this.isEditing = false;
      } else {
        // Create a new section
        this.createdSections.push({ ...this.section });
      }

      this.isFormVisible = false;
      this.resetSection();
    },
    resetSection() {
      this.section.year = '';
      this.section.semester = '';
    }
  }
};
</script>

<style scoped>
.popup {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 10px;
}
</style>
