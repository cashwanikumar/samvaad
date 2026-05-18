// AudioWorklet runs on the audio render thread (not the main JS thread).
// This processor receives raw microphone samples and converts them to PCM16
// so we can send them to the OpenAI Realtime API.
//
// The Realtime API expects: PCM16 (int16), mono, 24kHz
// The browser gives us: Float32 (normalized -1.0 to 1.0), varies (44.1/48kHz)
//
// If you set AudioContext({ sampleRate: 24000 }), the browser handles
// the resampling for you — so here we only need float32 → int16 conversion.

const TARGET_SAMPLES = 2400; // ~100ms at 24kHz

class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._chunks = [];
    this._accumulated = 0;
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;

    const int16 = new Int16Array(channel.length);
    for (let i = 0; i < channel.length; i++) {
      int16[i] = Math.max(-32768, Math.min(32767, channel[i] * 32768));
    }

    this._chunks.push(int16);
    this._accumulated += int16.length;

    if (this._accumulated >= TARGET_SAMPLES) {
      const combined = new Int16Array(this._accumulated);
      let offset = 0;
      for (const chunk of this._chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      this.port.postMessage(combined.buffer, [combined.buffer]);
      this._chunks = [];
      this._accumulated = 0;
    }

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
