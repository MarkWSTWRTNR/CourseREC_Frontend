<template>
  <div class="course-detail">
    <div class="course-info">
      <h2>{{ course.name }}</h2>
      <ul>
        <li><strong>Course ID:</strong> {{ course.courseId }}</li>
        <li><strong>Credit:</strong> {{ course.credit }}</li>
        <li><strong>Grading Type:</strong> {{ course.gradingtype }}</li>
        <li><strong>Course Prerequisite:</strong>
          <ul>
            <li v-for="prerequisite in course.prereq" :key="prerequisite.courseId">
              {{ prerequisite.courseId }} - {{ prerequisite.name }}
            </li>
          </ul>
        </li>
        <li><strong>Programs:</strong>
          <ul>
            <li v-for="program in course.groupCourses" :key="program.id">
              {{ program.programs.name }} ({{ program.groupName }})
            </li>
          </ul>
        </li>
        <li><strong>Description:</strong> {{ course.description }}</li>
      </ul>
    </div>

    <div class="comments-section">
      <h3>Comments</h3>
      <div class="comment-box" v-for="comment in course.comments" :key="comment.id">
        <div class="comment-header">
          <strong>{{ comment.user.username }}</strong>
          <button v-if="comment.user.username === cmuitaccount_name" type="button" class="btn btn-danger"
            @click="deleteComment(comment.id)">Delete</button>
        </div>
        <div class="comment-content">
          <p>{{ comment.comment }}</p>
        </div>
        <div class="comment-rating star-filled">
          <span v-html="generateStarIcons(comment.ratingScore)"></span>
        </div>
      </div>

      <div class="add-comment">
        <h3>Add Comment</h3>
        <textarea v-model="newCommentText" placeholder="Write your comment..."></textarea>
        <div class="rating-input">
          <label for="rating">Rating:</label>
          <input type="number" id="rating" v-model="newRating" min="1" max="5" />
        </div>
        <button type="button" class="btn btn-primary" @click="addComment">Add Comment</button>
      </div>
    </div>
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
      newCommentText: '',
      newRating: 0
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
      const confirmDelete = confirm("Are you sure you want to delete this comment?");
      if (!confirmDelete) {
        return;
      }
      axios.delete(`http://localhost:8080/users/${this.cmuitaccount_name}/comments/${commentId}`)
        .then(response => {
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
          course: { courseId: this.course.courseId }, // Set the course property
          ratingScore: this.newRating,
        };

        axios.post(`http://localhost:8080/users/${this.cmuitaccount_name}/comments`, newComment)
          .then(response => {
            const savedComment = response.data;
            this.course.comments.push(savedComment);
            this.newCommentText = ''; // Clear the input
            this.newRating = 1;
          })
          .catch(error => {
            alert('You has already commented on this course');
          });
      }
    },
    generateStarIcons(ratingScore) {
      const starIcons = [];
      for (let i = 1; i <= 5; i++) {
        if (i <= ratingScore) {
          starIcons.push('<i class="fas fa-star "></i>');
        } else {
          starIcons.push('<i class="far fa-star "></i>');
        }
      }
      return starIcons.join('');
    }
  }
};
</script>
<style lang="scss" scoped>
.course-detail {
  padding: 200px 20px; // Added horizontal padding for better spacing on smaller screens
  max-width: 800px; // Limit the width for better readability
  margin: 0 auto; // Center the content

  h2 {
    font-size: 2em;
    margin-bottom: 20px;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin-bottom: 10px;
    }
  }
}

.comments-section {
  margin-top: 50px;

  .comment-box {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f9f9f9; // Light background for better separation

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .comment-content {
      margin-top: 5px;
    }
  }

  .add-comment {
    margin-top: 20px;

    textarea {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      resize: vertical; // Allow vertical resizing
    }

    .rating-input {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      label {
        margin-right: 10px;
      }
    }
  }
}

.star-filled {
  color: gold;
}
</style>