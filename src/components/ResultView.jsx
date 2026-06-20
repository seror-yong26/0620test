import ScoreBadge from './ScoreBadge.jsx'

// 원본 사진 ↔ 판독 텍스트 대조 + 신뢰도/피드백/개선 제안

export default function ResultView({ data, onRetry }) {
  const { result, preview, targetText } = data
  const uncertain = result.uncertainSpans || []

  return (
    <div className="card">
      <h2>🪄 AI 선생님의 결과</h2>

      <ScoreBadge match={result.match} confidence={result.confidence} />

      <div className="compare">
        <div className="compare-col">
          <span className="compare-label">내가 쓴 사진</span>
          {preview && <img src={preview} alt="원본" className="preview-img" />}
        </div>
        <div className="compare-col">
          <span className="compare-label">AI가 읽은 글자</span>
          <div className="recognized">{result.recognizedText || '(읽지 못했어요)'}</div>
          <span className="compare-label">목표 글자</span>
          <div className="target">{targetText || '(지정 안 됨)'}</div>
        </div>
      </div>

      {uncertain.length > 0 && (
        <p className="hint">🤔 헷갈렸던 부분: {uncertain.join(', ')}</p>
      )}

      {result.handwritingFeedback && (
        <div className="feedback">
          <h3>✏️ 글씨 코멘트</h3>
          <p>{result.handwritingFeedback}</p>
        </div>
      )}

      {result.suggestions?.length > 0 && (
        <div className="feedback">
          <h3>💡 이렇게 해볼까요</h3>
          <ul>
            {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      <button className="btn-primary" onClick={onRetry}>🔁 다시 쓰기</button>
    </div>
  )
}
