import React, { useEffect, useState } from 'react';
import { X, Sparkles, Check, FileText } from 'lucide-react';

export default function TemplateSelector({ isOpen, onClose, onSelectTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/templates')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTemplates(data.templates);
          }
        })
        .catch(err => console.error('Fetch templates error:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
            <Sparkles color="#f43f5e" size={20} />
            Bộ Mẫu Hồ Sơ Canva / Word Pro
          </h3>
          <button className="btn btn-outline" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Đang tải danh sách mẫu...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '60vh', paddingRight: '4px' }}>
            {templates.map(tpl => (
              <div 
                key={tpl.id}
                onClick={() => {
                  onSelectTemplate({
                    ...tpl.data,
                    personalInfo: {
                      ...tpl.data?.personalInfo,
                      fullname: '',
                      birthYear: '',
                      occupation: ''
                    },
                    signatureName: ''
                  });
                  onClose();
                }}
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#f43f5e'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc' }}>{tpl.name}</span>
                    <span style={{ fontSize: '0.75rem', background: '#334155', color: '#fb7185', padding: '2px 8px', borderRadius: '10px' }}>
                      {tpl.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {tpl.category} • {tpl.data.subtitle}
                  </div>
                </div>
                <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  <Check size={14} /> Áp dụng
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
