<template>
    <div>
        <div v-if="loading">
            Loading user info...
        </div>
        <div v-if="userInfo">
            <h2>User Info</h2>
            <pre>{{ userInfo }}</pre>
        </div>
    </div>
</template>
  
<script>
import LoginService from '@/service/LoginService'

export default {
    name: 'UserInfo',
    data() {
        return {
            loading: true,
            userInfo: null
        }
    }, 
    methods: {
        async handleRedirectWithCode(code) {
            try {
                // Exchange the authorization code for an access token
                const response = await LoginService.getAccessToken({ code: code });
                const accessToken = response.data.access_token
                localStorage.setItem('access_token', accessToken)

                // Fetch user info using the access token
                this.fetchUserInfo(accessToken)
            } catch (error) {
                console.error("Error fetching access token or user info:", error)
            }
        },
        async fetchUserInfo(accessToken) {
            try {
                const response = await LoginService.fetchUserInfo(accessToken)
                this.userInfo = response.data
                localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
                this.loading = false
            } catch (error) {
                console.error("Error fetching user info:", error)
                this.loading = false
            }
        }
    },
    mounted() {
        const storedUserInfo = localStorage.getItem('userInfo')
        if (storedUserInfo) {
            this.userInfo = JSON.parse(storedUserInfo)
            this.loading = false
        } else {
            // If the user is redirected back to this component with a code in the URL, handle it
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            console.log("Authorization Code:", code);

            if (code) {
                this.handleRedirectWithCode(code)
            } else {
                this.loading = false
            }
        }
    }
}

</script>
  