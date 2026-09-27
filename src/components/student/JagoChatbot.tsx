import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { JagoMessage } from '../../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  Mic, 
  MicOff, 
  X, 
  ArrowRight, 
  FileText, 
  Wallet, 
  CreditCard, 
  ShieldCheck, 
  Minimize2, 
  Maximize2 
} from 'lucide-react';

interface JagoChatbotProps {
  isFloating?: boolean;
  isOpenFloating?: boolean;
  onCloseFloating?: () => void;
}

export const JagoChatbot: React.FC<JagoChatbotProps> = ({ 
  isFloating = false, 
  isOpenFloating = true, 
  onCloseFloating 
}) => {
  const { chatMessages, sendJagoMessage, setActiveTab } = useApp();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendJagoMessage(inputText);
    setInputText('');
  };

  const handleActionClick = (action: string) => {
    if (action === 'open_wallet' || action === 'upload_income') {
      setActiveTab('wallet');
      if (onCloseFloating) onCloseFloating();
    } else if (action === 'open_payments') {
      setActiveTab('payments');
      if (onCloseFloating) onCloseFloating();
    } else if (action === 'open_verification') {
      setActiveTab('verification');
      if (onCloseFloating) onCloseFloating();
    } else if (action === 'open_eligibility') {
      setActiveTab('eligibility');
      if (onCloseFloating) onCloseFloating();
    } else if (action === 'open_scholarships') {
      setActiveTab('scholarships');
      if (onCloseFloating) onCloseFloating();
    } else if (action === 'view_timeline') {
      setActiveTab('applications');
      if (onCloseFloating) onCloseFloating();
    } else if (action === 'check_post_matric_status') {
      sendJagoMessage('Why is my Post-Matric application pending?');
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in this browser.');
    }
  };

  // Speech to Text (Web Speech API)
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        sendJagoMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const quickPrompts = [
    'Why is my application pending?',
    'Am I eligible for Top Class?',
    'What is my DBT payment status?',
    'What documents are required for NFST?'
  ];

  if (isFloating && !isOpenFloating) return null;

  return (
    <div className={`flex flex-col bg-white overflow-hidden shadow-2xl border border-slate-200 transition-all ${
      isFloating 
        ? 'fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[550px] rounded-2xl animate-in slide-in-from-bottom-5 duration-200' 
        : 'w-full max-w-4xl mx-auto h-[620px] rounded-2xl shadow-sm'
    }`}>
      {/* Chat Header */}
      <div className="bg-gov-navy text-white px-5 py-3.5 flex items-center justify-between border-b border-gov-blue shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm">JAGO Assistant</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-amber-300 font-medium">Your MoTA Scholarship Navigator</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isFloating && onCloseFloating && (
            <button
              onClick={onCloseFloating}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-xs">
        {chatMessages.map((msg: JagoMessage) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                isUser 
                  ? 'bg-gov-navy text-white rounded-br-xs shadow-xs font-medium' 
                  : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-xs'
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Direct Action Navigation Button */}
                {msg.actionButton && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleActionClick(msg.actionButton!.action)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{msg.actionButton.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {!isUser && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="hover:text-slate-600 flex items-center gap-0.5"
                    title="Read response aloud"
                  >
                    <Volume2 className="w-3 h-3 text-slate-400 hover:text-gov-primary" />
                    <span>Listen</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions Chips */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Try:</span>
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendJagoMessage(q)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-[11px] whitespace-nowrap transition-colors border border-slate-200"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form with Speech Recognition */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2 rounded-xl transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
          title={isListening ? 'Listening... click to stop' : 'Speak your question'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? 'Listening to your voice...' : 'Ask JAGO about scholarships, status, or documents...'}
          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-gov-primary font-medium"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 bg-gov-navy hover:bg-gov-blue text-white rounded-xl transition-colors disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
