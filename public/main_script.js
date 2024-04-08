//Wait until the page content is loaded
document.addEventListener("DOMContentLoaded", function() {
    // const heading = document.getElementById("test");
    // heading.textContent = "new text";

    loadPage();


    //Event listner that redirects the user to the form.html page
    document.getElementById("add_recipe").addEventListener("click", function() {
        const form_url = "./form.html";

        //Changing page to the form.html page
        window.location.href = form_url;
    });

    //Event listner for the update buttons
    document.addEventListener("click", function(event) {
        //If the event target has the class name update_button
        if(event.target.classList.contains("update_button")) {

            //Retrive event target (recipe-id) attribute
            const recipeTitle = event.target.getAttribute("data-title");

            const update_form_url = `./update_form.html?recipeTitle=${recipeTitle}`;

            //Changing page to the update_form.html page with recipe-id as query parameter
            window.location.href = update_form_url;
        }
    });

    //Same as for the update button
    document.addEventListener("click", function(event) {
        if(event.target.classList.contains("delete_button")) {
            const recipeId = event.target.getAttribute("data-id");

            //If the user confirms
            if(confirm("Are you sure you want to delete this recipe!")){

                //Request the API to remove recipe with with parameter id
                fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
                    method: "DELETE"
                })
                .then(response => response.json())
                .then(data => {
                    //Log success
                    console.log(data.message + ` Recipe with id ${recipeId}`);

                    //Refresh page
                    window.location.reload();
                })
                .catch(error => {
                    console.error("Could not delete recipe: " + error);
                });
            };

        };
    });
});

function loadPage() {
    fetch("http://localhost:5000/api/recipes")
    .then(response => response.json())
    .then(data => {
        const recipes = data;

        const mainContainer = document.getElementById("main_container");

        recipes.forEach(recipe => {
        
            //Main container for each recipe
            const recipeContainer = document.createElement("div");
            recipeContainer.className = "recipe_container";

            //Contains header for each recipe
            const recipeHeader = document.createElement("header");
            recipeHeader.className = "recipe_header";

            const recipeImage = document.createElement("img");
            recipeImage.src = "http://placeholder.com/120x120";
            recipeImage.alt = "Image of food item.";
            recipeImage.className = "recipe_image";

            const recipeTitle = document.createElement("h2");
            recipeTitle.textContent = recipe.title;
            recipeTitle.className = "recipe_title";

            const updateButton = document.createElement("button");
            updateButton.textContent = "Update";
            updateButton.setAttribute("data-title", recipe.title);
            updateButton.className = "update_button";

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute("data-id", recipe._id);
            deleteButton.className = "delete_button";

            const cookingTime = document.createElement("p");
            cookingTime.textContent = `Cooking Time: ${recipe.cookingTime} min`;
            cookingTime.className = "recipe_cooking_time";

            //Attaching content to header
            recipeHeader.appendChild(recipeImage);
            recipeHeader.appendChild(recipeTitle);
            recipeHeader.appendChild(updateButton);
            recipeHeader.appendChild(deleteButton);
            recipeHeader.appendChild(cookingTime);

            //Contains instructions and ingredients for each recipe
            const ingInsContainer = document.createElement("div");
            ingInsContainer.className = "ingredient_instruction_container";

            //Container for ingredients
            const ingContainer = document.createElement("div");
            ingContainer.className = "recipe_ingredient_container";

            const ingredientsTitle = document.createElement("h3");
            ingredientsTitle.textContent = "Ingredients:";
            ingredientsTitle.className = "ingredients_title";

            const ingredientList = document.createElement("ul");
            ingredientList.className = "recipe_ingredient_list";

            recipe.ingredients.forEach(ingredient => {
                const recipeIngredient = document.createElement("li");
                recipeIngredient.textContent = ingredient;
                recipeIngredient.className = "recipe_ingredient";

                ingredientList.appendChild(recipeIngredient);
            });

            ingContainer.appendChild(ingredientsTitle);
            ingContainer.appendChild(ingredientList);

            //Container for instructions
            const insContainer = document.createElement("div");
            insContainer.className = "recipe_instruction_container";

            const instructionsTitle = document.createElement("h3");
            instructionsTitle.textContent = "Instructions:";
            instructionsTitle.className = "instructions_title";

            const instructions = document.createElement("p");
            instructions.textContent = recipe.instructions;
            instructions.className = "recipe_instructions";

            insContainer.appendChild(instructionsTitle);
            insContainer.appendChild(instructions);

            //Appending content to Ingredient and Instruction container
            ingInsContainer.appendChild(ingContainer);
            ingInsContainer.appendChild(insContainer);

            //Appending content to the main recipe container
            recipeContainer.appendChild(recipeHeader);
            recipeContainer.appendChild(ingInsContainer);
        
            //Appending complete recipe to the main element of the page
            mainContainer.appendChild(recipeContainer);
        });
    })
    .catch(error => {
        console.error("Could not fetch data: ", error);
    });
}