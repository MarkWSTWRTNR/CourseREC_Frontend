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
import { ROLES } from "@/service/roles";
const routes = [

  {
    path: "/curriculum",
    name: "curriculum",
    component: CurriculumView,
    meta: { roles: [ROLES.ADMIN, ROLES.STUDENT] }
  },
  {
    path: "/course_list",
    name: "courselist",
    component: CourseListView,
    meta: { roles: [ROLES.STUDENT] }
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { roles: [ROLES.STUDENT] }
  },
  {
    path: "/studentstudyplan",
    name: "studentstudyplan",
    component: StudentStudyPlanView,
    meta: { roles: [ROLES.STUDENT] }
  },
  {
    path: "/recommendcourse",
    name: "recommendcourse",
    component: RecommendCourseView,
    meta: { roles: [ROLES.STUDENT] }
  },
  {
    path: "/studyguide",
    name: "studyguide",
    component: StudyGuideView,
    meta: { roles: [ROLES.STUDENT] }
  },
  {
    path: "/finishedcourse",
    name: "finishedcourse",
    component: FinishedCourseView,
    meta: { roles: [ROLES.STUDENT] }
  },
  {
    path: '/courseByCourseId/:courseId',
    name: 'coursedetails',
    component: CourseDetailView,
    meta: { roles: [ROLES.STUDENT, ROLES.ADMIN] },
    props: true
  }, {
    path: '/faculty',
    name: 'faculty',
    component: FacultyView,
    meta: { roles: [ROLES.STUDENT, ROLES.ADMIN] }
  },
  {
    path: '/courseprogram',
    name: 'courseprogram',
    component: CourseProgramView,
    meta: { roles: [ROLES.ADMIN] }
  }, 
  {
    path: '/userInfo',
    name: 'UserInfo',
    component: UserInfo,

  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.roles)) {
    // Check if user is not logged in
    if (!LoginService.isLoggedIn()) {
      // Redirect to login page or another appropriate page
      next({ name: 'UserInfo' });
    } else {
      next(); // Allow navigation
    }
  } else {
    next(); // Allow navigation for routes that don't require authentication
  }
});
export default router;
