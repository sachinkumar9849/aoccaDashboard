import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface NoteProps {
  leadId: string;
}

export interface Note {
  id: string;
  lead_id: string;
  content: string;
  added_by: string;
  added_at: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

const fetchNotes = async (leadId: string) => {
  const token = localStorage.getItem('authToken') || '';
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/leads/${leadId}/notes`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

const NoteList: React.FC<NoteProps> = ({ leadId }) => {
  const { data: notes, isLoading, isError } = useQuery({
    queryKey: ['notes', leadId],
    queryFn: () => fetchNotes(leadId),
  });

  return (
    <div className="p-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="cursor-pointer border border-gray-300 w-8 h-8 flex items-center justify-center rounded-full">
            <FontAwesomeIcon icon={faNoteSticky} className="text-gray-600" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white w-64 shadow-md rounded-md p-2 max-h-96 overflow-y-auto">
          <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 cursor-default">
           
            <ol className="relative border-s border-gray-200 dark:border-gray-700">
            
              {isLoading ? (
                <li className="mb-10 ms-4">
                  <p>Loading notes...</p>
                </li>
              ) : isError ? (
                <li className="mb-10 ms-4">
                  <p>Error loading notes</p>
                </li>
              ) : notes && notes.length > 0 ? (
                notes.map((note: Note) => (
                  <li key={note.id} className="mb-10 ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      {new Date(note.added_at).toLocaleDateString()}
                    </time>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {note.user.first_name} {note.user.last_name}
                    </h3>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                      {note.content}
                    </p>
                  </li>
                ))
              ) : (
                <li className="mb-10 ms-4">
                  <p>No notes found</p>
                </li>
              )}
            </ol>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NoteList;