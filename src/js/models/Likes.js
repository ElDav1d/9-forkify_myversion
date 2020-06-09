export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, image) {
        const like = { id, title, author, image };
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(element => element.id === id);
        this.likes.splice(index, 1);

        // Persist data in localStorage
        this.persistData();
    }

    isLiked(id) {
        // true or false? if the element is in the likes array, findIndex() will return an integer
        return this.likes.findIndex(element => element.id === id) !== -1;
    }

    getLikesNumber() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restore likes from localStorage
        if (storage) this.likes = storage;
    }
}