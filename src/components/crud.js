// crud.js
import axios from 'axios';
import vSelect from 'vue-select';

export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            records: [],
            course_id: '',
            coursename: '',
            credit: '',
            gradingtype: '',
            prereq: [],
            description: '',
            selectedCourse: null,
            showForm: false
        };
    },
    mounted() {
        this.fetchCourses();
    },
    methods: {
        fetchCourses() {
            axios.get('http://localhost:5000/api/courses')
                .then(response => {
                    this.records = response.data.map(course => ({
                        course_id: course.course_id,
                        coursename: course.coursename,
                        credit: course.credit,
                        gradingtype: course.gradingtype,
                        prereq: course.prereq.map(prerequisite => ({
                            course_id: prerequisite.course_id,
                            coursename: prerequisite.coursename
                        })),
                        description: course.description,
                        label: `${course.course_id} - ${course.coursename}`
                    }));
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
                prereq: this.prereq,
                description: this.description
            };
            if (this.prereq === "null") {
                this.prereq = null;
            }
            axios.post('http://localhost:5000/api/courses', course)
                .then(response => {
                    const data = response.data;
                    if (data.error) {
                        alert(data.error);
                    } else {
                        this.fetchCourses();
                        this.course_id = '';
                        this.coursename = '';
                        this.credit = '';
                        this.gradingtype = '';
                        this.prereq = '';
                        this.description = '';
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            this.showForm = false;
            this.selectedCourse = null
            this.clearForm;
        },
        deleteCourse(courseId) {
            const confirmDelete = confirm("Are you sure you want to delete this course?");
            if (!confirmDelete) {
                return;
            }
            axios.delete(`http://localhost:5000/api/courses/${courseId}`)
                .then(response => {
                    this.fetchCourses();
                })
                .catch(error => {
                    console.log(error);
                });
        },
        editCourse(course) {
            if (course && course.course_id) {
                this.selectedCourse = course;
                this.course_id = course.course_id;
                this.coursename = course.coursename;
                this.credit = course.credit;
                this.gradingtype = course.gradingtype;
                this.prereq = course.prereq.map(prerequisite => ({
                    course_id: prerequisite.course_id,
                    coursename: prerequisite.coursename,
                    label: `${prerequisite.course_id} - ${prerequisite.coursename}`
                }));
                this.description = course.description;
                this.showForm = true;
            } else {
                console.log('Invalid course object:', course);
            }
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
                prereq: this.prereq,
                description: this.description
            };

            axios.put(`http://localhost:5000/api/courses/${this.selectedCourse.course_id}`, updatedCourse)
                .then(response => {
                    this.fetchCourses();
                    this.selectedCourse = null;
                    this.clearForm();
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
            this.course_id = '';
            this.coursename = '';
            this.credit = '';
            this.gradingtype = '';
            this.prereq = '';
            this.description = '';
        },


    }
}