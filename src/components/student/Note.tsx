import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const Note = () => {
    return (
        <div >
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="cursor-pointer border-gray-300 w-[26px] h-[26px] leading-[22px] rounded-full border-1">
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='bg-white'>
                    <DropdownMenuLabel>My Account My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Note