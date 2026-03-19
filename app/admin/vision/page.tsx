'use client'

/**
 * runway.fyi — Vision Lab Admin Page
 * File: app/admin/vision/page.tsx
 *
 * Password-gated page for uploading runway images and
 * getting Google Vision garment detection boxes.
 */

import { useState, useRef, useCallback, useEffect } from 'react'

const ADMIN_PASSWORD = 'Runw3825!'
const SESSION_KEY = 'rwfyi_admin_auth'

const VISION_ENDPOINT =
  `https://vision.googleapis.com/v1/images:annotate?key=${process.env.NEXT_PUBLIC_VISION_API_KEY}`

const MATERIAL_KEYWORDS = new Set([
  'leather','silk','satin','velvet','lace','tweed','boucle','shearling',
  'cashmere','wool','denim','cotton','chiffon','organza','sequin','fur',
  'suede','corduroy','knit','crochet','nylon','polyester'
])
const SILHOUETTE_KEYWORDS = new Set([
  'coat','jacket','blazer','trouser','skirt','dress','gown','suit',
  'blouse','shirt','boot','heel','loafer','flat','bag','glove','hat',
  'scarf','vest','bodysuit','jumpsuit','cape','trench','parka','cardigan',
  'sweater','top','shorts','jeans','legging','pump','sandal','mule'
])
const COLOR_KEYWORDS = new Set([
  'black','white','red','blue','green','yellow','pink','purple','orange',
  'brown','beige','cream','ivory','grey','gray','navy','camel','burgundy',
  'chocolate','forest','emerald','cobalt','scarlet','ochre','teal'
])

const BOX_COLORS = [
  '#C8A882','#8CA89C','#B07070','#7090B0','#90A870',
  '#A870A0','#C8B060','#709080','#C87060','#8080C8'
]

interface BoundingVertex { x: number; y: number }
interface DetectedObject {
  name: string
  score: number
  boundingPoly: { normalizedVertices: BoundingVertex[] }
}
interface LabelAnnotation { description: string; score: number }
interface VisionResult {
  labels: LabelAnnotation[]
  objects: DetectedObject[]
  materials: string[]
  silhouettes: string[]
  colors: string[]
  dominantColor: string
}
interface ImageSlot {
  file: File | null
  previewUrl: string | null
  result: VisionResult | null
  loading: boolean
  error: string | null
  naturalWidth: number
  naturalHeight: number
}

const emptySlot = (): ImageSlot => ({
  file: null, previewUrl: null, result: null,
  loading: false, error: null, naturalWidth: 0, naturalHeight: 0
})

async function analyseImageFile(file: File): Promise<VisionResult> {
  const base64 = await new Promise<string>((res, rej) => {
    const reader = new FileReader()
    reader.onload = () => res((reader.result as string).split(',')[1])
    reader.onerror = rej
    reader.readAsDataURL(file)
  })

  const payload = {
    requests: [{
      image: { content: base64 },
      features: [
        { type: 'LABEL_DETECTION', maxResults: 30 },
        { type: 'OBJECT_LOCALIZATION', maxResults: 20 },
        { type: 'IMAGE_PROPERTIES' }
      ]
    }]
  }

  const resp = await fetch(VISION_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!resp.ok) throw new Error(`Vision API ${resp.status}`)
  const data = await resp.json()
  const r = data.responses?.[0] ?? {}

  const labels: LabelAnnotation[] = (r.labelAnnotations ?? []).filter((l: LabelAnnotation) => l.score > 0.6)
  const objects: DetectedObject[] = (r.localizedObjectAnnotations ?? []).filter((o: DetectedObject) => o.score > 0.5)

  const materials: string[] = []
  const silhouettes: string[] = []
  const colors: string[] = []

  for (const label of labels) {
    const d = label.description.toLowerCase()
    if ([...MATERIAL_KEYWORDS].some(k => d.includes(k))) materials.push(label.description)
    if ([...SILHOUETTE_KEYWORDS].some(k => d.includes(k))) silhouettes.push(label.description)
    if ([...COLOR_KEYWORDS].some(k => d.includes(k))) colors.push(label.description)
  }

  const domColor = r.imagePropertiesAnnotation?.dominantColors?.colors?.[0]?.color
  const dominantColor = domColor
    ? `rgb(${Math.round(domColor.red ?? 0)},${Math.round(domColor.green ?? 0)},${Math.round(domColor.blue ?? 0)})`
    : '#888888'

  return { labels, objects, materials, silhouettes, colors, dominantColor }
}

export default function VisionAdminPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState(false)
  const [slots, setSlots] = useState<[ImageSlot, ImageSlot]>([emptySlot(), emptySlot()])
  const imgRefs = [useRef<HTMLImageElement>(null), useRef<HTMLImageElement>(null)]

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setUnlocked(true)
  }, [])

  const attemptUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setUnlocked(true)
    } else {
      setPwError(true)
      setPassword('')
    }
  }

  const handleFile = useCallback(async (idx: number, file: File) => {
    const previewUrl = URL.createObjectURL(file)
    setSlots(prev => {
      const next: [ImageSlot, ImageSlot] = [...prev] as [ImageSlot, ImageSlot]
      next[idx] = { ...emptySlot(), file, previewUrl, loading: true }
      return next
    })
    try {
      const result = await analyseImageFile(file)
      await new Promise<void>(res => setTimeout(res, 200))
      const img = imgRefs[idx].current
      const naturalWidth = img?.naturalWidth ?? 400
      const naturalHeight = img?.naturalHeight ?? 600
      setSlots(prev => {
        const next: [ImageSlot, ImageSlot] = [...prev] as [ImageSlot, ImageSlot]
        next[idx] = { file, previewUrl, result, loading: false, error: null, naturalWidth, naturalHeight }
        return next
      })
    } catch (err) {
      setSlots(prev => {
        const next: [ImageSlot, ImageSlot] = [...prev] as [ImageSlot, ImageSlot]
        next[idx] = { ...prev[idx], loading: false, error: String(err) }
        return next
      })
    }
  }, [])

  const clearSlot = (idx: number) => {
    setSlots(prev => {
      const next: [ImageSlot, ImageSlot] = [...prev] as [ImageSlot, ImageSlot]
      if (prev[idx].previewUrl) URL.revokeObjectURL(prev[idx].previewUrl!)
      next[idx] = emptySlot()
      return next
    })
  }

  if (!unlocked) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0C0B09',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 24, padding: 24,
      }}>
        <div style={{
          fontFamily: '"Ranade", sans-serif', fontSize: 40, fontWeight: 700,
          letterSpacing: '-0.03em', color: '#F5F2ED', textAlign: 'center',
        }}>Vision Lab</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 300 }}>
          <input
            type="password" placeholder="Password" value={password} autoFocus
            onChange={e => { setPassword(e.target.value); setPwError(false) }}
            onKeyDown={e => e.key === 'Enter' && attemptUnlock()}
            style={{
              background: '#1A1916', border: pwError ? '1px solid #B07070' : '1px solid #2A2926',
              borderRadius: 2, color: '#F5F2ED', fontFamily: '"Geist Mono", monospace',
              fontSize: 13, padding: '12px 16px', outline: 'none',
            }}
          />
          <button onClick={attemptUnlock} style={{
            background: '#F5F2ED', border: 'none', borderRadius: 2, color: '#0C0B09',
            fontFamily: '"Geist Mono", monospace', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase', padding: '12px 16px', cursor: 'pointer',
          }}>
            Unlock →
          </button>
          {pwError && <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: '#B07070', textAlign: 'center' }}>Incorrect password</div>}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0C0B09', color: '#F5F2ED' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(245,242,237,0.08)',
        padding: '28px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A5550', marginBottom: 8 }}>
            Admin · Vision Lab
          </div>
          <h1 style={{ fontFamily: '"Ranade", sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.9, margin: 0 }}>
            Garment Detection
          </h1>
        </div>
        <a href="/admin" style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5A5550', textDecoration: 'none' }}>
          ← Admin
        </a>
      </div>

      <div style={{ padding: '40px 48px' }}>
        <p style={{ fontFamily: '"Lora", Georgia, serif', fontSize: 14, color: '#5A5550', marginBottom: 32, maxWidth: 480 }}>
          Upload up to two runway images. Google Vision will detect garments, materials, and silhouettes with bounding boxes.
        </p>

        {/* Upload grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
          {slots.map((slot, idx) => (
            <div key={idx}>
              {!slot.previewUrl ? (
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: '1px dashed #2A2926', borderRadius: 2, background: '#111010',
                  minHeight: 200, cursor: 'pointer', gap: 10, padding: 24,
                }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(idx, f) }} />
                  <span style={{ fontSize: 24, opacity: 0.3 }}>↑</span>
                  <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5A5550' }}>
                    Image {idx + 1} — click to upload
                  </span>
                </label>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img
                    ref={imgRefs[idx]}
                    src={slot.previewUrl}
                    alt={`Look ${idx + 1}`}
                    style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', objectPosition: 'top center', display: 'block', borderRadius: 2 }}
                  />
                  {/* Bounding boxes */}
                  {slot.result && slot.result.objects.length > 0 && (
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                      viewBox={`0 0 ${slot.naturalWidth || 400} ${slot.naturalHeight || 600}`} preserveAspectRatio="none">
                      {slot.result.objects.map((obj, i) => {
                        const verts = obj.boundingPoly?.normalizedVertices ?? []
                        if (verts.length < 2) return null
                        const xs = verts.map(v => (v.x ?? 0) * (slot.naturalWidth || 400))
                        const ys = verts.map(v => (v.y ?? 0) * (slot.naturalHeight || 600))
                        const x = Math.min(...xs), y = Math.min(...ys)
                        const w = Math.max(...xs) - x, h = Math.max(...ys) - y
                        const color = BOX_COLORS[i % BOX_COLORS.length]
                        return (
                          <g key={i}>
                            <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth={2} />
                            <rect x={x} y={y - 20} width={obj.name.length * 7 + 12} height={18} fill={color} rx={1} />
                            <text x={x + 6} y={y - 6} fontSize={10} fontFamily="monospace" fill="white" fontWeight="600">
                              {obj.name} {Math.round(obj.score * 100)}%
                            </text>
                          </g>
                        )
                      })}
                    </svg>
                  )}
                  {/* Score badge */}
                  {slot.result && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      background: 'rgba(12,11,9,0.85)',
                      fontFamily: '"Geist Mono", monospace', fontSize: 10,
                      letterSpacing: '0.12em', padding: '4px 10px', borderRadius: 2, color: '#C8A882',
                    }}>
                      {slot.result.objects.length} objects · {slot.result.labels.length} labels
                    </div>
                  )}
                  {/* Loading */}
                  {slot.loading && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(12,11,9,0.7)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, borderRadius: 2,
                    }}>
                      <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#C8A882', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Analysing...</span>
                    </div>
                  )}
                  {slot.error && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(176,112,112,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 2 }}>
                      <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: '#fff', textAlign: 'center' }}>Vision API error — check NEXT_PUBLIC_VISION_API_KEY in Vercel</span>
                    </div>
                  )}
                  <button onClick={() => clearSlot(idx)} style={{
                    position: 'absolute', top: 10, left: 10,
                    background: 'rgba(12,11,9,0.8)', border: 'none', color: '#fff',
                    fontFamily: '"Geist Mono", monospace', fontSize: 10, cursor: 'pointer', padding: '3px 8px', borderRadius: 1,
                  }}>✕</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Results */}
        {slots.some(s => s.result) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {slots.map((slot, idx) => !slot.result ? <div key={idx} /> : (
              <div key={idx} style={{ background: '#111010', border: '1px solid #1A1916', borderRadius: 2, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A5550' }}>
                  Image {idx + 1} · Detection Results
                </div>
                {/* Dominant colour */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 2, background: slot.result.dominantColor, border: '1px solid rgba(255,255,255,0.1)' }} />
                  <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: '#5A5550' }}>Dominant colour</span>
                </div>
                {/* Materials */}
                {slot.result.materials.length > 0 && (
                  <div>
                    <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5A5550', marginBottom: 6 }}>Materials</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {slot.result.materials.map(m => (
                        <span key={m} style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 1, color: '#F5F2ED' }}>{m}</span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Silhouettes */}
                {slot.result.silhouettes.length > 0 && (
                  <div>
                    <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5A5550', marginBottom: 6 }}>Silhouettes</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {slot.result.silhouettes.map(s => (
                        <span key={s} style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, background: 'rgba(200,168,130,0.15)', padding: '2px 8px', borderRadius: 1, color: '#C8A882' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {/* All labels */}
                <div>
                  <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5A5550', marginBottom: 8 }}>All signals</div>
                  {slot.result.labels.slice(0, 10).map(label => (
                    <div key={label.description} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden' }}>
                        <div style={{ width: `${label.score * 100}%`, height: '100%', background: label.score > 0.8 ? '#C8A882' : 'rgba(255,255,255,0.2)' }} />
                      </div>
                      <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, width: 140, color: '#5A5550', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label.description}</span>
                      <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, color: '#2A2926', width: 28, textAlign: 'right' }}>{Math.round(label.score * 100)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
