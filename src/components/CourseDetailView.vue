<template>
  <div class="container">
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
    <h3>Comments</h3>
    <div class="comment-box" v-for="comment in course.comments" :key="comment.id">
      <div class="comment-header">
        <strong>{{ comment.user.username }}</strong>
        <button v-if="comment.user.username === cmuitaccount_name" type="button" class="btn btn-danger" @click="deleteComment(comment.id)">Delete</button>
      </div>
      <div class="comment-content">
        {{ comment.comment }}
      </div>
    </div>
      <h3>Add Comment</h3>
      <textarea v-model="newCommentText"></textarea>
      <button  type="button" class="btn btn-primary" @click="addComment">Add Comment</button>
  
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  name: 'CourseDetail',
  data() {
    return {
      course: {
        comments: []
      },
      cmuitaccount_name: '',
    };
  },
  mounted() {
    const courseId = this.$route.params.courseId;
    this.fetchCourse(courseId);
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      this.cmuitaccount_name = userInfo.cmuitaccount_name;
    }
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
    },
    deleteComment(commentId) {
      axios.delete(`http://localhost:8080/users/${this.cmuitaccount_name}/comments/${commentId}`)
        .then(response => {
          // Remove the deleted comment from the UI
          this.course.comments = this.course.comments.filter(comment => comment.id !== commentId);
        })
        .catch(error => {
          console.log(error);
        });
    },
    addComment() {
      if (this.newCommentText) {
        const newComment = {
          comment: this.newCommentText,
          course: { courseId: this.course.courseId } // Set the course property
        };

        axios.post(`http://localhost:8080/users/${this.cmuitaccount_name}/comments`, newComment)
          .then(response => {
            const savedComment = response.data;
            this.course.comments.push(savedComment);
            this.newCommentText = ''; // Clear the input
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>

<style scoped>
.comment-box {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-content {
  margin-top: 5px;
}
</style>