<template>
    <!-- Site footer -->
    <footer class="site-footer">
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-6">
                    <h6>CourseREC</h6>
                    <p class="text-justify">CourseRec System is an intuitive web-based platform tailored to empower students
                        in their academic journey. Beyond simply tracking grades and credit scores, it offers a
                        comprehensive insight into curriculum details, provides personalized course recommendations,
                        presents curated study guides, and fosters a community through student reviews.</p>
                </div>
                <div class="col-xs-6 col-md-3">
                    <h6>Quick Links</h6>
                    <ul class="footer-links">
                        <!-- Everyone can see -->
                        <li><router-link class="link " :to="{ name: 'home' }"> Home</router-link></li>


                        <!-- only Admin can see -->
                        <li v-if="isAdmin"><router-link class="link" :to="{ name: 'courselist' }"> Course list</router-link>
                        </li>
                        <li v-if="isAdmin"><router-link class="link" :to="{ name: 'curriculum' }"> Curriculum</router-link>
                        </li>


                        <!-- only student can see -->

                        <li v-if="isStudent"><router-link class="link" :to="{ name: 'courselist' }"> Course
                                List</router-link></li>
                        <li v-if="isStudent"><router-link class="link" :to="{ name: 'curriculum' }">
                                Curriculum</router-link></li>
                        <li v-if="isStudent"><router-link class="link" :to="{ name: 'recommendcourse' }"> Recommend
                                Course</router-link>
                        </li>
                        <li v-if="isStudent"><router-link class="link" :to="{ name: 'finishedcourse' }"> Finished
                                Course</router-link>
                        </li>
                        <li v-if="isStudent"><router-link class="link" :to="{ name: 'studyguide' }"> Study
                                Guide</router-link></li>
                    </ul>
                </div>
                <div class="col-xs-6 col-md-3">
                    <h6>Contact us</h6>
                    <ul class="footer-links">
                        <li>(+66) 84-1145539</li>
                        <li>Mark3wst@gmail.com</li>
                        <li>Chaing Mai, Thailand</li>
                    </ul>
                </div>


            </div>
            <hr>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-8 col-sm-6 col-xs-12">
                    <p class="copyright-text">Copyright &copy; 2023 All Rights Reserved by <a href="#">Scanfcode</a>.</p>
                </div>

                <div class="col-md-4 col-sm-6 col-xs-12">
                    <ul class="social-icons">
                        <div class="wrapper">
                            <p>Follow us:</p>
                            <li><a class="linkedin" href="https://www.linkedin.com/in/wongsathorn-woratanarat-657852267/"><i
                                        class="bi bi-linkedin"></i></a></li>
                            <li><a class="facebook" href="https://web.facebook.com/Mark3WST"><i
                                        class="bi bi-facebook"></i></a></li>
                            <li><a class="instagram" href="https://www.instagram.com/mark_wst/"><i
                                        class="bi bi-instagram"></i></a></li>
                            <li><a class="youtube" href="https://www.youtube.com/channel/UCwku0LhJ27tbTCDzFANxXqg"><i
                                        class="bi bi-youtube"></i></a></li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
</template>
<script>
import { userRole, ROLES } from '@/service/roles';
export default {
    name: 'Footer',
    data() {
        return {
            userInfo: null,
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
}
</script>
<style scoped>
.site-footer {
    background-color: #26272b;
    padding: 45px 0 20px;
    font-size: 15px;
    line-height: 24px;
    color: #ffffffb9;
    position: relative;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    /* Adjust as needed */
}

.wrapper {
    display: flex;
    gap: 0.2em;
    justify-content: center;
    flex-wrap: wrap;
}

.wrapper p {

    position: center;
    margin-top: auto;

}

.site-footer hr {
    border-top-color: #bbb;
    opacity: 0.5;
}

.site-footer hr.small {
    margin: 20px 0;
}

.site-footer h6 {
    color: #fff;
    font-size: 16px;
    text-transform: uppercase;
    margin-top: 5px;
    letter-spacing: 2px;
}

.site-footer a {
    color: #ffffffb9;
}

.site-footer a:hover {
    color: #3366cc;
    text-decoration: none;
}

.footer-links {
    padding-left: 0;
    list-style: none;
}

.footer-links li {
    display: block;
}

.footer-links a {
    color: #ffffffb9;
}

.footer-links a:active,
.footer-links a:focus,
.footer-links a:hover {
    color: #3366cc;
    text-decoration: none;
}

.footer-links.inline li {
    display: inline-block;
}

.site-footer .social-icons {
    text-align: right;
}

.site-footer .social-icons a {
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin-left: 6px;
    margin-right: 0;
    border-radius: 100%;
    background-color: #33353d;
}

.copyright-text {
    margin: 0;
}

@media (max-width: 991px) {
    .site-footer [class^=col-] {
        margin-bottom: 30px;
    }
}

@media (max-width: 767px) {
    .site-footer {
        padding-bottom: 0;
    }

    .site-footer .copyright-text,
    .site-footer .social-icons {
        text-align: center;
    }
}

.social-icons {
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
}

.social-icons li {
    display: inline-block;
    margin-bottom: 4px;
}

.social-icons li.title {
    margin-right: 15px;
    text-transform: uppercase;
    color: #96a2b2;
    font-weight: 700;
    font-size: 13px;
}

.social-icons a {
    background-color: #eceeef;
    color: #818a91;
    font-size: 16px;
    display: inline-block;
    line-height: 44px;
    width: 44px;
    height: 44px;
    text-align: center;
    margin-right: 8px;
    border-radius: 100%;
    transition: all .2s linear;
}

.social-icons a:active,
.social-icons a:focus,
.social-icons a:hover {
    color: #fff;
    background-color: #29aafe;
}

.social-icons.size-sm a {
    line-height: 34px;
    height: 34px;
    width: 34px;
    font-size: 14px;
}

.social-icons a.facebook:hover {
    background-color: #3b5998;
}

.social-icons a.instagram:hover {
    background-color: #ea4c89;
}

.social-icons a.linkedin:hover {
    background-color: #007bb6;
}

.social-icons a.youtube:hover {
    background-color: #ea4c4c;
}

@media (max-width: 1140px) {
    .social-icons li.title {
        display: block;
        margin-right: 0;
        font-weight: 600;
    }
}</style>
  