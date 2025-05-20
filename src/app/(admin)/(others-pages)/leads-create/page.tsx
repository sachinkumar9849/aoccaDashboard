"use client";
import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";
import SelectFieldDemo from "@/components/common/SelectFieldDemo";
import CurrentStatusSelect from "@/components/common/CurrentStatusSelect";
import StudentInquiryManagement from "@/components/common/StudentInquiryManagement";
import LeadTracking from "@/components/common/LeadTracking";
import TaggingDropdown from "@/components/common/TaggingDropdownTag";
import Inquiry from "@/components/common/Inquiry";
import { NotesMenu } from "@/components/crm/NotesMenu";
import DatePicker from "@/components/crm/DatePickerDemo";
import Editor from "@/components/common/Editor";

const StudentList = () => {


  return (
    <>
      <ComponentCard title="">
        <div className="flex justify-between mt-[-1px]">
          <p className="text-base font-medium text-gray-800 dark:text-white/90">Student Details</p>
          <NotesMenu />
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <Label>Full Name</Label>
              <Input type="text" />
            </div>
            <div className="col-span-1">
              <Label> Phone
              </Label>
              <Input type="number" />
            </div>
            <div className="col-span-1">
              <Label> Email
              </Label>
              <Input type="email" />
            </div>
            <div className="col-span-1">
              <Label> Address
              </Label>
              <Input type="text" />
            </div>
          </div>
        </div>
      </ComponentCard>
      <ComponentCard className="mt-4" title="Academic Background">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <SelectFieldDemo />
            </div>
            <div className="col-span-1">
              <CurrentStatusSelect />
            </div>

          </div>
        </div>
      </ComponentCard>
      <ComponentCard className="mt-4" title="Student Inquiry Management">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <StudentInquiryManagement />
            </div>
            <div className="col-span-1">
              <Inquiry />
            </div>
            <div className="col-span-1">
              <label htmlFor="">Amount</label>
              <Input />
            </div>
            <div className="col-span-1">

              <LeadTracking />
            </div>
            <div className="col-span-1">
              <Label>Lea Priority</Label>
              <TaggingDropdown />
            </div>
            <div className="col-span-1">
              <Label>Date</Label>
              <DatePicker />
            </div>
            <div className="col-span-3">
              <Editor

                height="300px"
                placeholder="Enter blog content here..."
              />
            </div>
            <div className="col-span-3">
              <a
                href=""
                target="_blank"
                rel="nofollow"
                className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
              >
                CREATE LEAD
              </a>
            </div>
          </div>
        </div>
      </ComponentCard>


    </>
  )
}

export default StudentList