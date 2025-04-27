"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PlugInIcon,
  UserCircleIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },


  {
    name: "Student Management",
    icon: <ListIcon />,
    subItems: [{ name: "Leads", path: "/leads", pro: false }, { name: "Leads Create", path: "/leads-create", pro: false }],
  },

  // {
  //   name: "News",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "News List", path: "/news-list", pro: false }, { name: "News Add", path: "/news-add", pro: false }],ICAI
  // },
  // {
  //   name: "Ca Courses",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "CAP-I", path: "/cap-i", pro: false },{ name: "CAP-II", path: "/cap-ii", pro: false },{ name: "CAP-III", path: "/cap-iii", pro: false },{ name: "ICAI", path: "/icai", pro: false },{ name: "CA Final", path: "/ca-final", pro: false }],
  // },
  // {
  //   name: "Ca Courses",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "CA-Foundation", path: "/ca-foundation", pro: false },{ name: "CA-Intermediate", path: "/ca-Intermediate", pro: false },{ name: "CA Final", path: "/ca-final", pro: false },{ name: "Mandatory Training", path: "/mandatory-training", pro: false }],
  // },
  {
    name: "Ca Courses",
    icon: <ListIcon />,
    subItems: [{ name: "CA-Foundation", path: "/ca-foundation-list", pro: false },{ name: "CA-Intermediate", path: "/ca-Intermediate-list", pro: false },{ name: "CA Final", path: "/cafinal-list", pro: false },{ name: "Mandatory Training", path: "/mandatory-training-list", pro: false }],
  },
  {
    name: "News",
    icon: <ListIcon />,
    subItems: [{ name: "News List", path: "/news-list", pro: false }, { name: "News Add", path: "/news-add", pro: false }],
  },
  {
    name: "Blog",
    icon: <ListIcon />,
    subItems: [{ name: "Blog List", path: "/blog-list", pro: false }, { name: "Blog Add", path: "/blog-add", pro: false }],
  
  },
  {
    name: "Management Team",
    icon: <ListIcon />,
    subItems: [{ name: "Management team list", path: "/management-team-list", pro: false }, { name: "Management team add", path: "/management-team-add", pro: false }],
  },
  {
    name: "Team",
    icon: <ListIcon />,
    subItems: [{ name: "Team List", path: "/team-list", pro: false }, { name: "Team Add", path: "/team-add", pro: false }],
  },
  {
    name: "Testimonial",
    icon: <ListIcon />,
    subItems: [{ name: "Testimonial List", path: "/testimonial-list", pro: false }, { name: "Testimonial Add", path: "/testimonial-add", pro: false }],
  },
  {
    name: "Topper Student",
    icon: <ListIcon />,
    subItems: [{ name: "Topper student List", path: "/topper-list", pro: false }, { name: "Topper student add", path: "/topper-student", pro: false }],
  },
  {
    name: "Alumni",
    icon: <ListIcon />,
    subItems: [{ name: "Alumni List", path: "/alumni-list", pro: false }, { name: "Alumni add", path: "/alumni-add", pro: false }],
  },
  {
    name: "Slider",
    icon: <ListIcon />,
    subItems: [{ name: "Slider List", path: "/slider-list", pro: false }, { name: "Slider Add", path: "/slider-add", pro: false }],
  },
  {
    name: "Faq",
    icon: <ListIcon />,
    subItems: [{ name: "Faq List", path: "/faq-list", pro: false }, { name: "Faq Add", path: "/faq-add", pro: false }],
  },
  {
    name: "Highlight",
    icon: <ListIcon />,
    subItems: [{ name: "Highlight Add", path: "/highlight-add", pro: false }, { name: "Highlight List", path: "/highlight-list", pro: false }],
  },
  // {
  //   name: "Video",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Video List", path: "/video-list", pro: false }, { name: "Video Add", path: "/video-add", pro: false }],
  // },
 
  // {
  //   name: "Services",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Services List", path: "/services-list", pro: false }, { name: "Services Add", path: "/services-add", pro: false }],
  // },
  {
    name: "Pages",
    icon: <ListIcon />,
    subItems: [{ name: "About", path: "/about", pro: false }],
  },


  // {
  //   name: "Forms",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },

  //   ],


  // },
];

const othersItems: NavItem[] = [
  // {
  //   icon: <PieChartIcon />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/line-chart", pro: false },
  //     { name: "Bar Chart", path: "/bar-chart", pro: false },
  //   ],
  // },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/alerts", pro: false },
  //     { name: "Avatar", path: "/avatars", pro: false },
  //     { name: "Badge", path: "/badge", pro: false },
  //     { name: "Buttons", path: "/buttons", pro: false },
  //     { name: "Images", path: "/images", pro: false },
  //     { name: "Videos", path: "/videos", pro: false },
  //   ],
  // },
  {
    icon: <PlugInIcon />,
    name: "Setting",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Site Setting",
    subItems: [
      { name: "Seo Details", path: "/seo-details", pro: false },
      { name: "Social Media Link", path: "/social-media", pro: false },
      { name: "Site Setting", path: "/site-setting", pro: false },
      { name: "Home Page Setting", path: "/home-page-setting", pro: false },
      { name: "Site Images", path: "/site-images", pro: false },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Page"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Setting"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
