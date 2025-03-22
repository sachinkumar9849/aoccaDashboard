import ComponentCard from '@/components/common/ComponentCard'
import StudentTable from '@/components/student/StudentTable'

import React from 'react'

const StudentList = () => {
  return (
    <ComponentCard title="Student List">
          <StudentTable />
        </ComponentCard>
  )
}

export default StudentList