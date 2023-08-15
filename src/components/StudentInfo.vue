<template>
  <div>
    <button @click="authorize">Authorize</button>
    <div v-if="studentInfo">
      <h2>Student Info</h2>
      <pre>{{ studentInfo }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      studentInfo: null
    };
  },
  methods: {
    async authorize() {
      const authUrl = 'https://oauth.cmu.ac.th/v1/Authorize.aspx';
      const clientId = '09924PuMCdFKpWXhwqfZsy1rw8Xhx94d51bBCJzh';
      const redirectUri = 'http://localhost:3000/student_info';
      const responseType = 'code';
      const scope = 'cmuitaccount.basicinfo';

      window.location.href = `${authUrl}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    },
    async fetchStudentInfo(code) {
      try {
        const response = await axios.post(`http://localhost:8080/api/auth/exchange?code=${code}`);
        const accessToken = response.data.access_token;
        this.studentInfo = await this.getStudentData(accessToken);
      } catch (error) {
        console.error('Error fetching token or student data:', error);
      }
    },
    async getStudentData(accessToken) {
      const dataEndpoint = 'https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo';
      try {
        const response = await axios.get(dataEndpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      this.fetchStudentInfo(code);
      console.log(code)
    }
  }
};
</script>
