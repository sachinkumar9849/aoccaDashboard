"use client";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";

import StudentTable from "@/components/student/StudentTable";

const StudentList = () => {
  

  return (
    <ComponentCard title="Services List">
      <div className="space-y-6">
         <StudentTable />
      </div>
    </ComponentCard>
  )
}

export default StudentList