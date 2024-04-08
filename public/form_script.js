let count = 0;

//Wait until the page content is loaded
document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("back_button").addEventListener("click", function() {
        const form_url = "./index.html";

        window.location.href = form_url;
    });

    const limit = 20;

    document.getElementById("add_ingredient_button").addEventListener("click", function() {
        count++;

        if (count < limit) {
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

    document.getElementById("recipe_form").addEventListener("submit", function(event){
        event.preventDefault();

        const formData = new FormData(this);

        const ingredients = [];
        formData.getAll("ingredients[]").forEach(ingredient => {
            ingredients.push(ingredient);
        });

        const postData = {
            title: formData.get("title"),
            ingredients: ingredients,
            cookingTime: formData.get("cookingTime"),
            instructions: formData.get("instructions")
        };

        fetch("http://localhost:5000/api/recipes", 
        {
            method: "POST",
            headers: 
            {
                "Content-type": "application/json"
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        });
    });
});