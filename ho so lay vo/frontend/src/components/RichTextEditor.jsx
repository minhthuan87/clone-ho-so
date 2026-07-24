import React from 'react';
import { Plus, Trash2, Edit3, Heart, Award, ShieldCheck, Target, StickyNote, Smile } from 'lucide-react';

export default function RichTextEditor({
  docData,
  setDocData,
  onOpenIconPicker
}) {
  // Helpers to update nested objects
  const updatePersonalInfo = (field, value) => {
    setDocData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateListItem = (listName, index, field, value) => {
    setDocData(prev => {
      const newList = [...(prev[listName] || [])];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, [listName]: newList };
    });
  };

  const addListItem = (listName, defaultIcon = '✨') => {
    setDocData(prev => ({
      ...prev,
      [listName]: [...(prev[listName] || []), { icon: defaultIcon, text: 'Nội dung mục mới' }]
    }));
  };

  const removeListItem = (listName, index) => {
    setDocData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  const addStickyNote = () => {
    const colors = ['#fff3cd', '#d1e7dd', '#f8d7da', '#cff4fc'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setDocData(prev => ({
      ...prev,
      notes: [...(prev.notes || []), { id: Date.now(), text: 'Ghi chú thêm...', color: randomColor }]
    }));
  };

  const removeStickyNote = (id) => {
    setDocData(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
  };

  const updateStickyNote = (id, text) => {
    setDocData(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? { ...n, text } : n)
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Header Titles */}
      <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
        <h4 style={{ color: '#f43f5e', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Edit3 size={16} /> Standard Document Headers
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="form-group">
            <label className="form-label">Tiêu đề chính:</label>
            <input 
              type="text" 
              className="form-input" 
              value={docData.title || ''} 
              onChange={e => setDocData(prev => ({ ...prev, title: e.target.value }))} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tiêu đề phụ:</label>
            <input 
              type="text" 
              className="form-input" 
              value={docData.subtitle || ''} 
              onChange={e => setDocData(prev => ({ ...prev, subtitle: e.target.value }))} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Kính gửi:</label>
            <input 
              type="text" 
              className="form-input" 
              value={docData.recipient || ''} 
              onChange={e => setDocData(prev => ({ ...prev, recipient: e.target.value }))} 
            />
          </div>
        </div>
      </div>

      {/* 2. Personal Info Fields */}
      <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
        <h4 style={{ color: '#38bdf8', marginBottom: '10px' }}>👤 Thông Tin Thân Nhân</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="form-group">
            <label className="form-label">Họ và tên:</label>
            <input 
              type="text" 
              className="form-input" 
              value={docData.personalInfo?.fullname || ''} 
              onChange={e => updatePersonalInfo('fullname', e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Năm sinh:</label>
            <input 
              type="text" 
              className="form-input" 
              value={docData.personalInfo?.birthYear || ''} 
              onChange={e => updatePersonalInfo('birthYear', e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Hộ khẩu:</label>
            <input 
              type="text" 
              className="form-input" 
              value={docData.personalInfo?.hometown || ''} 
              onChange={e => updatePersonalInfo('hometown', e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nghề nghiệp:</label>
            <input 
              type="text" 
              className="form-input" 
              value={docData.personalInfo?.occupation || ''} 
              onChange={e => updatePersonalInfo('occupation', e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* 3. Kỹ Năng Nổi Bật */}
      <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} /> Kỹ Năng Nổi Bật
          </h4>
          <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => addListItem('skills', '🍺')}>
            <Plus size={14} /> Thêm
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(docData.skills || []).map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 8px' }} 
                onClick={() => onOpenIconPicker((newIcon) => updateListItem('skills', idx, 'icon', newIcon))}
              >
                {item.icon}
              </button>
              <input 
                type="text" 
                className="form-input" 
                value={item.text} 
                onChange={e => updateListItem('skills', idx, 'text', e.target.value)} 
              />
              <button className="btn btn-outline" style={{ padding: '6px', color: '#ef4444' }} onClick={() => removeListItem('skills', idx)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Chế Độ Đãi Ngộ */}
      <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} /> Chế Độ Đãi Ngộ
          </h4>
          <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => addListItem('benefits', '✅')}>
            <Plus size={14} /> Thêm
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(docData.benefits || []).map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 8px' }} 
                onClick={() => onOpenIconPicker((newIcon) => updateListItem('benefits', idx, 'icon', newIcon))}
              >
                {item.icon}
              </button>
              <input 
                type="text" 
                className="form-input" 
                value={item.text} 
                onChange={e => updateListItem('benefits', idx, 'text', e.target.value)} 
              />
              <button className="btn btn-outline" style={{ padding: '6px', color: '#ef4444' }} onClick={() => removeListItem('benefits', idx)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Cam Kết */}
      <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Heart size={16} /> Cam Kết
          </h4>
          <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => addListItem('commitments', '🔴')}>
            <Plus size={14} /> Thêm
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(docData.commitments || []).map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 8px' }} 
                onClick={() => onOpenIconPicker((newIcon) => updateListItem('commitments', idx, 'icon', newIcon))}
              >
                {item.icon}
              </button>
              <input 
                type="text" 
                className="form-input" 
                value={item.text} 
                onChange={e => updateListItem('commitments', idx, 'text', e.target.value)} 
              />
              <button className="btn btn-outline" style={{ padding: '6px', color: '#ef4444' }} onClick={() => removeListItem('commitments', idx)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Mục Tiêu & Chữ Ký */}
      <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
        <h4 style={{ color: '#a78bfa', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={16} /> Mục Tiêu & Tên Chữ Ký
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="form-group">
            <label className="form-label">Mục tiêu:</label>
            <textarea 
              className="form-textarea" 
              rows={3}
              value={docData.objective || ''} 
              onChange={e => setDocData(prev => ({ ...prev, objective: e.target.value }))} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tên người ký (Chữ viết tay):</label>
            <input 
              type="text" 
              className="form-input" 
              value={docData.signatureName || ''} 
              onChange={e => setDocData(prev => ({ ...prev, signatureName: e.target.value }))} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái hồ sơ (Dưới chân trang):</label>
            <input 
              type="text" 
              className="form-input" 
              value={docData.statusBadge || ''} 
              onChange={e => setDocData(prev => ({ ...prev, statusBadge: e.target.value }))} 
            />
          </div>
        </div>
      </div>

      {/* 7. Sticky Notes */}
      <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ color: '#facc15', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <StickyNote size={16} /> Ghi Chú Giấy Nhớ (Sticky Notes)
          </h4>
          <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={addStickyNote}>
            <Plus size={14} /> Thêm Giấy Nhớ
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(docData.notes || []).map((note) => (
            <div key={note.id} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input 
                type="text" 
                className="form-input" 
                value={note.text} 
                onChange={e => updateStickyNote(note.id, e.target.value)} 
              />
              <button className="btn btn-outline" style={{ padding: '6px', color: '#ef4444' }} onClick={() => removeStickyNote(note.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
