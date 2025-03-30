"use client";
import React from "react";

import ComponentCard from "@/components/common/ComponentCard";
import StudentTable from "@/components/student/StudentTable";

const StudentList = () => {

  return (
    <ComponentCard title="Blog List">
          <StudentTable />
        </ComponentCard>
  )
}

export default StudentList