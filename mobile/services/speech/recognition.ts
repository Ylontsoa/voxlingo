import { Audio } from 'expo-av';
import client from '../api/client';

let recording: Audio.Recording | null = null;
let lastRecordingUri: string | null = null;
let playbackSound: Audio.Sound | null = null;

export async function startRecording(onMetering?: (level: number) => void): Promise<void> {
  if (recording) {
    try {
      await recording.stopAndUnloadAsync();
    } catch (e) {}
    recording = null;
  }

  const { status } = await Audio.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('PERMISSION_DENIED');
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording: newRecording } = await Audio.Recording.createAsync(
    {
      android: {
        extension: '.m4a',
        outputFormat: Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder: Audio.AndroidAudioEncoder.AAC,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
      },
      ios: {
        extension: '.m4a',
        outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
        audioQuality: Audio.IOSAudioQuality.MAX,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
      },
      web: {
        mimeType: 'audio/webm',
        bitsPerSecond: 128000,
      },
      isMeteringEnabled: true,
    },
    (status) => {
      if (onMetering && status.metering !== undefined && status.metering !== null) {
        const normalized = Math.min(1, Math.max(0, (status.metering + 60) / 60));
        onMetering(normalized);
      }
    },
    100
  );
  recording = newRecording;
}

export async function stopRecording(): Promise<string | null> {
  if (!recording) return null;
  try {
    await recording.stopAndUnloadAsync();
  } catch (e) {}
  const uri = recording.getURI();
  recording = null;
  if (uri) setLastRecordingUri(uri);
  return uri;
}

export async function transcribeAudio(uri: string, isoLanguage?: string): Promise<string> {
  const formData = new FormData();
  formData.append('audio', {
    uri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  } as any);
  if (isoLanguage) {
    formData.append('language', isoLanguage);
  }

  const { data } = await client.post('/speech/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.text;
}

export function setLastRecordingUri(uri: string) {
  lastRecordingUri = uri;
}

export function getLastRecordingUri(): string | null {
  return lastRecordingUri;
}

export async function playLastRecording(): Promise<void> {
  if (!lastRecordingUri) return;
  if (playbackSound) {
    await playbackSound.unloadAsync();
    playbackSound = null;
  }
  const { sound } = await Audio.Sound.createAsync({ uri: lastRecordingUri });
  playbackSound = sound;
  await sound.playAsync();
}