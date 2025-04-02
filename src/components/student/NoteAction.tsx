import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 

  faNoteSticky
} from "@fortawesome/free-solid-svg-icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NoteAction = () => {
    return (
        <div className="p-2">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="cursor-pointer border border-gray-300 w-8 h-8 flex items-center justify-center rounded-full">
                        {/* <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-600" /> */}
                        <FontAwesomeIcon icon={faNoteSticky} className="text-gray-600" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white w-64 shadow-md rounded-md p-2">
                    <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 cursor-pointer">
                    <ol className="relative border-s border-gray-200 dark:border-gray-700">

  <li className="mb-10 ms-4">
    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
      March 2022
    </time>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
    Lorem Ipsum is simply dummy text 
    </h3>
    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
    Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text 
    </p>
  </li>
  <li className="ms-4">
    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
      April 2025
    </time>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
    Lorem Ipsum is simply dummy text 
    </h3>
    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
    Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text 
    </p>
  </li>
</ol>

                    </DropdownMenuItem>
                    
                  
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default NoteAction;