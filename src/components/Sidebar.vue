<template>
	<aside :class="`${is_expanded ? 'is-expanded' : ''}`">
		<div class="logo">
			<img :src="logoURL" alt="Vue" />
		</div>

		<div class="menu-toggle-wrap">
			<button class="menu-toggle" @click="ToggleMenu">
				<span class="material-symbols-outlined">keyboard_double_arrow_right</span>
			</button>
		</div>

		<h3>Menu</h3>
		<div class="menu" v-if="userRole === ROLES.ADMIN">
			<div v-if="isLoggedIn">
				<router-link to="/course_list" class="button">
					<span class="material-symbols-outlined">list</span>
					<span class="text">Course list</span>
				</router-link>
				<router-link to="/curriculum" class="button">
					<span class="material-symbols-outlined">dynamic_feed</span>
					<span class="text">Curriculum</span>
				</router-link>
			</div>
		</div>
		<div class="menu" v-if="userRole === ROLES.STUDENT">
			<div v-if="isLoggedIn">
				<router-link to="/dashboard" class="button">
					<span class="material-symbols-outlined">dashboard</span>
					<span class="text">Dashboard</span>
				</router-link>
				<router-link to="/course_list" class="button">
					<span class="material-symbols-outlined">list</span>
					<span class="text">Course List</span>
				</router-link>
				<router-link to="/curriculum" class="button">
					<span class="material-symbols-outlined">dynamic_feed</span>
					<span class="text">Curriculum</span>
				</router-link>

				<router-link to="/recommendcourse" class="button">
					<span class="material-symbols-outlined">recommend</span>
					<span class="text">Recommend Course</span>
				</router-link>
				<router-link to="/finishedcourse" class="button">
					<span class="material-symbols-outlined">bookmark</span>
					<span class="text">Finished Course</span>
				</router-link>
				<router-link to="/studyguide" class="button">
					<span class="material-symbols-outlined">star</span>
					<span class="text">Study Guide</span>
				</router-link>
			</div>
		</div>

		<div class="flex"></div>
		<div class="menu">
			<router-link to="/userInfo" class="button">
				<span class="material-symbols-outlined">info</span>
				<span class="text">UserInfo</span>
			</router-link>

			<!-- If user is logged in, show Logout button, else show Login button -->
			<button v-if="isLoggedIn" @click="logout" class="button">
				<span class="material-symbols-outlined">logout</span>
				<span class="text">Logout</span>
			</button>
			<button v-else @click="login" class="button">
				<span class="material-symbols-outlined">login</span>
				<span class="text">Login</span>
			</button>

		</div>
	</aside>
</template>

<script setup>
import { ref } from 'vue'
import logoURL from '../assets/logo.png'
import { userRole, ROLES } from '@/service/roles';
const is_expanded = ref(localStorage.getItem("is_expanded") === "true")

const ToggleMenu = () => {
	is_expanded.value = !is_expanded.value
	localStorage.setItem("is_expanded", is_expanded.value)
}

</script>
<script>
import LoginService from '@/service/LoginService'
export default {
	data() {
		return {
			searchQuery: '',
			accessToken: null,
			userInfo: null
		}
	},
	computed: {
		isLoggedIn() {
			return !!this.accessToken;
		}
	},
	methods: {
		async login() {
			if (!this.accessToken) {
				const response = await LoginService.login();
				if (response && response.data) {
					this.accessToken = response.data;
					window.location.href = response.data; // Redirect to cmuoauth page for authentication
				}
			}
		},
		logout() {
			console.log("Logout method called");
			localStorage.removeItem('access_token'); // Remove the token from local storage
			localStorage.removeItem('userInfo')
			localStorage.removeItem('studyGuideData')
			this.accessToken = null;
			this.userInfo = null;
			console.log("userInfo after logout:", this.userInfo);
			window.location.reload();
		}
	},
	created() {
		this.accessToken = LoginService.getStoredAccessToken();
	}
}
</script>
<style lang="scss" scoped>
aside {
	display: flex;
	flex-direction: column;

	background-color: var(--dark);
	color: var(--light);

	width: calc(2rem + 32px);
	overflow: hidden;
	min-height: 100vh;
	padding: 1rem;

	transition: 0.2s ease-in-out;

	.flex {
		flex: 1 1 0%;
	}

	.logo {
		margin-bottom: 1rem;

		img {
			width: 2rem;
		}
	}

	.menu-toggle-wrap {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1rem;

		position: relative;
		top: 0;
		transition: 0.2s ease-in-out;

		.menu-toggle {
			transition: 0.2s ease-in-out;

			.material-symbols-outlined {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-out;
			}

			&:hover {
				.material-symbols-outlined {
					color: var(--primary);
					transform: translateX(0.5rem);
				}
			}
		}
	}

	h3,
	.button .text {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}

	h3 {
		color: var(--grey);
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
	}

	.menu {
		margin: 0 -1rem;

		.button {
			display: flex;
			align-items: center;
			text-decoration: none;

			transition: 0.2s ease-in-out;
			padding: 0.5rem 1rem;

			.material-symbols-outlined {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-in-out;
			}

			.text {
				color: var(--light);
				transition: 0.2s ease-in-out;
			}

			&:hover {
				background-color: var(--dark-alt);

				.material-symbols-outlined,
				.text {
					color: var(--primary);
				}
			}

			&.router-link-exact-active {
				background-color: var(--dark-alt);
				border-right: 5px solid var(--primary);

				.material-symbols-outlined,
				.text {
					color: var(--primary);
				}
			}
		}
	}

	.footer {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;

		p {
			font-size: 0.875rem;
			color: var(--grey);
		}
	}

	&.is-expanded {
		width: var(--sidebar-width);

		.menu-toggle-wrap {
			top: -3rem;

			.menu-toggle {
				transform: rotate(-180deg);
			}
		}

		h3,
		.button .text {
			opacity: 1;
		}

		.button {
			.material-symbols-outlined {
				margin-right: 1rem;
			}
		}

		.footer {
			opacity: 0;
		}
	}

	@media (max-width: 1024px) {
		position: absolute;
		z-index: 99;
	}
}
</style>