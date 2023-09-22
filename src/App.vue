<template>
	<div class="app">

		<!-- <Slidebar /> -->
		<Navigation />
		<router-view />
	</div>
</template>

<script>

import Navigation from "./components/Navigation.vue";
import Slidebar from "../src/components/Slidebar.vue"

export default {
	name: 'App',
	components: {
		Slidebar,
		Navigation
	},
	data() {
		return {
		};
	},
};
</script>
<style lang="scss">
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
	font-family: "Raleway", sans-serif;
	font-weight: 400;
}

.app {
	min-height: 100vh;
	position: relative;
	background-color: #f1f1f1;
}

.container {
	padding: 0 20px;
	max-width: 1140px;
	margin: 0 auto;
}

:root {
	--primary: #E1D084;
	--primary-alt: #ADB2B8;
	--grey: #64748b;
	--dark: #001C2D;
	--dark-alt: #334155;
	--light: #f1f5f9;
	--sidebar-width: 300px;
	--background-page: #23282c;
}
</style>
