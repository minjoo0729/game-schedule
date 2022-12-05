const mongoose = require("mongoose");

const OSchemaDefinition = {
    title: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: "0000-00-00",
        required: true,
    },
    time: {
        type: String,
        default: "-:-",
        required: true,
    },
    score: {
        type: String,
        default: "-:-",
    },
    memo: {
        type: String,
        default: "No Memo",
    },
    itemViewCnt: {
        type: Number,
        default: 0,
    }
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const GameModel = mongoose.model("game", schema);

module.exports = GameModel;

