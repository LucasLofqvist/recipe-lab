const express = require("express");
const path = require("path");

const router = express.Router();
router.use(express.json());

//Importing model to communicate with database
const recipes = require("../models/recipeModel");

//API

//All recipes
router.get("/recipes", async (req, res) => {
    
    try {
        const response = await recipes.find();

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Could not fetch data.");
    }
});

//Recipe by title
router.get("/recipes/:title", async (req, res) => {

    const title = req.params.title;
    
    const query = { title: title };

    try {
        const response = await recipes.find(query);

        if(response.length > 0)
            res.status(200).json(response);
        else
            res.status(404).json({message: `No recipe with title ${title} was found!`});
    } catch (error) {
        console.error(error);
        res.status(500).send("Could not fetch data.");
    }
});

//Insert new recipe
router.post("/recipes", async (req, res) => {
    const {title, ingredients, cookingTime, instructions} = req.body;

    if (!title || !ingredients || !cookingTime || !instructions) {
        res.status(400).json({message: `Missing one or more field values.`});
    }
    else{
        const query = { 
            title: title,
            ingredients: ingredients,
            cookingTime: cookingTime,
            instructions: instructions
        };

        try {
            //Might be able to use "unique" keyword in model instead of doing this
            const response = await recipes.find(query);

            if (response.length > 0) {
                res.status(409).json({message: "That recipe already exists."});
            }
            else {
                //creating an object from the mongoose model
                const newRecipe = new recipes(query);

                //Insert new recipe
                const response = await newRecipe.save();

                res.status(201).json({message: "Recipe sucessfully added!"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Could not insert new document."});
        }
    }
});

//Update recipe
router.put("/recipes/:id", async (req, res) => {
    const id = req.params.id;

    const query = req.body;

    //Check if body object contains any key-values or if its empty
    if(Object.keys(query).length === 0){
        res.status(400).json({message: "The request body is empty."});
    }
    else{
        try {

            //Update one document based on params id
            const result = await recipes.updateOne({_id: id}, {$set: query });
            
            //If the query was acknowledged to be successfull, fields in body object exists in database document
            if (result.acknowledged) {
                //If the id matches the _id in any document
                if (result.matchedCount < 1) {
                    res.status(404).json({message: "No matching document was found."})
                }
                else {
                    res.status(200).json({message: "The document was successfully updated."});
                }
            }
            else{
                res.status(400).json({message: "Update failed, something is wrong with the request."});
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Update failed, something went wrong."});
        }
    }
});

//Delete recipe
router.delete("/recipes/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const response = await recipes.deleteOne({_id: id});

        if (response.deletedCount > 0) {
            res.status(200).json({message: "Document deleted."});
        }
        else {
            res.status(404).json({message: "Document to be deleted was not found."});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Deletion failed, something went wrong."});
    }
});

//Exporing router
module.exports = router;