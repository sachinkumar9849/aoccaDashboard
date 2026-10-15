"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Share2,
  Save,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { apiClient } from "@/api/client";
import { CompanySetting } from "@/types";
import { toast } from "react-hot-toast";

const initialFormState: CompanySetting = {
  company_name: "Academy of Commerce",
  tagline: "Your Companion Towards Success",
  email: "academyofcommercenepal@gmail.com",
  secondary_email: "info@aoc.edu.np",
  phone: "+977-01-4240338",
  secondary_phone: "01-4232067",
  mobile: "+977-9800000000",
  address: "AOC Blue Complex, Ramshah Path, Putalisadak, Kathmandu",
  opening_hours: "Sun - Fri: 6:00 AM - 6:00 PM",
  google_map_url:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.5421846170616!2d85.31723307165261!3d27.70054137318389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a8da4510ab%3A0xc86ae3d135068afd!2sAcademy%20Of%20Commerce!5e0!3m2!1sen!2snp!4v1735921866914!5m2!1sen!2snp",
  facebook_url: "https://facebook.com",
  twitter_url: "https://twitter.com",
  instagram_url: "https://instagram.com",
  linkedin_url: "https://linkedin.com",
  youtube_url: "https://youtube.com",
  tiktok_url: "https://tiktok.com",
  whatsapp_number: "+977014240338",
};

const CompanySettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CompanySetting>(initialFormState);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch settings from API
  const { data, isLoading, refetch, isFetching } = useQuery<CompanySetting>({
    queryKey: ["company-settings"],
    queryFn: () => apiClient.getCompanySettings(),
  });

  useEffect(() => {
    if (data) {
      setFormData({
        ...initialFormState,
        ...data,
      });
      setHasChanges(false);
    }
  }, [data]);

  // Mutation to save settings
  const saveMutation = useMutation({
    mutationFn: (updated: Partial<CompanySetting>) =>
      apiClient.updateCompanySettings(updated),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["company-settings"] });
      toast.success(res?.message || "Company settings saved successfully!");
      setHasChanges(false);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save company settings");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleReset = () => {
    if (data) {
      setFormData({ ...initialFormState, ...data });
    } else {
      setFormData(initialFormState);
    }
    setHasChanges(false);
    toast("Form reset to saved values", { icon: "↩️" });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Company & Social Media Settings
              </h1>
              <p className="text-sm text-gray-500">
                Manage telephone numbers, emails, location, and social media links across the website.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {hasChanges && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Reset
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            <span>{saveMutation.isPending ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Info & Timing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-6">
            <Building2 className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">
              General Organization Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="e.g. Academy of Commerce"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Company Tagline / Motto
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline || ""}
                onChange={handleChange}
                placeholder="e.g. Your Companion Towards Success"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Opening / Office Hours
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="opening_hours"
                  value={formData.opening_hours || ""}
                  onChange={handleChange}
                  placeholder="e.g. Sun - Fri: 6:00 AM - 6:00 PM"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
                <Clock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Phone Numbers & Emails */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-6">
            <Phone className="text-emerald-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">
              Telephone, Phone & Email Contacts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Primary Telephone / Phone
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +977-01-4240338"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  required
                />
                <Phone
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Secondary Telephone / Landline
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="secondary_phone"
                  value={formData.secondary_phone || ""}
                  onChange={handleChange}
                  placeholder="e.g. 01-4232067"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
                <Phone
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Mobile / Hotlines
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile || ""}
                  onChange={handleChange}
                  placeholder="e.g. +977-9800000000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
                <Phone
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Primary Contact Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. academyofcommercenepal@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  required
                />
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Secondary / Admissions Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="secondary_email"
                  value={formData.secondary_email || ""}
                  onChange={handleChange}
                  placeholder="e.g. info@aoc.edu.np"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                WhatsApp Direct Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="whatsapp_number"
                  value={formData.whatsapp_number || ""}
                  onChange={handleChange}
                  placeholder="e.g. +977014240338 or +97798..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
                <MessageSquare
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Physical Address & Google Map */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-6">
            <MapPin className="text-rose-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">
              Address & Google Maps Embed
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Physical Campus / Office Address
              </label>
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. AOC Blue Complex, Ramshah Path, Putalisadak, Kathmandu"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Google Map Embed URL (iframe src)
              </label>
              <textarea
                name="google_map_url"
                rows={3}
                value={formData.google_map_url || ""}
                onChange={handleChange}
                placeholder="Paste Google Maps iframe src URL here..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-mono resize-none"
              />
            </div>
          </div>

          {formData.google_map_url && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-500 block mb-2">
                Map Preview:
              </span>
              <div className="h-44 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <iframe
                  src={formData.google_map_url}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Social Media Profiles */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-6">
            <Share2 className="text-indigo-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">
              Social Media Links
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Facebook Page URL
              </label>
              <input
                type="url"
                name="facebook_url"
                value={formData.facebook_url || ""}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Twitter / X URL
              </label>
              <input
                type="url"
                name="twitter_url"
                value={formData.twitter_url || ""}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url || ""}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                LinkedIn Page URL
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url || ""}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                YouTube Channel URL
              </label>
              <input
                type="url"
                name="youtube_url"
                value={formData.youtube_url || ""}
                onChange={handleChange}
                placeholder="https://youtube.com/@..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                TikTok Profile URL
              </label>
              <input
                type="url"
                name="tiktok_url"
                value={formData.tiktok_url || ""}
                onChange={handleChange}
                placeholder="https://tiktok.com/@..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Website Live Preview Summary
            </h3>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-medium">
              Live Synced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 block">Top Header Contact:</span>
              <p className="font-medium text-white truncate">{formData.address}</p>
              <p className="truncate">{formData.email}</p>
              <p className="truncate">
                {formData.phone} {formData.secondary_phone ? `, ${formData.secondary_phone}` : ""}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block">Hours & Mobile:</span>
              <p className="font-medium text-white">{formData.opening_hours || "—"}</p>
              <p>{formData.mobile || "No mobile set"}</p>
              <p className="text-emerald-400">WhatsApp: {formData.whatsapp_number || "—"}</p>
            </div>

            <div>
              <span className="text-slate-500 block">Active Social Links:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.facebook_url && (
                  <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded">Facebook</span>
                )}
                {formData.twitter_url && (
                  <span className="bg-sky-600/30 text-sky-300 px-2 py-0.5 rounded">Twitter/X</span>
                )}
                {formData.instagram_url && (
                  <span className="bg-pink-600/30 text-pink-300 px-2 py-0.5 rounded">Instagram</span>
                )}
                {formData.linkedin_url && (
                  <span className="bg-blue-700/30 text-blue-300 px-2 py-0.5 rounded">LinkedIn</span>
                )}
                {formData.youtube_url && (
                  <span className="bg-red-600/30 text-red-300 px-2 py-0.5 rounded">YouTube</span>
                )}
                {formData.tiktok_url && (
                  <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded">TikTok</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save size={18} />
            <span>{saveMutation.isPending ? "Saving Changes..." : "Save All Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettingsPage;
