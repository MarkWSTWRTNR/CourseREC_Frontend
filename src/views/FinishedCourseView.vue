<template>
  <div>
    <button @click="showForm">Create</button>

    <div v-if="isFormVisible" class="popup">
      <h2>{{ isEditing ? 'Edit Section' : 'Create Section' }}</h2>
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
          <button type="submit">{{ isEditing ? 'Save' : 'Create' }}</button>
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
            <tr v-for="course in section.courses" :key="course.courseId">
              <td>{{ course.courseId }}</td>
              <td>{{ course.name }}</td>
              <td>{{ course.credit }}</td>
              <td>{{ course.grade }}</td>
              <td>
                <router-link :to="'/courses/' + course.courseId">Description</router-link>
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
      },
      records: [],
      id: '',
      courseId: '',
      name: '',
      credit: 0,
      gradingtype: '',
      prerequisite: [],
      description: '',
      createdSections: [],
      selectedPrerequisites: [],
      editIndex: null
    };
  },
  components: {
    'v-select': vSelect,
  },
  mounted() {
    this.fetchCourses();
    this.fetchSections();
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
    saveSection() {
      if (this.isEditing) {
        // Update the edited section in the createdSections array
        this.createdSections.splice(this.editIndex, 1, { ...this.section });
        this.isEditing = false;
      } else {
        // Create a new section
        this.createdSections.push({ ...this.section });
      }

      // Prepare the section data to be sent to the backend API
      const sectionData = {
        year: this.section.year,
        semester: this.section.semester,
        courses: this.section.options,
        courseId: this.courseId,
        name: this.name,
        credit: this.credit,
        gradingtype: this.gradingtype,
        prerequisite: this.prerequisite,
        description: this.description
      };

      // Save the section data to the backend API
      apiClient
        .post('http://localhost:8080/saveStudentFinishedCourse', sectionData)
        .then(response => {
          alert('Section saved successfully');
          // Handle any further logic or data manipulation based on the response from the backend if needed
        })
        .catch(error => {
          console.log(error);
        });

      this.isFormVisible = false;
      this.resetSection();
    },
    fetchSections() {
      apiClient.get('http://localhost:8080/getStudentFinishedCourse') // Adjust the API endpoint according to your backend
        .then(response => {
          this.createdSections = response.data; // Assuming the API response returns an array of sections
        })
        .catch(error => {
          console.log(error);
        });
    },

    resetSection() {
      this.section.year = '';
      this.section.semester = '';
      this.section.options = [];
    },
    addOption() {
      this.section.options.push('');
    },
    editSection(index) {
      this.isFormVisible = true;
      this.isEditing = true;
      this.editIndex = index; // Store the index of the section being edited
      this.section = { ...this.createdSections[index] };
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
