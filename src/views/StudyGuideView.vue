<template>
  <div class="container">
    <h2>Study Guide Recommendations by ChatGPT</h2>
    <button class="btn btn-info" @click="getRecommendation">Get Study Guide Recommendation</button>

    <!-- Loading State -->
    <div v-if="loading">Loading...</div>

    <!-- Display Finished Courses -->
    <div v-if="finishedCourses && !loading">
      <h3>Finished Courses:</h3>
      <ul>
        <li v-for="course in finishedCourses" :key="course">{{ course }}</li>
      </ul>
    </div>

    <!-- Display Recommendation -->
    <div v-if="recommendation && !loading">
      <h3>Recommendation:</h3>
      <p>{{ recommendation }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      recommendation: '',
      finishedCourses: [],
      loading: false,
      cmuitaccount_name: '',
    };
  },
  methods: {
    async getRecommendation() {
      this.recommendation = '';
      this.finishedCourses = [];
      localStorage.removeItem('studyGuideData');

      this.loading = true;
      try {
        const response = await axios.get(`http://localhost:8080/bot/${this.cmuitaccount_name}/chat`);
        this.recommendation = response.data.recommendation;
        this.finishedCourses = response.data.finishedCourses;

        // Save the data to localStorage
        localStorage.setItem('studyGuideData', JSON.stringify({
          recommendation: this.recommendation,
          finishedCourses: this.finishedCourses
        }));
      } catch (error) {
        console.error('Error fetching recommendation:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    // Load data from localStorage when the component is mounted
    const storedData = localStorage.getItem('studyGuideData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.recommendation = parsedData.recommendation;
      this.finishedCourses = parsedData.finishedCourses;
    }
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      this.cmuitaccount_name = userInfo.cmuitaccount_name; // Store cmuitaccount_name as a data property
    } else {
      // Handle other cases or leave as is
    }
  }
};
</script>
