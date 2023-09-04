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
	--primary: #E1D084;
	--primary-alt: #ADB2B8;
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
	background-color: #23282c;
	main {
		flex: 1 1 0;
		padding: 2rem;

		@media (max-width: 1024px) {
			padding-left: 6rem;
		}
	}
}
</style>
