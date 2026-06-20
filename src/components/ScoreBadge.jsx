// 신뢰도/일치 여부를 색깔 배지로 표시

const MATCH_STYLE = {
  '일치': { bg: '#fee3b5', fg: '#1d1e1c', emoji: '🎉', label: '잘 맞았어요!' },
  '부분일치': { bg: '#fff8f1', fg: '#4a4a47', emoji: '🙂', label: '거의 다 왔어요' },
  '불일치': { bg: '#fa5d00', fg: '#ffffff', emoji: '💪', label: '다시 해볼까요' },
}

export default function ScoreBadge({ match, confidence }) {
  const style = MATCH_STYLE[match] || MATCH_STYLE['부분일치']
  return (
    <div className="badge-row">
      <span className="badge" style={{ background: style.bg, color: style.fg }}>
        {style.emoji} {style.label}
      </span>
      {typeof confidence === 'number' && (
        <span className="confidence">판독 자신감 {confidence}%</span>
      )}
    </div>
  )
}
