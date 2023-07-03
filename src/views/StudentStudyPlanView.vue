<template>
  <div class="container">
    <h1>Academic Result</h1>

    <div v-for="semester in semesters" :key="semester">
      <h2>{{ semester }}</h2>
      <div class="result-table">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Credit</th>
              <th>Grade</th>
              <th>Select Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in getCoursesBySemester(semester)" :key="course.id">
              <td>{{ course.name }}</td>
              <td>{{ course.credit }}</td>
              <td>{{ course.grade }}</td>
              <td>
                <select v-model="course.selectedGrade">
                  <option value="">-- Select Grade --</option>
                  <option v-for="grade in grades" :value="grade">{{ grade }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="gpa-prediction">
      <h2>GPA Prediction</h2>
      <p>Your predicted GPA for the next semester is <span class="predicted-gpa">{{ predictedGPA }}</span>.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    
  },
}
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

th, td {
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
