const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Store saved profiles in local JSON file
const profilesFilePath = path.join(__dirname, 'saved_profiles.json');
if (!fs.existsSync(profilesFilePath)) {
  fs.writeFileSync(profilesFilePath, JSON.stringify([]), 'utf8');
}

function getSavedProfiles() {
  try {
    const data = fs.readFileSync(profilesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveProfiles(profiles) {
  fs.writeFileSync(profilesFilePath, JSON.stringify(profiles, null, 2), 'utf8');
}

// Routes

// Root check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Ho So Backend API is running!', frontendUrl: 'http://localhost:5173' });
});

// 1. Upload photo endpoint
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Không tìm thấy file tải lên!' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({
    success: true,
    fileUrl: fileUrl,
    filename: req.file.filename
  });
});

// 2. Preset Templates Endpoint
app.get('/api/templates', (req, res) => {
  const templates = [
    {
      id: 'con-re-vip',
      name: 'Hồ Sơ Ứng Tuyển Con Rể (Bản Gốc Chuẩn)',
      category: 'Hài Hước / Đời Sống',
      badge: 'Bestseller ⭐',
      data: {
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
        statusBadge: 'TÌNH TRẠNG HỒ SƠ: ĐANG CHỜ NHÀ GÁI XÉT DUYỆT 😁',
        notes: [
          { id: 1, text: 'Ghi chú: Đã test khả năng nấu ăn 8/10!', color: '#fff3cd' }
        ]
      }
    },
    {
      id: 'ho-so-xin-phep',
      name: 'Hồ Sơ Xin Phép Đi Nhậu / Đi Chơi Vợ Duyệt',
      category: 'Gia Đình / Hài Hước',
      badge: 'Cực Hot 🔥',
      data: {
        title: 'ĐƠN XIN PHÉP',
        subtitle: 'ĐI GẶP BẠN BÈ / ĐI NHẬU',
        recipient: 'NÓC NHÀ VIỆT NAM',
        stampText: 'ĐÃ KIỂM ĐỊNH 100%',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        personalInfo: {
          fullname: '',
          birthYear: '',
          hometown: 'Việt Nam',
          occupation: ''
        },
        skills: [
          { icon: '⏰', text: 'Hứa về đúng 21h00, không trễ 1 phút.' },
          { icon: '📱', text: 'Nhắn tin báo cáo vị trí 30 phút/lần.' },
          { icon: '🥤', text: 'Chỉ uống nước suối hoặc 1-2 lon bia.' }
        ],
        benefits: [
          { icon: '🧹', text: 'Về nhà sẽ rửa hết toàn bộ bát đũa.' },
          { icon: '💆‍♂️', text: 'Massage chân cho vợ trước khi đi ngủ.' }
        ],
        commitments: [
          { icon: '🔒', text: 'Không liếc nhìn cô gái khác.' },
          { icon: '💳', text: 'Không chi quá 200k, còn thừa trả lại vợ.' }
        ],
        objective: 'Xin nóc nhà cấp phép xuất ngũ 3 tiếng buổi tối để duy trì tình bạn chiến hữu.',
        signatureName: '',
        statusBadge: 'TRẠNG THÁI: ĐANG ĐỜI NÓC NHÀ PHÊ DUYỆT 📋',
        notes: [
          { id: 1, text: 'Cam kết đi đến nơi về đến chốn!', color: '#d1e7dd' }
        ]
      }
    },
    {
      id: 'canva-business-pro',
      name: 'Hồ Sơ Doanh Nhân Canva / Adobe Professional',
      category: 'Công Việc / Premium',
      badge: 'Business Lux ✨',
      data: {
        title: 'HỒ SƠ NĂNG LỰC',
        subtitle: 'CHUYÊN VIÊN CAO CẤP',
        recipient: 'HỘI ĐỒNG TUYỂN DỤNG',
        stampText: 'ĐÃ XÁC THỰC',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        personalInfo: {
          fullname: '',
          birthYear: '',
          hometown: 'TP. Hồ Chí Minh',
          occupation: ''
        },
        skills: [
          { icon: '💼', text: 'Thiết kế hệ thống UX/UI quy mô lớn.' },
          { icon: '📊', text: 'Phân tích dữ liệu & Tối ưu kinh doanh.' },
          { icon: '🚀', text: 'Quản lý dự án Agile/Scrum chuyên nghiệp.' }
        ],
        benefits: [
          { icon: '🎯', text: 'Tăng trưởng doanh thu 150% cho đối tác.' },
          { icon: '⭐', text: 'Làm việc độc lập & quản lý team xuất sắc.' }
        ],
        commitments: [
          { icon: '🛡️', text: 'Bảo mật tuyệt đối thông tin doanh nghiệp.' },
          { icon: '⚡', text: 'Đảm bảo tiến độ và chất lượng vượt cam kết.' }
        ],
        objective: 'Cung cấp giải pháp đột phá, giúp doanh nghiệp phát triển bền vững trong kỷ nguyên số.',
        signatureName: '',
        statusBadge: 'TÌNH TRẠNG: SẴN SÀNG HỢP TÁC 🤝',
        notes: [
          { id: 1, text: 'Hồ sơ đã kiểm duyệt năm 2026', color: '#cff4fc' }
        ]
      }
    }
  ];
  res.json({ success: true, templates });
});

// 3. Save Profile API
app.post('/api/profiles', (req, res) => {
  const profileData = req.body;
  if (!profileData || !profileData.data) {
    return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ!' });
  }

  const profiles = getSavedProfiles();
  const newProfile = {
    id: 'prof-' + Date.now(),
    name: profileData.name || profileData.data.personalInfo?.fullname || 'Hồ sơ mới',
    createdAt: new Date().toISOString(),
    data: profileData.data
  };

  profiles.unshift(newProfile);
  saveProfiles(profiles);

  res.json({ success: true, message: 'Đã lưu hồ sơ thành công!', profile: newProfile });
});

// 4. Get all saved profiles
app.get('/api/profiles', (req, res) => {
  const profiles = getSavedProfiles();
  res.json({ success: true, profiles });
});

// 5. Delete saved profile
app.delete('/api/profiles/:id', (req, res) => {
  const { id } = req.params;
  let profiles = getSavedProfiles();
  profiles = profiles.filter(p => p.id !== id);
  saveProfiles(profiles);
  res.json({ success: true, message: 'Đã xóa hồ sơ thành công!' });
});

app.listen(PORT, () => {
  console.log(`Server Node.js backend đang chạy tại http://localhost:${PORT}`);
});
