// lib/uploadImage.js
import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'

function detectMime(buffer) {
  const head = buffer.slice(0, 12).toString('hex')
  if (head.startsWith('89504e47')) return { ext: 'png', mime: 'image/png' }
  if (head.startsWith('ffd8ff')) return { ext: 'jpg', mime: 'image/jpeg' }
  if (head.startsWith('47494638')) return { ext: 'gif', mime: 'image/gif' }
  if (head.startsWith('52494646') && head.includes('57454250')) return { ext: 'webp', mime: 'image/webp' }
  if (head.startsWith('000000') && head.includes('66747970')) return { ext: 'mp4', mime: 'video/mp4' }
  return { ext: 'bin', mime: 'application/octet-stream' }
}

export default async (buffer) => {
  const { ext, mime } = detectMime(buffer)
  const form = new FormData()
  const blob = new Blob([buffer.toArrayBuffer()], { type: mime })
  form.append('files[]', blob, 'tmp.' + ext)
  const res = await fetch('https://qu.ax/upload.php', { method: 'POST', body: form })
  const result = await res.json()
  if (result && result.success) {
    return result.files[0].url
  } else {
    throw new Error('Failed to upload the file to qu.ax')
  }
}