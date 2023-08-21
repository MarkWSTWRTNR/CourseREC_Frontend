<!-- CourseListView.vue -->
<template>
    <div class="container">
    <!-- <div>
    <input type="text" v-model="searchQuery" placeholder="Search courses">
    <button @click="searchCourses">Search</button>
  </div> -->
    <div class="row">
        <div class="col-md-12">
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
                    <!-- <tr v-if="displayCourses.length === 0">
                        <td colspan="6" class="text-center">No courses found</td>
                    </tr> -->
                    <tr v-for="record in records" :key="record.courseId">
                        <td>{{ record.courseId }}</td>
                        <td>{{ record.name }}</td>
                        <td>{{ record.credit }}</td>
                        <td>{{ record.gradingtype }}</td>
                        <td>
                            <li style="text-align: left;" v-for="prerequisite in record.prerequisite"
                                :key="prerequisite.courseId">
                                {{ prerequisite.courseId }} - {{ prerequisite.name }}
                            </li>
                        </td>
                        <td>
                            <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-danger"
                                @click="deleteCourse(record.id)">Delete</button>
                            <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-info"
                                @click="editCourse(record); openForm()">Edit</button><br>
                            <router-link :to="'/courseByCourseId/' + record.courseId">Description</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div>
        <button v-if="userRole === ROLES.ADMIN" class="btn btn-outline-primary" @click="openForm">Add courses</button>
        <div v-if="showForm">
            <div class="overlay">
                <div class="popup">
                    <div class="row">
                        <div class="col-md-12">
                            <h3>{{ selectedCourse ? 'Edit Course' : 'Add Course' }}</h3>
                            <form @submit.prevent="addCourse">
                                <div class="form-group">
                                    <label for="courseId">Course ID</label>
                                    <input type="text" class="form-control" id="courseId" v-model="courseId" required>
                                </div>
                                <div class="form-group">
                                    <label for="courseName">Course Name</label>
                                    <input type="text" class="form-control" id="courseName" v-model="name" required>
                                </div>
                                <div class="form-group">
                                    <label for="courseCredit">Course Credit</label>
                                    <input type="text" class="form-control" id="courseCredit" v-model="credit" required>
                                </div>
                                <div class="form-group">
                                    <label for="gradingType">Grading Type</label>
                                    <input type="text" class="form-control" id="gradingType" v-model="gradingtype" required>
                                </div>
                                <div class="form-group">
                                    <label for="coursePrerequisite">Course Prerequisite</label>
                                    <v-select class="form-control left-align" id="coursePrerequisite"
                                        v-model="selectedPrerequisites" :options="records.map(record => ({
                                            label: record.courseId + ' - ' + record.name,
                                            value: { courseId: record.courseId, name: record.name } // Include both courseId and name
                                        }))" multiple :reduce="option => option.value" :placeholder="'Select prerequisite courses'">
                                    </v-select>

                                </div>
                                <div class="form-group">
                                    <label for="description">Description</label>
                                    <input type="text" class="form-control" id="description" v-model="description" required>
                                </div>
                                <button v-if="selectedCourse" class="btn btn-outline-success"
                                    @click="updateCourse">Update</button>
                                <button v-else class="btn btn-primary" type="submit">Create</button>
                                <button @click="cancelForm">Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
  
<script>
import { userRole, ROLES } from "../service/roles"
// crud.js
import vSelect from 'vue-select';
import apiClient from "@/service/AxiosClient";

export default {
    components: {
        'v-select': vSelect,
    },
    name: 'courselist',
    data() {

        //\2. get prop code from redirection
        //3. make axios call post  (by step 4)  toget access token
        //4 receive access token (step 5)
        //5. call get with the bearer access token (step5)
        //6. receive resorcce, get studentID to chck role at backend
        return {
            userRole: userRole,
            ROLES: ROLES,
            records: [],
            id: '',
            courseId: '',
            name: '',
            credit: 0,
            gradingtype: '',
            prerequisite: [],
            description: '',
            selectedCourse: null,
            selectedPrerequisites: [],
            showForm: false,
            isSubmitting: false,
        };
    },
    mounted() {
        this.fetchCourses();
    },
    methods: {
        fetchCourses() {
            apiClient.get('http://localhost:8080/courses')
                .then(response => {
                    this.records = response.data.map(course => ({
                        id: course.id,
                        courseId: course.courseId,
                        name: course.name,
                        credit: course.credit,
                        gradingtype: course.gradingtype,
                        prerequisite: course.prerequisite.map(prerequisite => ({
                            courseId: prerequisite.courseId,
                            name: prerequisite.name,
                            label: `${prerequisite.courseId} - ${prerequisite.name}`
                        })),
                        description: course.description,
                        label: `${course.courseId} - ${course.name}`
                    }));
                    console.log(this.records)
                })
                .catch(error => {
                    console.log(error);
                });
        },

        addCourse() {
            if (this.isSubmitting) return; // Prevent multiple submissions
            this.isSubmitting = true;
            const course = {
                courseId: this.courseId,
                name: this.name,
                credit: this.credit,
                gradingtype: this.gradingtype,
                prerequisite: this.selectedPrerequisites,
                description: this.description
            };
            apiClient.post('http://localhost:8080/addCourse', course)
                .then(response => {
                    alert('Course created successfully');
                    const data = response.data;
                    if (data.error) {
                        alert(data.error);
                    } else {
                        this.fetchCourses();
                        this.clearForm();
                    }
                    console.log([course])
                })
                .catch(error => {
                    alert('Error creating course');
                    console.log(error);
                }).finally(() => {
                    this.isSubmitting = false; // Reset the submission flag
                    this.showForm = false;
                    this.clearForm;
                });
            this.showForm = false;
            this.selectedCourse = null
            this.clearForm;
        },
        deleteCourse(id) {
            const confirmDelete = confirm("Are you sure you want to delete this course?");
            if (!confirmDelete) {
                return;
            }
            apiClient.delete(`http://localhost:8080/deleteCourse/${id}`)
                .then(response => {
                    alert('Course deleted successfully');
                    this.fetchCourses();
                })
                .catch(error => {
                    alert('Error delete course');
                    console.log(error);
                });
        },
        editCourse(course) {
            if (course && course.courseId) {
                this.selectedCourse = course;
                this.courseId = course.courseId;
                this.name = course.name;
                this.credit = course.credit;
                this.gradingtype = course.gradingtype;
                this.prerequisite = course.prerequisite.map(prerequisite => ({
                    courseId: prerequisite.courseId,
                    name: prerequisite.name,
                    label: `${prerequisite.courseId} - ${prerequisite.name}`
                })) || [];
                this.description = course.description;

                // Populate selectedPrerequisites array with course IDs of prerequisites
                this.selectedPrerequisites = this.prerequisite.map(prerequisite => ({
                    courseId: prerequisite.courseId,
                    name: prerequisite.name
                }));

                this.showForm = true;
            } else {
                alert('Invalid course object:', course);
            }
        },
        updateCourse() {
            if (!this.selectedCourse || this.isSubmitting) return; // Prevent multiple submissions
            this.isSubmitting = true;
            const updatedCourse = {
                courseId: this.selectedCourse.courseId,
                name: this.name,
                credit: this.credit,
                gradingtype: this.gradingtype,
                prerequisite: this.selectedPrerequisites, // Update prerequisite data
                description: this.description
            };

            apiClient
                .put(`http://localhost:8080/updateCourse`, updatedCourse)
                .then(response => {
                    alert('Course updated successfully');
                    this.fetchCourses();
                    this.selectedCourse = null;
                    this.clearForm();
                })
                .catch(error => {
                    alert('Error updating course:', error);
                })
                .finally(() => {
                    this.isSubmitting = false; // Reset the submission flag
                    this.showForm = false;
                });
        },


        openForm() {
            this.showForm = true;
        },
        cancelForm() {
            // Close the form without submitting
            this.showForm = false;
            this.clearForm();
            this.selectedCourse = null;
        },
        clearForm() {
            this.courseId = '';
            this.name = '';
            this.credit = 0;
            this.gradingtype = '';

            this.description = '';
        },


    }
}
</script>
  
<style>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    z-index: 1000;
}

.form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}
</style>