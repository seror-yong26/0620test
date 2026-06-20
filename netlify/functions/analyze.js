import { GoogleGenAI } from '@google/genai'

// 초등학생 손글씨 교정 보조 - Gemini 2.5 Flash 비전 판독 함수
// 클라이언트는 절대 API 키를 보지 못하며, 모든 호출은 이 서버 함수에서만 수행된다.

const MODEL = 'gemini-2.5-flash'

function buildPrompt(targetText) {
  return `너는 초등학생의 손글씨 따라쓰기를 도와주는 친절한 선생님이야.
학생이 아래 "제시 글자"를 따라 쓴 종이를 사진으로 찍었어.

제시 글자: "${targetText || '(지정 안 됨 - 사진에 보이는 글자를 그대로 판독)'}"

사진 속 손글씨를 판독하고, 제시 글자와 비교해서 평가해줘.
피드백은 초등학생 눈높이로 다정하고 쉽게, 칭찬을 먼저 해줘.

반드시 아래 JSON 형식으로만 답해. 다른 말은 절대 쓰지 마.
{
  "recognizedText": "사진에서 판독한 글자 그대로",
  "confidence": 0부터 100 사이 정수(판독 자신감),
  "uncertainSpans": ["판독이 애매했던 글자나 부분들의 배열, 없으면 빈 배열"],
  "match": "일치" 또는 "부분일치" 또는 "불일치",
  "handwritingFeedback": "필체/자세에 대한 다정한 코멘트 한두 문장",
  "suggestions": ["구체적인 개선 제안 1~3개의 배열"]
}`
}

function extractJson(text) {
  if (!text) return null
  // ```json ... ``` 코드펜스 제거
  let cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1)
  }
  try {
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

export const handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'POST만 허용됩니다.' }) }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다. Netlify 환경변수를 확인하세요.' }),
    }
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: '잘못된 요청 형식입니다.' }) }
  }

  const { imageBase64, mimeType = 'image/jpeg', targetText = '' } = payload
  if (!imageBase64) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: '이미지가 없습니다.' }) }
  }

  // data URL 접두사가 붙어 있으면 제거
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64

  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: buildPrompt(targetText) },
            { inlineData: { mimeType, data: base64Data } },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    })

    const rawText = response.text
    const parsed = extractJson(rawText)

    if (!parsed) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'AI 응답을 해석하지 못했습니다.', raw: rawText }),
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify(parsed) }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'AI 판독 중 오류가 발생했습니다.', detail: String(err?.message || err) }),
    }
  }
}
