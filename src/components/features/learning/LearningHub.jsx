import React, { useState } from 'react';
import { BookOpen, Sparkles, Search } from 'lucide-react';
import { ProtocolWalkthroughs } from './ProtocolWalkthroughs';
import { GlossaryModal } from './GlossaryModal';
export const LearningHub = ({ onStartTour }) => {
    const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
    return (<div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: '24px',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%'
        }}>
      {/* Learning Hub Hero Banner */}
      <div className="panel-glass" style={{
            padding: '24px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            background: 'linear-gradient(135deg, rgba(15, 21, 35, 0.9) 0%, rgba(37, 99, 235, 0.15) 100%)',
            borderLeft: '4px solid var(--cyan-bright)'
        }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={24} color="var(--cyan-bright)"/>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Networking Observatory & Learning Hub
            </h2>
            <span style={{
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(0, 240, 255, 0.15)',
            color: 'var(--cyan-bright)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            fontWeight: 700
        }}>
              TECHNICAL EDUCATOR
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '780px', lineHeight: '1.5' }}>
            Learn computer networks from first principles. Explore interactive deep dives on the TCP state machine, DNS resolution trees, TLS 1.3 key exchanges, and full 4-layer encapsulation.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onStartTour} className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
            <Sparkles size={16}/>
            <span>Start Guided Tour</span>
          </button>

          <button onClick={() => setIsGlossaryOpen(true)} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
            <Search size={16}/>
            <span>Search Glossary</span>
          </button>
        </div>
      </div>

      {/* Protocol Walkthroughs Container */}
      <ProtocolWalkthroughs />

      {/* Glossary Modal */}
      <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)}/>
    </div>);
};
