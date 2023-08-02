<template>
  <div>
    <nav v-if="userRole === ROLES.ADMIN" class="navbar">
      <router-link to="/course_list">Course list</router-link>
      <router-link to="/curriculum">Curriculum</router-link>
      <router-link to="/login">login</router-link>
    </nav>
    
    <nav v-if="userRole === ROLES.STUDENT" class="navbar">
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/curriculum">Curriculum</router-link>
      <router-link to="/course_list">Course List</router-link>
      <router-link to="/studentstudyplan">Student Study Plan</router-link>
      <router-link to="/recommendcourse">Recommend Course</router-link>
      <router-link to="/studyguide">Study Guide</router-link>
      <router-link to="/finishedcourse">Finished Course</router-link>
    </nav>
    <router-view />
    <!-- Footer -->
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

.navbar {
  display: flex;
  justify-content: flex-start;
  padding: 15px;
  background-color: #f1f1f1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0);
}

.navbar a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  margin: auto;
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
</style>
