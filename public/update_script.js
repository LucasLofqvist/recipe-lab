document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("back_button").addEventListener("click", function() {
        const form_url = "./index.html";

        window.location.href = form_url;
    });

    const urlParameters = new URLSearchParams(window.location.search);

    const recipeTitle = urlParameters.get("recipeTitle");

    alert(recipeTitle);

    fetch(`http://localhost:5000/api/recipes/${recipeTitle}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Could not fetch recipe: " + error);
    })
});