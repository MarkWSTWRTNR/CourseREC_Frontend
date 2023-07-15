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
        filteredFaculty() {
            return this.searchQuery ? this.searchResults : this.faculties;
          },
          filteredPrograms() {
            if (this.searchQuery) {
              return this.programs.filter(program =>
                program.name.toLowerCase().includes(this.searchQuery.toLowerCase())
              );
            } else {
              return this.programs;
            }
          }
    },
    methods: {
        searchCourses() {
            axios.get('http://localhost:8080/courses/search', {
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
        searchProgram() {
            axios
              .get('http://localhost:8080/programs/search', {
                params: {
                  query: this.searchQuery
                }
              })
              .then(response => {
                this.programs = response.data;
              })
              .catch(error => {
                console.error(error);
              });
          },
        searchProgram() {
            axios.get('http://localhost:8080/programs/search', {
                params: {
                    query: this.searchQuery
                }
            })
                .then(response => {
                    this.searchResults = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
}