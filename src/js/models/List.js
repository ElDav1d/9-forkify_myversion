import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.listItems = [];
    }

    addItem(count, unit, ingredient) {
        const isSameUnitIngredient = element => element.unit === unit && element.ingredient === ingredient
        const checkIndex = this.listItems.findIndex(isSameUnitIngredient);

        let item

        if (checkIndex !== -1) {
            // If there's already an item in the list
            // with same ingredient and units
            // only the count must be updated
            this.listItems[checkIndex].count += count;
            item = this.listItems[checkIndex];
            item.isCountUpdated = true;
        } else {
            // If not, a new item is created
            // and pushed to the list 
            item = {
                id: uniqid(),
                count, //In ES6 is the same as count: count
                countStep: count,
                unit,
                ingredient,
                isCountUpdated: false
            }
            this.listItems.push(item);
        }

        // Persist data in localStorage
        this.persistData();
        return item
    }

    deleteItem(id) {
        const checkIndex = this.listItems.findIndex(element => element.id === id);
        this.listItems.splice(checkIndex, 1);

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