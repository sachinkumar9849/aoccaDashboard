import React from 'react';
import { Edit, Trash, Eye } from 'lucide-react';

// Define TypeScript interfaces
type StatusType = 'Active' | 'Pending' | 'Cancel';

interface User {
  id: number;
  name: string;
  role: string;
  phone: string;
  address: string;
  status: StatusType;
  avatar: string;
}

const UserTable: React.FC = () => {
  const users: User[] = [
    { 
      id: 1, 
      name: 'Lindsey Curtis', 
      role: 'Web Designer', 
      phone: '01-2102031', 
      address: 'Kathmandu Nepal', 
      status: 'Active',
      avatar: 'https://www.svgrepo.com/show/384676/account-avatar-profile-user-6.svg'
    },
    { 
      id: 2, 
      name: 'Kaiya George', 
      role: 'Project Manager', 
      phone: '01-2102031', 
      address: 'Kathmandu Nepal', 
      status: 'Pending',
      avatar: 'https://www.svgrepo.com/show/384676/account-avatar-profile-user-6.svg'
    },
    { 
      id: 3, 
      name: 'Zain Geidt', 
      role: 'Content Writing', 
      phone: '01-2102031', 
      address: 'Kathmandu Nepal', 
      status: 'Active',
      avatar: 'https://www.svgrepo.com/show/384676/account-avatar-profile-user-6.svg'
    },
    { 
      id: 4, 
      name: 'Abram Schleifer', 
      role: 'Digital Marketer', 
      phone: '01-2102031', 
      address: 'Kathmandu Nepal', 
      status: 'Cancel',
      avatar: 'https://www.svgrepo.com/show/384676/account-avatar-profile-user-6.svg'
    }
  ];

  const getStatusColor = (status: StatusType): string => {
    switch(status) {
      case 'Active':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-orange-600 bg-orange-100';
      case 'Cancel':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Full Name</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Phone Number</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Address</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-700">{user.phone}</td>
                <td className="py-4 px-6 text-gray-700">{user.address}</td>
                <td className="py-4 px-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                      <Edit size={18} />
                    </button>
                    <button className="p-1 text-red-500 hover:text-red-700">
                      <Trash size={18} />
                    </button>
                    <button className="p-1 text-green-500 hover:text-green-700">
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;