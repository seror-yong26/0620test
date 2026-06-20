import { useState } from 'react'
import Mascot from './Mascot.jsx'

// 교사 설정: 따라쓸 단어/문장 목록 등록 (localStorage 저장)

export default function TeacherSetup({ words, onSave }) {
  const [text, setText] = useState(words.join('\n'))

  const handleSave = () => {
    const list = text
      .split('\n')
      .map((w) => w.trim())
      .filter(Boolean)
    onSave(list)
  }

  return (
    <div className="card">
      <div className="card-mascot-row">
        <Mascot mood="default" size={64} />
        <h2>선생님 설정</h2>
      </div>
      <p className="hint">학생이 따라 쓸 단어나 문장을 한 줄에 하나씩 적어주세요.</p>
      <textarea
        className="word-input"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={'사과\n학교에 갑니다\n나무'}
      />
      <button className="btn-primary" onClick={handleSave}>
        저장하기
      </button>
    </div>
  )
}
