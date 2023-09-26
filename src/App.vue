<!-- App.vue -->
<template>
	<div class="app">


		<Navigation />
		<router-view />
		<Footer />
	</div>
</template>

<script>

import Navigation from "./components/Navigation.vue";
import Footer from "./components/Footer.vue"

export default {
	name: 'App',
	components: {
		Navigation,
		Footer
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
	font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	font-weight: 400;
	p{
		text-align: justify;
	}
	body{
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	header{
		flex: 0 0 auto
	}
	footer{
		margin-top: 5%;
		flex: 0 0 auto
	}

}

.app {
	min-height: 100vh;
	position: relative;
	background-color: #ffffff;
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
	--card-height: 450px;
    --card-width: calc(var(--card-height) / 1.5);
}
</style>
