"use client";
import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";


const StudentList = () => {

  return (
    <ComponentCard title="Video Add">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <Label>Student Name</Label>
            <Input type="text" />
          </div>
          <div className="col-span-1">
            <Label>Student Status
            </Label>
            <Input type="text" />
          </div>
        
         
        
          <div className="col-span-2">
            {/* <ImageUploader /> */}
          </div>
          <div className="col-span-2">
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