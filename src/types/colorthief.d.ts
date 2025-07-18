declare module 'colorthief' {
  export default class ColorThief {
    constructor()
    
    /**
     * Get the dominant color from the image
     * @param img - HTML image element
     * @param quality - Quality of the analysis (1-10, default 10)
     * @returns RGB color array [r, g, b]
     */
    getColor(img: HTMLImageElement, quality?: number): [number, number, number]
    
    /**
     * Get a palette of colors from the image
     * @param img - HTML image element
     * @param colorCount - Number of colors to extract (default 10)
     * @param quality - Quality of the analysis (1-10, default 10)
     * @returns Array of RGB color arrays [[r, g, b], ...]
     */
    getPalette(img: HTMLImageElement, colorCount?: number, quality?: number): [number, number, number][]
  }
}