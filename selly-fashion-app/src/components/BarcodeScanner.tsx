'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser'

interface BarcodeScannerProps {
  open: boolean
  onClose: () => void
  onDetected: (barcode: string) => void
  title?: string
}

/**
 * Камераар баркод уншигч (mobile-friendly).
 * - Эхлэхдээ ар талын камерыг (`environment`) ашиглана.
 * - Гараар оруулах талбар, "Камер солих" товчтой.
 */
export default function BarcodeScanner({ open, onClose, onDetected, title = 'Баркод скан хийх' }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [manualBarcode, setManualBarcode] = useState('')
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined)
  const [starting, setStarting] = useState(false)

  // List cameras
  useEffect(() => {
    if (!open) return
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) return
    // Permission needed to get labels — request once
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        // Close immediately — we'll re-open with chosen device
        stream.getTracks().forEach(t => t.stop())
        return navigator.mediaDevices.enumerateDevices()
      })
      .then((all) => {
        const cams = all.filter(d => d.kind === 'videoinput')
        setDevices(cams)
        // Prefer back camera by label
        const back = cams.find(d => /back|rear|environment/i.test(d.label))
        setDeviceId(back?.deviceId || cams[0]?.deviceId)
      })
      .catch((err) => {
        setError('Камер ашиглах эрх байхгүй: ' + (err?.message || 'Permission denied'))
      })
  }, [open])

  // Start scanning when device chosen
  useEffect(() => {
    if (!open) return
    let cancelled = false
    async function start() {
      setError(null)
      setStarting(true)
      try {
        const reader = new BrowserMultiFormatReader()
        readerRef.current = reader
        const controls = await reader.decodeFromVideoDevice(
          deviceId,
          videoRef.current!,
          (result, err, ctrl) => {
            if (cancelled) {
              ctrl.stop()
              return
            }
            if (result) {
              const text = result.getText()
              if (text && text.trim()) {
                ctrl.stop()
                onDetected(text.trim())
              }
            }
          }
        )
        if (cancelled) {
          controls.stop()
          return
        }
        controlsRef.current = controls
      } catch (err) {
        if (!cancelled) {
          setError('Камер эхлүүлэхэд алдаа: ' + (err instanceof Error ? err.message : 'unknown'))
        }
      } finally {
        if (!cancelled) setStarting(false)
      }
    }
    start()
    return () => {
      cancelled = true
      controlsRef.current?.stop()
      controlsRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, deviceId])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>📷</span> {title}
          </h3>
          <button
            onClick={() => { controlsRef.current?.stop(); onClose() }}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Camera viewport */}
          <div className="relative w-full aspect-[4/3] bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
            {/* Aim overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-1/3 border-2 border-emerald-400 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
            </div>
            {starting && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black/40">
                Камер эхлүүлж байна...
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Camera switcher */}
          {devices.length > 1 && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Камер сонгох</label>
              <select
                value={deviceId || ''}
                onChange={(e) => setDeviceId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              >
                {devices.map(d => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || `Камер ${d.deviceId.slice(0, 6)}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Manual entry fallback */}
          <div className="border-t border-slate-200 pt-3">
            <label className="block text-xs font-medium text-slate-600 mb-1">Гараар оруулах</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && manualBarcode.trim()) {
                    e.preventDefault()
                    controlsRef.current?.stop()
                    onDetected(manualBarcode.trim())
                  }
                }}
                placeholder="Баркод дугаар..."
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-mono"
                inputMode="numeric"
              />
              <button
                type="button"
                disabled={!manualBarcode.trim()}
                onClick={() => {
                  controlsRef.current?.stop()
                  onDetected(manualBarcode.trim())
                }}
                className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50"
              >
                ✓ Үргэлжлүүлэх
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Баркодыг ногоон хүрээний дунд барина уу. Гар утсаа бариадаа ойртуулж туршина.
          </p>
        </div>
      </div>
    </div>
  )
}
