"use client";
import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";
import TextArea from "@/components/form/input/TextArea";
import ImageUploader from "@/components/ImageUploader";

const About = () => {

  return (
    <ComponentCard title="About Us">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <Label>Heading</Label>
            <Input type="text" />
          </div>
          <div className="col-span-1">
            <Label>Slug
            </Label>
            <Input type="text" />
          </div>


          <div className="col-span-1">
            <Label>Meta Title
            </Label>
            <Input type="text" />
          </div>
          <div className="col-span-1">
            <Label>Meta Description
            </Label>
            <Input type="text" />
          </div>
          <div className="col-span-1">
            <Label>Meta Keyword
            </Label>
            <Input type="text" />
          </div>
          <div className="col-span-1">
            <Label>Description
            </Label>
            <TextArea />
          </div>

          <div className="col-span-1">
            <ImageUploader />
          </div>

          <div className="col-span-2">
            <a
              href="https://tailadmin.com/pricing"
              target="_blank"
              rel="nofollow"
              className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
            >
              Submit
            </a>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default About