import { useState } from 'react'
import { analyzeHandwriting, fileToDataUrl } from '../lib/api.js'
import Mascot from './Mascot.jsx'

// 따라쓸 단어 선택 → 사진 촬영/업로드 → AI 판독 요청

export default function CameraUpload({ words, onResult }) {
  const [targetText, setTargetText] = useState(words[0] || '')
  const [preview, setPreview] = useState(null)
  const [dataUrl, setDataUrl] = useState(null)
  const [mimeType, setMimeType] = useState('image/jpeg')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    const url = await fileToDataUrl(file)
    setPreview(url)
    setDataUrl(url)
    setMimeType(file.type || 'image/jpeg')
  }

  const handleAnalyze = async () => {
    if (!dataUrl) {
      setError('먼저 사진을 찍거나 골라주세요.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await analyzeHandwriting({ imageBase64: dataUrl, mimeType, targetText })
      onResult({ result, preview, targetText })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-mascot-row">
        <Mascot mood={loading ? 'default' : 'cheer'} size={64} />
        <h2>📸 따라쓰기 사진 올리기</h2>
      </div>

      {words.length > 0 ? (
        <label className="field">
          <span>따라 쓴 글자</span>
          <select value={targetText} onChange={(e) => setTargetText(e.target.value)}>
            {words.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </label>
      ) : (
        <label className="field">
          <span>따라 쓴 글자 (직접 입력)</span>
          <input value={targetText} onChange={(e) => setTargetText(e.target.value)} placeholder="예: 사과" />
        </label>
      )}

      <label className="upload-box">
        <input type="file" accept="image/*" capture="environment" onChange={handleFile} hidden />
        {preview ? (
          <img src={preview} alt="미리보기" className="preview-img" />
        ) : (
          <span className="upload-placeholder">📷 여기를 눌러 사진 찍기</span>
        )}
      </label>

      {error && <p className="error">{error}</p>}

      <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
        {loading ? '🔍 글씨 읽는 중...' : '✨ AI 선생님에게 보여주기'}
      </button>
    </div>
  )
}
