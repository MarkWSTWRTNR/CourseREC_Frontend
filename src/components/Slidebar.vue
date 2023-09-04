<template>
	<aside :class="`${is_expanded ? 'is-expanded' : ''}`">
		<div class="logo" :class="{ 'zoomed': is_expanded }">
			<img :src="logoURL" alt="logo" />
		</div>


		<div class="menu-toggle-wrap">
			<button class="menu-toggle" @click="ToggleMenu">
				<span class="material-symbols-outlined"><lord-icon src="https://cdn.lordicon.com/ompsjcne.json"
						trigger="hover" colors="outline:#121331,primary:#ebe6ef" stroke="100"
						style="width:30px;height:30px">
					</lord-icon></span>
			</button>
		</div>

		<h3>Menu</h3>
		<div class="menu">
			<router-link to="/home" class="button">
				<span class="material-symbols-outlined"><lord-icon src="https://cdn.lordicon.com/etqbfrgp.json"
						trigger="hover"
						colors="outline:#131432,primary:#667179,secondary:#6d1225,tertiary:#b2937a,quaternary:#adb2b8"
						style="width:50px;height:50px">
					</lord-icon></span>
				<span class="text">Home</span>
			</router-link>
		</div>
		<div class="menu" v-if="userRole === ROLES.ROLE_ADMIN">
			<div v-if="isLoggedIn">
				<router-link to="/course_list" class="button">
					<span class="material-symbols-outlined"><lord-icon src="https://cdn.lordicon.com/iqocwzif.json"
							trigger="hover" colors="primary:#6d1225,secondary:#b2937a" style="width:50px;height:50px">
						</lord-icon> </span>
					<span class="text">Course list</span>
				</router-link>
				<router-link to="/curriculum" class="button">
					<span class="material-symbols-outlined"><lord-icon src="https://cdn.lordicon.com/sjtkwowv.json"
							trigger="morph" colors="primary:#6d1225,secondary:#121331,tertiary:#b2937a,quaternary:#667179"
							style="width:50px;height:50px">
						</lord-icon></span>
					<span class="text">Curriculum</span>
				</router-link>
			</div>
		</div>
		<div class="menu" v-if="userRole === ROLES.ROLE_STUDENT">
			<div v-if="isLoggedIn">
				<router-link to="/dashboard" class="button">
					<span class="material-symbols-outlined"><lord-icon src="https://cdn.lordicon.com/hbwqfgcf.json"
							trigger="hover" colors="outline:#121331,primary:#667179,secondary:#b2937a,tertiary:#6d1225"
							style="width:50px;height:50px">
						</lord-icon></span>
					<span class="text">Dashboard</span>
				</router-link>
				<router-link to="/course_list" class="button">
					<span class="material-symbols-outlined"><lord-icon src="https://cdn.lordicon.com/iqocwzif.json"
							trigger="hover" colors="primary:#6d1225,secondary:#b2937a" style="width:50px;height:50px">
						</lord-icon></span>
					<span class="text">Course List</span>
				</router-link>
				<router-link to="/curriculum" class="button">
					<span class="material-symbols-outlined"><lord-icon src="https://cdn.lordicon.com/sjtkwowv.json"
							trigger="morph" colors="primary:#6d1225,secondary:#121331,tertiary:#b2937a,quaternary:#667179"
							style="width:50px;height:50px">
						</lord-icon></span>
					<span class="text">Curriculum</span>
				</router-link>

				<router-link to="/recommendcourse" class="button">
					<span class="material-symbols-outlined"><lord-icon src="https://cdn.lordicon.com/snnvmbic.json"
							trigger="morph" colors="outline:#121331,primary:#6d1225,secondary:#B2937A"
							style="width:50px;height:50px">
						</lord-icon></span>
					<span class="text">Recommend Course</span>
				</router-link>
				<router-link to="/finishedcourse" class="button">
					<span class="material-symbols-outlined"><lord-icon src="https://cdn.lordicon.com/ttioogfl.json"
							trigger="morph"
							colors="primary:#121331,secondary:#667179,tertiary:#6d1225,quaternary:#b2937a,quinary:#adb2b8"
							style="width:50px;height:50px">
						</lord-icon></span>
					<span class="text">Finished Course</span>
				</router-link>
				<router-link to="/studyguide" class="button">
					<span class="material-symbols-outlined"><lord-icon src="https://cdn.lordicon.com/coowbsor.json"
							trigger="hover" colors="outline:#121331,primary:#b2937a,secondary:#6d1225,tertiary:#ebe6ef"
							style="width:50px;height:50px">
						</lord-icon></span>
					<span class="text">Study Guide</span>
				</router-link>
			</div>
		</div>

		<div class="flex"></div>
		<div class="menu">
			<router-link to="/userInfo" class="button">
				<span><lord-icon src="https://cdn.lordicon.com/dqxvvqzi.json" trigger="hover"
						colors="outline:#121331,primary:#b2937a,secondary:#6d1225" style="width:50px;height:50px;">
					</lord-icon></span>
				<span class="text">UserInfo</span>
			</router-link>

			<!-- If user is logged in, show Logout button, else show Login button -->
			<button v-if="isLoggedIn" @click="logout" class="button">
				<span class="material-symbols-outlined"><lord-icon src="https://cdn.lordicon.com/qsacmnwj.json"
						trigger="hover" colors="outline:#121331,primary:#6d1225,secondary:#b2937a"
						style="width:50px;height:50px">
					</lord-icon></span>
				<span class="text">Logout</span>
			</button>
			<button v-else @click="login" class="button">
				<span class="material-symbols-outlined"><lord-icon src="https://cdn.lordicon.com/qsacmnwj.json"
						trigger="hover" colors="outline:#121331,primary:#b2937a,secondary:#6d1225"
						style="width:50px;height:50px">
					</lord-icon></span>
				<span class="text">Login with CMU account</span>
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

	width: calc(2rem + 60px);
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
			width: 50px;
			height: 60px;
			transition: transform 0.2s ease-in-out;
			/* Add transition property */
		}
	}

	.zoomed {
		img {
			transform: scale(1.5);
			/* Increase the scale for zoom effect */
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