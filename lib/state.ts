interface FrameState {
  recentLinks: string[]
  lastPosition?: { x: number; y: number }
  timestamp: number
}

const STATE_VERSION = 1
const SESSION_KEY = 'frameState'

export async function compressAndSaveState(state: FrameState): Promise<void> {
  try {
    const jsonString = JSON.stringify({
      v: STATE_VERSION,
      state
    })
    
    const encoder = new TextEncoder()
    const data = encoder.encode(jsonString)
    const cs = new CompressionStream('gzip')
    const writer = cs.writable.getWriter()
    writer.write(data)
    writer.close()

    const compressed = await new Response(cs.readable).arrayBuffer()
    const base64State = btoa(String.fromCharCode(...new Uint8Array(compressed)))
    
    sessionStorage.setItem(SESSION_KEY, base64State)
  } catch (error) {
    console.error('State compression failed:', error)
  }
}

export async function loadAndDecompressState(): Promise<FrameState | null> {
  try {
    const base64State = sessionStorage.getItem(SESSION_KEY)
    if (!base64State) return null

    const compressed = Uint8Array.from(atob(base64State), c => c.charCodeAt(0))
    const cs = new DecompressionStream('gzip')
    const writer = cs.writable.getWriter()
    writer.write(compressed)
    writer.close()

    const decompressed = await new Response(cs.readable).arrayBuffer()
    const decoder = new TextDecoder()
    const { v, state } = JSON.parse(decoder.decode(decompressed))

    if (v !== STATE_VERSION) {
      console.warn(`State version mismatch (expected ${STATE_VERSION}, got ${v})`)
      return null
    }

    return state as FrameState
  } catch (error) {
    console.error('State decompression failed:', error)
    return null
  }
}
