'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'

interface Props {
  existingImages?: string[]
}

export function ImageUpload({ existingImages = [] }: Props) {
  const [images, setImages] = useState<string[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      if (file.size > 2 * 1024 * 1024) {
        alert(`الملف ${file.name} كبير جداً. الحد الأقصى 2MB`)
        continue
      }
      if (!file.type.startsWith('image/')) {
        alert(`الملف ${file.name} ليس صورة`)
        continue
      }

      // Convert to base64 in the browser — no server upload needed
      try {
        const reader = new FileReader()
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        newUrls.push(dataUrl)
      } catch {
        alert(`فشل قراءة ${file.name}`)
      }
    }

    setImages((prev) => [...prev, ...newUrls])
    setUploading(false)
    // Reset input so same file can be selected again
    if (fileRef.current) fileRef.current.value = ''
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full">
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((url, i) => (
          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-purple-400 hover:text-purple-500 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <>
              <Upload size={20} />
              <span className="text-xs">رفع</span>
            </>
          )}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
      <p className="text-xs text-gray-400">الصيغ المدعومة: JPG, PNG, WebP. الحد الأقصى: 2MB للصورة</p>
    </div>
  )
}