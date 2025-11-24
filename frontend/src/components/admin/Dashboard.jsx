import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import "./Admin.css";

const Dashboard = () => {
  const summaryCards = useMemo(() => [
    {
      label: "Categories",
      value: 0,
      link: "/admin/categories",
      linkLabel: "View all categories",
    },
    {
      label: "Products",
      value: 0,
      link: "/admin/products",
      linkLabel: "Manage catalog",
    },
    {
      label: "Orders",
      value: 0,
      link: "/admin/orders",
      linkLabel: "Review orders",
    },
  ], []);

  const quickLinks = [
    {
      title: "Category management",
      description: "Create new categories and keep collections tidy.",
      action: "Go to categories",
      to: "/admin/categories",
    },
    {
      title: "Product catalog",
      description: "Add new arrivals or update pricing in seconds.",
      action: "Manage products",
      to: "/admin/products",
    },
    {
      title: "Storefront navigation",
      description: "Preview how customers browse your collections.",
      action: "Visit shop",
      to: "/shop",
    },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-page">
        <div className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">Control center</p>
            <h1>Admin Dashboard</h1>
            <p className="dashboard-lead">
              Monitor store performance and manage catalog content from one
              place.
            </p>
          </div>
          <Link to="/admin/categories" className="add-category-btn">
            View categories
          </Link>
        </div>

        <div className="dashboard-summary">
          {summaryCards.map((card) => (
            <div key={card.label} className="summary-card">
              <p className="summary-card-label">{card.label}</p>
              <p className="summary-card-number">
                {card.value}
              </p>
              <Link to={card.link} className="summary-card-link">
                {card.linkLabel}
              </Link>
            </div>
          ))}
        </div>

        <div className="dashboard-links">
          {quickLinks.map((item) => (
            <article key={item.title} className="dashboard-link-card">
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <Link to={item.to} className="primary-link">
                {item.action}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
