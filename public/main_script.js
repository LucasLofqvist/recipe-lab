//Wait until the page content is loaded
document.addEventListener("DOMContentLoaded", function() {
    // const heading = document.getElementById("test");
    // heading.textContent = "new text";

    document.getElementById("add_recipe").addEventListener("click", function() {
        const form_url = "./form.html";

        window.location.href = form_url;
    });
    
});