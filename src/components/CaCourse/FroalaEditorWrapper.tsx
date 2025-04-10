"use client";
import React from 'react';
import FroalaEditor from 'react-froala-wysiwyg';

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

// Import plugins
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/code_view.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/draggable.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/line_height.min.js';
import 'froala-editor/js/plugins/paragraph_style.min.js';
import 'froala-editor/js/plugins/quick_insert.min.js';
import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/align.min.js';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const FroalaEditorWrapper: React.FC<EditorProps> = ({ value, onChange }) => {
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