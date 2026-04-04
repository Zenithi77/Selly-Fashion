'use client'

import { useEffect, useRef, useState } from 'react'

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html5QrCodeRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const [isStarted, setIsStarted] = useState(false)
  const [manualBarcode, setManualBarcode] = useState('')

  useEffect(() => {
    let mounted = true

    const initScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')

        const devices = await Html5Qrcode.getCameras()
        if (!mounted) return

        if (devices && devices.length > 0) {
          setCameras(devices)
          setSelectedCamera(devices[0].id)
          
          const scanner = new Html5Qrcode('barcode-reader')
          html5QrCodeRef.current = scanner

          await scanner.start(
            devices[0].id,
            {
              fps: 10,
              qrbox: { width: 280, height: 150 },
              aspectRatio: 1.5,
            },
            (decodedText: string) => {
              scanner.stop().then(() => {
                if (mounted) {
                  onScan(decodedText)
                }
              })
            },
            () => {} // ignore scan failures
          )
          if (mounted) setIsStarted(true)
        } else {
          setError('Камер олдсонгүй. Гар аргаар баркод оруулна уу.')
        }
      } catch (err) {
        if (mounted) {
          console.error('Scanner init error:', err)
          setError('Камерт хандах боломжгүй байна. Гар аргаар баркод оруулна уу.')
        }
      }
    }

    initScanner()

    return () => {
      mounted = false
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {})
      }
    }
  }, [onScan])

  const switchCamera = async (cameraId: string) => {
    try {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop()
      }
      setSelectedCamera(cameraId)
      
      await html5QrCodeRef.current.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 280, height: 150 },
          aspectRatio: 1.5,
        },
        (decodedText: string) => {
          html5QrCodeRef.current.stop().then(() => {
            onScan(decodedText)
          })
        },
        () => {}
      )
      setIsStarted(true)
    } catch (err) {
      console.error('Camera switch error:', err)
      setError('Камер солиход алдаа гарлаа')
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim())
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Баркод уншуулах</h2>
              <p className="text-xs text-slate-500">Камераар баркод уншуулна уу</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scanner area */}
        <div className="p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : (
            <div className="relative mb-4">
              <div 
                id="barcode-reader" 
                ref={scannerRef}
                className="rounded-xl overflow-hidden bg-black"
              ></div>
              {!isStarted && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-xl">
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-slate-600">Камер ачааллаж байна...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Camera selector */}
          {cameras.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Камер сонгох</label>
              <select
                value={selectedCamera}
                onChange={(e) => switchCamera(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              >
                {cameras.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.label || `Камер ${camera.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Manual input */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500 mb-2">Эсвэл гараар баркод оруулах:</p>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Баркод дугаар..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              />
              <button
                type="submit"
                disabled={!manualBarcode.trim()}
                className="px-4 py-2.5 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Оруулах
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
