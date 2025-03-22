"use client";
import React, { useState } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";
import ImageUpload from "@/components/form/form-elements/ImageUpload";
import TextArea from "@/components/form/input/TextArea";
import StudentTable from "@/components/student/StudentTable";

const StudentList = () => {
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  return (
    <ComponentCard title="Video List">
          <StudentTable />
        </ComponentCard>
  )
}

export default StudentList