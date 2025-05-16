import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
},{
    timestamps: true,
});

categorySchema.index({user: 1, name: 1}, {unique: true});

const Category = mongoose.model("Category", categorySchema);

export default Category;
