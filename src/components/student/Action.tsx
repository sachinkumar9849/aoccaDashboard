// src/components/student/Action.tsx
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEllipsisVertical,
    faPencil,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LeadsEdit from './LeadsEdit';
import NotesAdd from './NotesAdd';

interface Lead {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    status: string;

}

interface ActionProps {
    lead: Lead;
}

const Action: React.FC<ActionProps> = ({ lead }) => {
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [isNotAddOpen, setIsNotAddOpen] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const handleNoteAdd = () => {
        setIsNotAddOpen(true);
        setIsDropdownOpen(false); // Close dropdown when opening edit modal
    };

    const handleEditClick = () => {
        setIsEditOpen(true);
        setIsDropdownOpen(false); // Close dropdown when opening edit modal
    };

    const handleEditClose = (open: boolean) => {
        setIsEditOpen(open);
        // Ensure dropdown stays closed when edit modal closes
        if (!open) {
            setIsDropdownOpen(false);
        }
    };
    const handleAddClose = (open: boolean) => {
        setIsNotAddOpen(open);
        // Ensure dropdown stays closed when edit modal closes
        if (!open) {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className="p-2">
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger>
                    <div className="cursor-pointer border border-gray-300 w-8 h-8 flex items-center justify-center rounded-full">
                        <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-600" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white w-64 shadow-md rounded-md p-2">
                    <DropdownMenuItem
                        className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 cursor-pointer"
                        onClick={handleNoteAdd}
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
                        <span className="text-gray-700 font-medium"> Notes Add</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 cursor-pointer"
                        onClick={handleEditClick}
                    >
                        <FontAwesomeIcon icon={faPencil} className="text-gray-600" />
                        <span className="text-gray-700 font-medium">Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 cursor-pointer">
                        <FontAwesomeIcon icon={faTrash} className="text-gray-600" />
                        <span className="text-gray-700 font-medium">Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>



            <LeadsEdit
                isOpen={isEditOpen}
                onOpenChange={handleEditClose}
                lead={lead}
            />
            <NotesAdd
                isOpen={isNotAddOpen}
                onOpenChange={handleAddClose}
                lead={lead}
            />
        </div>
    );
};

export default Action;