<!-- HomeListView -->
<template>
    <div class="home">

        <section class="hero">
            <div class="hero-text container">
                <div class="content">
                    <h1 class="anim">CourseREC<br>SYSTEM</h1>
                    <img src="../assets/statisfied.jpg" class="feature-img anim" alt="">
                    <p class="anim container" style="text-align: center;">Decision Supporting System for CMU Students</p>
                    <a href="#animate-section3" class="custom-btn btn-5_2 form-control anim">GET START</a>
                    <a href="#animate-section2" class="a-to-sec2  btn-light"><img src="../assets/fast-forward.gif" style="width: 25px;
                transition: .5s ease all;" alt="">About us</a>
                </div>
            </div>
        </section>
        <hr>
        <section class="hero " id="animate-section2">
            <div class="hero-text container">
                <img src="../assets/home-sec2.jpg" class="feature-img2 anim" alt="">
                <div class="text-right content">
                    <h4 class="anim">About us</h4>
                    <h1>Make your decision easier</h1>
                    <p class="anim container">CourseRec System is a web-based decision support tool designed to aid students
                        in study planning. It provides features like tracking grades and credit scores, offering curriculum
                        details, suggesting course recommendations, offering a general study guide, and hosting student
                        reviews.</p>
                </div>
            </div>
        </section>
        <hr>

        <section class="hero2" id="animate-section3">
            <div class="hero-text2 container">
                <h4 class="anim">WHAT WE DO</h4>
                <h1 class="anim">All the features you need to decide the best course for you.</h1>
                <h5 class="anim">These features can assist in selecting a course that facilitates graduation.</h5>
                <div class="cards-wrap anim">
                    <CardComponent :card="{
                        coverImage: require('@/assets/CourseList1.jpg'),
                        titleImage: '<h1>COURSE LIST</h1>',
                        characterImage: require('@/assets/CourseList2_1.png')
                    }" routeName="courselist" />
                    <CardComponent :card="{
                        coverImage: require('@/assets/curriculum1.jpg'),
                        titleImage: '<h1>CURRICULUM</h1>',
                        characterImage: require('@/assets/curriculum2.png')
                    }" routeName="curriculum" />

                    <CardComponent :card="{
                        coverImage: require('@/assets/finishedCourse1.jpg'),
                        titleImage: '<h1>COMPLETE COURSE</h1>',
                        characterImage: require('@/assets/finishedCourse2_1.jpg')
                    }" routeName="finishedcourse" />
                    <CardComponent :card="{
                        coverImage: require('@/assets/Recommendation1.jpg'),
                        titleImage: '<h1>RECOMMEND COURSE</h1>',
                        characterImage: require('@/assets/Recommendation2_1.jpg')
                    }" routeName="recommendcourse" />
                    <CardComponent :card="{
                        coverImage: require('@/assets/AI1.jpg'),
                        titleImage: '<h1>AI GUIDE</h1>',
                        characterImage: require('@/assets/AI2.jpg')
                    }" routeName="studyguide" />


                </div>
            </div>
        </section>
    </div>
</template>
<script>
import CardComponent from '../components/CardComponent.vue';
export default {
    name: "HomeListView",
    components: {
        CardComponent
    },
    mounted() {
        this.initAnimation('animate-section2');
        this.initAnimation('animate-section3');
    },
    methods: {
        initAnimation(sectionId) {
            const section = document.getElementById(sectionId);
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        section.classList.add('anim');
                    } else {
                        section.classList.remove('anim');
                    }
                });
            });
            observer.observe(section);
        }
    }
}
</script>
<style scoped>
.home {
    padding-top: 100px;

}

.hero {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.hero-text {
    text-align: center;

}

.hero2 {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin-top: 10%;
    margin-bottom: 20%;
}

.hero-text2 {
    text-align: center;
    margin-top: 10%;
    object-fit: cover;
}

.a-to-sec2 {
    display: flex;
    position: relative;
    color: #222;
    margin-top: 10%;
}

section {
    position: relative;
    z-index: 2;
}

.content {
    margin-top: 10%;
    max-width: 600px;

}

.content h1 {
    font-size: 70px;
    color: #222;
}

.content p {
    margin: 10px 0 30px;
    color: #333;
    animation-delay: 0.5s;
}

.content .btn {
    padding: 15px 80px;
    font-size: 16px;
    animation-delay: 1s;
}


.feature-img {
    width: 800px;
    position: absolute;
    bottom: 200px;
    right: 10%;
    z-index: -1;
}

.feature-img.anim {
    animation-delay: 1.5s;
}

.feature-img2 {
    width: 700px;
    position: absolute;
    bottom: 200px;
    left: 10%;
    z-index: -1;
}

.feature-img2.anim {
    animation-delay: 1.5s;
}

.text-right {
    margin-left: 700px;
}

.anim {
    opacity: 0;
    transform: translateY(30px);
    animation: moveup 0.5s linear forwards;
}

.anim .hero-text .content {
    opacity: 0;
    transform: translateY(30px);
    animation: moveup 1.2s linear forwards;
}

.cards-wrap {
    margin-top: 10%;
    margin-bottom: 10%;
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
}

@keyframes moveup {
    100% {
        opacity: 1;
        transform: translateY(0px);
    }
}

@media (max-width: 1140px) {
    .home {
        padding-top: 50px;

    }

    .content h1 {
        font-size: 50px;
    }

    .feature-img,
    .feature-img2 {
        position: relative;
        top: 0;
        left: 0;
        width: 75%;
        /* Adjust this for better sizing on smaller screens */
        margin: 2em auto;
        /* Center the images with some spacing */
    }

    .text-right {
        margin-left: 0px;
        text-align: center;
    }

    .hero-text {
        display: flex;
        flex-direction: column;
        align-items: center;

    }


    .hero-text2 {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: auto; /* Set height to auto to adapt to content */
        max-height: 70vh; /* Set a maximum height for section 3 */
        padding-top: 20px;
    }
    .hero-text2.container {
        overflow-y: auto;
    }
    .hero-text2 h1 {
        font-size: 45px;
    }

    .hero-text2 h4 {
        font-size: 20px;
    }

    .cards-wrap {
        margin-top: 30%;
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        z-index: 1;
    }
}
</style>
