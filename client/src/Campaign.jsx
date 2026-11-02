
import { useState } from "react";

function Campaign({ onBack, token }) {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("Product Promotion");
  const [tone, setTone] = useState("Professional");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("danger");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

const GENERATION_MODE = "ai";
  const clearPreviousEmail = () => {
    setEmail("");
    setMessage("");
  };

  // Copy generated email
  const copyEmail = async () => {
    if (!email.trim()) {
      setMessageType("danger");
      setMessage("Please generate an email first!");
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      setMessageType("success");
      setMessage("Email copied successfully!");
    } catch (error) {
      console.error("Copy email error:", error);
      setMessageType("danger");
      setMessage("Failed to copy email!");
    }
  };

  // Download generated email
  const downloadEmail = () => {
    if (!email.trim()) {
      setMessageType("danger");
      setMessage("Please generate an email first!");
      return;
    }

    let url;

    try {
      const blob = new Blob([email], {
        type: "text/plain;charset=utf-8"
      });

      url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      const fileName =
        product.trim().replace(/[^a-z0-9_-]/gi, "_") ||
        "campaign";

      link.download = `${fileName}_Email.txt`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessageType("success");
      setMessage("Email download started successfully!");
    } catch (error) {
      console.error("Download email error:", error);
      setMessageType("danger");
      setMessage("Failed to download email!");
    } finally {
      if (url) {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }
  };

  // Generate free template-based email
  const generateFreeEmail = () => {
    const greetings = {
      Professional: "Dear Customer,",
      Friendly: "Hi there!",
      Exciting: "Hello, exciting news!",
      Formal: "Dear Valued Customer,"
    };

    const introductions = {
      Professional:
        `We are pleased to introduce ${product}, designed with ${audience} in mind.`,
      Friendly:
        `We have something special for you! Meet ${product}, a great choice for ${audience}.`,
      Exciting:
        `Get ready to discover ${product}! We are excited to share it with ${audience}.`,
      Formal:
        `We would like to present ${product}, developed to meet the needs of ${audience}.`
    };

    const campaignGoals = {
      "Product Promotion":
        `Discover what ${product} has to offer and explore how it could benefit you.`,
      "New Product Launch":
        `We are delighted to announce the launch of ${product}. Be among the first to explore it.`,
      "Special Offer":
        `Explore our latest offers for ${product}. Visit us to learn about currently available deals.`,
      "Brand Awareness":
        `Learn more about ${product} and discover what makes our offering worth exploring.`
    };

    const callsToAction = {
      Professional: "Learn more about our product today.",
      Friendly: "Take a look and see what you think!",
      Exciting: "Explore it today!",
      Formal: "We invite you to learn more about our offering."
    };

    const subjectLines = {
      "Product Promotion": `Discover ${product}`,
      "New Product Launch": `Introducing ${product}`,
      "Special Offer": `Explore Offers on ${product}`,
      "Brand Awareness": `Get to Know ${product}`
    };

    return `Subject: ${subjectLines[goal]}

${greetings[tone]}

${introductions[tone]}

${campaignGoals[goal]}

${callsToAction[tone]}

Best regards,
Marketing Team`;
  };

  // Generate email
  const generateEmail = async (e) => {
    e.preventDefault();

    setMessage("");
    setEmail("");

    if (!token) {
      setMessageType("danger");
      setMessage("Please login to generate an email!");
      return;
    }

    setGenerating(true);

    try {
      if (GENERATION_MODE === "free") {
        const generatedEmail = generateFreeEmail();

        setEmail(generatedEmail);
        setMessageType("success");
        setMessage("Email template generated successfully!");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/ai/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            product,
            audience,
            goal,
            tone
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessageType("danger");
        setMessage(data.message || "Failed to generate AI email!");
        return;
      }

      if (!data.generatedEmail) {
        setMessageType("danger");
        setMessage("AI did not return an email!");
        return;
      }

      setEmail(data.generatedEmail);
      setMessageType("success");
      setMessage("AI email generated successfully!");
    } catch (error) {
      console.error("Email generation error:", error);
      setMessageType("danger");
      setMessage("Unable to generate email!");
    } finally {
      setGenerating(false);
    }
  };

  // Save campaign to MongoDB
  const saveCampaign = async () => {
    if (!email.trim()) {
      setMessageType("danger");
      setMessage("Please generate an email first!");
      return;
    }

    if (!token) {
      setMessageType("danger");
      setMessage("Please login to save your campaign!");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/campaigns",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            product,
            audience,
            goal,
            tone,
            generatedEmail: email
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessageType("danger");
        setMessage(data.message || "Failed to save campaign!");
        return;
      }

      setMessageType("success");
      setMessage("Campaign saved successfully!");
    } catch (error) {
      console.error("Save campaign error:", error);
      setMessageType("danger");
      setMessage("Cannot connect to backend server!");
    } finally {
      setSaving(false);
    }
  };

  const labelStyle = {
    fontWeight: 650,
    color: "#34415a",
    fontSize: "14px"
  };

  const fieldStyle = {
    minHeight: "48px",
    borderRadius: "9px",
    fontSize: "14px"
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: "#f5f7fc",
        minHeight: "100vh"
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: "1100px" }}
      >
        {/* Page Heading */}
        <div className="text-center mb-5">
          <span
            className="badge mb-3"
            style={{
              background: "#e9edff",
              color: "#4055d6",
              padding: "9px 15px",
              fontSize: "12px"
            }}
          >
            CAMPAIGN MANAGEMENT
          </span>

          <h1 className="fw-bold mb-2">
            Create Email Campaign
          </h1>

          <p className="text-muted mb-0">
            Design and manage professional marketing emails
            for your target audience.
          </p>
        </div>

        <div className="row g-4">

          {/* Campaign Form */}
          <div className="col-lg-5">
            <div
              className="card border-0 h-100"
              style={{
                borderRadius: "16px",
                boxShadow: "0 5px 25px rgba(30,45,80,0.06)"
              }}
            >
              <div className="card-body p-4 p-md-4">

                <div className="mb-4">
                  <h4 className="fw-bold mb-1">
                    Campaign Details
                  </h4>

                  <p className="text-muted small mb-0">
                    Enter the details of your marketing campaign.
                  </p>
                </div>

                <form onSubmit={generateEmail}>

                  {/* Product */}
                  <div className="mb-4">
                    <label className="form-label" style={labelStyle}>
                      Product Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      style={fieldStyle}
                      value={product}
                      onChange={(e) => {
                        setProduct(e.target.value);
                        clearPreviousEmail();
                      }}
                      placeholder="Example: Smart Watch"
                      required
                    />

                    <small className="text-muted">
                      Enter the product you want to promote.
                    </small>
                  </div>

                  {/* Audience */}
                  <div className="mb-4">
                    <label className="form-label" style={labelStyle}>
                      Target Audience
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      style={fieldStyle}
                      value={audience}
                      onChange={(e) => {
                        setAudience(e.target.value);
                        clearPreviousEmail();
                      }}
                      placeholder="Example: College Students"
                      required
                    />

                    <small className="text-muted">
                      Who do you want to reach?
                    </small>
                  </div>

                  {/* Campaign Goal */}
                  <div className="mb-4">
                    <label className="form-label" style={labelStyle}>
                      Campaign Goal
                    </label>

                    <select
                      className="form-select"
                      style={fieldStyle}
                      value={goal}
                      onChange={(e) => {
                        setGoal(e.target.value);
                        clearPreviousEmail();
                      }}
                    >
                      <option>Product Promotion</option>
                      <option>New Product Launch</option>
                      <option>Special Offer</option>
                      <option>Brand Awareness</option>
                    </select>
                  </div>

                  {/* Tone */}
                  <div className="mb-4">
                    <label className="form-label" style={labelStyle}>
                      Email Tone
                    </label>

                    <select
                      className="form-select"
                      style={fieldStyle}
                      value={tone}
                      onChange={(e) => {
                        setTone(e.target.value);
                        clearPreviousEmail();
                      }}
                    >
                      <option>Professional</option>
                      <option>Friendly</option>
                      <option>Exciting</option>
                      <option>Formal</option>
                    </select>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3"
                    disabled={generating || saving}
                    style={{
                      borderRadius: "9px",
                      fontWeight: 650,
                      background: "linear-gradient(135deg, #4055d6, #7956d9)",
                      border: "none"
                    }}
                  >
                    {generating
                      ? "Generating Email..."
                      : "✉ Generate Email"}
                  </button>

                </form>

                <div className="mt-3 text-center">
                  <small className="text-muted">
                    {GENERATION_MODE === "free"
                      ? "Template-based email generation"
                      : "AI-powered email generation"}
                  </small>
                </div>

              </div>
            </div>
          </div>

          {/* Email Preview */}
          <div className="col-lg-7">
            <div
              className="card border-0 h-100"
              style={{
                borderRadius: "16px",
                boxShadow: "0 5px 25px rgba(30,45,80,0.06)"
              }}
            >
              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <div>
                    <h4 className="fw-bold mb-1">
                      Email Preview
                    </h4>

                    <p className="text-muted small mb-0">
                      Review and edit your generated email.
                    </p>
                  </div>

                  <span
                    className="badge"
                    style={{
                      background: "#e9edff",
                      color: "#4055d6"
                    }}
                  >
                    Preview
                  </span>
                </div>

                {email ? (
                  <>
                    <div
                      className="p-3 mb-3"
                      style={{
                        background: "#f8f9fd",
                        border: "1px solid #e8ebf2",
                        borderRadius: "10px"
                      }}
                    >
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">
                          Product
                        </span>
                        <strong className="small">
                          {product}
                        </strong>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span className="text-muted small">
                          Audience
                        </span>
                        <strong className="small">
                          {audience}
                        </strong>
                      </div>
                    </div>

                    <label
                      className="form-label"
                      style={labelStyle}
                    >
                      Generated Email Content
                    </label>

                    <textarea
                      className="form-control"
                      rows="15"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setMessage("");
                      }}
                      style={{
                        borderRadius: "10px",
                        resize: "vertical",
                        minHeight: "300px",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        background: "#ffffff"
                      }}
                    />

                    {/* Email Actions */}
                    <div className="row g-2 mt-3">

                      <div className="col-md-6">
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100"
                          onClick={copyEmail}
                          disabled={saving || generating}
                        >
                          Copy Email
                        </button>
                      </div>

                      <div className="col-md-6">
                        <button
                          type="button"
                          className="btn btn-outline-success w-100"
                          onClick={downloadEmail}
                          disabled={saving || generating}
                        >
                          Download Email
                        </button>
                      </div>

                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-success w-100 py-3"
                          onClick={saveCampaign}
                          disabled={saving || generating}
                          style={{
                            borderRadius: "9px",
                            fontWeight: 650
                          }}
                        >
                          {saving
                            ? "Saving Campaign..."
                            : "Save Campaign"}
                        </button>
                      </div>

                    </div>
                  </>
                ) : (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center text-center p-4"
                    style={{
                      minHeight: "390px",
                      background: "#f8f9fd",
                      border: "1px dashed #ccd3e1",
                      borderRadius: "12px"
                    }}
                  >
                    <div
                      className="mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        background: "#e9edff",
                        color: "#4055d6",
                        fontSize: "30px"
                      }}
                    >
                      ✉
                    </div>

                    <h5 className="fw-bold">
                      Your Email Preview
                    </h5>

                    <p
                      className="text-muted"
                      style={{ maxWidth: "300px" }}
                    >
                      Enter your campaign details and click
                      Generate Email to see your email here.
                    </p>
                  </div>
                )}

                {/* Success or Error Message */}
                {message && (
                  <div
                    className={`alert alert-${messageType} mt-3 mb-0`}
                    role="alert"
                  >
                    {message}
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

        {/* Back Button */}
        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={onBack}
          >
            ← Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}

export default Campaign;
