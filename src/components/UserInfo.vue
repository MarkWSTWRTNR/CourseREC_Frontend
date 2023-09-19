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
                    <p class="white"><strong>Name (Thai):</strong> {{ userInfo.firstname_TH }} {{ userInfo.lastname_TH }}
                    </p>
                    <p class="white"><strong>Name (English):</strong> {{ userInfo.firstname_EN }} {{ userInfo.lastname_EN }}
                    </p>
                    <p class="white"><strong>Organization Name:</strong> {{ userInfo.organization_name_TH }}</p>
                    <p class="white"><strong>Organization Name:</strong> {{ userInfo.organization_name_EN }}</p>
                    <div v-if="userProgram">
                        <p class="white"><strong>Program Name:</strong> {{ userProgram.name }}</p>
                    </div>
                </div>
            </div>
        </div>
        <h2>Set User to Program</h2>
        <h3 class="white">Select Faculty:</h3>
        <select v-model="selectedFaculty" class="form-control">
            <option value="">-- Select Faculty --</option>
            <option v-for="faculty in faculties" :value="faculty.name" :key="faculty.facultyId">
                {{ faculty.name }}
            </option>
        </select>

        <h3 v-if="selectedFaculty" class="white">Select Program:</h3>
        <select v-if="selectedFaculty" v-model="selectedProgram" class="form-control">
            <option value="">-- Select Program --</option>
            <option v-for="program in filteredPrograms" :value="program.programId" :key="program.programId">
                {{ program.name }}
            </option>
        </select>

        <button @click="setUserToProgram(selectedProgram)" class="btn btn-primary">Set User to Program</button>

        <pre>
        <!-- {{ userInfo }} -->
    </pre>
    </div>
</template>
  
<script>
import apiClient from '@/service/AxiosClient';
import LoginService from '@/service/LoginService'
import { userRole, ROLES } from '@/service/roles';
export default {
    name: 'UserInfo',
    data() {
        return {
            loading: true,
            userInfo: {},
            cmuitaccount_name: '',
            faculties: [],
            programs: [],
            selectedFaculty: '',
            selectedProgram: '',
            userProgram: null,
        }
    },
    computed: {
        filteredPrograms() {
            if (this.selectedFaculty) {
                const filteredPrograms = this.programs.filter(program => program.faculty && program.faculty.name === this.selectedFaculty);
                console.log("Filtered programs:", filteredPrograms);
                console.log("sf", this.selectedFaculty);
                return filteredPrograms;
            }
            return [];
        },
    }, mounted() {

        const storedUserInfo = localStorage.getItem('userInfo');
        const accessToken = localStorage.getItem('access_token');
        if (storedUserInfo) {
            const userInfo = JSON.parse(storedUserInfo);
            this.cmuitaccount_name = userInfo.cmuitaccount_name; // Store cmuitaccount_name as a data property
            this.fetchData();
        } else {
            // Handle other cases or leave as is
        }
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
    },
    methods: {
        fetchData() {
            apiClient
                .get('http://localhost:8080/facultys')
                .then(response => {
                    this.faculties = response.data;
                    console.log('f', this.faculties)
                })

                .catch(error => {
                    console.log('Error fetching faculties:', error);
                });

            apiClient
                .get('http://localhost:8080/programs')
                .then(response => {
                    this.programs = response.data; console.log('p', this.programs)
                })
                .catch(error => {
                    console.log('Error fetching programs:', error);
                });
            apiClient
                .get(`http://localhost:8080/users/${this.cmuitaccount_name}`).then((response) => {
                    this.userProgram = response.data.programs;
                })
                .catch((error) => {
                    console.error('Error fetching user program:', error);
                });
        },
        setUserToProgram(selectedProgramId) {
            // Create an object with the selected programId
            const program = {
                programId: selectedProgramId,
            };
            // Make an HTTP POST request to set the program
            apiClient.post(`http://localhost:8080/users/${this.cmuitaccount_name}/set-program`, program)
                .then((response) => {
                    this.fetchData();
                    console.log('Program set successfully', response.data);
                })
                .catch((error) => {
                    alert("Something went wrong");
                });
        },
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
                }).finally(() => {
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

}
</script>
