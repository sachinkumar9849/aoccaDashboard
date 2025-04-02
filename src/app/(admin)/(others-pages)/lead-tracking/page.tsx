"use client";
import React from "react";
import Label from "@/components/form/Label";
import ComponentCard from "@/components/common/ComponentCard";
import LeadTracking from "@/components/common/LeadTracking";
import TaggingDropdown from "@/components/common/TaggingDropdownTag";

const StudentList = () => {


  return (
    <ComponentCard title="Led Tracking & Status Management">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          
          
          <div className="col-span-1">
        
           <LeadTracking/>
          </div>
          <div className="col-span-1">
          <Label>Lea Priority</Label>
            <TaggingDropdown/>
          </div>
        
        
        
         
        
          <div className="col-span-1">
          
            <a
              href=""
              target="_blank"
              rel="nofollow"
              className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
            >
              Submit
            </a>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default StudentList