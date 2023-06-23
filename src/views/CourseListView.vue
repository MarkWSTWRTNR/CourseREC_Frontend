<template>
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
                    <tr v-for="record in records" :key="record.course_id">
                        <td>{{ record.course_id }}</td>
                        <td>{{ record.coursename }}</td>
                        <td>{{ record.credit }}</td>
                        <td>{{ record.gradingtype }}</td>
                        <td>{{ record.prereq }}</td>
                        <td>
                            <button class="btn btn-outline-danger" @click="deleteCourse(record.course_id)">Delete</button>
                            <button class="btn btn-outline-info" @click="editCourse(record)">Edit</button>
                            

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <h3>Add Course</h3>
            <form @submit.prevent="addCourse">
                <div class="form-group">
                    <label for="courseId">Course ID</label>
                    <input type="text" class="form-control" id="courseId" v-model="course_id" required>
                </div>
                <div class="form-group">
                    <label for="courseName">Course Name</label>
                    <input type="text" class="form-control" id="courseName" v-model="coursename" required>
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
                    <input type="text" class="form-control" id="coursePrerequisite" v-model="prereq" required>
                </div>
                <button type="submit" class="btn btn-primary">Create</button>
                <button class="btn btn-outline-success" @click="updateCourse">Update</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'courselist',
    data() {
        return {
            records: [],
            course_id: '',
            coursename: '',
            credit: '',
            gradingtype: '',
            prereq: '',
            selectedCourse: null
        };
    },
    mounted() {
        this.fetchCourses();
    },
    methods: {
        fetchCourses() {
            axios.get('http://localhost:5000/api/courses')
                .then(response => {
                    this.records = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        addCourse() {
            const course = {
                course_id: this.course_id,
                coursename: this.coursename,
                credit: this.credit,
                gradingtype: this.gradingtype,
                prereq: this.prereq
            };

            axios.post('http://localhost:5000/api/courses', course)
                .then(response => {
                    this.fetchCourses();
                    this.course_id = '';
                    this.coursename = '';
                    this.credit = '';
                    this.gradingtype = '';
                    this.prereq = '';
                })
                .catch(error => {
                    console.log(error);
                });
        },
        deleteCourse(courseId) {
            axios.delete(`http://localhost:5000/api/courses/${courseId}`)
                .then(response => {
                    this.fetchCourses();
                })
                .catch(error => {
                    console.log(error);
                });
        },
        editCourse(course) {
            this.selectedCourse = course;
            this.course_id = course.course_id;
            this.coursename = course.coursename;
            this.credit = course.credit;
            this.gradingtype = course.gradingtype;
            this.prereq = course.prereq;
        },
        updateCourse() {
    if (!this.selectedCourse) {
        return;
    }

    const updatedCourse = {
        course_id: this.course_id,
        coursename: this.coursename,
        credit: this.credit,
        gradingtype: this.gradingtype,
        prereq: this.prereq
    };

    axios.put(`http://localhost:5000/api/courses/${this.selectedCourse.course_id}`, updatedCourse)
        .then(response => {
            this.fetchCourses();
            this.course_id = '';
            this.coursename = '';
            this.credit = '';
            this.gradingtype = '';
            this.prereq = '';
            this.selectedCourse = null;
        })
        .catch(error => {
            console.log(error);
        });
}


    }
}
</script>

<style>
/* CSS styles */
</style>
