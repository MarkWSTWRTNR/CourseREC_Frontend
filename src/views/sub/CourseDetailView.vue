<template>
    <div>
      <h2>{{ course.coursename }}</h2>
      <p><strong>Course ID:</strong> {{ course.course_id }}</p>
      <p><strong>Credit:</strong> {{ course.credit }}</p>
      <p><strong>Grading Type:</strong> {{ course.gradingtype }}</p>
      <p><strong>Course Prerequisite:</strong> {{ course.prereq }}</p>
      <p><strong>Description:</strong> {{ course.description }}</p>
    </div>
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
      const courseId = this.$route.params.course_id;
      this.fetchCourse(courseId);
    },
    methods: {
      fetchCourse(courseId) {
        axios.get(`http://localhost:5000/api/courses/${courseId}`)
          .then(response => {
            this.course = response.data;
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };
  </script>
  