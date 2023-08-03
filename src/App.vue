<template>
  <div class="container">
    <!-- Vertical navbar on the right -->
    <nav v-if="userRole === ROLES.ADMIN" class="navbar navbar-admin">
      <router-link to="/course_list">Course list</router-link>
      <router-link to="/curriculum">Curriculum</router-link>
      <router-link to="/login">login</router-link>
    </nav>

    <nav v-if="userRole === ROLES.STUDENT" class="navbar navbar-student">
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/curriculum">Curriculum</router-link>
      <router-link to="/course_list">Course List</router-link>
      <router-link to="/studentstudyplan">Student Study Plan</router-link>
      <router-link to="/recommendcourse">Recommend Course</router-link>
      <router-link to="/studyguide">Study Guide</router-link>
      <router-link to="/finishedcourse">Finished Course</router-link>
    </nav>

    <!-- Content on the left -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { userRole, ROLES } from "../src/service/roles";

export default {
  data() {
    return {
      userRole: userRole,
      ROLES: ROLES,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.container {
  display: flex;
}

/* Update styles for the vertical navbar on the right */
.navbar {
  display: flex;
  flex-direction: column; /* Display the links vertically */
  padding: 15px;
  background-color: #f1f1f1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0);
  width: 200px; /* Set a fixed width for the vertical navbar */
}

/* Right align the vertical navbar */
.navbar.navbar-admin {
  justify-content: flex-start;
}

.navbar.navbar-student {
  justify-content: flex-start;
}

.navbar a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 4px 0;
}

.navbar a:hover {
  background-color: #e3e3e3;
}

.navbar a.router-link-exact-active {
  background-color: #42b983;
  color: white;
}

.router-link-exact-active {
  background-color: #42b983;
  color: white;
  border-radius: 4px;
}

.router-link-exact-active:hover {
  background-color: #3c8c6e;
}

/* Styles for the content on the left */
.content {
  flex: 1; /* Fill the remaining width of the container */
  padding: 15px;
}
</style>
