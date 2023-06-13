<template>
    <h1>Curriculum Page</h1>
    <p>Hi, I'm {{ name }}. I'm a {{ profession }} based in {{ location }}. Welcome to my portfolio website!</p>
</template>

<script>
import axios from 'axios';
export default {
    name: 'HomePage,',
    data() {
        return {
            name: '',
            profession: '',
            location: '',
        };
    }, mounted() {
        axios.get('http://localhost:5000/api/profile')
            .then(response => {
                this.name = response.data.name;
                this.profession = response.data.profession;
                this.location = response.data.location;
            })
            .catch(error => console.log(error));
    }
};
</script>