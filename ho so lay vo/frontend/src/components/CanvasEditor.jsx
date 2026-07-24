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

  // 1. Move Sticky Note
  const handleNoteMouseDown = (e, noteId, currentX, currentY, idx) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;

    const defaultX = orientation === 'portrait' ? 410 : 680;
    const defaultY = 20 + idx * 75;

    const initialX = currentX !== undefined ? currentX : defaultX;
    const initialY = currentY !== undefined ? currentY : defaultY;

    const handleMouseMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startX) / (zoomScale || 1);
      const deltaY = (moveEvent.clientY - startY) / (zoomScale || 1);

      const newX = Math.round(initialX + deltaX);
      const newY = Math.round(initialY + deltaY);

      if (onUpdateNote) {
        onUpdateNote(noteId, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 2. Resize Sticky Note (Drag bottom-right corner)
  const handleResizeMouseDown = (e, noteId, currentWidth, currentHeight) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = currentWidth || 210;
    const initialHeight = currentHeight || 110;

    const handleMouseMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startX) / (zoomScale || 1);
      const deltaY = (moveEvent.clientY - startY) / (zoomScale || 1);

      const newW = Math.max(130, Math.min(500, Math.round(initialWidth + deltaX)));
      const newH = Math.max(70, Math.min(450, Math.round(initialHeight + deltaY)));

      if (onUpdateNote) {
        onUpdateNote(noteId, { width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 3. Rotate Sticky Note (Drag or click rotate button)
  const handleRotateMouseDown = (e, noteId, currentRotation) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const initialRot = currentRotation || 0;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newRot = Math.round((initialRot + deltaX * 0.8) % 360);

      if (onUpdateNote) {
        onUpdateNote(noteId, { rotation: newRot });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleRotateClick = (e, noteId, currentRotation) => {
    e.stopPropagation();
    const nextRot = ((currentRotation || 0) + 15) % 360;
    if (onUpdateNote) {
      onUpdateNote(noteId, { rotation: nextRot });
    }
  };

  return (
    <div className="canvas-viewport">
      {/* Paper Document Container with dynamic scale transformation */}
      <div 
        style={{
          transform: `scale(${zoomScale}) ${isTiltMode ? 'rotateY(-12deg) rotateX(6deg)' : ''}`,
          transformOrigin: 'top center',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
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
                onMouseDown={(e) => handleNoteMouseDown(e, note.id, note.x, note.y, idx)}
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
                  padding: '8px 12px 14px 12px'
                }}
              >
                {/* Top Control Bar with Drag icon & Rotate Handle */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '4px',
                  borderBottom: '1px dashed rgba(0,0,0,0.15)',
                  paddingBottom: '2px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#64748b' }}>
                    <Move size={12} />
                    <span>Kéo di chuyển</span>
                  </div>

                  {/* Rotate Button / Drag handle */}
                  <div 
                    onClick={(e) => handleRotateClick(e, note.id, rotation)}
                    onMouseDown={(e) => handleRotateMouseDown(e, note.id, rotation)}
                    style={{ 
                      cursor: 'pointer', 
                      background: 'rgba(0,0,0,0.08)', 
                      padding: '2px 6px', 
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.7rem',
                      color: '#0f172a'
                    }}
                    title="Bấm hoặc kéo để xoay góc nghiêng ghi chú"
                  >
                    <RotateCw size={11} />
                    <span>{rotation}°</span>
                  </div>
                </div>

                {/* Note Text */}
                <div style={{ flex: 1, wordBreak: 'break-word', lineHeight: 1.3 }}>
                  📌 {note.text}
                </div>

                {/* Bottom Right Corner Resize Handle (↘️) */}
                <div 
                  onMouseDown={(e) => handleResizeMouseDown(e, note.id, width, height)}
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '4px',
                    width: '16px',
                    height: '16px',
                    cursor: 'se-resize',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    opacity: 0.7
                  }}
                  title="Kéo góc này để thay đổi kích thước to/nhỏ ghi chú"
                >
                  <Maximize2 size={12} style={{ transform: 'rotate(90deg)' }} />
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
  );
}
