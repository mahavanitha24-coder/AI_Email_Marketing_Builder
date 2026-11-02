
import { useEffect, useState } from "react";

function Dashboard({ token }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/campaigns",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load campaigns"
          );
        }

        setCampaigns(
          Array.isArray(data)
            ? data
            : Array.isArray(data.campaigns)
              ? data.campaigns
              : []
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCampaigns();
    } else {
      setError("Please login to view the dashboard.");
      setLoading(false);
    }
  }, [token]);

  const totalCampaigns = campaigns.length;

  const uniqueProducts = new Set(
    campaigns
      .map((campaign) =>
        campaign.product?.trim().toLowerCase()
      )
      .filter(Boolean)
  ).size;

  const goals = [
    "Product Promotion",
    "New Product Launch",
    "Special Offer",
    "Brand Awareness"
  ];

  const recentCampaigns = [...campaigns]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const cardStyle = {
    border: "none",
    borderRadius: "16px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
    height: "100%"
  };

  return (
    <div
      className="container-fluid py-4 px-3 px-md-5"
      style={{ background: "#f5f7fb", minHeight: "100vh" }}
    >
      {/* Dashboard Heading */}
      <div className="mb-4">
        <h2 className="fw-bold mb-2" style={{ color: "#202b46" }}>
          Campaign Dashboard
        </h2>

        <p className="text-muted mb-0">
          Monitor your email marketing campaigns and performance.
        </p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          />
          <p className="text-muted mt-3">
            Loading your dashboard...
          </p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Welcome Section */}
          <div
            className="p-4 p-md-5 mb-4 text-white"
            style={{
              background:
                "linear-gradient(120deg, #3548c8, #7555d9)",
              borderRadius: "18px"
            }}
          >
            <h3 className="fw-bold mb-2">
              Welcome to Your Dashboard!
            </h3>

            <p className="mb-0" style={{ opacity: 0.9 }}>
              Manage your campaigns, explore your products,
              and track your marketing activities in one place.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="row g-4 mb-4">

            <div className="col-md-6 col-xl-4">
              <div
                className="card p-4"
                style={cardStyle}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-2">
                      Total Campaigns
                    </p>

                    <h2 className="fw-bold mb-0 text-primary">
                      {totalCampaigns}
                    </h2>
                  </div>

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "55px",
                      height: "55px",
                      background: "#e8edff",
                      fontSize: "25px"
                    }}
                  >
                    📧
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-4">
              <div
                className="card p-4"
                style={cardStyle}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-2">
                      Unique Products
                    </p>

                    <h2 className="fw-bold mb-0 text-success">
                      {uniqueProducts}
                    </h2>
                  </div>

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "55px",
                      height: "55px",
                      background: "#e3f8ed",
                      fontSize: "25px"
                    }}
                  >
                    📦
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-4">
              <div
                className="card p-4"
                style={cardStyle}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-2">
                      Campaign Goals
                    </p>

                    <h2 className="fw-bold mb-0 text-warning">
                      {new Set(
                        campaigns
                          .map((campaign) => campaign.goal)
                          .filter(Boolean)
                      ).size}
                    </h2>
                  </div>

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "55px",
                      height: "55px",
                      background: "#fff4dc",
                      fontSize: "25px"
                    }}
                  >
                    🎯
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Campaign Analytics */}
          <div
            className="card p-4 mb-4"
            style={cardStyle}
          >
            <h5 className="fw-bold mb-4">
              Campaign Analytics
            </h5>

            {goals.map((goal) => {
              const count = campaigns.filter(
                (campaign) => campaign.goal === goal
              ).length;

              const percentage = totalCampaigns
                ? (count / totalCampaigns) * 100
                : 0;

              return (
                <div className="mb-4" key={goal}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold text-secondary">
                      {goal}
                    </span>

                    <span className="fw-bold">
                      {count}
                    </span>
                  </div>

                  <div
                    className="progress"
                    style={{
                      height: "10px",
                      borderRadius: "10px",
                      background: "#edf0f6"
                    }}
                  >
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${percentage}%`,
                        borderRadius: "10px"
                      }}
                      aria-valuenow={percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>

                  <small className="text-muted">
                    {percentage.toFixed(1)}% of campaigns
                  </small>
                </div>
              );
            })}
          </div>

          {/* Recent Campaigns */}
          <div
            className="card p-4"
            style={cardStyle}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">
                Recent Campaigns
              </h5>

              <span className="badge bg-primary">
                Latest 5
              </span>
            </div>

            {recentCampaigns.length === 0 ? (
              <div className="text-center py-4">
                <div style={{ fontSize: "40px" }}>
                  📭
                </div>

                <h6 className="fw-bold mt-3">
                  No Campaigns Yet
                </h6>

                <p className="text-muted mb-0">
                  Create your first email campaign to see it here.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-muted">
                      <th>Product</th>
                      <th>Audience</th>
                      <th>Campaign Goal</th>
                      <th>Tone</th>
                      <th>Created Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentCampaigns.map((campaign, index) => (
                      <tr key={campaign._id || index}>
                        <td className="fw-semibold">
                          {campaign.product || "N/A"}
                        </td>

                        <td>
                          {campaign.audience || "N/A"}
                        </td>

                        <td>
                          <span className="badge bg-light text-dark">
                            {campaign.goal || "N/A"}
                          </span>
                        </td>

                        <td>
                          {campaign.tone || "N/A"}
                        </td>

                        <td>
                          {formatDate(campaign.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
