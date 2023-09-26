<!-- CourseListView.vue -->
<template>
    <div class="home">
        <section class="hero">
            <div class="hero-text container">
                <div class="search-bar">
                    <div class="form-group">
                        <input type="text" v-model="searchQuery" placeholder="Search courses..." class="form-control">
                    </div>
                    <button @click="searchCourses" class="custom-btn btn-5_2">Search</button>
                </div>
                <div class="center-side">
                    <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-primary" @click="openForm">Add
                        courses</button>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="table-responsive">
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
                                    <!-- Course Rows -->
                                    <tr v-for="record in records" :key="record.courseId">
                                        <td>{{ record.courseId }}</td>
                                        <td>{{ record.name }}</td>
                                        <td>{{ record.credit }}</td>
                                        <td>{{ record.gradingtype }}</td>
                                        <td>
                                            <ul>
                                                <li v-for="prerequisite in record.prerequisite"
                                                    :key="prerequisite.courseId">
                                                    {{ prerequisite.courseId }} - {{ prerequisite.name }}
                                                </li>
                                            </ul>
                                        </td>
                                        <td>
                                            <div class="d-e-d">
                                                <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-danger"
                                                    @click="deleteCourse(record.id)">Delete</button>
                                                <button v-if="userRole === ROLES.ROLE_ADMIN" class="btn btn-info"
                                                    @click="editCourse(record); openForm()">Edit</button><br>
                                                <router-link
                                                    :to="'/courseByCourseId/' + record.courseId">Description</router-link>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="pagination-buttons">
                        <button class="custom-btn btn-5_2 left-button" @click="changePage(-1)"
                            :disabled="currentPage === 1">
                            <b>Previous</b>
                        </button>
                        <button class="custom-btn btn-5_2 right-button" @click="changePage(1)"
                            :disabled="currentPage === totalPages">
                            <b>Next</b>
                        </button>
                    </div>
                </div>
                <div>

                    <div v-if="showForm">
                        <div class="overlay">
                            <div class="popup">
                                <div class="row">
                                    <div class="col-md-12">
                                        <h3>{{ selectedCourse ? 'Edit Course' : 'Add Course' }}</h3>
                                        <form @submit.prevent="addCourse">
                                            <div class="form-group">
                                                <label for="courseId">Course ID</label>
                                                <input type="text" class="form-control" id="courseId" v-model="courseId"
                                                    required>
                                            </div>
                                            <div class="form-group">
                                                <label for="courseName">Course Name</label>
                                                <input type="text" class="form-control" id="courseName" v-model="name"
                                                    required>
                                            </div>
                                            <div class="form-group">
                                                <label for="courseCredit">Course Credit</label>
                                                <input type="text" class="form-control" id="courseCredit" v-model="credit"
                                                    required>
                                            </div>
                                            <div class="form-group">
                                                <label for="gradingType">Grading Type</label>
                                                <select type="text" class="form-control" id="gradingType"
                                                    v-model="gradingtype" required>
                                                    <option value="">-- Select Grading Type --</option>
                                                    <option>Letter Grading</option>
                                                    <option>Non-Letter Grading</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="coursePrerequisite">Course Prerequisite</label>
                                                <v-select class="form-control left-align" id="coursePrerequisite"
                                                    v-model="selectedPrerequisites" :options="allCourse.map(allcourse => ({
                                                        label: allcourse.courseId + ' - ' + allcourse.name,
                                                        value: { courseId: allcourse.courseId, name: allcourse.name }
                                                    }))" multiple :reduce="option => option.value"
                                                    :placeholder="'Select prerequisite courses'"></v-select>
                                            </div>
                                            <div class="form-group">
                                                <label for="description">Description</label>
                                                <textarea class="form-control" id="description" v-model="description"
                                                    required></textarea>
                                            </div>
                                            <div class="form-buttons">
                                                <button v-if="selectedCourse" class="btn btn-success">Update</button>
                                                <button v-else class="btn btn-primary" type="submit">Create</button>
                                                <button class="btn btn-secondary" @click="cancelForm">Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
  
<script>
import '../assets/css/Button.css';
import { userRole, ROLES } from "../service/roles"
import vSelect from 'vue-select';
import CourseService from '@/service/CourseService.js';
export default {
    components: {
        'v-select': vSelect,
    },
    name: 'courselist',
    data() {
        return {
            userRole: userRole,
            ROLES: ROLES,
            records: [],
            allCourse: [],
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
            currentPage: 1,
            totalPages: 0,
            searchQuery: ''
        };
    },
    mounted() {
        this.fetchCourses();
        this.getAllCourse();
    },
    methods: {
        fetchCourses() {
            CourseService.getCourses(12, this.currentPage)
                .then(response => {
                    this.totalPages = Math.ceil(response.headers['x-total-count'] / 12);
                    this.records = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        getAllCourse() {
            CourseService.getAllCourse().then(response => {
                this.allCourse = response.data.map(course => ({
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
                console.log(this.allCourse);
            }).catch(error => {
                console.log(error);
            });
        },
        changePage(direction) {
            this.currentPage += direction;
            this.fetchCourses();
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
            CourseService.addCourse(course)
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
            CourseService.deleteCourse(id)
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

            CourseService.updateCourse(updatedCourse)
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
        searchCourses() {
            CourseService.searchCourses(this.searchQuery, 12, this.currentPage)
                .then(response => {
                    this.totalPages = Math.ceil(response.headers['x-total-count'] / 12);
                    this.records = response.data;
                })
                .catch(error => {
                    console.log(error);
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
            this.selectedPrerequisites = [];
        },


    }
}
</script>
  
<style lang="scss" scoped>
.home {
    padding-top: 150px; // or whatever value is needed to push the content below the navbar
}

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

.pagination-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}

.pagination-buttons button:disabled {
    opacity: 0.2;
    cursor: not-allowed;
}

.left-button {
    justify-content: flex-start;
}

.right-button {
    justify-content: flex-end;
}

.search-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .form-group {
        flex: 1;
        margin-right: 10px;
    }
}

.form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}



.popup {
    /* ... (rest of the styles remain unchanged) */
    padding: 30px;
    width: 80%;
    max-width: 600px;
}

textarea.form-control {
    resize: vertical;
    min-height: 100px;
}

.center-side {
    display: flex;
    justify-content: center;
    margin-bottom: 1em;
}

.d-e-d {
    display: flex;
    justify-content: center;
    gap: 1em;
}</style>