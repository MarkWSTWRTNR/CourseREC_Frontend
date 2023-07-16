<!-- ต้องใส่ faculty กับ programs ไหม เพราะว่าตอน Reccomend course มันต้องlink กันรึป่าว -->
<template>
  <h3>Select Faculty:</h3>
  <select v-model="selectedFaculty">
    <option value="">-- Select Faculty --</option>
    <option v-for="faculty in faculties" :value="faculty.facultyId" :key="faculty.facultyId">
      {{ faculty.name }}
    </option>
  </select>
  <h3 v-if="selectedFaculty">Select Program:</h3>
  <select v-if="selectedFaculty" v-model="selectedProgram">
    <option value="">-- Select Program --</option>
    <option v-for="program in programs" :value="program.programId" :key="program.programId">
      {{ program.name }}
    </option>
  </select>

  <div v-if="selectedProgram">
    <div v-for="(item, index) in items1" :key="index">
      <div @click="toggleAccordion(1, index)" :class="{ 'accordion': true, 'active': isActive(1, index) }">
        <h3>{{ item.title }}</h3>
        <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(1, index) }"></i>
      </div>

      <div v-show="isActive(1, index)" class="content">
      </div>


      <div v-for="semester in semesters" :key="semester">
        <h2>{{ semester }}</h2>
        <div class="result-table">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Credit</th>
                <th>Select Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in getCoursesBySemester(semester)" :key="record.id">
                <td> <select name="" id="">
                    <option value="">-- Select Course --</option>
                  </select></td>
                <td>{{ record.credit }}</td>
                <td>
                  <select v-model="record.selectedGrade">
                    <option value="">-- Select Grade --</option>
                    <option v-for="grade in grades" :value="grade">{{ grade }}</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
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
      items1: [
        {
          title: 'Academic Result',
        },
      ],
      items2: [
        { title: 'GPA Prediction' },
      ],
      faculties: [],
      programs: [],
      selectedFaculty: '',
      selectedProgram: '',
      activeIndices: [],
      activeAccordionIndices1: [], // Initialize with an empty array
      activeAccordionIndices2: [], // Initialize with an empty array
      semesters: ['Semester 1', 'Semester 2', 'Semester 3'], // Add your semester data here
      grades: ['A', 'B', 'C', 'D', 'F'], // Add your grade options here
    }
  },
  methods: {
    async fetchFacultiesAndPrograms() {
      try {
        const facultiesResponse = await axios.get('http://localhost:8080/facultys');
        this.faculties = facultiesResponse.data;
        console.log(this.faculties);

        if (this.selectedFaculty) {
          const programsResponse = await axios.get('http://localhost:8080/programs', {
            params: {
              facultyId: this.selectedFaculty,
            },
          });
          this.programs = programsResponse.data;
          console.log(this.programs);
        }
      } catch (error) {
        console.error(error);
      }
    },
    toggleAccordion(accordionNumber, index) {
      if (accordionNumber === 1) {
        const isActive = this.isActive(1, index);
        if (isActive) {
          this.activeAccordionIndices1 = this.activeAccordionIndices1.filter(i => i !== index);
        } else {
          this.activeAccordionIndices1.push(index);
        }
      } else if (accordionNumber === 2) {
        const isActive = this.isActive(2, index);
        if (isActive) {
          this.activeAccordionIndices2 = this.activeAccordionIndices2.filter(i => i !== index);
        } else {
          this.activeAccordionIndices2.push(index);
        }
      }
    },
    isActive(accordionNumber, index) {
      if (accordionNumber === 1) {
        return this.activeAccordionIndices1 && this.activeAccordionIndices1.includes(index);
      } else if (accordionNumber === 2) {
        return this.activeAccordionIndices2 && this.activeAccordionIndices2.includes(index);
      }
      return false;
    }
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

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
}

h2 {
  margin-top: 30px;
}

.result-table {
  margin-top: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.gpa-prediction {
  margin-top: 30px;
}

.predicted-gpa {
  font-weight: bold;
}
</style>
