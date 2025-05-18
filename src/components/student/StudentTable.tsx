import React from 'react'
import Note from './Note'
import NoteAction from './NoteAction';
import ViewDetail from './ViewDetail';

const StudentTable = () => {
  return (
    <div>
      <div className="relative overflow-x-auto mb-5" >
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                S.N
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>


              <th scope="col" className="px-6 py-3">
                Phone number
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

              <td className="px-6 py-4">1</td>
              <td className="px-6 py-4">01/12/2025</td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Sachin kumar
              </th>

              <td className="px-6 py-4">9834804385</td>


              <td className="px-6 py-4">

           
               
                  <select

                    id="countries_disabled"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                   
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                   
                  </select>
            

              </td>
              <td className="flex items-center px-6 py-4 space-x-3">
                <Note />

                <ViewDetail />

                <NoteAction />
              </td>
            </tr>

          </tbody>
        </table>
      </div>
<>
  <nav aria-label="Page navigation example mt-5 mx-auto d-flex justify-center" style={{display:"flex" , justifyContent:'center'}}>
    <ul className="inline-flex -space-x-px text-sm">
      <li>
        <a
          href="#"
          className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          Previous
        </a>
      </li>
      <li>
        <a
          href="#"
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          1
        </a>
      </li>
      <li>
        <a
          href="#"
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          2
        </a>
      </li>
      <li>
        <a
          href="#"
          aria-current="page"
          className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
        >
          3
        </a>
      </li>
      <li>
        <a
          href="#"
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          4
        </a>
      </li>
      <li>
        <a
          href="#"
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          5
        </a>
      </li>
      <li>
        <a
          href="#"
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          Next
        </a>
      </li>
    </ul>
  </nav>
 
</>

    </div>
  )
}

export default StudentTable