<template>
    <div class="home hero-text container">
        <div class="forbidden-page">
            <!-- <img src="@/assets/forbidden.svg" alt="Forbidden Access" /> -->
            <h1>403 - Forbidden</h1>
            <p>Sorry, you don't have access to this page.</p>
            <p>Please login</p>
            <router-link to="/" class="home-link">Return to Home Page</router-link>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "ForbiddenPage",
};
</script>
  
<style lang="scss" scoped>
.home {
    padding-top: 200px; // or whatever value is needed to push the content below the navbar
}

.forbidden-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Arial', sans-serif;
    color: #333;
    text-align: center;

    img {
        width: 200px;
        margin-bottom: 20px;
    }

    h1 {
        font-size: 32px;
        margin-bottom: 10px;
    }

    p {
        font-size: 18px;
        margin-bottom: 20px;
    }

    .home-link {
        color: #007BFF;
        text-decoration: none;
        font-weight: 500;
        border: 1px solid #007BFF;
        padding: 10px 20px;
        border-radius: 5px;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: #007BFF;
            color: white;
        }
    }
}
</style>
  