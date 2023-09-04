<template>
<div class="app">
		<!-- Sidebar -->
		<Slidebar />

		<!-- Content -->
		<router-view />
	</div>
</template>

<script>

import Slidebar from "../src/components/Slidebar.vue"

export default {
  name: 'App',
  components:{
    Slidebar
  },
  data() {
    return {
    };
  },
};
</script>
<style lang="scss">

:root {
	--primary: #4ade80;
	--primary-alt: #22c55e;
	--grey: #64748b;
	--dark: #001C2D;
	--dark-alt: #334155;
	--light: #f1f5f9;
	--sidebar-width: 300px;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Fira sans', sans-serif;
}

body {
	background: var(--light);
}

button {
	cursor: pointer;
	appearance: none;
	border: none;
	outline: none;
	background: none;
}

.app {
	display: flex;
	background-color: #E4E8E7;
	main {
		flex: 1 1 0;
		padding: 2rem;

		@media (max-width: 1024px) {
			padding-left: 6rem;
		}
	}
}
</style>
