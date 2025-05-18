"use client";
import React from "react";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const RoutineAdd = () => {



    return (
        <form className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
                <ComponentCard title="CA Foundation">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <Label htmlFor="title">Session</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"


                            />

                        </div>

                        <div className="col-span-1">
                            <Label htmlFor="name">Total Student</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"

                            />

                        </div>





                        <div className="col-span-1 dd">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                name="status"


                            >
                                <SelectTrigger className="w-full" style={{ height: "44px" }}>
                                    <SelectValue placeholder="published" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>

                        </div>
                        <div className="col-span-2">
                            <button
                                type="submit"

                                className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 disabled:opacity-70"
                            >
                                Submit
                            </button>
                        </div>

                    </div>
                </ComponentCard>

            </div>
        </form>
    );
};

export default RoutineAdd;