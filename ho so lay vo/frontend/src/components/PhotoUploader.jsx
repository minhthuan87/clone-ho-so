import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Stamp, Sparkles } from 'lucide-react';

export default function PhotoUploader({ avatarUrl, setAvatarUrl, stampText, setStampText }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Use FormData to send to backend API
    const formData = new FormData();
    formData.append('photo', file);

    setIsUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setAvatarUrl(data.fileUrl);
      } else {
        // Fallback to FileReader if server upload fails
        const reader = new FileReader();
        reader.onload = (event) => setAvatarUrl(event.target.result);
        reader.readAsDataURL(file);
      }
    } catch (error) {
      // Fallback local reader
      const reader = new FileReader();
      reader.onload = (event) => setAvatarUrl(event.target.result);
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const sampleAvatars = [
    { label: 'Nam thanh niên 1', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80' },
    { label: 'Nam thanh niên 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
    { label: 'Nữ quý cô', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { label: 'Phong cách Hàn Quốc', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ImageIcon size={16} color="#f43f5e" />
          <span>Tải Ảnh Chân Dung / Avatar</span>
        </label>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleFileChange} 
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-primary" 
            style={{ flex: 1 }} 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload size={16} />
            <span>{isUploading ? 'Đang tải...' : 'Tải Ảnh Mới...'}</span>
          </button>
        </div>
      </div>

      {/* Preset Avatar Selection */}
      <div className="form-group">
        <label className="form-label">Hoặc chọn ảnh mẫu nhanh:</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {sampleAvatars.map((item, idx) => (
            <img 
              key={idx}
              src={item.url} 
              alt={item.label}
              onClick={() => setAvatarUrl(item.url)}
              style={{
                width: '100%',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '6px',
                cursor: 'pointer',
                border: avatarUrl === item.url ? '2px solid #f43f5e' : '1px solid #334155'
              }} 
            />
          ))}
        </div>
      </div>

      {/* Custom Red Stamp Overlay Text */}
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Stamp size={16} color="#ef4444" />
          <span>Chữ Đóng Dấu Đỏ Trên Ảnh</span>
        </label>
        <input 
          type="text" 
          className="form-input" 
          value={stampText} 
          onChange={(e) => setStampText(e.target.value)} 
          placeholder="VD: ỨNG VIÊN TIỀM NĂNG, ĐÃ PHÊ DUYỆT..." 
        />
      </div>

      <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', fontSize: '0.8rem', color: '#94a3b8' }}>
        💡 <strong>Mẹo:</strong> Bạn có thể ghi chú thêm các dấu chìm hoặc đính kẹp kim loại trên góc ảnh để tăng độ hài hước!
      </div>
    </div>
  );
}
