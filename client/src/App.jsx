import React, { useState, useRef, useEffect } from "react";
import { 
  Mic, Square, Copy, Download, Loader2, Volume2, 
  Activity, ShieldCheck, Stethoscope, HeartPulse, 
  Pill, Microscope, Dna, Thermometer, FlaskConical 
} from "lucide-react";

const API_URL = "https://bhargav1290-finalasr.hf.space/upload";

// Decorative Background Icons - Hidden on mobile to prevent clutter
const FloatingIcon = ({ Icon, top, left, rotate, size = 40 }) => (
  <div 
    className="absolute text-teal-600/5 pointer-events-none hidden lg:block"
    style={{ top: `${top}%`, left: `${left}%`, transform: `rotate(${rotate}deg)` }}
  >
    <Icon size={size} />
  </div>
);

export default function ResponsiveMedicalSpeech() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("ready");
  const [timer, setTimer] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setTimer(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const startRecording = async () => {
    setTranscript("");
    setStatus("recording");
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => { if (e.data.size) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await sendAudioToServer(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch { setStatus("error"); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setStatus("processing");
  };

  const sendAudioToServer = async (blob) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: blob,
      });
      if (res.ok) {
        setTranscript((await res.text()).trim());
        setStatus("ready");
      } else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#E0F7F6] flex items-center justify-center overflow-x-hidden font-sans">
      
      {/* 1. LIGHT TEAL SHINE BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#B9EAE7] via-[#E0F7F6] to-white" />
      <div className="absolute top-[-20%] left-[-10%] w-[80%] lg:w-[60%] h-[60%] bg-white/40 rounded-full blur-[80px] lg:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[60%] lg:w-[40%] h-[40%] bg-teal-200/30 rounded-full blur-[80px] lg:blur-[100px] pointer-events-none" />
      
      {/* 2. SUBTLE MEDICAL ICONS (Desktop only) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <FloatingIcon Icon={Stethoscope} top={15} left={10} rotate={-20} size={100} />
        <FloatingIcon Icon={Pill} top={10} left={80} rotate={45} size={60} />
        <FloatingIcon Icon={HeartPulse} top={70} left={5} rotate={15} size={80} />
        <FloatingIcon Icon={Dna} top={80} left={85} rotate={-10} size={110} />
        <FloatingIcon Icon={Microscope} top={40} left={92} rotate={20} size={70} />
      </div>

      {/* 3. MAIN RESPONSIVE CONTAINER */}
      <div className="container mx-auto px-6 py-12 lg:py-0 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-20 relative z-10">
        
        {/* LEFT SECTION: Welcome Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border border-teal-100 rounded-lg text-teal-600 shadow-sm">
              <ShieldCheck size={18} />
            </div>
            <span className="text-[10px] lg:text-xs font-bold text-teal-700/70 uppercase tracking-widest">Medical Grade AI</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-slate-800 leading-tight tracking-tight">
            Welcome <span className="text-teal-500">!</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-600/80 max-w-lg leading-relaxed font-medium">
            Revolutionizing healthcare communication with assistive speech recognition. 
            Experience high-accuracy transcription for dysarthric speech patterns.
          </p>

          <div className="pt-2 lg:pt-4">
            <button className="px-8 lg:px-10 py-4 lg:py-5 bg-teal-500 text-white rounded-full font-bold text-base lg:text-lg shadow-xl shadow-teal-500/20 hover:bg-teal-600 transition-all hover:-translate-y-1 active:scale-95">
              GET STARTED
            </button>
          </div>
        </div>

        {/* RIGHT SECTION: Minimal Phone UI */}
        <div className="w-full max-w-[340px] lg:w-[380px] relative mt-4 lg:mt-0">
          
          {/* Phone Frame */}
          <div className="relative mx-auto w-full aspect-[9/18.5] bg-slate-900 rounded-[3rem] p-2 shadow-2xl border-[4px] border-slate-900 ring-1 ring-slate-200/50">
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-2xl z-20" />

            <div className="h-full w-full bg-white rounded-[2.6rem] overflow-hidden flex flex-col relative">
              
              {/* Internal Header */}
              <div className="relative h-[30%] lg:h-[32%] bg-teal-500 flex flex-col items-center justify-center">
                <div className="z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 animate-pulse">
                  <Volume2 size={24} className="text-white lg:scale-125" />
                </div>
                
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 500 500" preserveAspectRatio="none">
                   <path d="M-10,150 C100,250 250,50 600,150" fill="none" stroke="white" strokeWidth="2" />
                   <path d="M-10,250 C150,350 350,150 600,250" fill="none" stroke="white" strokeWidth="2" />
                </svg>

                <div className="absolute bottom-0 w-full h-10 lg:h-12 bg-white rounded-t-[3rem] lg:rounded-t-[3.5rem] translate-y-1" />
              </div>

              {/* Interaction Body */}
              <div className="px-6 lg:px-8 -mt-2 lg:-mt-4 flex-1 flex flex-col">
                <div className="space-y-6 lg:space-y-8 mt-4 lg:mt-6">
                  
                  {/* Status Section */}
                  <div className="space-y-1">
                    <label className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status</label>
                    <div className="flex items-center gap-2 border-b-2 border-slate-50 pb-2">
                       <Activity size={12} className="text-teal-500 lg:scale-110" />
                       <span className="text-xs lg:text-sm font-bold text-slate-600">
                          {status === "recording" ? `Dictating... (${formatTime(timer)})` : status.toUpperCase()}
                       </span>
                    </div>
                  </div>

                  {/* Transcript Section */}
                  <div className="space-y-1">
                    <label className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Transcript</label>
                    <div className="min-h-[120px] lg:min-h-[140px] text-sm lg:text-[15px] text-slate-600 leading-relaxed font-normal pt-2 border-b-2 border-slate-50">
                      {status === "processing" ? (
                        <div className="flex items-center gap-2 text-teal-600">
                          <Loader2 size={14} className="animate-spin" /> Waveform analysis...
                        </div>
                      ) : (
                        transcript || "Converted text appears here..."
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 lg:pt-4">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-full py-3.5 lg:py-4 rounded-2xl text-white font-black text-xs lg:text-sm tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3
                        ${isRecording ? "bg-red-500 shadow-red-100" : "bg-teal-500 shadow-teal-50 hover:bg-teal-600"}
                      `}
                    >
                      {isRecording ? <Square size={16} fill="white" /> : <Mic size={16} />}
                      {isRecording ? "STOP" : "START "}
                    </button>
                  </div>
                </div>
              </div>

              {/* Home bar */}
              <div className="py-3 flex justify-center mt-auto">
                <div className="w-16 lg:w-20 h-1 bg-slate-100 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}