<template>
  <div class="container">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/curriculum">Curriculum</router-link>
      <router-link to="/course_list">Course list</router-link>
    </nav>
<div class="content">


    <router-view />
  </div></div>
</template>

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
}

nav a {
  margin-bottom: 10px;
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.container{
  display: grid;
  grid-template-columns: 200px 1fr;
  height: 100vh;
}
.content {
  padding: 30px;

}
</style>
