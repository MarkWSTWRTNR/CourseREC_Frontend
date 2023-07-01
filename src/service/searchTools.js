import axios from "axios";
export default {
    data() {
        return {
            searchQuery: '',
            searchResults: [],
        };
    }, computed: {
        displayCourses() {
            return this.searchQuery ? this.searchResults : this.records;
        },
    },
    methods: {
        searchCourses() {
            axios.get('http://localhost:5000/api/courses/search', {
                params: {
                    query: this.searchQuery,
                },
            })
                .then(response => {
                    this.searchResults = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },
}