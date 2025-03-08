interface RecentLink {
  url: string
  timestamp: number
}

type StoredData = {
  version: number
  links: RecentLink[]
}

const STORAGE_KEY = 'recentLinks'
const SCHEMA_VERSION = 1
const MAX_LINKS = 10

export const getRecentLinks = (): RecentLink[] => {
  if (typeof window === 'undefined') return []

  try {
    const rawData = localStorage.getItem(STORAGE_KEY)
    if (!rawData) return []

    const data: StoredData = JSON.parse(rawData)
    
    // Schema version check
    if (data.version !== SCHEMA_VERSION) {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }

    // Basic URL validation
    return data.links.filter(link => 
      link.url && 
      typeof link.url === 'string' &&
      link.url.startsWith('http')
    )
  } catch (error) {
    console.error('Error loading links from storage:', error)
    return []
  }
}

export const saveLink = (url: string): void => {
  if (typeof window === 'undefined') return

  try {
    const links = getRecentLinks()
    
    // LRU cache logic
    const existingIndex = links.findIndex(link => link.url === url)
    if (existingIndex > -1) {
      // Move existing to top
      const [existing] = links.splice(existingIndex, 1)
      links.unshift({ ...existing, timestamp: Date.now() })
    } else {
      // Add new and enforce max size
      links.unshift({ url, timestamp: Date.now() })
      if (links.length > MAX_LINKS) links.pop()
    }

    const data: StoredData = {
      version: SCHEMA_VERSION,
      links
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving link to storage:', error)
  }
}

// Compression helpers
export const compress = (data: string): string => {
  const encoder = new TextEncoder()
  const compressed = pako.gzip(encoder.encode(data))
  return btoa(String.fromCharCode(...compressed))
}

export const decompress = (data: string): string => {
  const binary = atob(data)
  const bytes = new Uint8Array([...binary].map(c => c.charCodeAt(0)))
  const decompressed = pako.ungzip(bytes)
  return new TextDecoder().decode(decompressed))
}
