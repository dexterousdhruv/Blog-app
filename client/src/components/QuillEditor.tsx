// components/QuillEditor.tsx
import React, { useEffect, useRef } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { FormControl } from "@/components/ui/form"

type Props = {
  value: string
  onChange: (value: string) => void
}

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  ['link', 'formula'],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean'],
]

const QuillEditor: React.FC<Props> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const quillRef = useRef<Quill | null>(null)

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      })
      quillRef.current = quill

      quill.on("text-change", () => {
        const html = quill.root.innerHTML
        onChange(html)
      })

      // Initialize with default value
      quill.root.innerHTML = value
    }
  }, [onChange, value])

  return (
    <FormControl>
      <div
        ref={editorRef}
        className="min-h-[200px] border border-gray-200 rounded-md p-2 mt-1"
      />
    </FormControl>
  )
}

export default QuillEditor
