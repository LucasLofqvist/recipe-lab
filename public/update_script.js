document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("back_button").addEventListener("click", function() {
        const form_url = "./index.html";

        window.location.href = form_url;
    });

    const urlParameters = new URLSearchParams(window.location.search);

    const recipeTitle = urlParameters.get("recipeTitle");

    fetch(`http://localhost:5000/api/recipes/${recipeTitle}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        const titleInput = document.getElementById("title");
        titleInput.value = data[0].title;

        const inputContainer = document.getElementById("ingredient_input_container");

        data[0].ingredients.forEach(ingredient => {
            const ingredientInput = document.createElement("input");
            ingredientInput.type = "text";
            ingredientInput.name = "ingredients[]";
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

    const submitButton = document.getElementById("submit_form_button");

    submitButton.addEventListener("click", (event) => {
        event.preventDefault();

        //Send the form data here
    });
});