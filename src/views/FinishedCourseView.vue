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
        <div v-for="(option, index) in section.options" :key="index">
          <label :for="'option' + index">Course {{ index + 1 }}:</label>
          <v-select :id="'option' + index" v-model="section.options[index]" label="name" :options="records" searchable
            required></v-select>

        </div>

        <button @click="addOption">Add More</button>
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
              <th>Grade</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.courseId">
              <td>{{ record.courseId }}</td>
              <td>{{ record.name }}</td>
              <td>{{ record.credit }}</td>
              <td></td>
              <td>
                <router-link :to="'/courses/' + record.courseId">Description</router-link>
              </td>
            </tr>
          </tbody>

        </table>
        <button @click="editSection(index)">Edit</button>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/AxiosClient';
import vSelect from 'vue-select';

export default {
  data() {
    return {
      isFormVisible: false,
      isEditing: false,
      section: {
        year: '',
        semester: '',
        options: [],

      }, records: [],
      createdSections: [],
      editIndex: null
    };
  }, 
  components: {
    'v-select': vSelect,

  },
  created() {
    this.fetchCourses();
  },
  methods: {
    fetchCourses() {
      apiClient.get('http://localhost:8080/courses')
        .then(response => {
          this.records = response.data.map(course => ({
            id: course.id,
            courseId: course.courseId,
            name: course.name,
            credit: course.credit,
            gradingtype: course.gradingtype,
            prerequisite: course.prerequisite.map(prerequisite => ({
              courseId: prerequisite.courseId,
              name: prerequisite.name,
              label: `${prerequisite.courseId} - ${prerequisite.name}`
            })),
            description: course.description,
            label: `${course.courseId} - ${course.name}`
          }));
          console.log(this.records)
        })
        .catch(error => {
          console.log(error);
        });
    },
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
      this.section.options = [];
    },
    addOption() {
      this.section.options.push('');
    },
    getOption(index) {
      return this.section.options[index];
    },
    setOption(index, value) {
      this.section.options[index] = value;
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
