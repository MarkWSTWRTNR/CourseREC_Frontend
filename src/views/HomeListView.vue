<template>
    <div class="home">

        <section class="hero">
            <div class="hero-text container">
                <div class="content">
                    <img src="../assets/statisfied.jpg" class="feature-img anim" alt="">
                    <h1 class="anim">CourseREC<br>SYSTEM</h1>
                    <p class="anim">Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui quos, eos sint est eius
                        ducimus, atque
                        ut
                        exercitationem consectetur tempore adipisci soluta ipsa iure doloribus! Nam, repellat! Dolor,
                        labore
                        incidunt.</p>
                    <a href="#" class="btn anim">Get Start</a>
                    
                </div>
            </div>
        </section>
        <hr>
        <section>
            <div class="container content">
                <h1>lorem</h1>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Unde earum sed quis excepturi asperiores
                    corporis
                    aliquid quod harum cum a accusantium iusto nulla placeat quas officia ratione perspiciatis porro
                    iste
                    delectus rem, perferendis esse! Earum sapiente rem, laboriosam a quas eaque nihil in necessitatibus
                    optio
                    molestias amet esse veniam, eum tempora velit quos voluptatem cumque error ut, doloribus officia
                    sunt.
                    Repudiandae perspiciatis quibusdam minima labore id iste eaque consequuntur, illo dolore nemo a
                    laboriosam
                    quis! Ea facilis adipisci recusandae praesentium quisquam, repellat mollitia blanditiis ipsum
                    tenetur
                    tempore! Aliquid natus eum molestias consequuntur harum. Molestias officia obcaecati at nisi
                    accusamus
                    delectus sed dolorum sequi deleniti, temporibus quisquam asperiores nemo, iusto neque autem odio
                    adipisci
                    qui ea aspernatur ullam dolor blanditiis totam?</p>
            </div>
        </section>
    </div>
</template>
<script>

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

.btn {
    display: inline-block;
    text-decoration: none;
    padding: 14px 40px;
    color: #fff;
    background-image: linear-gradient(45deg, #df4881, #c430d7);
    font-size: 14px;
    border-radius: 30px;
    border-top-right-radius: 0;
    transition: 0.5s;
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

.btn:hover {
    border-top-right-radius: 30px;
}

.feature-img {
    width: 700px;
    position: absolute;
    bottom: 200px;
    right: 10%;
    z-index: -1;
}

.feature-img.anim {
    animation-delay: 1.5s;
}

.anim {
    opacity: 0;
    transform: translateY(30px);
    animation: moveup 0.5s linear forwards;
}

@keyframes moveup {
    100% {
        opacity: 1;
        transform: translateY(0px);
    }
}

/* ... existing styles ... */

/* Media Query for Tablets */
@media (max-width: 768px) {
    .content h1 {
        font-size: 50px;
    }

    .feature-img {
        position: absolute;
        top: 0;  /* Position at the top */
        left: 50%;  /* Center it horizontally */
        transform: translateX(-50%); /* Centering adjustment */
        width: 100%;  /* Let it take full width */
        bottom: auto; /* Reset the bottom property */
    }
    
    .hero-text {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}

/* Media Query for Mobile devices */
@media (max-width: 480px) {
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
}</style>