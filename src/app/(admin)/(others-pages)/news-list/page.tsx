"use client";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import NewsBlogList from "@/components/pageComponent/NewsBlogList";

const StudentList = () => {

  return (
    <ComponentCard title="Blog List">
           <NewsBlogList />
        </ComponentCard>
  )
}

export default StudentList