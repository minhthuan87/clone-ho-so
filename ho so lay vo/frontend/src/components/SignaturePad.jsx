import React from 'react';
import { PenTool, Palette, Type, Check } from 'lucide-react';

export default function SignaturePad({ 
  signatureName, 
  setSignatureName,
  signatureFont,
  setSignatureFont,
  signatureColor,
  setSignatureColor,
  signatureSize,
  setSignatureSize
}) {
  const fontPresets = [
    { name: 'Nét Cọ Bay Bổng', fontClass: "'Dancing Script', cursive" },
    { name: 'Cây Bút Mực Caveat', fontClass: "'Caveat', cursive" },
    { name: 'Chữ Tay Patrick', fontClass: "'Patrick Hand', cursive" },
    { name: 'Thủ Bút Great Vibes', fontClass: "'Great Vibes', cursive" },
    { name: 'Bút Rồng Sacramento', fontClass: "'Sacramento', cursive" },
    { name: 'Bút Quý Tộc Alex Brush', fontClass: "'Alex Brush', cursive" },
    { name: 'Nét Phá Cách Pacifico', fontClass: "'Pacifico', cursive" },
    { name: 'Mềm Mại Satisfy', fontClass: "'Satisfy', cursive" },
    { name: 'Quý Phái Montez', fontClass: "'Montez', cursive" },
    { name: 'Dễ Thương Mali', fontClass: "'Mali', cursive" }
  ];

  const colorPresets = [
    { name: 'Xanh Mực Bút Máy', hex: '#0f2b5c' },
    { name: 'Đen Mực Chữ Ký', hex: '#1e293b' },
    { name: 'Đỏ Con Dấu', hex: '#be123c' },
    { name: 'Tím Mực Học Sinh', hex: '#6b21a8' },
    { name: 'Xanh Ngọc Thuần', hex: '#0284c7' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Input Name */}
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PenTool size={16} color="#38bdf8" />
          <span>Tên Chữ Ký Tay Xác Nhận</span>
        </label>
        <input 
          type="text" 
          className="form-input" 
          value={signatureName || ''} 
          onChange={e => setSignatureName(e.target.value)} 
          placeholder="Nhập tên chữ ký (VD: Thuận, Hoàng, Tuấn...)" 
        />
      </div>

      {/* Color Picker */}
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Palette size={16} color="#ec4899" />
          <span>Màu Mực Chữ Ký</span>
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {colorPresets.map((c, i) => (
            <button
              key={i}
              onClick={() => setSignatureColor(c.hex)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: c.hex,
                border: signatureColor === c.hex ? '3px solid #ffffff' : '1px solid #334155',
                cursor: 'pointer',
                boxShadow: signatureColor === c.hex ? '0 0 8px ' + c.hex : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={c.name}
            >
              {signatureColor === c.hex && <Check size={14} color="#fff" />}
            </button>
          ))}
        </div>
      </div>

      {/* Size Slider */}
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Kích thước chữ ký:</span>
          <span style={{ color: '#38bdf8' }}>{signatureSize || 2.8}rem</span>
        </label>
        <input 
          type="range" 
          min="1.8" 
          max="4.0" 
          step="0.1"
          value={signatureSize || 2.8} 
          onChange={e => setSignatureSize(parseFloat(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>

      {/* Font Presets Selector */}
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Type size={16} color="#fbbf24" />
          <span>Chọn Kiểu Phông Chữ Ký ({fontPresets.length} kiểu):</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
          {fontPresets.map((preset, idx) => {
            const isSelected = (signatureFont || "'Dancing Script', cursive") === preset.fontClass;
            return (
              <div 
                key={idx}
                onClick={() => setSignatureFont(preset.fontClass)}
                style={{
                  background: isSelected ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
                  border: isSelected ? '2px solid #38bdf8' : '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '0.8rem', color: isSelected ? '#f8fafc' : '#94a3b8', fontWeight: isSelected ? 700 : 400 }}>
                  {preset.name}
                </span>
                <span style={{ 
                  fontFamily: preset.fontClass, 
                  fontSize: '1.9rem', 
                  color: signatureColor || '#0f2b5c',
                  lineHeight: 1
                }}>
                  {signatureName || 'Thuận'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
