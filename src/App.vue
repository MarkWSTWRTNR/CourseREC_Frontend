<template>

    
      <nav v-if="userRole === ROLES.ADMIN">
        <router-link to="/curriculum">Curriculum</router-link>
        <router-link to="/course_list">Course list</router-link>
        <router-link to="/faculty">Faculty</router-link>
      </nav>

      <nav v-if="userRole === ROLES.STUDENT">
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
</template>


<script>
import { userRole, ROLES } from "../src/service/roles"

export default {
  data() {
    return {
      userRole: userRole,
      ROLES: ROLES,
    };
  },
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px;
  background-color: #010508;
  text-align: left;
}

nav a {
  margin-bottom: 10px;
  font-weight: bold;
  color: #ffffff;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
