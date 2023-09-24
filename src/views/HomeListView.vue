<!-- HomeListView -->
<template>
    <div class="home">

        <section class="hero">
            <div class="hero-text container">
                <div class="content">
                    <h1 class="anim">CourseREC<br>SYSTEM</h1>
                    <img src="../assets/statisfied.jpg" class="feature-img anim" alt="">
                    <p class="anim container">Decision Supporting System for CMU Students</p>
                    <a href="#" class="btn anim">Get Start</a>

                </div>
            </div>
        </section>
        <hr>
        <section class="hero " id="animate-section">
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
        <section class="hero">
            <div class="hero-text container">
                <h4>Features</h4>
                <h1>All the features you need to decide the best course for you.</h1>
                <div class="cards-wrapper">
                    <CardComponent :card="{
                        link: 'https://www.mythrillfiction.com/the-dark-rider',
                        coverImage: 'https://ggayane.github.io/css-experiments/cards/dark_rider-cover.jpg',
                        titleImage: 'https://ggayane.github.io/css-experiments/cards/dark_rider-title.png',
                        characterImage: 'https://ggayane.github.io/css-experiments/cards/dark_rider-character.webp'
                    }" />

                    <CardComponent :card="{
                        link: 'https://www.mythrillfiction.com/force-mage',
                        coverImage: 'https://ggayane.github.io/css-experiments/cards/force_mage-cover.jpg',
                        titleImage: 'https://ggayane.github.io/css-experiments/cards/force_mage-title.png',
                        characterImage: 'https://ggayane.github.io/css-experiments/cards/force_mage-character.webp'
                    }" />
                </div>

            </div>
        </section>
        <hr>
        <section></section>
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
        this.initAnimation();
    },
    methods: {
        initAnimation() {
            const section = document.getElementById('animate-section');
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
<style>
.home {
    padding-top: 100px;
    overflow: hidden;
}

.hero {
    position: relative;
    z-index: 1;
    display: flex;
    /* Make the container a Flex container */
    justify-content: center;
    /* Center horizontally */
    align-items: center;
    /* Center vertically */
    height: 100vh;
    /* Set height to viewport height, adjust as needed */
    overflow: hidden;
}

.hero-text {
    text-align: center;
    /* Optional: for better presentation */
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
    animation: moveup 0.5s linear forwards;
}

.cards-wrapper {
    display:flex;
    gap: 2rem;
    /* spacing between cards */
    justify-content: center;
    /* center the cards horizontally */
    flex-wrap: wrap;
    /* allows the cards to wrap to the next line if necessary */
    margin: 18rem;
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
        overflow: hidden;
    }

    .content h1 {
        font-size: 50px;
    }

    .feature-img {
        position: static;
        top: 0;
        left: 50%;
        transform: translateY(50%);
        width: 100%;
        bottom: auto;
        margin: auto;
    }

    .feature-img2 {
        position: static;
        top: 0;
        left: 50%;
        transform: translateX(50%);
        width: 80%;
        bottom: auto;
        margin: auto;
    }

    .text-right {
        margin-left: 0px;
    }

    .hero-text {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .cards-wrapper {
        flex-direction: column;
        align-items: center;
        /* center the cards vertically on mobile devices */
    }
}
</style>
<!-- /* Media Query for Mobile devices */
/* @media (max-width: 480px) {
    .home {
        padding-top: 50px;
    }

    .content {
        margin-top: 5%;
    }

    .content h1 {
        font-size: 30px;
    }

    .content p {
        font-size: 16px;
    }

    .content .btn {
        padding: 10px 40px;
        font-size: 14px;
    }

    .btn {
        padding: 10px 20px;
    }

    .feature-img {
        width: 100%;
    }
} */ -->
