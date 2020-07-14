import axios from 'axios';
import uniqid from 'uniqid';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const requested = await axios(`http://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = requested.data.recipe.title;
            this.author = requested.data.recipe.publisher;
            this.image = requested.data.recipe.image_url;
            this.url = requested.data.recipe.source_url;
            this.ingredients = requested.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        //Assuming that we need 15 min for each 3 ingredients
        const numberOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numberOfIngredients / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']; // recognize other units, used at :50

        const newIngredients = this.ingredients.map(element => {
            // 1) Uniform units
            let ingredient = element.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            })

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const arrayIngredient = ingredient.split(' ');
            const unitIndex = arrayIngredient.findIndex(element2 => units.includes(element2));

            let objectIngredient;
            if (unitIndex > -1) {
                // Type coercion: "if there is a unit" coerced to TRUE
                // Ex. 4 1/2 cups, arrayCount is [4, 1/2] --> eval => 4 + 1/2 = 4.5
                // Ex. 1-1/3 cups, arrayCount is [1-1/3] --> eval => 1 + 1/3 = 1.333333333333
                // Ex. 4 cups, arrayCount is [4]
                const arrayCount = arrayIngredient.slice(0, unitIndex);

                let count;
                if (arrayCount.length === 1) {
                    count = eval(arrayIngredient[0].replace('-', '+'));
                } else {
                    count = eval(arrayIngredient.slice(0, unitIndex).join('+'));
                }

                objectIngredient = {
                    id: uniqid(),
                    count, // same as count: count
                    unit: arrayIngredient[unitIndex],
                    ingredient: arrayIngredient.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrayIngredient[0], 10)) {
                // There's NO unit, but 1st element is a "string-number": parsed into number, then coerces to true
                objectIngredient = {
                    id: uniqid(),
                    count: parseInt(arrayIngredient[0], 10),
                    unit: '',
                    ingredient: arrayIngredient.slice(1).join(' ') // all the array BUT the first element, then string
                }
            } else if (unitIndex === -1) {
                // There's NO unit and NO "string-number" in 1st position
                objectIngredient = {
                    id: uniqid(),
                    count: 1,
                    unit: '',
                    ingredient //same as ingredient: ingredient
                }
            }

            return objectIngredient;
        });

        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'decrease' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ingredient => {
            ingredient.count *= (newServings / this.servings);
        })

        this.servings = newServings;
    }
}