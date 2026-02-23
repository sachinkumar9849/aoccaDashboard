import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'



interface Note {
    id: string;
    content: string;
    added_at: string;
    user: {
        first_name: string;
        last_name: string;
    };
}

interface ViewDetailProps {
    leadId: string;
    leadData: {
        id: string;
        full_name: string;
        phone: string;
        email: string;
        address: string;
        previous_qualification: string;
        current_status: string;
        lead_source: string;
        inquiry: string;
        amount: number;
        status: string;
        follow_up_date: string | null;
        tag: string;
        created_at: string;
        updated_at: string;
    };
}

const fetchNotes = async (leadId: string) => {
    const token = localStorage.getItem('authToken') || '';
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/leads/${leadId}/notes`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

const formatCurrency = (amount: number) => {
    return `Rs ${new Intl.NumberFormat('en-NP').format(amount)}`;
};

const ViewDetail: React.FC<ViewDetailProps> = ({ leadId, leadData }) => {
    const { data: notes, isLoading, isError } = useQuery({
        queryKey: ['notes', leadId],
        queryFn: () => fetchNotes(leadId),
    });

    return (
        <Dialog>
            <DialogTrigger>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogDescription className='bg-white'>
                        <div className="bg-white">
                            <div className="flex items-center justify-between space-x-4 mb-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-xl text-white font-bold">
                                            {leadData.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </span>
                                    </div>
                                    <div className='ml-2'>
                                        <DialogTitle>{leadData.full_name}</DialogTitle>
                                        <p className="text-sm text-gray-600">Lead Status: <span className="font-semibold capitalize">{leadData.status}</span></p>
                                        <p className="text-sm text-gray-600">Tag: <span className="font-semibold capitalize">{leadData.tag || 'None'}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <span className="w-32 text-gray-500 text-sm text-right mr-2">Created At:-</span>
                                    <span className="font-bold text-gray-800 flex-1">
                                        {new Date(leadData.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-lg font-semibold mb-4">Lead Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <span className="w-32 text-gray-500 text-sm">Full Name</span>
                                            <span className="font-medium text-gray-800 flex-1">{leadData.full_name}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-32 text-gray-500 text-sm">Email</span>
                                            <a href={`mailto:${leadData.email}`} className="font-medium text-blue-600 hover:underline flex-1">{leadData.email}</a>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-32 text-gray-500 text-sm">Phone</span>
                                            <a href={`tel:${leadData.phone}`} className="font-medium text-gray-800 flex-1">{leadData.phone}</a>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-32 text-gray-500 text-sm">Address</span>
                                            <span className="font-medium text-gray-800 flex-1">{leadData.address}</span>
                                        </div>

                                        <div className="flex items-start">
                                            <span className="w-32 text-gray-500 text-sm">Previous Qualification</span>
                                            <span className="font-medium text-gray-800 flex-1">{leadData.previous_qualification}</span>
                                        </div>

                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <span className="w-32 text-gray-500 text-sm">Current Status</span>
                                            <span className="font-medium text-gray-800 flex-1 capitalize">{leadData.current_status}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-32 text-gray-500 text-sm">Lead Source</span>
                                            <span className="font-medium text-gray-800 flex-1 capitalize">{leadData.lead_source}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-32 text-gray-500 text-sm">Inquiry</span>
                                            <span className="font-medium text-gray-800 flex-1">{leadData.inquiry}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-32 text-gray-500 text-sm">Amount</span>
                                            <span className="font-medium text-gray-800 flex-1">{formatCurrency(leadData.amount)}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-32 text-gray-500 text-sm">Follow-up Date</span>
                                            <span className="font-medium text-gray-800 flex-1">{formatDate(leadData.follow_up_date)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="text-lg font-semibold mb-4">Notes</h3>
                                    {isLoading ? (
                                        <p className="text-gray-500">Loading notes...</p>
                                    ) : isError ? (
                                        <p className="text-red-500">Error loading notes</p>
                                    ) : notes && notes.length > 0 ? (
                                        <div className="space-y-4">
                                            {notes.map((note: Note) => (
                                                <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-gray-800">{note.content}</p>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(note.added_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Added by: {note.user.first_name} {note.user.last_name}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No notes available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ViewDetail