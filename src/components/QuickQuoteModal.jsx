// QuickQuoteModal — elegant fullscreen popup wrapping the QuickQuoteSection form
import { useEffect, useRef } from 'react'
import QuickQuoteSection from './QuickQuoteSection'

export default function QuickQuoteModal({ onClose }) {
  const backdropRef = useRef(null)

  // Lock body scroll + Escape key close
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <>
      <style>{`
        @keyframes qqm-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes qqm-panel-in {
          from { opacity: 0; transform: translateY(36px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .qqm-close-btn {
          position: sticky;
          top: 16px;
          float: right;
          margin: 16px 20px 0 0;
          z-index: 10;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 50%;
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          font-size: 18px;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }
        .qqm-close-btn:hover {
          background: rgba(200,168,78,0.15);
          border-color: rgba(200,168,78,0.45);
          color: #e8cc7a;
        }
        .qqm-panel::-webkit-scrollbar { width: 5px; }
        .qqm-panel::-webkit-scrollbar-track { background: transparent; }
        .qqm-panel::-webkit-scrollbar-thumb { background: rgba(200,168,78,0.25); border-radius: 3px; }
      `}</style>

      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={e => { if (e.target === backdropRef.current) onClose() }}
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(2,3,8,0.88)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
          animation: 'qqm-backdrop-in 0.3s ease forwards',
          overflowY: 'auto',
        }}
      >
        {/* Panel */}
        <div
          className="qqm-panel"
          style={{
            width: '100%', maxWidth: 920,
            maxHeight: '92vh',
            overflowY: 'auto',
            background: 'linear-gradient(170deg, #0b1120 0%, #060810 100%)',
            border: '1px solid rgba(200,168,78,0.22)',
            borderRadius: 24,
            boxShadow: '0 48px 120px rgba(0,0,0,0.88), 0 0 0 1px rgba(200,168,78,0.08) inset',
            animation: 'qqm-panel-in 0.42s cubic-bezier(0.34,1.3,0.64,1) forwards',
            position: 'relative',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(200,168,78,0.25) transparent',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Gold top bar */}
          <div style={{
            height: 3,
            background: 'linear-gradient(90deg, transparent 0%, #9a7a2e 20%, #c8a84e 50%, #e8cc7a 70%, transparent 100%)',
            borderRadius: '24px 24px 0 0',
          }} />

          {/* Close button — sticky top-right */}
          <button className="qqm-close-btn" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* QuickQuoteSection rendered inside the modal */}
          <QuickQuoteSection />
        </div>
      </div>
    </>
  )
}
