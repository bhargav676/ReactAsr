import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Copy, Download, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import './App.css';

const API_URL = "https://bhargav1290-finalasr.hf.space/upload";

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("ready"); // ready, recording, processing, error
  const [timer, setTimer] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Recording Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setTimer(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const startRecording = async () => {
    setTranscript("");
    setStatus("recording");
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType: 'audio/webm;codecs=opus', 
        audioBitsPerSecond: 32000 
      });
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToServer(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setStatus("error");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus("processing");
    }
  };

  const sendAudioToServer = async (blob) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: blob,
      });

      if (response.ok) {
        const result = await response.text();
        setTranscript(result.trim());
        setStatus("ready");
      } else {
        setStatus("error");
      }
    } catch (e) {
      setStatus("error");
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(transcript);
  };

  const downloadText = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "transcription.txt";
    a.click();
  };

  return (
    <div className="container">
      <div className="main-card">
        <div className="header">
          <h1>Dysarthria <span style={{color: 'var(--primary)'}}>AI</span></h1>
          <p>Instant Voice-to-Text Recognition</p>
        </div>

        <div className="mic-container">
          <button 
            className={`record-btn ${isRecording ? 'recording' : 'idle'}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <Square size={36} fill="white" /> : <Mic size={42} />}
          </button>

          <div className={`status-pill ${isRecording ? 'active' : ''}`}>
            {status === "recording" && (
              <><div className="dot-red" /> {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')} Recording...</>
            )}
            {status === "processing" && (
              <><Loader2 size={14} className="loading-spinner" /> AI is transcribing...</>
            )}
            {status === "ready" && !isRecording && (
              <><Sparkles size={14} /> Ready to Listen</>
            )}
            {status === "error" && (
              <><AlertCircle size={14} /> Connection Failed</>
            )}
          </div>
        </div>

        <div className="transcript-wrapper">
          <div className="transcript-area">
            {status === "processing" ? (
              <div className="placeholder">Processing your speech pattern...</div>
            ) : transcript ? (
              transcript
            ) : (
              <div className="placeholder">Click the microphone and start speaking clearly.</div>
            )}
          </div>

          <div className="action-bar">
            <button className="icon-btn" onClick={copyText} disabled={!transcript} title="Copy Text">
              <Copy size={20} />
            </button>
            <button className="icon-btn" onClick={downloadText} disabled={!transcript} title="Download .txt">
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>

      <footer style={{textAlign: 'center', marginTop: '30px', color: '#94a3b8', fontSize: '0.8rem'}}>
        Powered by Optimized Whisper Small • High Accuracy Speech Inference
      </footer>
    </div>
  );
};

export default App;