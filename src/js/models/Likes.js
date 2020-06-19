export default class Likes {
    constructor() {
        this.likeItems = [];
    }

    addLike(id, title, author, image) {
        const item = { id, title, author, image };
        this.likeItems.push(item);

        // Persist data in localStorage
        this.persistData();

        return item;
    }

    deleteLike(id) {
        const index = this.likeItems.findIndex(element => element.id === id);
        this.likeItems.splice(index, 1);

        // Persist data in localStorage
        this.persistData();
    }

    isLiked(id) {
        // true or false? if the element is in the likes array, findIndex() will return an integer
        return this.likeItems.findIndex(element => element.id === id) !== -1;
    }

    getLikesNumber() {
        return this.likeItems.length;
    }

    persistData() {
        localStorage.setItem('likeItems', JSON.stringify(this.likeItems));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likeItems'));

        // Restore likes from localStorage
        if (storage) this.likeItems = storage;
    }
}