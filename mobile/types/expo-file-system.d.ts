// mobile/types/expo-file-system.d.ts
declare module 'expo-file-system' {
  export const documentDirectory: string;
  export const cacheDirectory: string;
  
  export enum EncodingType {
    UTF8 = 'utf8',
    Base64 = 'base64',
  }
  
  export function writeAsStringAsync(
    fileUri: string,
    contents: string,
    options?: { encoding?: EncodingType }
  ): Promise<void>;
  
  export function readAsStringAsync(
    fileUri: string,
    options?: { encoding?: EncodingType }
  ): Promise<string>;
  
  export function deleteAsync(
    fileUri: string,
    options?: { idempotent?: boolean }
  ): Promise<void>;
  
  export function getInfoAsync(
    fileUri: string,
    options?: { size?: boolean; md5?: boolean }
  ): Promise<{ exists: boolean; uri: string; size?: number; md5?: string }>;
  
  export function makeDirectoryAsync(
    fileUri: string,
    options?: { intermediates?: boolean }
  ): Promise<void>;
}