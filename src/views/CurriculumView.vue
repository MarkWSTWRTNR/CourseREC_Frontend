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
      <div @click="toggleAccordion(1, index)" :class="{ 'accordion': true, 'active': isActive(1, index) }">
        <h3>Curriculum</h3>
      </div>
      <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(1, index) }"></i>


      <div v-if="showForm1">
        <div class="overlay">
          <div class="popup">
            <form @submit.prevent="addCourseToSection(courseType, selectedCourse)">
              <div class="row">
                <div class="col-md-12">
                  <label for="courseId">Course</label>
                  <v-select class="form-control left-align" v-model="selectedCourse" :options="records.map(record => ({
                    label: record.courseId + ' - ' + record.name,
                    value: record.courseId
                  }))" :reduce="option => option.value" :placeholder="'Select a course'">
                  </v-select>
                  <label for="courseType">Course Type:</label>
                  <select v-model="courseType" id="courseType">
                    <option value="">-- Select Course Type --</option>
                    <option value="gerclp">General Education | Required courses | Learner Pereson</option>
                    <option value="gercic">General Education | Required courses | Innovative Co-creator</option>
                    <option value="gercac">General Education | Required courses | Active Citizen</option>
                    <option value="geec">General Education | Elective courses</option>
                    <option value="foscc">Feild of Specialization| Core Courses</option>
                    <option value="fosmcrc">Feild of Specialization | Major Courses | Required Courses</option>
                    <option value="fosme">Feild of Specialization | Major Elective</option>
                  </select>
                  <button class="btn btn-primary" type="submit">Submit</button>
                  <button @click="cancelForm">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div v-if="showForm2">
        <div class="overlay">
          <div class="popup">
            <form @submit.prevent="updateProgramCredits">
              <div>
                <h3>General Education | Required courses | Learner person</h3>
                <label for="creditGerclp">Credit Gerclp:</label>
                <input type="number" id="creditGerclp" v-model="credits.creditGerclp">
              </div>
              <div>
                <h3>General Education | Required courses | Innovative Co-creator</h3>
                <label for="creditGercic">Credit Gercic:</label>
                <input type="number" id="creditGercic" v-model="credits.creditGercic">
              </div>
              <div>
                <h3>General Education | Required courses | Active Citizen</h3>
                <label for="creditGercac">Credit Gercac:</label>
                <input type="number" id="creditGercac" v-model="credits.creditGercac">
              </div>
              <div>
                <h3>General Education | Elective courses</h3>
                <label for="creditGeec">Credit Geec:</label>
                <input type="number" id="creditGeec" v-model="credits.creditGeec">
              </div>

              <div>
                <h3>Field of Specialization | Core Courses</h3>
                <label for="creditFoscc">Credit Foscc:</label>
                <input type="number" id="creditFoscc" v-model="credits.creditFoscc">
              </div>

              <div>
                <h3>Field of Specialization | Major Courses | Required Courses</h3>
                <label for="creditFosmcrc">Credit Fosmcrc:</label>
                <input type="number" id="creditFosmcrc" v-model="credits.creditFosmcrc">
              </div>

              <div>
                <h3>Field of Specialization | Major Elective</h3>
                <label for="creditFosme">Credit Fosme:</label>
                <input type="number" id="creditFosme" v-model="credits.creditFosme">
              </div>

              <div>
                <h3>Free Elective</h3>
                <label for="creditFe">Credit Free Elective:</label>
                <input type="number" id="creditFe" v-model="credits.creditFe">
              </div>
              <button class="btn btn-primary" type="submit">Submit Credits</button>
            </form>
          </div>
        </div>
      </div>
      <div v-if="showForm3">
        <div class="overlay">
          <div class="popup">
            <form @submit.prevent="addFreeElectiveSection">
              <div class="row">
                <div class="col-md-12">
                  <label>Free Elective:</label>
                  <input type="text" id="freeElective" placeholder="Free elective" v-model="freeElective">
                  <button class="btn btn-outline-success" type="submit">Update Free Elective</button>
                  <button @click="cancelForm">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div v-show="isActive(1, index)" class="content">
        <h3>General Education | Required courses | Learner person</h3>
        <h4>Minimum credit required: {{ programs.length > 0 ? programs[0].creditGerclp : '' }}</h4>
        <div class="row">
          <div class="col-md-12">
            <table class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Prerequisite</th>
                  <th>Credit</th>
                  <th v-if="userRole === ROLES.ADMIN">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="course in getLearnerPersonCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.preerquisite }}</td>
                  <td>{{ course.credit }}</td>
                  <td>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="removeCourseToSection(sectionType, course.courseId)">Remove</button>
                    <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>General Education | Required courses | Innovative Co-creator</h3>
        <h4>Minimum credit required: {{ programs.length > 0 ? programs[0].creditGercic : '' }}</h4>
        <div class="row">
          <div class="col-md-12">
            <table class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Prerequisite</th>
                  <th>Credit</th>
                  <th v-if="userRole === ROLES.ADMIN">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="course in getInnovativeCoCreatorCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.prerequisite }}</td>
                  <td>{{ course.credit }}</td>
                  <td>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="removeCourseToSection(sectionType, course.courseId)">Remove</button>
                    <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>General Education | Required courses | Active Citizen</h3>
        <h4>Minimum credit required: {{ programs.length > 0 ? programs[0].creditGercac : '' }}</h4>
        <div class="row">
          <div class="col-md-12">
            <table class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Prerequisite</th>
                  <th>Credit</th>
                  <th v-if="userRole === ROLES.ADMIN">Action</th>
                </tr>
              </thead>
              <tbody>
                <!-- Add courses for Active Citizen section here -->
                <tr v-for="course in getActiveCitizenCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.prerequisite }}</td>
                  <td>{{ course.credit }}</td>
                  <td>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="removeCourseToSection(sectionType, course.courseId)">Remove</button>
                    <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>General Education | Elective courses</h3>
        <h4>Minimum credit required: {{ programs.length > 0 ? programs[0].creditGeec : '' }}</h4>
        <div class="row">
          <div class="col-md-12">
            <table class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Prerequisite</th>
                  <th>Credit</th>
                  <th v-if="userRole === ROLES.ADMIN">Action</th>
                </tr>
              </thead>
              <tbody>
                <!-- Add courses for Elective courses section here -->
                <tr v-for="course in getElectiveCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.prerequisite }}</td>
                  <td>{{ course.credit }}</td>
                  <td>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="removeCourseToSection(sectionType, course.courseId)">Remove</button>
                    <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>Field of Specialization | Core Courses</h3>
        <h4>Minimum credit required: {{ programs.length > 0 ? programs[0].creditFoscc : '' }}</h4>
        <div class="row">
          <div class="col-md-12">
            <table class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Prerequisite</th>
                  <th>Credit</th>
                  <th v-if="userRole === ROLES.ADMIN">Action</th>
                </tr>
              </thead>
              <tbody>
                <!-- Add core courses for Field of Specialization section here -->
                <tr v-for="course in getCoreCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.prerequisite }}</td>
                  <td>{{ course.credit }}</td>
                  <td>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="removeCourseToSection(sectionType, course.courseId)">Remove</button>
                    <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>Field of Specialization | Major Courses | Required Courses</h3>
        <h4>Minimum credit required: {{ programs.length > 0 ? programs[0].creditFosmcrc : '' }}</h4>
        <div class="row">
          <div class="col-md-12">
            <table class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Prerequisite</th>
                  <th>Credit</th>
                  <th v-if="userRole === ROLES.ADMIN">Action</th>
                </tr>
              </thead>
              <tbody>
                <!-- Add required courses for Major Courses in Field of Specialization section here -->
                <tr v-for="course in getMajorCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.prerequisite }}</td>
                  <td>{{ course.credit }}</td>
                  <td>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="removeCourseToSection(sectionType, course.courseId)">Remove</button>
                    <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>Field of Specialization | Major Elective</h3>
        <h4>Minimum credit required: {{ programs.length > 0 ? programs[0].creditFosme : '' }}</h4>
        <div class="row">
          <div class="col-md-12">
            <table class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Prerequisite</th>
                  <th>Credit</th>
                  <th v-if="userRole === ROLES.ADMIN">Action</th>
                </tr>
              </thead>
              <tbody>
                <!-- Add major elective courses for Field of Specialization section here -->
                <tr v-for="course in getMajorElectiveCourses" :key="course.id">
                  <td>{{ course.courseId }}</td>
                  <td>{{ course.name }}</td>
                  <td>{{ course.prerequisite }}</td>
                  <td>{{ course.credit }}</td>
                  <td>
                    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="removeCourseToSection(sectionType, course.courseId)">Remove</button>
                    <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h3>Free Elective</h3>
        <h4>Minimum credit required: {{ programs.length > 0 ? programs[0].creditFe : '' }}</h4>
        <div class="row">
          <div class="col-md-12">
            <table class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Details</th>
                  <th v-if="userRole === ROLES.ADMIN">Action</th>
                </tr>
              </thead>
              <tbody>
                <!-- Add major elective courses for Field of Specialization section here -->
                <tr v-for="course in getFreeElective" :key="course.id">
                  <td>{{ course.freeElective }}</td>

                  <!-- <td v-for="course in getFreeElective" :key="course.id">
                  <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                      @click="deleteCourse(course.courseId)">Remove</button>
                    <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link> 
                  </td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm1">Add courses</button> |
    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm2">Set curriculum
      credit</button> |
    <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-success" @click="openForm3">Update Free Elective
    </button>
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
      showForm1: false,
      showForm2: false,
      showForm3: false,
      freeElective: '',
      selectedCourse: '', // Add this line to define selectedCourse in the data section
      courseType: '',
      credits: {
        creditGerclp: 0,
        creditGercic: 0,
        creditGercac: 0,
        creditGeec: 0,
        creditFoscc: 0,
        creditFosmcrc: 0,
        creditFosme: 0,
        creditFe:0,
        // Initialize other section credits to 0
      },
      activeAccordionIndices: [1], // Initially set the first accordion as active
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
    getLearnerPersonCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.gerclp || [];
    }, getInnovativeCoCreatorCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.gercic || [];
    }, getActiveCitizenCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.gercac || [];
    }, getElectiveCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.geec || [];
    }, getCoreCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.foscc || [];
    }, getMajorCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.fosmcrc || [];
    }, getMajorElectiveCourses() {
      return this.filteredPrograms.find(program => program.programId === this.selectedProgram)?.fosme || [];
    }, getFreeElective() {
      const selectedProgram = this.filteredPrograms.find(program => program.programId === this.selectedProgram);
      return selectedProgram && selectedProgram.freeElective ? [{ freeElective: selectedProgram.freeElective }] : [];
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
          this.programs = response.data; console.log('p', this.programs[0].gercac)
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
    // Inside your Vue component's methods:

    addCourseToSection(sectionType, course) {
      // Find the selected program in the filteredPrograms array
      const selectedProgram = this.filteredPrograms.find(program => program.programId === this.selectedProgram);
      // Check if the selected program exists and if the selected course is valid
      if (selectedProgram && course) {
        // Based on the sectionType, add the course to the corresponding section
        const courseData = { courseId: course };
        switch (sectionType) {
          case 'gerclp':
            selectedProgram.gerclp.push(courseData);
            break;
          case 'gercic':
            selectedProgram.gercic.push(courseData);
            break;
          case 'gercac':
            selectedProgram.gercac.push(courseData);
            break;
          case 'geec':
            selectedProgram.geec.push(courseData);
            break;
          case 'foscc':
            selectedProgram.foscc.push(courseData);
            break;
          case 'fosmcrc':
            selectedProgram.fosmcrc.push(courseData);
            break;
          case 'fosme':
            selectedProgram.fosme.push(courseData);
            break;
        }
        // Send the updated program data to the server using Axios
        apiClient.put('http://localhost:8080/addCourseToProgram', selectedProgram)
          .then(response => {
            // Handle the response if needed
            this.fetchData();
          })
          .catch(error => {
            console.error('Error updating program:', error);
          })
          .finally(() => {
            this.isSubmitting = false; // Reset the submission flag
            this.showForm1 = false;
            this.showForm3 = false;
            this.clearForm();
          });
      } else {
        console.error("Please select a valid program and course.");
      }
      this.clearForm();
      this.selectedCourse = null;
      this.courseType = '';
    },
    addFreeElectiveSection() {
      const selectedProgram = this.filteredPrograms.find(program => program.programId === this.selectedProgram);

      if (selectedProgram) {
        selectedProgram.freeElective = this.freeElective;


        // Send the updated program data to the server using Axios
        apiClient.put('http://localhost:8080/addCourseToProgram', selectedProgram)
          .then(response => {
            // Handle the response if needed
            this.fetchData();
          })
          .catch(error => {
            console.error('Error updating program:', error);
          })
          .finally(() => {
            this.isSubmitting = false; // Reset the submission flag
            this.showForm1 = false;
            this.showForm3 = false;
          });
      } else {
        console.error("Please select a valid program.");
      }

      this.clearForm();
    },

    removeCourseToSection(sectionType, course) {
      if (this.selectedProgram && course) {
        console.log(course);
        // Send the selected program ID and the course ID to the server using Axios
        apiClient
          .put(`http://localhost:8080/removeCourseFromProgram/${this.selectedProgram}/${course}`)
          .then(response => {
            // Handle the response if needed
            // Refresh the data or perform any other necessary actions
            this.fetchData();

          })
          .catch(error => {
            console.error('Error removing course from program:', error);
          });
      } else {
        console.error("Please select a valid program and course.");
      }
    }, updateProgramCredits() {
      // Send the credits object to the backend when updating the program
      const programId = this.selectedProgram; // Assuming you have the selected program ID
      apiClient
        .put(`http://localhost:8080/updateProgramCredits/${programId}`, this.credits)
        .then(response => {
          // Handle the response if needed
          // Refresh the data or perform any other necessary actions
          this.fetchData();
        })
        .catch(error => {
          console.error('Error updating program credits:', error);
        }).finally(() => {
          this.isSubmitting = false; // Reset the submission flag
          this.showForm2 = false;
          this.clearForm();
        });
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
      return false;
    },
    openForm1() {
      this.showForm1 = true;
    },
    openForm2() {
      this.showForm2 = true;
    },
    openForm3() {
      this.showForm3 = true;
    },
    cancelForm() {
      // Close the form without submitting
      this.showForm1 = false;
      this.showForm2 = false;
      this.showForm3 = false;
      this.clearForm();
      this.selectedCourse = null;
    },
    clearForm() {
      this.courseType = null;
      this.selectedCourse = null;
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
  background-color: #a890e0;
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
