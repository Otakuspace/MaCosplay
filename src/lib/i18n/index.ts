import { thaiTranslations, type TranslationKey } from './thai';

// Simple i18n implementation for Thai language
export function t(key: TranslationKey): string {
  return thaiTranslations[key] || key;
}

// Get nested translation (for objects like categoryIcons)
export function getNestedTranslation(key: keyof typeof thaiTranslations, subKey: string): string {
  const nested = thaiTranslations[key];
  if (typeof nested === 'object' && nested !== null && subKey in nested) {
    return (nested as Record<string, string>)[subKey];
  }
  return subKey;
}

// Thai date formatting
export function formatThaiDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // Convert to Buddhist Era
    
    return `${day} ${month} ${year}`;
  } catch (error) {
    return dateString;
  }
}

// Thai relative time formatting
export function formatThaiRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return 'เมื่อสักครู่';
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
    if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`;
    
    return formatThaiDate(dateString);
  } catch (error) {
    return dateString;
  }
}

export { thaiTranslations };