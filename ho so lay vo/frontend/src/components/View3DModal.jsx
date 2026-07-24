import React from 'react';
import { X, RotateCcw, Sparkles } from 'lucide-react';

export default function View3DModal({ isOpen, onClose, docData }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
            <Sparkles color="#ec4899" size={20} />
            Trình Chế Độ 3D Xoay Ngang Toàn Cảnh
          </h3>
          <button className="btn btn-outline" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ 
          background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', 
          borderRadius: '12px', 
          padding: '40px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          perspective: '1000px',
          minHeight: '400px'
        }}>
          <div style={{
            background: '#fffcf4',
            borderRadius: '12px',
            padding: '24px 32px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            transform: 'rotateY(-20deg) rotateX(10deg) scale(0.9)',
            transition: 'transform 0.5s ease',
            color: '#0f2b5c',
            maxWidth: '500px'
          }}>
            <h2 style={{ textAlign: 'center', color: '#0f2b5c' }}>{docData.title}</h2>
            <h1 style={{ textAlign: 'center', color: '#b91c1c', margin: '8px 0' }}>{docData.subtitle}</h1>
            <p style={{ textAlign: 'center', fontWeight: 600 }}>KÍNH GỬI: {docData.recipient}</p>
            <div style={{ margin: '16px 0', borderTop: '1px dashed #cbd5e1', paddingTop: '16px' }}>
              <div>👤 <strong>Họ tên:</strong> {docData.personalInfo?.fullname}</div>
              <div>🎂 <strong>Năm sinh:</strong> {docData.personalInfo?.birthYear}</div>
              <div>💼 <strong>Nghề nghiệp:</strong> {docData.personalInfo?.occupation}</div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: "'Dancing Script', cursive", fontSize: '2rem', color: '#0f172a' }}>
              {docData.signatureName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
