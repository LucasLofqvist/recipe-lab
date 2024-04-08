//const { Int32 } = require("bson");
const mg = require("mongoose");

const recipeSchema = new mg.Schema(
    {
        title:String,
        ingredients:Array,
        cookingTime:Number,
        instructions:String
    },
    {collection: "recipes"}
    );

module.exports = new mg.model("Recipe", recipeSchema);