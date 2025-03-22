"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Image from "next/image";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
}

// Sample table data
const tableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Sachin kumar jha",
      role: "Nepal Topper In Ca Final",
    },
  },
];

export default function StudentTable() {
  // Action Handlers
  const handleEdit = (id: number) => alert(`Edit student with ID: ${id}`);
  const handleDelete = (id: number) => alert(`Delete student with ID: ${id}`);
  const handleView = (id: number) => alert(`View student with ID: ${id}`);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start">Student Image</TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start">Student Name</TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start">Student Status</TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start">Action</TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((order) => (
                <TableRow key={order.id}>
                  {/* Student Image */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={order.user.image}
                          alt={order.user.name}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Student Name */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start">{order.user.name}</TableCell>

                  {/* Student Status */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start">{order.user.role}</TableCell>

                  {/* Action Icons */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start flex gap-4">
                    <FaEye
                      className="cursor-pointer text-blue-500 hover:text-blue-700"
                      onClick={() => handleView(order.id)}
                    />
                    <FaEdit
                      className="cursor-pointer text-green-500 hover:text-green-700 mx-4"
                      onClick={() => handleEdit(order.id)}
                    />
                    <FaTrash
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(order.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
