import React from 'react';
import { RotateCw, Move, Maximize2 } from 'lucide-react';

export default function CanvasEditor({
  docRef,
  docData,
  orientation,
  isTiltMode,
  stampText,
  zoomScale = 0.85,
  onUpdateNote
}) {
  const {
    title = 'HỒ SƠ',
    subtitle = 'ỨNG TUYỂN CON RỂ',
    recipient = 'NHÀ GÁI',
    avatarUrl,
    personalInfo = {},
    skills = [],
    benefits = [],
    commitments = [],
    objective = '',
    signatureName = '',
    signatureFont = "'Dancing Script', cursive",
    signatureColor = "#0f2b5c",
    signatureSize = 2.8,
    statusBadge = 'TÌNH TRẠNG HỒ SƠ: ĐANG CHỜ NHÀ GÁI XÉT DUYỆT 😁',
    notes = []
  } = docData;

  // 1. Move Sticky Note (Mouse & Touch support)
  const handleNoteStart = (e, noteId, currentX, currentY, idx) => {
    if (e.button && e.button !== 0) return;
    e.stopPropagation();

    const isTouch = e.type === 'touchstart';
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    const defaultX = orientation === 'portrait' ? 410 : 680;
    const defaultY = 20 + idx * 75;

    const initialX = currentX !== undefined ? currentX : defaultX;
    const initialY = currentY !== undefined ? currentY : defaultY;

    const handleMove = (moveEvent) => {
      const moveX = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const deltaX = (moveX - clientX) / (zoomScale || 1);
      const deltaY = (moveY - clientY) / (zoomScale || 1);

      const newX = Math.round(initialX + deltaX);
      const newY = Math.round(initialY + deltaY);

      if (onUpdateNote) {
        onUpdateNote(noteId, { x: newX, y: newY });
      }
    };

    const handleEnd = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };

    if (isTouch) {
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    } else {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
    }
  };

  // 2. Resize Sticky Note (Mouse & Touch support)
  const handleResizeStart = (e, noteId, currentWidth, currentHeight) => {
    e.stopPropagation();

    const isTouch = e.type === 'touchstart';
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    const initialWidth = currentWidth || 210;
    const initialHeight = currentHeight || 110;

    const handleMove = (moveEvent) => {
      const moveX = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const deltaX = (moveX - clientX) / (zoomScale || 1);
      const deltaY = (moveY - clientY) / (zoomScale || 1);

      const newW = Math.max(130, Math.min(500, Math.round(initialWidth + deltaX)));
      const newH = Math.max(70, Math.min(450, Math.round(initialHeight + deltaY)));

      if (onUpdateNote) {
        onUpdateNote(noteId, { width: newW, height: newH });
      }
    };

    const handleEnd = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };

    if (isTouch) {
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    } else {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
    }
  };

  // 3. Step Rotation Buttons for Sticky Note (-5°, 0°, +5°)
  const handleRotateStep = (e, noteId, currentRot, delta, isReset = false) => {
    e.preventDefault();
    e.stopPropagation();
    let newRot = isReset ? 0 : ((currentRot || 0) + delta);
    if (newRot > 180) newRot -= 360;
    if (newRot < -180) newRot += 360;
    if (onUpdateNote) {
      onUpdateNote(noteId, { rotation: newRot });
    }
  };

  const docWidth = orientation === 'portrait' ? 650 : 960;
  const docHeight = orientation === 'portrait' ? 920 : 650;
  const scaledWidth = docWidth * zoomScale;
  const scaledHeight = docHeight * zoomScale;

  return (
    <div className="canvas-viewport" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%', overflow: 'auto', padding: '16px', boxSizing: 'border-box' }}>
      {/* Centered Document Wrapper ensuring all 4 corners are clearly visible */}
      <div 
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          position: 'relative',
          margin: '0 auto',
          transition: 'width 0.3s ease, height 0.3s ease',
          flexShrink: 0
        }}
      >
        <div 
          style={{
            width: `${docWidth}px`,
            height: `${docHeight}px`,
            transform: `scale(${zoomScale}) ${isTiltMode ? 'rotateY(-12deg) rotateX(6deg)' : ''}`,
            transformOrigin: 'top left',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <div 
            ref={docRef}
            className={`paper-document ${orientation}`}
          >
          {/* Decorative elements */}
          <div className="paper-clip"></div>
          <div className="paper-tape"></div>
          <div className="airmail-stamp">
            <div>DUYỆT<br/>100%</div>
          </div>

          {/* 1. Header Section */}
          <div className="doc-header">
            <h1 className="doc-main-title">{title}</h1>
            <div className="doc-sub-title">{subtitle}</div>
            <div className="doc-recipient">— KÍNH GỬI: {recipient} —</div>
          </div>

          {/* 2. Top Grid: Photo + Personal Info */}
          <div className="doc-top-grid">
            {/* Photo Frame */}
            <div className="photo-container">
              <img 
                src={avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80'} 
                alt="Ứng viên" 
                className="photo-frame"
              />
              <div className="stamp-badge">
                ♥ {stampText || 'ỨNG VIÊN TIỀM NĂNG'} ♥
              </div>
            </div>

            {/* Personal Info Box */}
            <div className="info-card-box">
              <div className="info-row">
                <span className="info-label">👤 Họ và tên:</span>
                <span className="info-value" style={{ zIndex: 5, position: 'relative' }}>
                  {personalInfo.fullname ? personalInfo.fullname : <span style={{ opacity: 0.35, fontStyle: 'italic' }}>(Nhập họ tên...)</span>}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">🎂 Năm sinh:</span>
                <span className="info-value">
                  {personalInfo.birthYear ? personalInfo.birthYear : <span style={{ opacity: 0.35, fontStyle: 'italic' }}>(Nhập năm sinh...)</span>}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">🏠 Hộ khẩu:</span>
                <span className="info-value">{personalInfo.hometown || 'Việt Nam'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">💼 Nghề nghiệp:</span>
                <span className="info-value">
                  {personalInfo.occupation ? personalInfo.occupation : <span style={{ opacity: 0.35, fontStyle: 'italic' }}>(Nhập nghề nghiệp...)</span>}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Middle Grid: Skills & Benefits */}
          <div className="doc-middle-grid">
            {/* Skills Column */}
            <div>
              <div className="ribbon-header">
                <span>★ KỸ NĂNG NỔI BẬT</span>
              </div>
              <div className="content-card-box">
                {skills.map((item, idx) => (
                  <div className="item-row" key={idx}>
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-text">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Column */}
            <div>
              <div className="ribbon-header red">
                <span>♥ CHẾ ĐỘ ĐẠI NGỘ</span>
              </div>
              <div className="content-card-box">
                {benefits.map((item, idx) => (
                  <div className="item-row" key={idx}>
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-text">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Commitments Ribbon Section */}
          <div style={{ marginBottom: '24px' }}>
            <div className="ribbon-header red" style={{ display: 'table', margin: '0 auto 12px auto' }}>
              <span>CAM KẾT</span>
            </div>
            <div className="commit-box">
              <div className="commit-grid">
                {commitments.map((item, idx) => (
                  <div className="item-row" key={idx}>
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-text">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Objective & Signature Bottom Grid */}
          <div className="doc-bottom-grid">
            {/* Objective Box */}
            <div className="objective-box">
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#b45309', marginBottom: '4px', textTransform: 'uppercase' }}>
                🎯 MỤC TIÊU HỒ SƠ
              </div>
              <div className="objective-text">
                "{objective || 'Xin được trở thành con rể chính thức, cùng xây dựng một gia đình hạnh phúc, yêu thương và đồng hành lâu dài.'}"
                <span style={{ color: '#ef4444', marginLeft: '6px' }}>♥</span>
              </div>
            </div>

            {/* Signature Box */}
            <div className="signature-box">
              <div className="signature-label">KÝ TÊN XÁC NHẬN</div>
              <div className="signature-handwriting" style={{ 
                fontFamily: signatureFont, 
                color: signatureColor, 
                fontSize: `${signatureSize}rem` 
              }}>
                {signatureName ? signatureName : <span style={{ opacity: 0.25, fontSize: '1.8rem' }}>(Ký tên...)</span>}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>🖊️ Chữ ký ứng viên</div>
            </div>
          </div>

          {/* 6. Sticky Notes Overlay (Drag to move, Corner Resize, Drag/Click Rotate) */}
          {notes.map((note, idx) => {
            const posX = note.x !== undefined ? note.x : (orientation === 'portrait' ? 410 : 680);
            const posY = note.y !== undefined ? note.y : (20 + idx * 75);
            const width = note.width || 210;
            const height = note.height || 110;
            const rotation = note.rotation !== undefined ? note.rotation : (idx % 2 === 0 ? 5 : -4);

            return (
              <div 
                key={note.id || idx} 
                className="sticky-note"
                onMouseDown={(e) => handleNoteStart(e, note.id, note.x, note.y, idx)}
                onTouchStart={(e) => handleNoteStart(e, note.id, note.x, note.y, idx)}
                style={{ 
                  backgroundColor: note.color || '#fff3cd', 
                  left: `${posX}px`,
                  top: `${posY}px`, 
                  width: `${width}px`,
                  minHeight: `${height}px`,
                  maxWidth: '500px',
                  zIndex: 20,
                  cursor: 'grab',
                  userSelect: 'none',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                  transform: `rotate(${rotation}deg)`,
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  padding: '8px 12px 14px 12px',
                  borderRadius: '8px',
                  touchAction: 'none'
                }}
              >
                {/* Top Control Bar with Drag Handle & Easy Step Rotate Buttons */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '6px',
                  borderBottom: '1px dashed rgba(0,0,0,0.15)',
                  paddingBottom: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
                    <Move size={13} />
                    <span>Kéo di chuyển</span>
                  </div>

                  {/* Clean Rotation Step Controls: -5°, 0°, +5° */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(0,0,0,0.06)', borderRadius: '12px', padding: '2px 4px' }}>
                    <button 
                      onClick={(e) => handleRotateStep(e, note.id, rotation, -5)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.7rem', padding: '1px 3px', color: '#1e293b', borderRadius: '4px' }}
                      title="Xoay nghiêng trái (-5°)"
                    >
                      ↺ -5°
                    </button>

                    <button 
                      onClick={(e) => handleRotateStep(e, note.id, rotation, 0, true)}
                      style={{ 
                        border: 'none', 
                        background: rotation === 0 ? '#38bdf8' : 'rgba(0,0,0,0.1)', 
                        color: rotation === 0 ? '#fff' : '#0f172a',
                        cursor: 'pointer', 
                        fontSize: '0.68rem', 
                        padding: '1px 5px', 
                        borderRadius: '8px',
                        fontWeight: 700
                      }}
                      title="Bấm để đặt lại góc 0° (Thẳng)"
                    >
                      {rotation}°
                    </button>

                    <button 
                      onClick={(e) => handleRotateStep(e, note.id, rotation, 5)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.7rem', padding: '1px 3px', color: '#1e293b', borderRadius: '4px' }}
                      title="Xoay nghiêng phải (+5°)"
                    >
                      ↻ +5°
                    </button>
                  </div>
                </div>

                {/* Note Text */}
                <div style={{ flex: 1, wordBreak: 'break-word', lineHeight: 1.35, fontSize: '0.92rem', color: '#1e293b', fontWeight: 500 }}>
                  📌 {note.text}
                </div>

                {/* Bottom Right Corner Resize Handle (↘️) */}
                <div 
                  onMouseDown={(e) => handleResizeStart(e, note.id, width, height)}
                  onTouchStart={(e) => handleResizeStart(e, note.id, width, height)}
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '4px',
                    width: '18px',
                    height: '18px',
                    cursor: 'se-resize',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    opacity: 0.75,
                    touchAction: 'none'
                  }}
                  title="Kéo góc này để thay đổi kích thước to/nhỏ ghi chú"
                >
                  <Maximize2 size={13} style={{ transform: 'rotate(90deg)' }} />
                </div>

              </div>
            );
          })}

          {/* 7. Footer Status Badge Banner */}
          <div className="footer-banner">
            <span>♥</span>
            <span>{statusBadge}</span>
          </div>

        </div>
      </div>
    </div>
  </div>
);
}
