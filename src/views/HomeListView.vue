<template>
        <div class="home root">
            <img class="background" ref="background" src="../assets/tree-1.jpg" />
            <img class="foreground" ref="foreground" src="../assets/pngwing.com.png" />
            <div class="hero section section-1" ref="first">
                <div class="hero-text container">
                    <h4>Project</h4>
                    <hr />
                    <h2>
                        CourseREC <br />
                        SYSTEM
                    </h2>
                    <hr />
                </div>
            </div>
            <div class="section section-2" ref="second">
                <div>
                    <h2>Here's more info</h2>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit...</p>
                </div>
            </div>
        </div>
</template>
  
<script>
// @ is an alias to /src
import { ref, onMounted, onUnmounted } from 'vue'
export default {
    name: "Home",
    components: {},
    setup() {
        const foreground = ref(null)
        const background = ref(null)
        const first = ref(null)
        const second = ref(null)
        onMounted(() => {
            document.addEventListener('scroll', handleScroll)
        })

        onUnmounted(() => {
            document.removeEventListener('scroll', handleScroll)
        })
        const handleScroll = (evt) => {
            const scrollY = window.scrollY;

            // decreases as user scrolls
            first.value.style.opacity =
                (100 - (scrollY + window.innerHeight - first.value.offsetHeight)) / 100;
            // increases as user scrolls
            second.value.style.opacity =
                (scrollY + window.innerHeight - second.value.offsetTop) / 100;

            const maxBackgroundSize = 120;
            const backgroundSize = scrollY / (maxBackgroundSize - 100); // increases as user scrolls

            // zoom the background at a slower rate
            background.value.style.transform =
                'scale(' + (100 + backgroundSize * 0.4) / 100 + ')';

            // Fade out the foreground as user scrolls
            const maxScrollForFade = first.value.offsetHeight;
            const opacity = 1 - (scrollY / maxScrollForFade);
            foreground.value.style.opacity = Math.max(opacity, 0); // Ensure opacity doesn't go below 0

            foreground.value.style.transform =
                'scale(' + (100 + backgroundSize) / 100 + ')';
        }


        return {
            foreground,
            background,
            first,
            second,
        }
    },
};
</script>

<style lang="scss" scoped>
img.background,
img.foreground {
    /* Fill background */
    min-height: 100%;
    min-width: 1024px;

    /* Scale proportionately */
    width: 100%;
    height: auto;
}

img.background {
    /* Positioning */
    position: fixed;
    top: 0;
    left: 0;
}

.section {
    min-height: 100vh;
    position: relative;
}

.section>div {
    position: fixed;
    color: white;
    /* centers this div */
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.section-1 {
    margin-bottom: 500px;
    /* determines the gap between our two sections */
    font-size: 4em;
}

.section-2 {
    opacity: 0;
    /* defaults to 0 because it's not visible */
}

.section-2 div {
    background-color: rgba(255, 255, 255, 0.7);
    color: black;
    text-align: center;
    padding: 50px;
    max-width: 300px;
}

.section-2 h2 {
    font-size: 2em;
    margin-bottom: 40px;
}

.section-2 p {
    line-height: 150%;
}
.hero {
    background: var(--background-page);
    background-attachment: fixed;
    position: relative;
    height: 100vh;

    img {
        object-fit: cover;
        height: 100%;
        width: 100%;
    }

    .hero-text {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: #fff;

        h4 {
            text-transform: uppercase;
            font-size: 22px;
            padding-bottom: 4px;
        }

        h2 {
            font-size: 50px;

            @media (min-width: 550px) {
                font-size: 80px;
            }
        }

        hr:nth-child(2) {
            max-width: 365px;
            margin-bottom: 16px;
        }

        hr:nth-child(4) {
            height: 6px;
            background-color: #fff;
            border: none;
            max-width: 85px;
            margin-top: 16px;
        }
    }
}</style>