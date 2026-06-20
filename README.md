# 또박또박 손글씨 교실 ✏️

초등학생이 제시된 글자/단어/문장을 따라 쓰고 사진을 찍어 올리면, **Gemini 2.5 Flash**가 손글씨를 판독해 교정 피드백(정오·필체·개선 제안)을 주는 웹앱입니다.

## 구조

```
브라우저(React SPA)  →  /api/analyze (Netlify Function)  →  Gemini 2.5 Flash
```

- **API 키는 프론트엔드에 절대 노출되지 않습니다.** 모든 Gemini 호출은 서버리스 함수(`netlify/functions/analyze.js`)에서만 수행됩니다.

## 로컬 개발

```bash
npm install
cp .env.example .env        # .env 에 GEMINI_API_KEY 입력
npx netlify dev             # 함수 + 프론트 동시 실행 (권장)
```

> `npm run dev` (vite만)는 `/api/analyze` 함수가 동작하지 않습니다. 함수 테스트는 `netlify dev`를 사용하세요.

## 배포 (Netlify)

1. 이 폴더를 GitHub에 올린 뒤 Netlify에 연결 (또는 `npx netlify deploy --prod`)
2. **Site settings → Environment variables**에 `GEMINI_API_KEY` 등록
3. 빌드 설정은 `netlify.toml`에 포함되어 있습니다 (`build`, `dist`, `functions`)

## 사용 흐름

1. **선생님 설정** 탭: 따라 쓸 단어/문장을 한 줄에 하나씩 등록 (localStorage 저장)
2. **연습하기** 탭: 글자 선택 → 사진 촬영/업로드 → "AI 선생님에게 보여주기"
3. 결과: 원본↔판독 대조, 일치 여부, 신뢰도, 필체 코멘트, 개선 제안 → "다시 쓰기"

## API 응답 스키마

```json
{
  "recognizedText": "판독한 글자",
  "confidence": 0-100,
  "uncertainSpans": ["애매했던 부분"],
  "match": "일치|부분일치|불일치",
  "handwritingFeedback": "필체 코멘트",
  "suggestions": ["개선 제안"]
}
```
