<!-- CourseListView.vue -->
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
                    <tr v-for="record in    records   " :key="record.course_id">
                        <td>{{ record.course_id }}</td>
                        <td>{{ record.coursename }}</td>
                        <td>{{ record.credit }}</td>
                        <td>{{ record.gradingtype }}</td>
                        <td><span v-for="prerequisite in record.prereq" :key="prerequisite.course_id">
                                {{ prerequisite.course_id }} - {{ prerequisite.coursename }}
                            </span>
                        </td>

                        <td>
                            <button class="btn btn-outline-danger" @click="deleteCourse(record.course_id)">Delete</button>
                            <button class="btn btn-outline-info" @click="editCourse(record); openForm()">Edit</button><br>
                            <router-link :to="'/courses/' + record.course_id">Description</router-link>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div>
        <button class="btn btn-outline-primary" @click="openForm">Add courses</button>
        <div v-if="showForm">
            <div class="overlay">
                <div class="popup">
                    <div class="row">
                        <div class="col-md-12">
                            <h3>{{ selectedCourse ? 'Edit Course' : 'Add Course' }}</h3>
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
                                    <select class="form-control" id="coursePrerequisite" v-model="prereq" required>
                                        <option value="" disabled selected>Select a prerequisite course</option>
                                        <option value="null">None</option>
                                        <option v-for="record in records" :value="record.course_id">{{ record.course_id }}
                                            {{ record.coursename }}
                                        </option>
                                    </select>
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
</template>

<script>
import crud from '@/components/crud';
export default {
    name: 'courselist',
    mixins: [crud],

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
