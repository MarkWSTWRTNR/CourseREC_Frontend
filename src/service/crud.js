// crud.js
import vSelect from 'vue-select';
import apiClient from './AxiosClient';

export default {
    components: {
        'v-select': vSelect,

    },
    data() {
        return {
            records: [],
            courseId: '',
            name: '',
            credit: '',
            gradingtype: '',
            // prereq: [],
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
            apiClient.get('http://localhost:8080/courses')
                .then(response => {
                    this.records = response.data.map(course => ({
                        courseId: course.courseId,
                        name: course.name,
                        credit: course.credit,
                        gradingtype: course.gradingtype,
                        // prereq: course.prereq.map(prerequisite => ({
                        //     courseId: prerequisite.courseId,
                        //     name: prerequisite.name,
                        //     label: `${prerequisite.courseId} - ${prerequisite.name}`
                        // })),
                        description: course.description,
                        label: `${course.courseId} - ${course.name}`
                    }));
                })
                .catch(error => {
                    console.log(error);
                });
        },

        addCourse() {
            const course = {
                courseId: this.courseId,
                name: this.name,
                credit: this.credit,
                gradingtype: this.gradingtype,
                // prereq: this.prereq,
                description: this.description
            };
            if (this.prereq === "null") {
                this.prereq = null;
            }
            apiClient.post('http://localhost:8080/addCourses', [course])
                .then(response => {
                    alert('Course created successfully');
                    const data = response.data;
                    if (data.error) {
                        alert(data.error);
                    } else {
                        this.fetchCourses();
                        this.courseId = '';
                        this.name = '';
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
            apiClient.delete(`http://localhost:8080/delete/${courseId}`)
                .then(response => {
                    alert('Course deleted successfully');
                    this.fetchCourses();
                })
                .catch(error => {
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
                // this.prereq = course.prereq.map(prerequisite => ({
                //     courseId: prerequisite.courseId,
                //     name: prerequisite.name,
                //     label: `${prerequisite.courseId} - ${prerequisite.name}`
                // }));
                this.description = course.description;
                this.showForm = true;
            } else {
                alert('Invalid course object:', course);
            }
        },
        updateCourse() {
            if (!this.selectedCourse) {
                return;
            }

            const updatedCourse = {
                courseId: this.selectedCourse.courseId,
                coursename: this.coursename,
                credit: this.credit,
                gradingtype: this.gradingtype,
                prereq: this.prereq,
                description: this.description
            };

            apiClient.put(`http://localhost:8080/updateCourse`, updatedCourse)
                .then(response => {
                    alert('Course updated successfully');
                    this.fetchCourses();
                    this.selectedCourse = null;
                    this.clearForm();
                })
                .catch(error => {
                    alert('Error updating course:', error);
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
            this.credit = '';
            this.gradingtype = '';
            // this.prereq = '';
            this.description = '';
        },


    }
}