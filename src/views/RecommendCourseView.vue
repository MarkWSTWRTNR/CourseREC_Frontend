<template>
    <div class="home hero-text container">
        <h1>Recommended Courses</h1>
        <div v-if="isLoading">Loading...</div>
        <div v-else>
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
                    <tr v-for="course in recommendedCourses" :key="course.id">
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
                            <router-link :to="'/courseByCourseId/' + course.courseId">Description</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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
    mounted() {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const userInfo = JSON.parse(storedUserInfo);
            this.cmuitaccount_name = userInfo.cmuitaccount_name;
            this.fetchRecommendedCourses(); // Corrected method call
        }
    },
    methods: {
        fetchRecommendedCourses() {
            apiClient.get(`http://localhost:8080/users/${this.cmuitaccount_name}/recommended-courses`)
                .then(response => {
                    this.recommendedCourses = response.data;
                    this.isLoading = false; // Update isLoading when data is loaded
                    console.log("Recommended Course Data:", this.recommendedCourses);
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
    padding-top: 200px; // or whatever value is needed to push the content below the navbar
}
</style>
  