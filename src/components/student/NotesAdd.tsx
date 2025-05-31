import React from 'react';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

interface Lead {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    status: string;
    address?: string;
    previous_qualification?: string;
    tag?: string;
    follow_up_date?: string;
}

interface NotesAddProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    lead: Lead;
}

interface NoteData {
    content: string;
    added_by: string;
}


const validationSchema = Yup.object({
    content: Yup.string()
        .required('Note content is required')
        .min(1, 'Note cannot be empty')
        .max(1000, 'Note cannot exceed 1000 characters'),
});

const NotesAdd: React.FC<NotesAddProps> = ({ isOpen, onOpenChange, lead }) => {
    const queryClient = useQueryClient();

    // API call function
    const addNote = async (noteData: NoteData) => {
        // Get the auth token - replace this with your actual token retrieval method
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (!token) {
            throw new Error('No authentication token found. Please log in again.');
        }

        const response = await axios.post(
            `http://156.67.104.182:8081/api/v1/leads/${lead.id}/notes`,
            noteData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // or just token depending on your API
                },
            }
        );
        return response.data;
    };

    // Mutation for adding note
    const addNoteMutation = useMutation({
        mutationFn: addNote,
        onSuccess: async () => {
            toast.success('Note added successfully!');
            
            // Immediately refetch the notes query
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['notes', lead.id] }),
                queryClient.invalidateQueries({ queryKey: ['lead-notes', lead.id] }),
                queryClient.invalidateQueries({ queryKey: ['leads'] }),
                // Refetch notes immediately
                queryClient.refetchQueries({ queryKey: ['notes', lead.id] }),
                queryClient.refetchQueries({ queryKey: ['lead-notes', lead.id] }),
            ]);
            
            formik.resetForm();
            onOpenChange(false);
        },
       
    });

    // Formik setup
    const formik = useFormik({
        initialValues: {
            content: '',
        },
        validationSchema,
        onSubmit: (values) => {
            // You'll need to get the actual user ID from your auth context/state
            // Replace this with the actual logged-in user ID
            const userId = "ae4c46fa-ff56-45d9-8c3d-bb2101076256"; // This should come from your auth context
            
            addNoteMutation.mutate({
                content: values.content,
                added_by: userId,
            });
        },
    });

    const handleClose = () => {
        if (!addNoteMutation.isPending) {
            formik.resetForm();
            onOpenChange(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!addNoteMutation.isPending) {
                    if (!open) {
                        handleClose();
                    } else {
                        onOpenChange(open);
                    }
                }
            }}
        >
            <DialogContent
                className="max-h-[80vh] overflow-y-auto max-w-md"
                onInteractOutside={(e) => {
                    if (addNoteMutation.isPending) {
                        e.preventDefault();
                    }
                }}
                onEscapeKeyDown={(e) => {
                    if (addNoteMutation.isPending) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>Add Note for {lead.full_name}</DialogTitle>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium text-gray-700">
                            Note Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formik.values.content}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Add a note about this lead..."
                            className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                formik.touched.content && formik.errors.content
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300'
                            }`}
                            rows={4}
                            disabled={addNoteMutation.isPending}
                        />
                        {formik.touched.content && formik.errors.content && (
                            <p className="text-sm text-red-500">{formik.errors.content}</p>
                        )}
                        <p className="text-xs text-gray-500">
                            {formik.values.content.length}/1000 characters
                        </p>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={addNoteMutation.isPending}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={addNoteMutation.isPending || !formik.values.content.trim()}
                            className="flex-1 text-white bg-[#0e569d] hover:bg-[#0d4a85]"
                        >
                            {addNoteMutation.isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Adding...
                                </div>
                            ) : (
                                'Add Note'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NotesAdd;