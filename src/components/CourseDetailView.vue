<template>
  <div>
    <h2>{{ course.name }}</h2>
    <p><strong>Course ID:</strong> {{ course.courseId }}</p>
    <p><strong>Credit:</strong> {{ course.credit }}</p>
    <p><strong>Grading Type:</strong> {{ course.gradingtype }}</p>
    <p><strong>Course Prerequisite:</strong>
      <li v-for="prerequisite in course.prereq" :key="prerequisite.courseId">
        {{ prerequisite.courseId }} - {{ prerequisite.name }}
      </li>
    <p><strong>Programs:</strong>
      <li v-for="program in course.groupCourses" :key="program.id">
        {{ program.programs.name }} ({{ program.programs.programId }})
      </li>
    </p>
    </p>
    <p><strong>Description:</strong> {{ course.description }}</p>
  </div>
  <p><strong></strong></p>
</template>
  
<script>
import axios from 'axios';

export default {
  name: 'CourseDetail',
  data() {
    return {
      course: {}
    };
  },
  mounted() {
    const courseId = this.$route.params.courseId;
    this.fetchCourse(courseId);
  },
  methods: {
    fetchCourse(courseId) {
      axios.get(`http://localhost:8080/courseByCourseId/${courseId}`)
        .then(response => {
          this.course = response.data;
          console.log(this.course);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
  