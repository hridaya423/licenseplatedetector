'use client'
import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'

interface DetectionResult {
  text: string
  plate_image: string
}

export default function LicensePlateUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<{
    results: DetectionResult[]
    result_image: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!selectedFile) {
      setError('Please select an image')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/detect`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      setResult(response.data)
    } catch (err) {
      setError('Failed to process image. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          License Plate Detector
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <input 
              type="file" 
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
              id="fileInput"
            />
            <label 
              htmlFor="fileInput" 
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Choose Image
            </label>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                {selectedFile.name}
              </p>
            )}
          </div>

          {preview && (
            <div className="mt-4 flex justify-center">
              <Image 
                src={preview} 
                alt="Preview" 
                width={300} 
                height={200} 
                className="rounded-md"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Detect License Plate'}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-500 text-center">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-8 w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-center mb-4">
            Detection Results
          </h2>

          {result.results && result.results.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {result.results.map((plate, index) => (
                <div 
                  key={index} 
                  className="border rounded-md p-4 text-center"
                >
                  <p className="font-semibold mb-2">
                    Plate Text: {plate.text}
                  </p>
                  <Image 
                    src={`data:image/jpeg;base64,${plate.plate_image}`} 
                    alt="Detected Plate" 
                    width={300} 
                    height={100} 
                    className="mx-auto rounded-md"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No license plates detected
            </p>
          )}

          {result.result_image && (
            <div className="mt-6 flex justify-center">
              <Image 
                src={`data:image/jpeg;base64,${result.result_image}`} 
                alt="Processed Image" 
                width={600} 
                height={400} 
                className="rounded-md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
