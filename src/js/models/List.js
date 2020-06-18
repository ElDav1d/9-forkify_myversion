import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.list = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count, //In ES6 is the same as count: count
            unit,
            ingredient
        }
        this.list.push(item);

        // Persist data in localStorage
        this.persistData();

        return item
    }

    deleteItem(id) {
        const index = this.list.findIndex(element => element.id === id);
        this.list.splice(index, 1);

        // Persist data in localStorage
        this.persistData();
    }

    deleteList() {
        this.list = [];

        // Persist data in localStorage
        this.persistData();
    }

    updateCount(id, newCount) {
        this.list.find(element => element.id === id).count = newCount;

        // Persist data in localStorage
        this.persistData();
    }

    persistData() {
        localStorage.setItem('list', JSON.stringify(this.list));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('list'));

        // Restore likes from localStorage
        if (storage) this.list = storage;
    }
} 