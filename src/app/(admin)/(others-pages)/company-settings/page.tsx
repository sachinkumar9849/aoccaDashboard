import CompanySettingsPage from "@/components/pageComponent/CompanySettingsPage";
import React from "react";

export const metadata = {
  title: "Company & Social Media Settings | Admin Portal",
  description: "Manage company contact numbers, emails, location, and social media links",
};

const page = () => {
  return <CompanySettingsPage />;
};

export default page;
