
import { useEffect, useState } from "react";

function MyCampaigns({ token, onBack }) {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Edit campaign states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    product: "",
    audience: "",
    goal: "Product Promotion",
    tone: "Professional",
    generatedEmail: ""
  });

  const [saving, setSaving] = useState(false);

  // Fetch saved campaigns
  useEffect(() => {
    const controller = new AbortController();

    const fetchCampaigns = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/campaigns",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch campaigns"
          );
        }

        setCampaigns(data.campaigns || []);

      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (token) {
      fetchCampaigns();
    } else {
      setError("Please login to view campaigns.");
      setLoading(false);
    }

    return () => controller.abort();
  }, [token]);

  // Search and sort campaigns
  const filteredCampaigns = campaigns
    .filter((campaign) =>
      campaign.product
        ?.toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortOrder === "az") {
        return (a.product || "").localeCompare(b.product || "");
      }

      return 0;
    });

  // Start editing a saved campaign
  const startEditing = (campaign) => {
    setEditingId(campaign._id);

    setEditForm({
      product: campaign.product || "",
      audience: campaign.audience || "",
      goal: campaign.goal || "Product Promotion",
      tone: campaign.tone || "Professional",
      generatedEmail: campaign.generatedEmail || ""
    });

    setError("");
    setMessage("");
  };

  // Generate updated email automatically
  const generateUpdatedEmail = (form) => {
    const greetings = {
      Professional: "Dear Customer,",
      Friendly: "Hi there!",
      Exciting: "Hello, exciting news!",
      Formal: "Dear Valued Customer,"
    };

    const introductions = {
      Professional: `We are pleased to introduce ${form.product}, designed with ${form.audience} in mind.`,
      Friendly: `We have something special for you! Meet ${form.product}, a great choice for ${form.audience}.`,
      Exciting: `Get ready to discover ${form.product}! We are excited to share it with ${form.audience}.`,
      Formal: `We would like to present ${form.product}, developed to meet the needs of ${form.audience}.`
    };

    const campaignGoals = {
      "Product Promotion": `Discover what ${form.product} has to offer and explore how it could benefit you.`,
      "New Product Launch": `We are delighted to announce the launch of ${form.product}. Be among the first to explore it.`,
      "Special Offer": `Explore our latest offers for ${form.product}. Visit us to learn about currently available deals.`,
      "Brand Awareness": `Learn more about ${form.product} and discover what makes our offering worth exploring.`
    };

    const callsToAction = {
      Professional: "Learn more about our product today.",
      Friendly: "Take a look and see what you think!",
      Exciting: "Explore it today!",
      Formal: "We invite you to learn more about our offering."
    };

    const subjectLines = {
      "Product Promotion": `Discover ${form.product}`,
      "New Product Launch": `Introducing ${form.product}`,
      "Special Offer": `Explore Offers on ${form.product}`,
      "Brand Awareness": `Get to Know ${form.product}`
    };

    return `Subject: ${subjectLines[form.goal]}

${greetings[form.tone]}

${introductions[form.tone]}

${campaignGoals[form.goal]}

${callsToAction[form.tone]}

Best regards,
Marketing Team`;
  };

  // Update fields and regenerate email automatically
  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previousForm) => {
      const updatedForm = {
        ...previousForm,
        [name]: value
      };

      if (
        ["product", "audience", "goal", "tone"].includes(name)
      ) {
        updatedForm.generatedEmail =
          generateUpdatedEmail(updatedForm);
      }

      return updatedForm;
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setError("");
    setMessage("");
  };

  // Save updated campaign to MongoDB
  const saveEditedCampaign = async (campaignId) => {
    if (
      !Object.values(editForm).every(
        (value) =>
          typeof value === "string" &&
          value.trim().length > 0
      )
    ) {
      setError("Please fill all campaign fields.");
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/campaigns/${campaignId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(editForm)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update campaign"
        );
      }

      setCampaigns((previousCampaigns) =>
        previousCampaigns.map((campaign) =>
          campaign._id === campaignId
            ? data.campaign
            : campaign
        )
      );

      setEditingId(null);
      setMessage("Campaign updated successfully!");

    } catch (err) {
      setError(err.message);

    } finally {
      setSaving(false);
    }
  };

  // Delete a saved campaign
  const deleteCampaign = async (campaignId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this campaign?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(campaignId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/campaigns/${campaignId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete campaign"
        );
      }

      setCampaigns((previousCampaigns) =>
        previousCampaigns.filter(
          (campaign) => campaign._id !== campaignId
        )
      );

      setMessage("Campaign deleted successfully!");

    } catch (err) {
      setError(err.message);

    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">
        My Saved Campaigns
      </h2>

      {/* Search Campaigns */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search campaigns by product name..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />
      </div>

      {/* Sort Campaigns */}
      <div className="mb-4">
        <label className="form-label">
          Sort Campaigns
        </label>

        <select
          className="form-select"
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value)
          }
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">Product Name (A-Z)</option>
        </select>
      </div>

      {loading && (
        <p className="text-center">
          Loading campaigns...
        </p>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {!loading && !error && campaigns.length === 0 && (
        <div className="alert alert-info">
          No campaigns found. Create your first campaign!
        </div>
      )}

      {!loading && !error &&
        campaigns.length > 0 &&
        filteredCampaigns.length === 0 && (
          <div className="alert alert-warning">
            No campaigns match your search.
          </div>
        )}

      {!loading && filteredCampaigns.map((campaign) => (
        <div
          className="card shadow-sm mb-4"
          key={campaign._id}
        >
          <div className="card-body">

            {editingId === campaign._id ? (
              <>
                <h4 className="mb-3">
                  Edit Campaign
                </h4>

                <label className="form-label">
                  Product Name
                </label>

                <input
                  className="form-control mb-3"
                  name="product"
                  value={editForm.product}
                  onChange={handleEditChange}
                />

                <label className="form-label">
                  Target Audience
                </label>

                <input
                  className="form-control mb-3"
                  name="audience"
                  value={editForm.audience}
                  onChange={handleEditChange}
                />

                <label className="form-label">
                  Campaign Goal
                </label>

                <select
                  className="form-select mb-3"
                  name="goal"
                  value={editForm.goal}
                  onChange={handleEditChange}
                >
                  <option>Product Promotion</option>
                  <option>New Product Launch</option>
                  <option>Special Offer</option>
                  <option>Brand Awareness</option>
                </select>

                <label className="form-label">
                  Email Tone
                </label>

                <select
                  className="form-select mb-3"
                  name="tone"
                  value={editForm.tone}
                  onChange={handleEditChange}
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Exciting</option>
                  <option>Formal</option>
                </select>

                <label className="form-label">
                  Generated Email
                </label>

                <textarea
                  className="form-control mb-3"
                  rows="10"
                  name="generatedEmail"
                  value={editForm.generatedEmail}
                  onChange={handleEditChange}
                />

                <button
                  type="button"
                  className="btn btn-success me-2"
                  onClick={() =>
                    saveEditedCampaign(campaign._id)
                  }
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelEditing}
                  disabled={saving}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h4 className="card-title">
                  {campaign.product}
                </h4>

                <p>
                  <strong>Target Audience:</strong>{" "}
                  {campaign.audience}
                </p>

                <p>
                  <strong>Campaign Goal:</strong>{" "}
                  {campaign.goal}
                </p>

                <p>
                  <strong>Email Tone:</strong>{" "}
                  {campaign.tone}
                </p>

                <h5>Generated Email</h5>

                <textarea
                  className="form-control"
                  rows="10"
                  value={campaign.generatedEmail || ""}
                  readOnly
                />

                <p className="text-muted mt-3">
                  Created:{" "}
                  {campaign.createdAt
                    ? new Date(
                        campaign.createdAt
                      ).toLocaleString()
                    : "Unknown"}
                </p>

                <button
                  type="button"
                  className="btn btn-primary me-2"
                  onClick={() => startEditing(campaign)}
                  disabled={
                    deletingId !== null || saving
                  }
                >
                  Edit Campaign
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    deleteCampaign(campaign._id)
                  }
                  disabled={
                    deletingId !== null || saving
                  }
                >
                  {deletingId === campaign._id
                    ? "Deleting..."
                    : "Delete Campaign"}
                </button>
              </>
            )}

          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-secondary"
        onClick={onBack}
      >
        Back to Home
      </button>
    </div>
  );
}

export default MyCampaigns;
