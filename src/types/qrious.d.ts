declare module 'qrious' {
  interface QRiousOptions {
    element?: HTMLCanvasElement;
    value?: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    foreground?: string;
    background?: string;
    backgroundAlpha?: number;
    foregroundAlpha?: number;
    padding?: number;
  }

  export default class QRious {
    constructor(options: QRiousOptions);

    element: HTMLCanvasElement;
    value: string;
    size: number;
    level: 'L' | 'M' | 'Q' | 'H';
    foreground: string;
    background: string;
  }
}
