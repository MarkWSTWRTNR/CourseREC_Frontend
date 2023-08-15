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
import StudentInfo from '../components/StudentInfo.vue';
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
    path: '/student_info',
    name: 'StudentInfo',
    component: StudentInfo,
    props: route => ({ code: route.query.code })
  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
