<template>
  <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm">Add courses</button>
  <div v-for="(item, index) in item1" :key="index">
    <div @click="toggleAccordion(1, index)" :class="{ 'accordion': true, 'active': isActive(1, index) }">
      <h3>{{ item.title }}</h3>
      <i class="fa fa-chevron-down" :class="{ 'fa-rotate-180': isActive(1, index) }"></i>
    </div >
    <div v-show="isActive(1, index)" class="content">
      <div v-for="semester in semester" :key="semester.name">
        <h5>{{ semester.name }}</h5>
        <div class="row">
          <div class="col-md-12">
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
                <tr v-for="record in records" :key="record.course_id">
                  <td>{{ record.course_id }}</td>
                  <td>{{ record.coursename }}</td>
                  <td>{{ record.credit }}
                    <!-- <select name="" id="">
                      <option value="">-- Select Grade --</option>
                      <option value="A"> A </option>
                      <option value="B+"> B+</option>
                      <option value="B">B</option>
                      <option value="C+">C+</option>
                      <option value="C">C</option>
                      <option value="D+">D+</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select> -->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { userRole, ROLES } from '@/service/roles';
export default {
  name: 'finishedCourse',
  data() {
    return {
      item1: [
        {
          title: 'Year 1',
        },
      ],
      semester: [
        {
          name: 'Semester 1'
        }
      ],
      userRole: userRole,
      ROLES: ROLES,
      selectedGrade: "",
      grades: [],
      records: [],
      activeAccordionIndices1: []
    };
  },
  methods: {
    fetchCourses() {
      axios.get('http://localhost:5000/api/courses')
        .then(response => {
          this.records = response.data.map(course => ({
            course_id: course.course_id,
            coursename: course.coursename,
            credit: course.credit,
            gradingtype: course.gradingtype,
            prereq: course.prereq.map(prerequisite => ({
              course_id: prerequisite.course_id,
              coursename: prerequisite.coursename
            })),
            description: course.description,
            label: `${course.course_id} - ${course.coursename}`
          }));
        })
        .catch(error => {
          console.log(error);
        });
    },
    addGrade() {
      if (this.selectedGrade) {
        this.grades.push(this.selectedGrade);
        this.selectedGrade = "";
      }
    },
    calculateGPA() {
      const gradePoints = {
        A: 4.0,
        "B+": 3.5,
        B: 3.0,
        "C+": 2.5,
        C: 2.0,
        "D+": 1.5,
        D: 1.0,
        F: 0.0,
      };

      let totalCredits = this.grades.length;
      let totalPoints = 0;

      this.grades.forEach((grade) => {
        totalPoints += gradePoints[grade];
      });

      return (totalPoints / totalCredits).toFixed(2);
    },
    toggleAccordion(accordionNumber, index) {
      if (accordionNumber === 1) {
        const isActive = this.isActive(1, index);
        if (isActive) {
          this.activeAccordionIndices1 = this.activeAccordionIndices1.filter(i => i !== index);
        } else {
          this.activeAccordionIndices1.push(index);
        }
      }
    }, isActive(accordionNumber, index) {
      if (accordionNumber === 1) {
        return this.activeAccordionIndices1 && this.activeAccordionIndices1.includes(index);
      }
      return false;
    },
  },

};
</script>
  
<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 16px;
}

label {
  font-weight: bold;
}

select {
  margin-right: 8px;
}

button {
  margin-top: 8px;
}

ul {
  margin-top: 8px;
}

li {
  margin-bottom: 4px;
}
</style>
  