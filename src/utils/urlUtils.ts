// Resolve short URLs by following redirects
export const resolveShortUrl = async (url: string): Promise<string> => {
  try {
    // For security and CORS reasons, we'll use a HEAD request to get the redirect
    const response = await fetch(url, { 
      method: 'HEAD',
      redirect: 'manual'
    })
    
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (location) {
        return location
      }
    }
    
    // If no redirect, return original URL
    return url
  } catch (error) {
    console.error('Error resolving short URL:', error)
    // Fallback: try a simple fetch and see where it goes
    try {
      const response = await fetch(url)
      return response.url
    } catch {
      return url
    }
  }
}

// Parse Google Maps URL to extract coordinates
export const parseGoogleMapsUrl = async (url: string): Promise<{ latitude: string, longitude: string, label?: string } | null> => {
  try {
    let targetUrl = url
    
    // Check if it's a short URL that needs resolution
    if (url.includes('goo.gl/maps') || url.includes('maps.app.goo.gl') || url.includes('g.page')) {
      targetUrl = await resolveShortUrl(url)
    }
    
    // Handle various Google Maps URL formats
    const patterns = [
      // https://maps.google.com/?q=40.7128,-74.0060
      /[?&]q=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/,
      // https://www.google.com/maps/@40.7128,-74.0060,15z
      /@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/,
      // https://maps.google.com/maps?ll=40.7128,-74.0060
      /[?&]ll=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/,
      // Place URLs with coordinates
      /place\/([^/]+)\/@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/,
      // Another place format
      /\/place\/[^@]*@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/
    ]
    
    for (const pattern of patterns) {
      const match = targetUrl.match(pattern)
      if (match) {
        if (pattern.source.includes('place')) {
          if (match.length >= 4) {
            // For place URLs, try to extract the place name and coordinates
            const placeName = match[1] ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : undefined
            return {
              latitude: match[2],
              longitude: match[3],
              label: placeName
            }
          } else {
            return {
              latitude: match[1],
              longitude: match[2]
            }
          }
        } else {
          return {
            latitude: match[1],
            longitude: match[2]
          }
        }
      }
    }
    
    // Try to extract coordinates from the URL path or query parameters
    const urlObj = new URL(targetUrl)
    const coords = urlObj.pathname.match(/@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/) ||
                  urlObj.search.match(/[?&]q=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/)
    
    if (coords) {
      return {
        latitude: coords[1],
        longitude: coords[2]
      }
    }
    
    return null
  } catch (error) {
    console.error('Error parsing Google Maps URL:', error)
    return null
  }
}