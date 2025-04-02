import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


const ViewDetail = () => {
    return (
        <>

            <Dialog>
                <DialogTrigger>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </DialogTrigger>
                <DialogContent >
                    <DialogHeader>

                        <DialogDescription className='bg-white'>
                            <div className="bg-white">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-xl text-white font-bold">SJ</span>
                                    </div>
                                    <div>
                                        <DialogTitle>Sachin Kumar Jha</DialogTitle>
                                        <p className="text-sm text-gray-600">Student <span className="font-semibold">CA</span></p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <ul className="space-y-3">
                                        <li className="flex items-center">
                                            <span className="w-24 text-gray-500 text-sm">Name</span>
                                            <span className="font-medium text-gray-800">Sachin</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-24 text-gray-500 text-sm">Email</span>
                                            <a href="mailto:alex.della@outlook.com" className="font-medium text-blue-600 hover:underline">sacin@gmail.com</a>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-24 text-gray-500 text-sm">Phone</span>
                                            <a href="tel:+013755896654" className="font-medium text-gray-800">+01 (375) 5896 654</a>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-24 text-gray-500 text-sm">Source</span>
                                            <a href="https://www.wrapcodes.com" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">Facebook</a>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-24 text-gray-500 text-sm">Current Status</span>
                                            <span className="font-medium text-green-600">Active</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default ViewDetail