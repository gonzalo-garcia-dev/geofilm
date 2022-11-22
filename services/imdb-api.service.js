const axios = require('axios');

class ApiService {

    constructor() {
        this.axiosApp = axios.create({
            baseURL: 'https://imdb-api.com/es/API'

        })
    }
    findAllMovies = (movieTitle) => {
        return this.axiosApp.get(`/SearchMovie/k_e4bm64sq/${movieTitle}`);
    }

    getOneMovie = (movieId) => {
        return this.axiosApp.get(`/Title/k_e4bm64sq/${movieId}`);
    }




}

module.exports = ApiService