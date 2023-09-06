import { createRouter, createWebHistory } from "vue-router";
import CurriculumView from "../views/CurriculumView.vue";
import CourseListView from "@/views/CourseListView.vue";
import DashboardView from "../views/DashboardView.vue";
import StudentStudyPlanView from "../views/StudentStudyPlanView.vue";
import RecommendCourseView from "../views/RecommendCourseView.vue";
import StudyGuideView from "../views/StudyGuideView.vue";
import FinishedCourseView from "../views/FinishedCourseView.vue";
import CourseDetailView from "../components/CourseDetailView.vue"
import FacultyView from "../components/FacultyView.vue";
import CourseProgramView from "../components/CourseProgramView.vue"
import UserInfo from '../components/UserInfo.vue';
import LoginService from "@/service/LoginService";
import HomeListView from "@/views/HomeListView.vue"
import ForbiddenPage from "../components/ForbiddenPage.vue"
import { userRole, ROLES } from "@/service/roles";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeListView,
  }
  ,
  {
    path: "/curriculum",
    name: "curriculum",
    component: CurriculumView,
    meta: { roles: [ROLES.ROLE_ADMIN, ROLES.ROLE_STUDENT] }
  },
  {
    path: "/course_list",
    name: "courselist",
    component: CourseListView,
    meta: { roles: [ROLES.ROLE_ADMIN, ROLES.ROLE_STUDENT] }
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { roles: [ROLES.ROLE_STUDENT] }
  },
  {
    path: "/studentstudyplan",
    name: "studentstudyplan",
    component: StudentStudyPlanView,
    meta: { roles: [ROLES.ROLE_STUDENT] }
  },
  {
    path: "/recommendcourse",
    name: "recommendcourse",
    component: RecommendCourseView,
    meta: { roles: [ROLES.ROLE_STUDENT] }
  },
  {
    path: "/studyguide",
    name: "studyguide",
    component: StudyGuideView,
    meta: { roles: [ROLES.ROLE_STUDENT] }
  },
  {
    path: "/finishedcourse",
    name: "finishedcourse",
    component: FinishedCourseView,
    meta: { roles: [ROLES.ROLE_STUDENT] }
  },
  {
    path: '/courseByCourseId/:courseId',
    name: 'coursedetails',
    component: CourseDetailView,
    meta: { roles: [ROLES.ROLE_STUDENT, ROLES.ROLE_ADMIN] },
    props: true
  }, {
    path: '/faculty',
    name: 'faculty',
    component: FacultyView,
    meta: { roles: [ROLES.ROLE_STUDENT, ROLES.ROLE_ADMIN] }
  },
  {
    path: '/courseprogram',
    name: 'courseprogram',
    component: CourseProgramView,
    meta: { roles: [ROLES.ROLE_ADMIN] }
  },
  {
    path: '/userInfo',
    name: 'UserInfo',
    component: UserInfo,

  },
  {
    path: '/forbiddenPage',
    name: 'ForbiddenPage', 
    component: ForbiddenPage
  },



];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.roles)) {
    // Check if user is not logged in
    if (!LoginService.isLoggedIn()) {
      // Redirect to login page or another appropriate page
      next({ name: 'UserInfo' });
    } else {
      // Fetch user data to get the role
      try {
        const response = await LoginService.fetchUserInfo(localStorage.getItem('access_token'));
        const userData = response.data;
        const userRoleValue = userData.role;

        // Check if the user's role matches the required roles
        if (to.meta.roles.includes(userRoleValue)) {
          userRole.value = userRoleValue; // Update the user role
          next(); // Allow navigation
        } else {
          // Redirect to a forbidden or access-denied page
          next({ name: 'ForbiddenPage' }); // Adjust the name as needed
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        next(false); // Prevent navigation on error
      }
    }
  } else {
    next(); // Allow navigation for routes that don't require authentication
  }
});


export default router;
