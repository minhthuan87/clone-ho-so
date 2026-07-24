import React from 'react';
import { Download, RotateCcw, Box, Save, Sparkles, Layers, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeaderNav({
  orientation,
  setOrientation,
  isTiltMode,
  setIsTiltMode,
  zoomScale,
  setZoomScale,
  onAutoFit,
  onExport,
  onSaveProfile,
  onOpenTemplates,
  onTriggerConfetti
}) {
  const handleApproveAction = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    if (onTriggerConfetti) onTriggerConfetti();
  };

  const zoomIn = () => setZoomScale(prev => Math.min(1.4, +(prev + 0.05).toFixed(2)));
  const zoomOut = () => setZoomScale(prev => Math.max(0.3, +(prev - 0.05).toFixed(2)));
  const zoomFit = () => {
    if (onAutoFit) onAutoFit();
    else setZoomScale(0.72);
  };

  return (
    <header className="navbar">
      <div className="nav-brand">
        <span style={{ fontSize: '1.4rem' }}>📜</span>
        <div>
          Hồ Sơ Studio Pro
          <span className="badge">v2.5 Fullstack</span>
        </div>
      </div>

      {/* Zoom / Scale Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0f172a', padding: '4px 10px', borderRadius: '20px', border: '1px solid #334155' }}>
        <button className="btn btn-outline" style={{ padding: '4px 8px' }} onClick={zoomOut} title="Thu Nhỏ Tầm Nhìn">
          <ZoomOut size={14} />
        </button>
        <span style={{ fontSize: '0.8rem', color: '#38bdf8', minWidth: '42px', textAlign: 'center', fontWeight: 700 }}>
          {Math.round(zoomScale * 100)}%
        </span>
        <button className="btn btn-outline" style={{ padding: '4px 8px' }} onClick={zoomIn} title="Phóng To Tầm Nhìn">
          <ZoomIn size={14} />
        </button>
        <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={zoomFit} title="Nhìn Toàn Bản Hồ Sơ">
          <Maximize2 size={13} />
          <span>Vừa Màn</span>
        </button>
      </div>

      <div className="nav-actions">
        {/* Template Switcher */}
        <button className="btn btn-outline" onClick={onOpenTemplates} title="Chọn Mẫu Hồ Sơ">
          <Layers size={16} />
          <span>Mẫu Hồ Sơ</span>
        </button>

        {/* Orientation Switcher */}
        <button 
          className={`btn ${orientation === 'landscape' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
          title="Xoay Ngang / Dọc Giao Diện"
        >
          <RotateCcw size={16} className={orientation === 'landscape' ? 'rotate-90' : ''} />
          <span>{orientation === 'portrait' ? 'Xoay Ngang' : 'Xoay Dọc'}</span>
        </button>

        {/* 3D Perspective View Mode */}
        <button 
          className={`btn ${isTiltMode ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setIsTiltMode(!isTiltMode)}
          title="Bật/Tắt Hiệu Ứng 3D Nghiêng"
        >
          <Box size={16} />
          <span>Góc Nhìn 3D</span>
        </button>

        {/* Celebratory Approval Button */}
        <button className="btn btn-secondary" onClick={handleApproveAction} style={{ background: '#059669', color: 'white', border: 'none' }}>
          <Sparkles size={16} />
          <span>Duyệt Hồ Sơ! 🎉</span>
        </button>

        {/* Save to Backend */}
        <button className="btn btn-secondary" onClick={onSaveProfile}>
          <Save size={16} />
          <span>Lưu Server</span>
        </button>

        {/* Export Image / PDF */}
        <button className="btn btn-primary" onClick={onExport}>
          <Download size={16} />
          <span>Tải Ảnh HD</span>
        </button>
      </div>
    </header>
  );
}
