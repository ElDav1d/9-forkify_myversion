import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const requested = await axios(`http://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = requested.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
};