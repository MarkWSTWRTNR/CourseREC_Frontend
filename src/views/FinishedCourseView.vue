<template>
    <div>
      <h1>Grade Calculator</h1>
      <div>
        <label for="grade">Grade:</label>
        <select id="grade" v-model="selectedGrade">
          <option value="">Select Grade</option>
          <option value="A">A</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="C+">C+</option>
          <option value="C">C</option>
          <option value="D+">D+</option>
          <option value="D">D</option>
          <option value="F">F</option>
        </select>
        <button @click="addGrade">Add Grade</button>
      </div>
      <div v-if="grades.length > 0">
        <h2>Grades:</h2>
        <ul>
          <li v-for="(grade, index) in grades" :key="index">{{ grade }}</li>
        </ul>
        <h2>GPA: {{ calculateGPA() }}</h2>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedGrade: "",
        grades: [],
      };
    },
    methods: {
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
  