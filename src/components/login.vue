<template>
  <div class="home">
    <button @click="login">Login with CMU OAuth</button>
  </div>
</template>

<script>
import LoginService from '@/service/LoginService'
export default {
  name: 'login',
  data() {
    return {
      searchQuery: '',
      accessToken: null,
      userInfo: null
    }
  },
  methods: {
    login() {
      LoginService.login().then((response) => {
        window.location.href = response.data
      })
    }
  }
}
</script>
