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

interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  status: string;
  // Add other lead properties you need
}

interface ActionProps {
  lead: Lead;
}

const Action: React.FC<ActionProps> = ({ lead }) => {
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

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
        </div>
    );
};

export default Action;