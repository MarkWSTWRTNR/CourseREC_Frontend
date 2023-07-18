// // crud.js
// import vSelect from 'vue-select';
// import apiClient from './AxiosClient';

// export default {
//     components: {
//         'v-select': vSelect,

//     },
//     data() {
//         return {
//             records: [],
//             id: '',
//             courseId: '',
//             name: '',
//             credit: 0,
//             gradingtype: '',
//             prerequisite: [],
//             description: '',
//             selectedCourse: null,
//             showForm: false
//         };
//     },
//     mounted() {
//         this.fetchCourses();
//     },
//     methods: {
//         fetchCourses() {
//             apiClient.get('http://localhost:8080/courses')
//                 .then(response => {
//                     this.records = response.data.map(course => ({
//                         id: course.id,
//                         courseId: course.courseId,
//                         name: course.name,
//                         credit: course.credit,
//                         gradingtype: course.gradingtype,
//                         prerequisite: course.prerequisite.map(prerequisite => ({
//                             courseId: prerequisite.courseId,
//                             name: prerequisite.name,
//                             label: `${prerequisite.courseId} - ${prerequisite.name}`
//                         })),
//                         description: course.description,
//                         label: `${course.courseId} - ${course.name}`
//                     }));
//                     console.log(this.records)
//                 })
//                 .catch(error => {
//                     console.log(error);
//                 });
//         },

//         addCourse() {
//             const course = {
//                 courseId: this.courseId,
//                 name: this.name,
//                 credit: this.credit,
//                 gradingtype: this.gradingtype,
//                 prerequisite: this.prerequisite,
//                 description: this.description
//             };
//             apiClient.post('http://localhost:8080/addCourse', course)
//                 .then(response => {
//                     alert('Course created successfully');
//                     const data = response.data;
//                     if (data.error) {
//                         alert(data.error);
//                     } else {
//                         this.fetchCourses();
//                         this.clearForm();
//                     }
//                     console.log([course])
//                 })
//                 .catch(error => {
//                     console.log(error);
//                 });
//             this.showForm = false;
//             this.selectedCourse = null
//             this.clearForm;
//         },
//         deleteCourse(id) {
//             const confirmDelete = confirm("Are you sure you want to delete this course?");
//             if (!confirmDelete) {
//                 return;
//             }
//             apiClient.delete(`http://localhost:8080/deleteCourse/${id}`)
//                 .then(response => {
//                     alert('Course deleted successfully');
//                     this.fetchCourses();
//                 })
//                 .catch(error => {
//                     console.log(error);
//                 });
//         },
//         editCourse(course) {
//             if (course && course.courseId) {
//                 this.selectedCourse = course;
//                 this.courseId = course.courseId;
//                 this.name = course.name;
//                 this.credit = course.credit;
//                 this.gradingtype = course.gradingtype;
//                 this.prerequisite = course.prerequisite.map(prerequisite => ({
//                     courseId: prerequisite.courseId,
//                     name: prerequisite.name,
//                     label: `${prerequisite.courseId} - ${prerequisite.name}`
//                 }));
//                 this.description = course.description;
//                 this.showForm = true;
//             } else {
//                 alert('Invalid course object:', course);
//             }
//         },
//         updateCourse() {
//             if (!this.selectedCourse) {
//                 return;
//             }

//             const updatedCourse = {
//                 courseId: this.selectedCourse.courseId,
//                 name: this.name,
//                 credit: this.credit,
//                 gradingtype: this.gradingtype,
//                 prerequisite: this.prerequisite,
//                 description: this.description
//             };
//             console.log('upate click')
//             apiClient.put(`http://localhost:8080/updateCourse`, updatedCourse)
//                 .then(response => {
//                     alert('Course updated successfully');
//                     this.fetchCourses();
//                     this.selectedCourse = null;
//                     this.clearForm();
//                 })
//                 .catch(error => {
//                     alert('Error updating course:', error);
//                 });console.log([updatedCourse])
//         },

//         openForm() {
//             this.showForm = true;
//         },
//         cancelForm() {
//             // Close the form without submitting
//             this.showForm = false;
//             this.clearForm();
//             this.selectedCourse = null;
//         },
//         clearForm() {
//             this.courseId = '';
//             this.name = '';
//             this.credit = 0;
//             this.gradingtype = '';
//             this.prerequisite = [];
//             this.description = '';
//         },


//     }
// }