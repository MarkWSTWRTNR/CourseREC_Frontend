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
                program.program_name.toLowerCase().includes(this.searchQuery.toLowerCase())
              );
            } else {
              return this.programs;
            }
          }
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
        searchProgram() {
            axios
              .get('http://localhost:5000/api/programs/search', {
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
            axios.get('http://localhost:5000/api/programs/search', {
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