"use client";
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';
// Import SunEditor types
import SunEditorCore from 'suneditor/src/lib/core';

// Dynamically import SunEditor with noSSR
const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
  loading: () => <div className="h-48 border border-gray-300 rounded flex items-center justify-center">Loading editor...</div>
});

// No CSS import here - we'll handle it through globals.css

interface EditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  readOnly?: boolean;
}

// Define the type for SunEditor instance
interface SunEditorInstance {
  editor: SunEditorCore;
  getContents: () => string;
  setContents: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  value = '',
  onChange,
  placeholder = "Enter content here...",
  height = "300px",
  minHeight = "150px",
  maxHeight = "500px",
}) => {
  const editorRef = useRef<SunEditorInstance | null>(null);

  const handleEditorChange = (content: string) => {
    if (onChange) {
      onChange(content);
    }
  };



  // Update content when value prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.editor) {
      const currentContent = editorRef.current.getContents();
      if (currentContent !== value) {
        editorRef.current.setContents(value);
      }
    }
  }, [value]);

  return (
    <div>
      <SunEditor
        setContents={value}
        onChange={handleEditorChange}
        setOptions={{
          height,
          minHeight,
          maxHeight,
          buttonList: [
            ['undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['removeFormat'],
            ['fontColor', 'hiliteColor'],
            ['align', 'list', 'lineHeight'],
            ['outdent', 'indent'],
            ['table', 'link', 'image', 'video'],
            ['fullScreen', 'showBlocks', 'codeView'],
          ],
          placeholder,
        }}
      />
    </div>
  );
};

export default Editor;