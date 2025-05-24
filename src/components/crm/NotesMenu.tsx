"use client";
import React, { useState } from "react";

import Input from "../form/input/InputField";
import DatePicker from "./DatePickerDemo";

export const NotesMenu = () => {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote]);
      setNewNote("");
    }
  };

  return (
    <>

      <button
        onClick={openDrawer}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0e569d] rounded-lg hover:bg-[#0e569d] focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Notes
      </button>

      {/* Drawer / Sidebar */}
      <div
        className={`fixed inset-0 z-50 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          } transition-opacity duration-300`}
      >

        <div
          className="fixed inset-0 bg-black/50"
          onClick={closeDrawer}
        ></div>


        <div className={`fixed right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl transform ${open ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300`}>
          <div className="flex flex-col h-full">

            <div className="flex items-center justify-between p-4 border-b">
              <h5 className="text-lg font-medium">Notes</h5>
              <button
                onClick={closeDrawer}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>





            <div className="p-4 border-t">
              <div className="flex gap-2 mb-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                ></textarea>
              </div>
              <DatePicker />
              <button
                onClick={handleAddNote}
                className="w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-[#0e569d] rounded-md focus:outline-none"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};