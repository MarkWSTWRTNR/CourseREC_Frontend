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
      const tokenEndpoint = 'https://oauth.cmu.ac.th/v1/GetToken.aspx';
      const clientSecret = 'MjNmwQjEV4xf3GQBjVG52mpDjCRyUvSX08ngWR5S';
      const clientId = '09924PuMCdFKpWXhwqfZsy1rw8Xhx94d51bBCJzh';
      const redirectUri = 'http://localhost:3000/student_info';

      try {
        const response = await axios.post(tokenEndpoint, {
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code'
        });
        if (response.data.error) {
          console.error('OAuth provider error:', response.data.error_description);
          return;
        }
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
