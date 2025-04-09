import React from 'react'

const TableListLoading = () => {
    return (
        <>
            <div className="w-full p-4 bg-white rounded-lg shadow-sm animate-pulse">
                <div className="h-7 w-40 bg-gray-200 rounded mb-4"></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="py-4 px-6 text-left">
                                    <div className="h-5 w-10 bg-gray-200 rounded"></div>
                                </th>
                                <th className="py-4 px-6 text-left">
                                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                                </th>
                                <th className="py-4 px-6 text-left">
                                    <div className="h-5 w-14 bg-gray-200 rounded"></div>
                                </th>
                                <th className="py-4 px-6 text-left">
                                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                                </th>
                                <th className="py-4 px-6 text-left">
                                    <div className="h-5 w-24 bg-gray-200 rounded"></div>
                                </th>
                                <th className="py-3 px-6 text-left">
                                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-4 px-6">
                                        <div className="h-5 w-8 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="h-5 w-24 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="flex gap-2">
                                            <div className="p-1 w-6 h-6 bg-gray-200 rounded"></div>
                                            <div className="p-1 w-6 h-6 bg-gray-200 rounded"></div>
                                            <div className="p-1 w-6 h-6 bg-gray-200 rounded"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default TableListLoading