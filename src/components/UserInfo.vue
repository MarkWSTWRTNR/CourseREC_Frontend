<template>
    <div class="home container">
        <div v-if="loading" class="loading-message">
            Loading user info...
        </div>
        <div v-else>
            <h2>Set User to Program</h2>
            <div v-if="isStudent" class="program-select">
                <div class="form-group">
                    <label for="facultySelect">Select Faculty:</label>
                    <select v-model="selectedFaculty" class="form-control" id="facultySelect">
                        <option value="">-- Select Faculty --</option>
                        <option v-for="faculty in faculties" :value="faculty.name" :key="faculty.facultyId">
                            {{ faculty.name }}
                        </option>
                    </select>
                </div>

                <div v-if="selectedFaculty" class="form-group">
                    <label for="programSelect">Select Program:</label>
                    <select v-model="selectedProgram" class="form-control" id="programSelect">
                        <option value="">-- Select Program --</option>
                        <option v-for="program in filteredPrograms" :value="program.programId" :key="program.programId">
                            {{ program.name }}
                        </option>
                    </select>
                </div>

                <button @click="setUserToProgram(selectedProgram)" class="btn btn-primary mt-3">Assign Program</button>
                <div v-if="feedbackMessage" :class="feedbackClass" class="feedback mt-2">{{ feedbackMessage }}</div>
            </div>
            <div class="user-info mt-5">
                <h2>User Information</h2>
                <div class="info-list">

                    <div>
                        <p class="white"><strong>Cmuitaccount Name:</strong> {{ userInfo.cmuitaccount_name }}</p>
                        <p class="white"><strong>CMU IT Account:</strong> {{ userInfo.cmuitaccount }}</p>
                        <p class="white"><strong>Student ID:</strong> {{ userInfo.student_id }}</p>
                        <p class="white"><strong>Name (Thai):</strong> {{ userInfo.firstname_TH }} {{ userInfo.lastname_TH
                        }}
                        </p>
                        <p class="white"><strong>Name (English):</strong> {{ userInfo.firstname_EN }} {{
                            userInfo.lastname_EN }}
                        </p>
                        <p class="white"><strong>Organization Name:</strong> {{ userInfo.organization_name_TH }}</p>
                        <p class="white"><strong>Organization Name:</strong> {{ userInfo.organization_name_EN }}</p>
                        <div v-if="userProgram">
                            <p class="white"><strong>Program Name:</strong> {{ userProgram.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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
            feedbackMessage: '', feedbackType: '',
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
        }, isAdmin() {
            return userRole.value === ROLES.ROLE_ADMIN;
        },
        isStudent() {
            return userRole.value === ROLES.ROLE_STUDENT;
        },
        isLoggedIn() {
            return !!this.accessToken;
        },
        isEitherAdminOrStudent() {
            return this.isAdmin || this.isStudent;
        }, feedbackClass() {
            return {
                'feedback-success': this.feedbackType === 'success',
                'feedback-error': this.feedbackType === 'error'
            };
        }
    }, watch: {
        cmuitaccount_name(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.fetchData();
            }
        }
    },
    async mounted() {
        const storedUserInfo = localStorage.getItem('userInfo');
        const accessToken = localStorage.getItem('access_token');
        if (storedUserInfo) {
            this.userInfo = JSON.parse(storedUserInfo);
            this.cmuitaccount_name = this.userInfo.cmuitaccount_name;
            this.loading = false;
        }

        if (accessToken) {
            await this.fetchUserInfo(accessToken);
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (code) {
                await this.handleRedirectWithCode(code);
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
            const program = {
                programId: selectedProgramId,
            };
            apiClient.post(`http://localhost:8080/users/${this.cmuitaccount_name}/set-program`, program)
                .then((response) => {
                    this.fetchData();
                    this.feedbackMessage = 'Program assigned successfully!';
                    this.feedbackType = 'success'; // Set feedback type to success
                })
                .catch((error) => {
                    this.feedbackMessage = 'Error assigning program. Please try again.';
                    this.feedbackType = 'error'; // Set feedback type to error
                });
        },
        async handleRedirectWithCode(code) {
            try {
                const response = await LoginService.getAccessToken({ code: code });
                const accessToken = response.data.access_token;
                localStorage.setItem('access_token', accessToken);
                await this.fetchUserInfo(accessToken);
            } catch (error) {
                console.error("Error fetching access token:", error);
            } finally {
                window.location.reload();
            }
        }
        ,
        async fetchUserInfo(accessToken) {
            // Fetch user info using the access token
            try {
                const response = await LoginService.fetchUserInfo(accessToken);
                const userData = response.data; // Extract user data from the response
                this.userInfo = userData.userInfo; // Update userInfo with user data
                userRole.value = userData.role;
                console.log(userRole.value);
                console.log("cmuitaccount", this.userInfo.cmuitaccount);
                this.loading = false;

                // Store user info in localStorage
                localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
            } catch (error) {
                console.error("Error fetching user info:", error);
                this.loading = false;
            }
        }
    },

}
</script>
<style lang="scss" scoped>
.home {
    padding-top: 150px; // Adjust as needed
    max-width: 800px; // Limit the width for readability
    margin: 0 auto; // Center the content
}

.loading-message {
    text-align: center;
    font-size: 1.5em;
    margin-bottom: 50px;
}

.program-select {
    background-color: #f7f7f7; // A light background to distinguish the section
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 20px;
}

.user-info {
    .info-list {
        background-color: #f7f7f7;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}

.feedback-success {
    color: rgb(0, 161, 0); // You can adjust this color based on success or error
    font-size: 0.9em;
    font-weight: bold;
}
.feedback-error {
    color: rgb(150, 3, 3); // You can adjust this color based on success or error
    font-size: 0.9em;
    font-weight: bold;
}
</style>