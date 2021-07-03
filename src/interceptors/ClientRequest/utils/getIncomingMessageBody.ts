import { IncomingMessage } from 'http'
import { Stream } from 'stream'
import * as zlib from 'zlib'

export function getIncomingMessageBody(res: IncomingMessage): Promise<string> {
  let responseBody = ''
  let stream: Stream = res

  if (res.headers['content-encoding'] === 'gzip') {
    stream = res.pipe(zlib.createGunzip())
  }

  return new Promise((resolve, reject) => {
    stream.once('error', reject)
    stream.on('data', (chunk) => (responseBody += chunk))
    stream.once('end', () => {
      resolve(responseBody)
    })
  })
}
