import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import CurrentStatus from '../common/leads/CurrentStatus'
import Note from './Note'

const StudentTable = () => {
  return (
    <div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Source
              </th>
             
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Current Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Sachin kumar
              </th>
              <td className="px-6 py-4">sachin@gmail.com</td>
              <td className="px-6 py-4">Facbook</td>
              <td className="px-6 py-4">9834804385</td>
           
              <td className="px-6 py-4">$2999</td>
              <td className="px-6 py-4">

                <CurrentStatus />
              </td>
              <td className="flex items-center px-6 py-4 space-x-3">
              <Note/>
                <a
                  href="#"
                  className="font-medium text-yellow-600 dark:text-yellow-500 hover:text-yellow-800 dark:hover:text-yellow-400"
                  title="Edit"
                >




                  <Dialog >
                    <DialogTrigger>

                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>



                    </DialogTrigger>
                    <DialogContent className='bg-white'>
                      <DialogHeader >

                        <DialogDescription>
                          <div className="max-w-md mx-auto overflow-hidden md:max-w-2xl ">
                            <div className="">
                              <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-xl text-white font-bold">SJ</span>
                                </div>
                                <div>
                                  <h2 className="text-2xl font-bold text-gray-800">Sachin kumar</h2>
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
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                </a>
           
             
                
                
              </td>
            </tr>
         

          </tbody>
        </table>
      </div>

    </div>
  )
}

export default StudentTable