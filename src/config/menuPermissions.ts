/**
 * ============================================================================
 * Sidebar Menu Role Permissions Configuration
 * ============================================================================
 * 
 * Edit this file to control which sidebar menus and submenus are visible
 * based on user roles.
 * 
 * SYSTEM ROLES:
 * - "admin"   : Full administrative access
 * - "teacher" : Faculty / Instructors
 * - "staff"   : Administrative / Operations staff
 * - "student" : Enrolled students
 * 
 * HOW TO CONFIGURE:
 * 1. To show a menu to specific roles:
 *      "Menu Name": ["admin", "staff"]
 * 
 * 2. To show a menu to ALL roles:
 *      "Menu Name": ["*"]
 * 
 * 3. To HIDE a menu from ALL roles:
 *      "Menu Name": []
 * 
 * 4. To give 'admin' automatic access to all menus, set ADMIN_HAS_FULL_ACCESS = true.
 * ============================================================================
 */

import React from "react";

export type UserRole = "admin" | "teacher" | "staff" | "student" | string;

export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STAFF: "staff",
  STUDENT: "student",
} as const;

/**
 * When true, users with 'admin' role bypass checks and see all menus.
 * Set to false if you want 'admin' to strictly follow the permissions list.
 */
export const ADMIN_HAS_FULL_ACCESS = true;

/**
 * Default visibility for any menu or submenu not explicitly listed below.
 * Set to true to show unlisted menus by default, or false to hide them.
 */
export const DEFAULT_ACCESS_ALLOWED = true;

/**
 * Centralized Role Permissions Configuration
 * 
 * Key: Menu Name, Submenu Name, or Route Path
 * Value: Array of allowed role names, or ["*"] for all roles
 */
export const MENU_PERMISSIONS: Record<string, UserRole[]> = {
  // ==========================================
  // MAIN SECTIONS / PARENT MENUS
  // ==========================================
  "Dashboard": ["*"],
  "User Management": ["admin"],
  "Lead Management": ["admin", "staff"],
  "Student Management": ["admin", "teacher", "staff"],
  "Class Management": ["admin", "teacher"],
  "Subjects": ["admin", "teacher"],
  "Exams": ["admin", "teacher"],
  "Routine": ["admin", "teacher", "student"],
  "Ca Courses": ["admin", "teacher", "staff", "student"],
  "News": ["admin", "staff"],
  "Blog": ["admin", "staff"],
  "Management Team": ["admin"],
  "Team": ["admin"],
  "Testimonial": ["admin"],
  "Topper Student": ["admin"],
  "Alumni": ["admin"],
  "Slider": ["admin"],
  "Gallery": ["admin"],
  "Faq": ["admin"],
  "Highlight": ["admin"],
  "Pages": ["admin"],
  "SEO": ["admin"],
  "Header Popup": ["admin"],
  "Settings": ["admin"],
  "Company Settings": ["admin"],

  // ==========================================
  // SUBMENU ITEMS (Granular Control)
  // ==========================================
  // User Management
  "Users": ["admin"],
  "Staff List": ["admin"],

  // Lead Management
  "Leads": ["admin", "staff"],
  "Follow up leads": ["admin", "staff"],
  "Leads Create": ["admin", "staff"],

  // Student Management
  "Student Class": ["admin", "teacher", "staff"],

  // Class Management
  "CA Foundation": ["admin", "teacher"],
  "CA Foundation ": ["admin", "teacher"],
  "CA Intermediate": ["admin", "teacher"],
  "CA Intermediate ": ["admin", "teacher"],
  "CA Final": ["admin", "teacher"],
  "CA Final ": ["admin", "teacher"],
  "CA Mandatory": ["admin", "teacher"],
  "CA Mandatory ": ["admin", "teacher"],

  // Subjects
  "Subject List": ["admin", "teacher"],
  "Create Subject": ["admin", "teacher"],

  // Exams
  "Exam List": ["admin", "teacher"],
  "Create Exam": ["admin", "teacher"],

  // Routine
  "Routine List": ["admin", "teacher", "student"],
  "Create Routine": ["admin", "teacher"],

  // Ca Courses
  "CA-Foundation": ["admin", "teacher", "staff", "student"],
  "CA-Intermediate": ["admin", "teacher", "staff", "student"],
  "Mandatory Training": ["admin", "teacher", "staff", "student"],

  // News
  "News List": ["admin", "staff"],
  "News Add": ["admin", "staff"],

  // Blog
  "Blog List": ["admin", "staff"],
  "Blog Add": ["admin", "staff"],

  // Management Team
  "Management team list": ["admin"],
  "Management team add": ["admin"],

  // Team
  "Team List": ["admin"],
  "Team Add": ["admin"],

  // Testimonial
  "Testimonial List": ["admin"],
  "Testimonial Add": ["admin"],

  // Topper Student
  "Topper student List": ["admin"],
  "Topper student add": ["admin"],

  // Alumni
  "Alumni List": ["admin"],
  "Alumni add": ["admin"],

  // Slider
  "Slider List": ["admin"],
  "Slider Add": ["admin"],

  // Gallery
  "Gallery List": ["admin"],
  "Gallery Add": ["admin"],

  // Faq
  "Faq List": ["admin"],
  "Faq Add": ["admin"],

  // Highlight
  "Highlight Add": ["admin"],
  "Highlight List": ["admin"],

  // Pages
  "About": ["admin"],

  // SEO
  "Archive Pages SEO": ["admin"],
  "Popup List": ["admin"],
  "Popup Add": ["admin"],

  // ==========================================
  // OTHERS SECTION
  // ==========================================
  "User Profile": ["*"],
};

/**
 * Shape of menu items for filtering
 */
export interface NavSubItemLike {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  roles?: UserRole[];
}

export interface NavItemLike {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  roles?: UserRole[];
  subItems?: NavSubItemLike[];
}

/**
 * Check if a menu item or submenu item is visible to the given role
 */
export function isMenuVisible(
  menuName: string,
  userRole?: string | null,
  path?: string,
  customRoles?: UserRole[]
): boolean {
  const normalizedRole = (userRole || "").toLowerCase().trim();

  // Admin bypass
  if (ADMIN_HAS_FULL_ACCESS && normalizedRole === "admin") {
    return true;
  }

  // Find permissions rule: check exact name, trimmed name, path, or custom item roles
  const trimmedName = menuName.trim();
  const configuredRoles =
    MENU_PERMISSIONS[menuName] ??
    MENU_PERMISSIONS[trimmedName] ??
    (path ? MENU_PERMISSIONS[path] : undefined) ??
    customRoles;

  // If not configured, fall back to default
  if (!configuredRoles) {
    return DEFAULT_ACCESS_ALLOWED;
  }

  // If empty array, hidden from everyone
  if (configuredRoles.length === 0) {
    return false;
  }

  // If contains wildcard, visible to all
  if (configuredRoles.includes("*")) {
    return true;
  }

  // Check if current user role is included
  if (!normalizedRole) {
    return false;
  }

  return configuredRoles.some(
    (allowedRole) => allowedRole.toLowerCase().trim() === normalizedRole
  );
}

/**
 * Filter navigation items based on user role
 */
export function filterNavItemsByRole<T extends NavItemLike>(
  items: T[],
  userRole?: string | null
): T[] {
  return items
    .map((item) => {
      // 1. Check if the parent menu item is allowed
      const isParentAllowed = isMenuVisible(
        item.name,
        userRole,
        item.path,
        item.roles
      );

      if (!isParentAllowed) {
        return null;
      }

      // 2. If item has subItems, filter them
      if (item.subItems && item.subItems.length > 0) {
        const allowedSubItems = item.subItems.filter((sub) =>
          isMenuVisible(sub.name, userRole, sub.path, sub.roles)
        );

        // If parent has no allowed sub-items and has no direct path, hide it
        if (allowedSubItems.length === 0 && !item.path) {
          return null;
        }

        return {
          ...item,
          subItems: allowedSubItems,
        };
      }

      return item;
    })
    .filter((item): item is T => item !== null);
}
