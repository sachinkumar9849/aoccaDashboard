"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end flex-row justify-between mt-5">

          <span className="text-sm text-gray-500 dark:text-gray-400">
            Students
          </span>
          <h4 className=" font-bold text-gray-800 text-title-sm dark:text-white/90">
            3,782
          </h4>


        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end flex-row justify-between mt-5">

          <span className="text-sm text-gray-500 dark:text-gray-400">
            Ca Courses
          </span>
          <h4 className=" font-bold text-gray-800 text-title-sm dark:text-white/90">
            22
          </h4>


        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}

      {/* <!-- Metric Item End --> */}
    </div>
  );
};
