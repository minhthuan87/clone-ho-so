import React from 'react';
import { X, Smile } from 'lucide-react';

export default function IconPickerModal({ isOpen, onClose, onSelectIcon }) {
  if (!isOpen) return null;

  const categories = [
    {
      name: 'Gia đình & Cuộc sống',
      icons: ['🍺', '🥣', '🚭', '❤️', '🚗', '😁', '🧹', '⏰', '📱', '🥤', '💆‍♂️', '🔒', '💳', '🏡', '👶', '💍', '🎁']
    },
    {
      name: 'Công việc & Doanh nhân',
      icons: ['💼', '📊', '🚀', '🎯', '⭐', '🛡️', '⚡', '🤝', '🏆', '📈', '📜', '🖊️', '💡', '📌', '📎', '🔒', '👑']
    },
    {
      name: 'Hài hước & Đánh giá',
      icons: ['👍', '🔥', '💯', '✨', '🔴', '✅', '❌', '⚠️', '💸', '💪', '🥳', '😎', '🙏', '👑', '🥇', '🍺', '🍕']
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
            <Smile color="#fbbf24" size={20} />
            Chọn Icon / Emoji Thêm Vào Hồ Sơ
          </h3>
          <button className="btn btn-outline" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '60vh' }}>
          {categories.map((cat, i) => (
            <div key={i}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                {cat.name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {cat.icons.map((icon, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectIcon(icon);
                      onClose();
                    }}
                    style={{
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '1.4rem',
                      padding: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.1s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
