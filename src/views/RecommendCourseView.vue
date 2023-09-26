<template>
    <div class="home">
        <section class="hero">
            <div class="hero-text container">
                <h1>Recommended Courses: </h1>
                <div v-if="isLoading">Loading...</div>
                <div v-else>
                    <div v-if="hasRecommendedCourses">
                        <div v-for="(groupedCourses, groupName) in groupedByGroupCourse" :key="groupName">
                            <h2>{{ groupName }}</h2>
                            <table class="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Course ID</th>
                                        <th>Course Name</th>
                                        <th>Course Credit</th>
                                        <th>Grading Type</th>
                                        <th>Course Prerequisite</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="course in groupedCourses" :key="course.id">
                                        <td>{{ course.courseId }}</td>
                                        <td>{{ course.name }}</td>
                                        <td>{{ course.credit }}</td>
                                        <td>{{ course.gradingtype }}</td>
                                        <td>
                                            <ul>
                                                <li v-for="prerequisite in course.prerequisite" :key="prerequisite.id">
                                                    {{ prerequisite.courseId }} - {{ prerequisite.name }}
                                                </li>
                                            </ul>
                                        </td>
                                        <td>
                                            <router-link
                                                :to="'/courseByCourseId/' + course.courseId">Description</router-link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div v-else class="center-text">
                        <p>Please set your program by visiting the <router-link to="/UserInfo">UserInfo page</router-link>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import apiClient from '@/service/AxiosClient';

export default {
    data() {
        return {
            isLoading: true,
            recommendedCourses: [],
            cmuitaccount_name: '',
        };
    },
    computed: {
        hasRecommendedCourses() {
            // Check if recommendedCourses is an array
            return Array.isArray(this.recommendedCourses);
        },
        groupedByGroupCourse() {
            // Check if recommendedCourses is an array
            if (!Array.isArray(this.recommendedCourses)) {
                return {};
            }

            return this.recommendedCourses.reduce((acc, course) => {
                const groupName = course.groupCourses[0]?.groupName || 'Uncategorized';
                if (!acc[groupName]) {
                    acc[groupName] = [];
                }
                acc[groupName].push(course);
                return acc;
            }, {});
        }
    },

    mounted() {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const userInfo = JSON.parse(storedUserInfo);
            this.cmuitaccount_name = userInfo.cmuitaccount_name;
            this.fetchRecommendedCourses();
        }
    },
    methods: {
        fetchRecommendedCourses() {
            apiClient.get(`http://localhost:8080/users/${this.cmuitaccount_name}/recommended-courses`)
                .then(response => {
                    this.recommendedCourses = response.data;
                    this.isLoading = false;
                })
                .catch(error => {
                    console.error("Error fetching Recommended Course data:", error);
                });
        }
    }
};
</script>

  
<style lang="scss" scoped>
.home {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 200px; // or whatever value is needed to push the content below the navbar
}

.hero {
    position: relative;
    z-index: 1;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.hero-text {
    text-align: center;

}

.center-text {
    text-align: center;
    margin-top: 20px;
    /* Add some margin to center it vertically */
}
</style>
  