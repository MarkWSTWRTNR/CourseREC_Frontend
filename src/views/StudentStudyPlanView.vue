<template>
    <div>
    
      <h1>Add Course</h1>
      <form @submit="addCourse">
        <select v-model="categoryId" required>
          <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
        </select>
        <input type="text" v-model="courseID" placeholder="Course ID" required>
        <button type="submit">Add</button>
      </form>
  
      <h1>Categories</h1>
      <ul>
        <li v-for="category in categories" :key="category.id">
          {{ category.name }}
          <ul>
            <li v-for="course in category.courses" :key="course.id">
              {{ course.name }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        categoryName: '',
        categoryId: '',
        courseID: '',
        categories: []
      };
    },
    mounted() {
      this.fetchCategories();
    },
    methods: {
      fetchCategories() {
       //ใส่พวก axios.get('/categories').then(response => this.categories = response.data)
      },
      createCategory() {
        axios.post('/create_category', { category_name: this.categoryName })
          .then(response => {
            console.log(response.data.message);
            this.fetchCategories();
            this.categoryName = '';
          })
          .catch(error => console.error(error));
      },
      addCourse() {
        axios.post('/add_course_to_curriculum', { category_id: this.categoryId, course_name: this.courseID })
          .then(response => {
            console.log(response.data.message);
            this.fetchCategories();
            this.categoryId = '';
            this.courseID = '';
          })
          .catch(error => console.error(error));
      }
    }
  }
  </script>
  