/**
 * Hardware, OS, Browser, GPU, and Screen specs detection
 */

export function parseOS(ua: string): string {
  if (/iphone/i.test(ua)) {
    const match = ua.match(/OS ([\d_]+)/);
    const ver = match ? match[1].replace(/_/g, '.') : '';
    return `Apple iPhone (iOS ${ver})`.trim();
  }
  if (/ipad/i.test(ua)) return 'Apple iPad (iPadOS)';
  if (/android/i.test(ua)) {
    const matchVer = ua.match(/Android ([\d.]+)/);
    const ver = matchVer ? `Android ${matchVer[1]}` : 'Android';
    const matchModel = ua.match(/;\s*([^;]+)\s+Build\//);
    const model = matchModel ? ` • ${matchModel[1]}` : '';
    return `${ver}${model}`.trim();
  }
  if (/macintosh|mac os x/i.test(ua)) {
    const match = ua.match(/Mac OS X ([\d_]+)/);
    const ver = match ? match[1].replace(/_/g, '.') : '';
    return `Apple Mac (macOS ${ver})`.trim();
  }
  if (/windows nt 10\.0/i.test(ua)) return 'Windows 10/11 (PC)';
  if (/windows nt 6\.3/i.test(ua)) return 'Windows 8.1';
  if (/windows nt 6\.1/i.test(ua)) return 'Windows 7';
  if (/linux/i.test(ua)) return 'Linux (x86_64)';
  return 'Unknown Device / OS';
}

export function parseBrowser(ua: string): string {
  if (/telegram/i.test(ua)) {
    return '✈️ Telegram In-App Browser';
  }
  if (/edg\//i.test(ua)) {
    const match = ua.match(/Edg\/([\d.]+)/);
    return `Microsoft Edge ${match ? match[1].split('.')[0] : ''}`;
  }
  if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) {
    const match = ua.match(/(?:Chrome|CriOS)\/([\d.]+)/);
    return `Google Chrome ${match ? match[1].split('.')[0] : ''}`;
  }
  if (/firefox|fxios/i.test(ua)) {
    const match = ua.match(/(?:Firefox|FxiOS)\/([\d.]+)/);
    return `Mozilla Firefox ${match ? match[1].split('.')[0] : ''}`;
  }
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
    const match = ua.match(/Version\/([\d.]+)/);
    return `Apple Safari ${match ? match[1].split('.')[0] : ''}`;
  }
  if (/opr|opera/i.test(ua)) {
    return 'Opera Browser';
  }
  if (/samsungbrowser/i.test(ua)) {
    return 'Samsung Internet';
  }
  return 'Web Browser';
}

export function getGpuRenderer(): string | undefined {
  try {
    if (typeof document === 'undefined') return undefined;
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        return renderer ? String(renderer).replace(/ANGLE \((.*)\)/, '$1') : undefined;
      }
    }
  } catch {
    // ignore
  }
  return undefined;
}

export async function getBatteryInfo(): Promise<string | undefined> {
  try {
    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      const battery = await (navigator as any).getBattery();
      const level = Math.round(battery.level * 100);
      const isCharging = battery.charging ? ' ⚡ (Quvvatlanmoqda)' : '';
      return `${level}%${isCharging}`;
    }
  } catch {
    // ignore
  }
  return undefined;
}

export interface HardwareSpecs {
  deviceType: '📱 Mobile' | '💻 Desktop' | '📟 Tablet';
  os: string;
  browser: string;
  screenResolution: string;
  viewportSize: string;
  pixelRatio: string;
  gpu?: string;
  cpuCores?: string;
  deviceMemory?: string;
  touchSupport: boolean;
  colorScheme: 'Dark' | 'Light';
}

export function detectHardwareSpecs(): HardwareSpecs {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobile = /iphone|ipod|android.*mobile|windows phone/i.test(ua);
  const isTablet = /ipad|android(?!.*mobile)/i.test(ua);
  const deviceType: '📱 Mobile' | '💻 Desktop' | '📟 Tablet' = isMobile
    ? '📱 Mobile'
    : isTablet
    ? '📟 Tablet'
    : '💻 Desktop';

  const os = parseOS(ua);
  const browser = parseBrowser(ua);
  const gpu = getGpuRenderer();

  const screenResolution =
    typeof window !== 'undefined' && window.screen
      ? `${window.screen.width}x${window.screen.height}`
      : 'Unknown';

  const viewportSize =
    typeof window !== 'undefined'
      ? `${window.innerWidth}x${window.innerHeight}`
      : 'Unknown';

  const pixelRatio =
    typeof window !== 'undefined' && window.devicePixelRatio
      ? `${window.devicePixelRatio.toFixed(1)}x`
      : '1.0x';

  const nav = typeof navigator !== 'undefined' ? (navigator as any) : {};
  const cpuCores = nav.hardwareConcurrency ? `${nav.hardwareConcurrency} yadroli CPU` : undefined;
  const deviceMemory = nav.deviceMemory ? `${nav.deviceMemory}+ GB RAM` : undefined;
  const touchSupport =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0));

  const colorScheme: 'Dark' | 'Light' =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'Dark'
      : 'Light';

  return {
    deviceType,
    os,
    browser,
    screenResolution,
    viewportSize,
    pixelRatio,
    gpu,
    cpuCores,
    deviceMemory,
    touchSupport,
    colorScheme,
  };
}
