"use client";
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure you want to delete?",
  description = "This action cannot be undone. This will permanently delete the selected item.",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelButtonText}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;