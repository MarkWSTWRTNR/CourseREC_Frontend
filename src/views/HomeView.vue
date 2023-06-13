<template>
    <div>
      <p>{{ responseMessage }}</p>
    </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';


export default {
  data() {
    return {
      responseMessage: ''
    };
  },
  mounted() {
    this.testBackendConnection();
  },
  methods: {
    testBackendConnection() {
      axios.get('http://localhost:5000/test')
        .then(response => {
          console.log(response); // Add this line to log the response
          this.responseMessage = response.data;
        })
        .catch(error => {
          console.error('Error connecting to backend:', error);
        });
    }

  }
};
</script>
