<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content container">
        <h2 class="title">General Study Guide Recommendation by ChatGPT</h2>
        <button class="btn" @click="getRecommendation">Get General Study Guide Recommendation</button>

        <!-- Loading State -->
        <div v-if="loading" class="loading-text">Loading...</div>

        <!-- Display Finished Courses -->
        <div v-if="finishedCourses && !loading" class="finished-courses">
          <h3 class="subtitle">Your Finished Courses:</h3>
          <ul>
            <li v-for="course in finishedCourses" :key="course" class="course-item">{{ course }}</li>
          </ul>
        </div>

        <!-- Display Recommendation -->
        <div v-if="recommendation && !loading" class="recommendation">
          <h3 class="subtitle">Recommendation:</h3>
          <p>{{ recommendation }}</p>
        </div>
      </div>
    </section>
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

<style lang="scss" scoped>
.home {
  padding-top: 150px;
}

.hero {
  position: relative;
  z-index: 1;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.btn {
  background-color: #17A2B8;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #138496;
}

.loading-text {
  font-size: 18px;
  margin-top: 20px;
}

.finished-courses {
  margin-top: 20px;
}

.subtitle {
  font-size: 20px;
  margin-bottom: 10px;
}

.course-item {
  font-size: 16px;
  margin-bottom: 5px;
}

.recommendation {
  margin-top: 20px;
}
</style>
