<template>
    <div class="container">
        <div>
            <div v-if="loading">
                Loading user info...
            </div>
            <div v-else>
                <h2>User Information</h2>
                <div>
                    <p class="white"><strong>Cmuitaccount Name:</strong> {{ userInfo.cmuitaccount_name }}</p>
                    <p class="white"><strong>CMU IT Account:</strong> {{ userInfo.cmuitaccount }}</p>
                    <p class="white"><strong>Student ID:</strong> {{ userInfo.student_id }}</p>
                    <p class="white"><strong>Name (Thai):</strong> {{ userInfo.firstname_TH }} {{ userInfo.lastname_TH }}</p>
                    <p class="white"><strong>Name (English):</strong> {{ userInfo.firstname_EN }} {{ userInfo.lastname_EN }}</p>
                    <p class="white"><strong>Organization Name:</strong> {{ userInfo.organization_name_TH }}</p>
                    <p class="white"><strong>Organization Name:</strong> {{ userInfo.organization_name_EN }}</p>
                </div>
            </div>
        </div>
        <pre>
        <!-- {{ userInfo }} -->
    </pre>
    </div>
    
</template>
  
<script>
import LoginService from '@/service/LoginService'
import { userRole, ROLES } from '@/service/roles';
export default {
    name: 'UserInfo',
    data() {
        return {
            loading: true,
            userInfo: {}
        }
    },

    methods: {
        handleRedirectWithCode(code) {
            // Exchange the authorization code for an access token
            LoginService.getAccessToken({ code: code })
                .then((response) => {
                    const accessToken = response.data.access_token;
                    localStorage.setItem('access_token', accessToken);

                    // Fetch user info using the access token
                    this.fetchUserInfo(accessToken);
                })
                .catch((error) => {
                    console.error("Error fetching access token:", error);
                }).finally(()=>{
                    window.location.reload()
                });
        },
        fetchUserInfo(accessToken) {
            // Fetch user info using the access token
            LoginService.fetchUserInfo(accessToken)
                .then((response) => {
                    const userData = response.data; // Extract user data from the response
                    this.userInfo = userData.userInfo; // Update userInfo with user data
                    userRole.value = userData.role;
                    console.log(userRole.value)
                    console.log("cmuitaccount", this.userInfo.cmuitaccount);
                    this.loading = false;

                    // Store user info in localStorage
                    localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
                })
                .catch((error) => {
                    console.error("Error fetching user info:", error);
                    this.loading = false;
                });
        }
    },
    mounted() {
        const storedUserInfo = localStorage.getItem('userInfo');
        const accessToken = localStorage.getItem('access_token');
        
        if (storedUserInfo) {
            this.userInfo = JSON.parse(storedUserInfo);
            this.loading = false;
        }
        
        if (accessToken) {
            this.fetchUserInfo(accessToken);
        } else {
            // If the user is redirected back to this component with a code in the URL, handle it
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            console.log("Authorization Code:", code);

            if (code) {
                this.handleRedirectWithCode(code);
            } else {
                this.loading = false;
            }
        }
    }
}
</script>
