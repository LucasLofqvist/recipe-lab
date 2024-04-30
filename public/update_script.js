let ingredientCount = 0;
const ingredientLimit = 20;

document.addEventListener("DOMContentLoaded", function(){

    //Listens for event on "Back" button
    document.getElementById("back_button").addEventListener("click", function() {
        const form_url = "./index.html";

        window.location.href = form_url;
    });

    const urlParameters = new URLSearchParams(window.location.search);

    //Get the recipe title from the query parameters
    const recipeTitle = urlParameters.get("recipeTitle");

    let recipeId = "empty";
    let originalState = {};

    //Loading in the correct recipe
    fetch(`https://recipe-lab-vst3.onrender.com/api/recipes/${recipeTitle}`)
    .then(response => response.json())
    .then(data => {

        recipeId = data[0]._id;
        ingredientCount = data[0].ingredients.length;

        //Save the original state of the recipe
        originalState = {
            title: data[0].title,
            ingredients: data[0].ingredients,
            cookingTime: data[0].cookingTime.toString(),
            instructions: data[0].instructions
        };

        const titleInput = document.getElementById("title");
        titleInput.value = data[0].title;

        const inputContainer = document.getElementById("ingredient_input_container");

        data[0].ingredients.forEach(ingredient => {
            const ingredientInput = document.createElement("input");
            ingredientInput.type = "text";
            ingredientInput.name = "ingredients[]";
            ingredientInput.className = "dynamic_ingredients";
            ingredientInput.required = true;
            ingredientInput.value = ingredient;

            inputContainer.appendChild(ingredientInput);
        });

        const cookingTime = document.getElementById("cookingTime");
        cookingTime.value = data[0].cookingTime;

        const instructions = document.getElementById("instructions");
        instructions.value = data[0].instructions;
    })
    .catch(error => {
        console.error("Could not fetch recipe: " + error);
    });

    //Listening for submit events on the form
    const form = document.getElementById("recipe_form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        const ingredients = [];
        formData.getAll("ingredients[]").forEach(ingredient => {
            ingredients.push(ingredient);
        });

        const updatedForm = {
            title: formData.get("title"),
            ingredients: ingredients,
            cookingTime: formData.get("cookingTime"),
            instructions: formData.get("instructions")
        };

        //If changes has been made to the recipe update it
        if(compareObjects(originalState, updatedForm)){
            alert("No changes has been made to the recipe");
        }
        else {
            fetch(`https://recipe-lab-vst3.onrender.com/api/recipes/${recipeId}`, {
                method: "PUT",
                headers: { "content-type" : "application/json "},
                body: JSON.stringify(updatedForm)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message)
            });
        };
    });

    //Adding ingredient input to form
    document.getElementById("add_ingredient_button").addEventListener("click", function() {
        ingredientCount++;

        if (ingredientCount <= ingredientLimit) {
            const ingredientContainer = document.getElementById("ingredient_input_container");
            const newIngredientInput = document.createElement("input");

            newIngredientInput.type = "text";
            newIngredientInput.name = "ingredients[]";
            newIngredientInput.className = "dynamic_ingredients";
            newIngredientInput.required = true;

            ingredientContainer.appendChild(newIngredientInput);
        }
        else{
            alert("You have reached the maximum number of ingredients!");
        }
        
    });

    document.getElementById("remove_ingredients_button").addEventListener("click", function(event){
        const allIngredientInputs = document.querySelectorAll(".dynamic_ingredients");

        allIngredientInputs.forEach(input => input.remove());
        ingredientCount = 0;

        const addIngredientButton = document.getElementById("add_ingredient_button");
        addIngredientButton.click();
        addIngredientButton.click();
    });

    function compareObjects(obj1, obj2) {
        
        if(obj1.title !== obj2.title){
            return false;
        }

        const string1 = JSON.stringify(obj1.ingredients);
        const string2 = JSON.stringify(obj2.ingredients);

        if (string1 !== string2) {
            return false;
        }

        if (obj1.cookingTime !== obj2.cookingTime) {
            return false;
        }

        if (obj1.instructions !== obj2.instructions) {
            return false;
        }

        return true;
    };


});