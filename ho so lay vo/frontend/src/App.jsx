import React, { useState, useRef, useEffect, useCallback } from 'react';
import HeaderNav from './components/HeaderNav.jsx';
import CanvasEditor from './components/CanvasEditor.jsx';
import PhotoUploader from './components/PhotoUploader.jsx';
import RichTextEditor from './components/RichTextEditor.jsx';
import SignaturePad from './components/SignaturePad.jsx';
import TemplateSelector from './components/TemplateSelector.jsx';
import IconPickerModal from './components/IconPickerModal.jsx';
import View3DModal from './components/View3DModal.jsx';
import { toPng } from 'html-to-image';
import { Image as ImageIcon, Edit3, PenTool, Sparkles, Eye } from 'lucide-react';

const DEFAULT_DOC = {
  title: 'HỒ SƠ',
  subtitle: 'ỨNG TUYỂN CON RỂ',
  recipient: 'NHÀ GÁI',
  stampText: 'ỨNG VIÊN TIỀM NĂNG',
  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  personalInfo: {
    fullname: '',
    birthYear: '',
    hometown: 'Việt Nam',
    occupation: ''
  },
  skills: [
    { icon: '🍺', text: 'Biết nhậu nhưng biết điểm dừng.' },
    { icon: '🥣', text: 'Biết rửa chén, quét nhà khi được giao nhiệm vụ.' },
    { icon: '🚭', text: 'Không hút thuốc (nếu đúng).' },
    { icon: '❤️', text: 'Luôn tôn trọng gia đình hai bên.' },
    { icon: '🚗', text: 'Sẵn sàng đưa đón vợ mọi lúc mọi nơi.' },
    { icon: '😁', text: 'Có khả năng dỗ vợ khi giận.' }
  ],
  benefits: [
    { icon: '✅', text: 'Lương chuyển khoản đúng ngày.' },
    { icon: '✅', text: 'Thưởng lễ, Tết ưu tiên cho vợ.' },
    { icon: '✅', text: 'Không có quỹ đen (cam kết).' }
  ],
  commitments: [
    { icon: '🔴', text: 'Yêu vợ một lòng.' },
    { icon: '🔴', text: 'Không ngoại tình.' },
    { icon: '🔴', text: 'Không bạo lực.' },
    { icon: '🔴', text: 'Luôn đặt gia đình lên hàng đầu.' },
    { icon: '🔴', text: 'Chấp nhận "vợ luôn đúng".' }
  ],
  objective: 'Xin được trở thành con rể chính thức, cùng xây dựng một gia đình hạnh phúc, yêu thương và đồng hành lâu dài.',
  signatureName: '',
  signatureFont: "'Dancing Script', cursive",
  signatureColor: '#0f2b5c',
  signatureSize: 2.8,
  statusBadge: 'TÌNH TRẠNG HỒ SƠ: ĐANG CHỜ NHÀ GÁI XÉT DUYỆT 😁',
  notes: [
    { id: 1, text: 'Ghi chú: Đã kiểm định nết ăn nết ở 10/10!', color: '#fff3cd', x: 410, y: 20, width: 210, height: 110, rotation: 5 }
  ]
};

export default function App() {
  const [docData, setDocData] = useState(DEFAULT_DOC);
  const [orientation, setOrientation] = useState('portrait'); // portrait or landscape
  const [isTiltMode, setIsTiltMode] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // photo, editor, signature
  const [zoomScale, setZoomScale] = useState(0.72); // Default auto-fit scale
  
  // Modals state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [iconCallback, setIconCallback] = useState(null);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);

  const [mobileView, setMobileView] = useState('editor'); // 'editor' or 'preview'

  const docRef = useRef(null);
  const viewportRef = useRef(null);

  // Auto-fit calculate scale to fit all 4 corners of document cleanly inside viewport
  const autoFitDocument = useCallback(() => {
    if (!viewportRef.current) return;
    const viewportRect = viewportRef.current.getBoundingClientRect();
    const docWidth = orientation === 'portrait' ? 650 : 960;
    const docHeight = orientation === 'portrait' ? 950 : 680;

    // Available space inside viewport minus margins
    const availableWidth = Math.max(200, viewportRect.width - 24);
    const availableHeight = Math.max(200, viewportRect.height - 24);

    if (availableWidth <= 0 || availableHeight <= 0) return;

    const scaleX = availableWidth / docWidth;
    const scaleY = availableHeight / docHeight;

    const computedScale = Math.max(0.2, Math.min(1.0, Math.min(scaleX, scaleY)));
    setZoomScale(+computedScale.toFixed(2));
  }, [orientation]);

  // Recalculate auto fit on mount, orientation change, or viewport resize
  useEffect(() => {
    autoFitDocument();
    const timer1 = setTimeout(autoFitDocument, 50);
    const timer2 = setTimeout(autoFitDocument, 300);

    let observer;
    if (viewportRef.current && typeof window !== 'undefined' && window.ResizeObserver) {
      observer = new ResizeObserver(() => {
        autoFitDocument();
      });
      observer.observe(viewportRef.current);
    }

    window.addEventListener('resize', autoFitDocument);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (observer) observer.disconnect();
      window.removeEventListener('resize', autoFitDocument);
    };
  }, [autoFitDocument]);

  // Handle Export Image
  const handleExportPNG = async () => {
    if (!docRef.current) return;
    try {
      const dataUrl = await toPng(docRef.current, { cacheBust: true, quality: 0.95 });
      const link = document.createElement('a');
      link.download = `${docData.subtitle || 'Ho-So-Ung-Tuyen'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export PNG failed:', err);
      alert('Không thể xuất ảnh! Vui lòng thử lại.');
    }
  };

  // Save to Backend API
  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: docData.subtitle, data: docData })
      });
      const resData = await response.json();
      if (resData.success) {
        alert('🎉 Đã lưu hồ sơ thành công vào Backend Server Node.js!');
      } else {
        alert('Lưu hồ sơ thất bại: ' + resData.message);
      }
    } catch (e) {
      alert('Không thể kết nối Server Backend! (Hãy chắc chắn backend server.js đang chạy trên port 5000)');
    }
  };

  const handleOpenIconPicker = (callback) => {
    setIconCallback(() => callback);
    setIsIconModalOpen(true);
  };

  const handleUpdateNote = (id, newAttrs) => {
    setDocData(prev => ({
      ...prev,
      notes: (prev.notes || []).map(n => n.id === id ? { ...n, ...newAttrs } : n)
    }));
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <HeaderNav 
        orientation={orientation}
        setOrientation={setOrientation}
        isTiltMode={isTiltMode}
        setIsTiltMode={setIsTiltMode}
        zoomScale={zoomScale}
        setZoomScale={setZoomScale}
        onAutoFit={autoFitDocument}
        onExport={handleExportPNG}
        onSaveProfile={handleSaveProfile}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
      />

      {/* Mobile Screen Navigation Segment Switcher */}
      <div className="mobile-view-toggle">
        <button 
          className={`mobile-tab-btn ${mobileView === 'editor' ? 'active' : ''}`}
          onClick={() => setMobileView('editor')}
        >
          <Edit3 size={16} />
          <span>Chỉnh Sửa</span>
        </button>
        <button 
          className={`mobile-tab-btn ${mobileView === 'preview' ? 'active' : ''}`}
          onClick={() => {
            setMobileView('preview');
            setTimeout(autoFitDocument, 100);
          }}
        >
          <Eye size={16} />
          <span>Xem Hồ Sơ</span>
        </button>
      </div>

      {/* Main Studio Body */}
      <div className="studio-body">
        {/* Left Sidebar Panel */}
        <aside className={`sidebar-panel ${mobileView === 'preview' ? 'mobile-hidden' : ''}`}>
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              <Edit3 size={18} />
              <span>Nội Dung</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
              onClick={() => setActiveTab('photo')}
            >
              <ImageIcon size={18} />
              <span>Ảnh & Dấu</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'signature' ? 'active' : ''}`}
              onClick={() => setActiveTab('signature')}
            >
              <PenTool size={18} />
              <span>Chữ Ký</span>
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'editor' && (
              <RichTextEditor 
                docData={docData}
                setDocData={setDocData}
                onOpenIconPicker={handleOpenIconPicker}
              />
            )}
            {activeTab === 'photo' && (
              <PhotoUploader 
                avatarUrl={docData.avatarUrl}
                setAvatarUrl={(url) => setDocData(prev => ({ ...prev, avatarUrl: url }))}
                stampText={docData.stampText}
                setStampText={(txt) => setDocData(prev => ({ ...prev, stampText: txt }))}
              />
            )}
            {activeTab === 'signature' && (
              <SignaturePad 
                signatureName={docData.signatureName}
                setSignatureName={(name) => setDocData(prev => ({ ...prev, signatureName: name }))}
                signatureFont={docData.signatureFont}
                setSignatureFont={(font) => setDocData(prev => ({ ...prev, signatureFont: font }))}
                signatureColor={docData.signatureColor}
                setSignatureColor={(col) => setDocData(prev => ({ ...prev, signatureColor: col }))}
                signatureSize={docData.signatureSize}
                setSignatureSize={(sz) => setDocData(prev => ({ ...prev, signatureSize: sz }))}
              />
            )}
          </div>
        </aside>

        {/* Center Live Document Viewport */}
        <main ref={viewportRef} className={`canvas-main ${mobileView === 'editor' ? 'mobile-hidden' : ''}`} style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
          <CanvasEditor 
            docRef={docRef}
            docData={docData}
            orientation={orientation}
            isTiltMode={isTiltMode}
            stampText={docData.stampText}
            zoomScale={zoomScale}
            onUpdateNote={handleUpdateNote}
          />
        </main>
      </div>

      {/* Template Selector Modal */}
      <TemplateSelector 
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={(tplData) => setDocData(tplData)}
      />

      {/* Icon Picker Modal */}
      <IconPickerModal 
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={(icon) => {
          if (iconCallback) iconCallback(icon);
        }}
      />

      {/* 3D Landscape Modal */}
      <View3DModal 
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
        docData={docData}
      />
    </div>
  );
}
