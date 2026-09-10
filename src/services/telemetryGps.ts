/**
 * HTML5 GPS coordinates lookup and OpenStreetMap Reverse Geocoding
 */

export async function getExactGpsCoordinates(
  timeoutMs: number = 4000
): Promise<{ latitude: number; longitude: number; accuracy: number } | null> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 10000 }
    );
  });
}

export async function reverseGeocodeCoords(
  lat: number,
  lon: number
): Promise<{ city?: string; region?: string; country?: string; street?: string } | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'uz,ru,en' },
      }
    ).catch(() => null);
    clearTimeout(timer);

    if (res?.ok) {
      const data = await res.json().catch(() => null);
      if (data?.address) {
        const addr = data.address;
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.county ||
          addr.state_district ||
          addr.municipality;
        const region = addr.state || addr.region;
        const street = [addr.road, addr.house_number].filter(Boolean).join(' ');
        return { city, region, country: addr.country, street };
      }
    }
  } catch {
    // ignore
  }
  return null;
}
