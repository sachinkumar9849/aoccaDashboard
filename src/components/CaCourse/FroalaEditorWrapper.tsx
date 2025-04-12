"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import FroalaEditor to ensure it only loads on client-side
const FroalaEditor = dynamic(
  () => import('react-froala-wysiwyg'),
  { ssr: false }
);

// Import styles
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/plugins/table.min.css";
import "froala-editor/css/plugins/image.min.css";
import "froala-editor/css/plugins/emoticons.min.css";
import "froala-editor/css/plugins/code_view.min.css";
import "froala-editor/css/plugins/quick_insert.min.css";
import "froala-editor/css/plugins/char_counter.min.css";
import "froala-editor/css/plugins/colors.min.css";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const FroalaEditorWrapper: React.FC<EditorProps> = ({ value, onChange }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This ensures we only render the editor after the component has mounted
    setIsMounted(true);

    // Import plugins only when component mounts (client-side)
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/table.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/image.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/link.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/lists.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/paragraph_format.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/code_view.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/char_counter.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/emoticons.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/draggable.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/font_family.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/font_size.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/line_height.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/paragraph_style.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/quick_insert.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/quote.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/colors.min.js');
    // @ts-expect-error - Froala plugin imports lack proper type definitions
    import('froala-editor/js/plugins/align.min.js');
  }, []);

  // Only render the editor when the component has mounted
  if (!isMounted) {
    return <div className="border p-4 min-h-[300px] bg-gray-50">Loading editor...</div>;
  }

  return (
    <FroalaEditor
      model={value}
      onModelChange={onChange}
      config={{
        placeholderText: 'Enter description here...',
        heightMin: 300,
        charCounterCount: true,
        imageUploadURL: '/api/upload-image',
        imageUploadParams: {
          type: 'description-image'
        },
        toolbarButtons: [
          'bold', 'italic', 'underline', 'paragraphFormat',
          'formatOL', 'formatUL', 'insertLink', 'insertImage',
          'insertTable', 'html', 'fontFamily', 'fontSize',
          'textColor', 'backgroundColor', 'emoticons',
          'specialCharacters', 'insertHR', 'undo', 'redo'
        ],
        tableStyles: {
          'table-bordered': 'Bordered Table',
          'table-striped': 'Striped Table',
          'table-hover': 'Hover Table',
          'table-condensed': 'Condensed Table'
        },
        tableCellStyles: {
          'text-success': 'Success',
          'text-info': 'Info',
          'text-warning': 'Warning',
          'text-danger': 'Danger'
        },
        imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
        imageDefaultWidth: 300,
        imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', 'imageDisplay', 'imageStyle', 'imageAlt', 'imageSize'],
        quickInsertButtons: ['image', 'table', 'ul', 'ol', 'hr'],
        saveInterval: 10000,
        pluginsEnabled: [
          'table', 'image', 'link', 'lists', 'paragraphFormat',
          'codeView', 'charCounter', 'emoticons', 'alignment',
          'draggable', 'fontFamily', 'fontSize', 'lineHeight',
          'paragraphStyle', 'quickInsert', 'quote', 'colors'
        ]
      }}
    />
  );
};

export default FroalaEditorWrapper;