import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.listItems = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count, //In ES6 is the same as count: count
            unit,
            ingredient
        }
        this.listItems.push(item);

        // Persist data in localStorage
        this.persistData();

        return item
    }

    deleteItem(id) {
        const index = this.listItems.findIndex(element => element.id === id);
        this.listItems.splice(index, 1);

        // Persist data in localStorage
        this.persistData();
    }

    deleteList() {
        this.listItems = [];

        // Persist data in localStorage
        this.persistData();
    }

    updateCount(id, newCount) {
        this.listItems.find(element => element.id === id).count = newCount;

        // Persist data in localStorage
        this.persistData();
    }

    persistData() {
        localStorage.setItem('listItems', JSON.stringify(this.listItems));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('listItems'));

        // Restore likes from localStorage
        if (storage) this.listItems = storage;
    }
} 