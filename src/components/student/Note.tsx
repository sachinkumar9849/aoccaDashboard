import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEllipsisVertical, 
  faPencil, 
  faPrint, 
  faClock, 
  faBox, 
  faCircleExclamation, 
  faTrash 
} from "@fortawesome/free-solid-svg-icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Note = () => {
    return (
        <div className="p-4">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="cursor-pointer border border-gray-300 w-8 h-8 flex items-center justify-center rounded-full">
                        <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-600" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white w-64 shadow-md rounded-md p-2">
                    <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 cursor-pointer">
                        <FontAwesomeIcon icon={faPencil} className="text-gray-600" />
                        <span className="text-gray-700 font-medium">Edit</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 cursor-pointer">
                        <FontAwesomeIcon icon={faPrint} className="text-gray-600" />
                        <span className="text-gray-700 font-medium">Print</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 cursor-pointer">
                        <FontAwesomeIcon icon={faClock} className="text-gray-600" />
                        <span className="text-gray-700 font-medium">Remind</span>
                    </DropdownMenuItem>
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 cursor-pointer">
                        <FontAwesomeIcon icon={faBox} className="text-gray-600" />
                        <span className="text-gray-700 font-medium">Archive</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 cursor-pointer">
                        <FontAwesomeIcon icon={faCircleExclamation} className="text-gray-600" />
                        <span className="text-gray-700 font-medium">Report Spam</span>
                    </DropdownMenuItem>
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 cursor-pointer">
                        <FontAwesomeIcon icon={faTrash} className="text-gray-600" />
                        <span className="text-gray-700 font-medium">Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default Note;