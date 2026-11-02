
const express = require("express");
const mongoose = require("mongoose");
const Campaign = require("../models/Campaign");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all campaign routes
router.use(authMiddleware);

// ==============================
// SAVE CAMPAIGN API
// ==============================
router.post("/", async (req, res) => {
  try {
    const {
      product,
      audience,
      goal,
      tone,
      generatedEmail
    } = req.body;

    // Validate required fields
    if (
      ![product, audience, goal, tone].every(
        (value) =>
          typeof value === "string" &&
          value.trim().length > 0
      )
    ) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    // Validate authenticated user ID
    if (!mongoose.isValidObjectId(req.userId)) {
      return res.status(401).json({
        message: "Invalid user authentication"
      });
    }

    // Save campaign for logged-in user
    const campaign = new Campaign({
      userId: req.userId,
      product: product.trim(),
      audience: audience.trim(),
      goal: goal.trim(),
      tone: tone.trim(),
      generatedEmail:
        typeof generatedEmail === "string"
          ? generatedEmail
          : ""
    });

    await campaign.save();

    return res.status(201).json({
      message: "Campaign saved successfully!",
      campaign
    });

  } catch (error) {
    console.error("Campaign save error:", error.message);

    return res.status(500).json({
      message: "Server error"
    });
  }
});

// ==============================
// GET MY CAMPAIGNS API
// ==============================
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Campaigns fetched successfully!",
      campaigns
    });

  } catch (error) {
    console.error("Campaign fetch error:", error.message);

    return res.status(500).json({
      message: "Server error"
    });
  }
});

// ==============================
// UPDATE CAMPAIGN API (NEW)
// ==============================
router.put("/:id", async (req, res) => {
  try {
    const campaignId = req.params.id;

    // Validate campaign ID
    if (!mongoose.isValidObjectId(campaignId)) {
      return res.status(400).json({
        message: "Invalid campaign ID"
      });
    }

    // Get updated campaign details
    const {
      product,
      audience,
      goal,
      tone,
      generatedEmail
    } = req.body;

    // Validate all required fields
    if (
      ![product, audience, goal, tone, generatedEmail].every(
        (value) =>
          typeof value === "string" &&
          value.trim().length > 0
      )
    ) {
      return res.status(400).json({
        message: "Please fill all campaign fields"
      });
    }

    // Update only the logged-in user's campaign
    const updatedCampaign =
      await Campaign.findOneAndUpdate(
        {
          _id: campaignId,
          userId: req.userId
        },
        {
          $set: {
            product: product.trim(),
            audience: audience.trim(),
            goal: goal.trim(),
            tone: tone.trim(),
            generatedEmail
          }
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedCampaign) {
      return res.status(404).json({
        message: "Campaign not found or access denied"
      });
    }

    return res.status(200).json({
      message: "Campaign updated successfully!",
      campaign: updatedCampaign
    });

  } catch (error) {
    console.error("Campaign update error:", error.message);

    return res.status(500).json({
      message: "Server error"
    });
  }
});

// ==============================
// DELETE CAMPAIGN API
// ==============================
router.delete("/:id", async (req, res) => {
  try {
    const campaignId = req.params.id;

    // Validate campaign ID
    if (!mongoose.isValidObjectId(campaignId)) {
      return res.status(400).json({
        message: "Invalid campaign ID"
      });
    }

    // Delete only the logged-in user's campaign
    const deletedCampaign =
      await Campaign.findOneAndDelete({
        _id: campaignId,
        userId: req.userId
      });

    if (!deletedCampaign) {
      return res.status(404).json({
        message: "Campaign not found or access denied"
      });
    }

    return res.status(200).json({
      message: "Campaign deleted successfully!"
    });

  } catch (error) {
    console.error("Campaign delete error:", error.message);

    return res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;
