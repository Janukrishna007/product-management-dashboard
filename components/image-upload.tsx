"use client"

import { useCallback, useState } from "react"
import { Upload, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ImageUploadProps {
    value?: string
    onChange: (value: string) => void
    onRemove: () => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleFile = useCallback(
        (file: File) => {
            if (!file.type.startsWith("image/")) {
                alert("Please upload an image file")
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("Image size should be less than 5MB")
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                onChange(reader.result as string)
            }
            reader.readAsDataURL(file)
        },
        [onChange]
    )

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)

            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
        },
        [handleFile]
    )

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
        },
        [handleFile]
    )

    return (
        <div className="space-y-2">
            <AnimatePresence mode="wait">
                {value ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative group"
                    >
                        <img
                            src={value}
                            alt="Product preview"
                            className="w-full h-48 object-cover rounded-lg border border-border/30"
                        />
                        <button
                            type="button"
                            onClick={onRemove}
                            className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onDragOver={(e) => {
                            e.preventDefault()
                            setIsDragging(true)
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200
              ${isDragging ? "border-primary bg-primary/5" : "border-border/30 hover:border-primary/50"}
            `}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                <span className="text-primary font-medium">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
