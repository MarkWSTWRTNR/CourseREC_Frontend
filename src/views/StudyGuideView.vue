<!-- StudyGuide.vue -->
<template>
    <div class="container">
    <div>
      <h2>Study Guide Recommendations by ChatGPT</h2>
      <button @click="getRecommendation">Get Study Guide Recommendation</button>
      
      <!-- Loading State -->
      <div v-if="loading">Loading...</div>
      
      <!-- Display Recommendation -->
      <p v-if="recommendation && !loading">{{ recommendation }}</p>
    </div></div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        recommendation: '',
        loading: false
      };
    },
    methods: {
      async getRecommendation() {
        // Clear old recommendation
        this.recommendation = '';
        localStorage.removeItem('studyGuideRecommendation');
  
        this.loading = true; // Set loading state to true
        try {
          const response = await axios.get('http://localhost:8080/bot/chat');
          this.recommendation = response.data;
          // Save the new recommendation to localStorage
          localStorage.setItem('studyGuideRecommendation', this.recommendation);
        } catch (error) {
          console.error('Error fetching recommendation:', error);
        } finally {
          this.loading = false; // Set loading state back to false
        }
      }
    },
    mounted() {
      // Load recommendation from localStorage when the component is mounted
      const storedRecommendation = localStorage.getItem('studyGuideRecommendation');
      if (storedRecommendation) {
        this.recommendation = storedRecommendation;
      }
    }
  };
  </script>
  