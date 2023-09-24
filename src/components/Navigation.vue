<template>
    <header :class="{ 'scrolled-nav': scrolledNav }">
        <nav>
            <div class="branding">
                <img src="@/assets/logo2.png" alt="">
            </div>
            <ul v-show="!mobile" class="navigation">
                <!-- Everyone can see -->
                <li><router-link class="link" :to="{ name: 'home' }"> Home</router-link></li>


                <!-- only Admin can see -->
                <li v-if="isAdmin"><router-link class="link" :to="{ name: 'curriculum' }"> Course list</router-link></li>
                <li v-if="isAdmin"><router-link class="link" :to="{ name: 'courselist' }"> Curriculum</router-link></li>


                <!-- only student can see -->
               
                <li v-if="isStudent"><router-link class="link" :to="{ name: 'courselist' }"> Course List</router-link></li>
                <li v-if="isStudent"><router-link class="link" :to="{ name: 'curriculum' }"> Curriculum</router-link></li>
                <li v-if="isStudent"><router-link class="link" :to="{ name: 'recommendcourse' }"> Recommend
                        Course</router-link>
                </li>
                <li v-if="isStudent"><router-link class="link" :to="{ name: 'finishedcourse' }"> Finished
                        Course</router-link>
                </li>
                <li v-if="isStudent"><router-link class="link" :to="{ name: 'studyguide' }"> Study Guide</router-link></li>
                <!-- Admin and student can see -->
                <li v-if="isEitherAdminOrStudent">
                    <router-link class="link" :to="{ name: 'UserInfo' }">UserInfo: {{ cmuitaccount_name }}</router-link>
                </li>
                <!-- Everyone can see -->
                <li v-if="isLoggedIn">
                    <router-link class="custom-btn btn-5 form-control " to="#" @click.native="logout">
                        <span class="text">Logout</span>
                    </router-link>
                </li>
                <li v-else>
                    <router-link class="custom-btn btn-5" to="#" @click.native="login">
                        <span class="text">Login with CMU account</span>
                    </router-link>
                </li>
            </ul>
            <!-- Hamburger bar -->
            <div class="icon">
                <i @click="toggleMobileNav" v-show="mobile" class="far fa-bars" :class="{ 'icon-active': mobileNav }"></i>
            </div>
            <transition name="mobile-nav">
                <ul v-show="mobileNav" class="dropdown-nav">
                    <!-- Everyone can see -->
                    <li><router-link class="link" :to="{ name: 'home' }"><lord-icon
                                src="https://cdn.lordicon.com/etqbfrgp.json" trigger="hover"
                                colors="outline:#131432,primary:#667179,secondary:#6d1225,tertiary:#b2937a,quaternary:#adb2b8"
                                style="width:50px;height:50px">
                            </lord-icon> Home</router-link></li>

                    <!-- only Admin can see -->
                    <li v-if="isAdmin"><router-link class="link" :to="{ name: 'courselist' }"><lord-icon
                                src="https://cdn.lordicon.com/iqocwzif.json" trigger="hover"
                                colors="primary:#6d1225,secondary:#b2937a" style="width:50px;height:50px">
                            </lord-icon> Course list</router-link></li>
                    <li v-if="isAdmin"><router-link class="link" :to="{ name: 'curriculum' }"><lord-icon
                                src="https://cdn.lordicon.com/sjtkwowv.json" trigger="morph"
                                colors="primary:#6d1225,secondary:#121331,tertiary:#b2937a,quaternary:#667179"
                                style="width:50px;height:50px">
                            </lord-icon> Curriculum</router-link></li>
                    <!-- only student can see -->
                    <li v-if="isStudent"><router-link class="link" :to="{ name: 'courselist' }"><lord-icon
                                src="https://cdn.lordicon.com/iqocwzif.json" trigger="hover"
                                colors="primary:#6d1225,secondary:#b2937a" style="width:50px;height:50px">
                            </lord-icon> Course List</router-link>
                    </li>
                    <li v-if="isStudent"><router-link class="link" :to="{ name: 'curriculum' }"><lord-icon
                                src="https://cdn.lordicon.com/sjtkwowv.json" trigger="morph"
                                colors="primary:#6d1225,secondary:#121331,tertiary:#b2937a,quaternary:#667179"
                                style="width:50px;height:50px">
                            </lord-icon> Curriculum</router-link>
                    </li>
                    <li v-if="isStudent"><router-link class="link" :to="{ name: 'recommendcourse' }"><lord-icon
                                src="https://cdn.lordicon.com/snnvmbic.json" trigger="morph"
                                colors="outline:#121331,primary:#6d1225,secondary:#B2937A" style="width:50px;height:50px">
                            </lord-icon> Recommend Course</router-link></li>
                    <li v-if="isStudent"><router-link class="link" :to="{ name: 'finishedcourse' }"><lord-icon
                                src="https://cdn.lordicon.com/ttioogfl.json" trigger="morph"
                                colors="primary:#121331,secondary:#667179,tertiary:#6d1225,quaternary:#b2937a,quinary:#adb2b8"
                                style="width:50px;height:50px">
                            </lord-icon> Finished Course</router-link></li>
                    <li v-if="isStudent"><router-link class="link" :to="{ name: 'courselist' }"><lord-icon
                                src="https://cdn.lordicon.com/zfuqnliu.json" trigger="hover"
                                colors="outline:#121331,primary:#3a3347,secondary:#667179,tertiary:#e1d084,quaternary:#6d1225,quinary:#b2937a,senary:#e3c0ac"
                                style="width:50px;height:50px">
                            </lord-icon> Study Guide</router-link>
                    </li>
                    <!-- Admin and student can see -->
                    <li v-if="isEitherAdminOrStudent"><router-link class="link" :to="{ name: 'UserInfo' }"><lord-icon
                                src="https://cdn.lordicon.com/dqxvvqzi.json" trigger="hover"
                                colors="outline:#121331,primary:#b2937a,secondary:#6d1225" style="width:50px;height:50px;">
                            </lord-icon> UserInfo: {{ cmuitaccount_name }}</router-link></li>

                    <!-- Everyone can see -->
                    <li v-if="isLoggedIn">
                        <button class="custom-btn btn-5" to="#" @click.native="logout">
                            <lord-icon src="https://cdn.lordicon.com/qsacmnwj.json" trigger="hover"
                                colors="outline:#121331,primary:#6d1225,secondary:#b2937a" style="width:50px;height:50px">
                            </lord-icon>
                            <span class="text">Logout</span>
                        </button>
                    </li>
                    <li v-else>
                        <button class="custom-btn btn-5" to="#" @click.native="login">
                            <lord-icon src="https://cdn.lordicon.com/qsacmnwj.json" trigger="hover"
                                colors="outline:#121331,primary:#b2937a,secondary:#6d1225" style="width:50px;height:50px">
                            </lord-icon>
                            <span class="text">Login with CMU account</span>
                        </button>
                    </li>
                </ul>
            </transition>
        </nav>
    </header>
</template>
  
<script>
import { userRole, ROLES } from '@/service/roles';
import LoginService from '@/service/LoginService';
import router from '@/router';
export default {
    name: "navigation",
    data() {
        return {
            scrolledNav: null,
            scrollPosition: null,
            mobile: null,
            mobileNav: null,
            widowWidth: null,
            accessToken: null,
            userInfo: null,
            cmuitaccount_name: null,
        }
    },
    computed: {
        isAdmin() {
            return userRole.value === ROLES.ROLE_ADMIN;
        },
        isStudent() {
            return userRole.value === ROLES.ROLE_STUDENT;
        },
        isLoggedIn() {
            return !!this.accessToken;
        },
        isEitherAdminOrStudent() {
            return this.isAdmin || this.isStudent;
        },
    },
    created() {
        this.accessToken = LoginService.getStoredAccessToken();
        window.addEventListener('resize', this.checkScreen);
        this.checkScreen();

        // Check for user role in local storage
        const storedUserRole = localStorage.getItem('userRole');
        if (storedUserRole) {
            userRole.value = storedUserRole; // Assuming userRole is a ref or reactive variable
        }
    },
    mounted() {
        window.addEventListener("scroll", this.updateScroll);
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const userInfo = JSON.parse(storedUserInfo);
            this.cmuitaccount_name = userInfo.cmuitaccount_name;
        }

        // If userRole is not set, fetch it from the server
        if (!userRole.value && this.accessToken) {
            LoginService.fetchUserInfo(this.accessToken).then(response => {
                const userData = response.data;
                userRole.value = userData.role;
                localStorage.setItem('userRole', userData.role);
            });
        }
    },
    methods: {
        toggleMobileNav() {
            this.mobileNav = !this.mobileNav
        },
        updateScroll() {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 50) {
                this.scrolledNav = true;
                return;
            }
            this.scrolledNav = false;
        },
        checkScreen() {
            this.windowWidth = window.innerWidth;
            if (this.windowWidth <= 1025) {
                this.mobile = true;
                return;
            }
            this.mobile = false;
            this.mobileNav = false;
        },
        login() {
            LoginService.login().then((response) => {
                this.accessToken = response.data;
                window.location.href = response.data; // Redirect for authentication

                // After successful login, set the user role
                LoginService.fetchUserInfo(this.accessToken).then(response => {
                    const userData = response.data;
                    userRole.value = userData.role;
                    localStorage.setItem('userRole', userData.role);
                });
            });
        },
        logout() {
            localStorage.removeItem('access_token');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userRole'); // Clear user role
            this.accessToken = null;
            this.userInfo = null;
            this.cmuitaccount_name = null;
            router.push({ name: 'home' }).then((response) => {
                window.location.reload();
            });
        },
    }
};
</script>

  
<style lang="scss" scoped>
header {
    background-color: rgb(255, 255, 255);
    z-index: 99;
    width: 100%;
    position: fixed;
    transition: .5s ease all;
    color: #fff;

    nav {
        position: relative;
        display: flex;
        flex-direction: row;
        padding: 12px 0;
        transition: .5s ease all;
        width: 90%;
        margin: 0 auto;

        @media (min-width: 1140px) {
            max-width: 1140px;
        }

        ul,
        .link {
            font-weight: 500;
            color: #000000;
            list-style: none;
            text-decoration: none;
        }

        li {
            text-transform: uppercase;
            padding: 16px;
            margin-left: 16px;
        }

        .link {
            font-size: 14px;
            transition: .5s ease all;
            padding-bottom: 4px;
            border-bottom: 1px solid transparent;

            &:hover {
                color: #00afea;
                border-color: #00afea;
            }
        }

        .branding {
            display: flex;
            align-items: center;

            img {
                width: 150px;
                transition: .5s ease all;
            }
        }

        .navigation {
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: flex-end;
        }

        .icon {
            display: flex;
            align-items: center;
            position: absolute;
            top: 0%;
            right: 24px;
            height: 100%;

            i {
                cursor: pointer;
                font-size: 24px;
                transition: .8s ease all;
            }
        }

        .icon-active {
            transform: rotate(180deg);
        }

        .dropdown-nav {
            display: flex;
            flex-direction: column;
            position: fixed;
            width: 100%;
            max-width: 250px;
            height: 100%;
            background-color: #fff;
            top: 0;
            left: 0;

            li {
                margin-left: 0;

                .link {
                    color: #000
                }
            }
        }

        .mobile-nav-enter-active,
        .mobile-nav-leave-active {
            transition: 1s ease all;
        }

        .mobile-nav-enter-from,
        .mobile-nav-leave-to {
            transform: translateX(-250px);
        }

        .mobile-nav-enter-to {
            transform: translateX(0);
        }
    }
}

.scrolled-nav {
    background-color: #000;
    box-shadow: 0 4px 6px -1 rgba(0, 0, 0, 1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    .link {
        color: white;
    }

    nav {
        padding: 8px 0;

        .branding {
            img {
                width: 100px;
                box-shadow: 0 4px 6px -1 rgba(0, 0, 0, 1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

            }
        }
    }
}
</style>