const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const UserModel = new mongoose.model("user", UserSchema);
module.exports = UserModel;
