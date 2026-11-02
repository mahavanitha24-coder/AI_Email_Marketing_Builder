
const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    // User who created the campaign
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    product: {
      type: String,
      required: true
    },

    audience: {
      type: String,
      required: true
    },

    goal: {
      type: String,
      required: true
    },

    tone: {
      type: String,
      required: true
    },

    generatedEmail: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Campaign",
  campaignSchema
);
