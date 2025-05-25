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
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import Label from '../form/Label';
import Input from '../form/input/InputField';

interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  address?: string;
  previous_qualification?: string;
  status: string;
  tag?: string;
  follow_up_date?: string;
}

interface LeadsEditProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

const LeadsEdit: React.FC<LeadsEditProps> = ({ isOpen, onOpenChange, lead }) => {
  const queryClient = useQueryClient();

  const updateLeadMutation = useMutation({
    mutationFn: (updatedLead: Partial<Lead>) => {
      const token = localStorage.getItem('authToken') || '';
      return axios.patch(
        `${process.env.NEXT_PUBLIC_URL}/leads/${lead.id}`,
        updatedLead,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated successfully');
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(`Error updating lead: ${error.response?.data?.message || error.message}`);
    }
  });

  const formik = useFormik({
    initialValues: {
      full_name: lead.full_name,
      phone: lead.phone,
      email: lead.email,
      status: lead.status,
      tag: lead.tag || '',
      follow_up_date: lead.follow_up_date ? lead.follow_up_date.split('T')[0] : '',
    },
    onSubmit: (values) => {
      updateLeadMutation.mutate({
        ...values,
        follow_up_date: values.follow_up_date ? `${values.follow_up_date}T00:00:00Z` : undefined
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.full_name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                onChange={formik.handleChange}
                value={formik.values.phone}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                onChange={formik.handleChange}
                value={formik.values.status}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="waitingForResult">Waiting for result</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                name="tag"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.tag}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="follow_up_date">Follow-up Date</Label>
              <Input
                id="follow_up_date"
                name="follow_up_date"
                type="date"
                onChange={formik.handleChange}
                value={formik.values.follow_up_date}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateLeadMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateLeadMutation.isPending}
            >
              {updateLeadMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadsEdit;