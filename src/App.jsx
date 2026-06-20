import { useEffect, useState } from 'react'
import TeacherSetup from './components/TeacherSetup.jsx'
import CameraUpload from './components/CameraUpload.jsx'
import ResultView from './components/ResultView.jsx'
import Mascot from './components/Mascot.jsx'

const STORAGE_KEY = 'handwriting-words'

export default function App() {
  const [tab, setTab] = useState('practice') // 'practice' | 'setup'
  const [words, setWords] = useState([])
  const [resultData, setResultData] = useState(null)

  // 저장된 단어 불러오기
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (Array.isArray(saved)) setWords(saved)
    } catch {
      /* 무시 */
    }
  }, [])

  const saveWords = (list) => {
    setWords(list)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    setTab('practice')
  }

  return (
    <div className="app">
      <header className="header">
        <Mascot mood="cheer" size={88} className="header-mascot" />
        <h1>또박또박 손글씨 교실</h1>
        <p>글자를 따라 쓰고 사진을 찍으면 또박이가 봐줘요!</p>
      </header>

      <nav className="tabs">
        <button className={tab === 'practice' ? 'tab active' : 'tab'} onClick={() => setTab('practice')}>
          ✏️ 연습하기
        </button>
        <button className={tab === 'setup' ? 'tab active' : 'tab'} onClick={() => setTab('setup')}>
          👩‍🏫 선생님 설정
        </button>
      </nav>

      <main>
        {tab === 'setup' && <TeacherSetup words={words} onSave={saveWords} />}

        {tab === 'practice' && !resultData && (
          <CameraUpload words={words} onResult={setResultData} />
        )}

        {tab === 'practice' && resultData && (
          <ResultView data={resultData} onRetry={() => setResultData(null)} />
        )}
      </main>

      <footer className="footer">또박이와 함께하는 손글씨 교정 · Gemini 2.5 Flash</footer>
    </div>
  )
}
