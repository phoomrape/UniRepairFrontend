import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  Stack,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
    }

    if (password.length < 6) {
      return setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    }

    setLoading(true);

    try {
      await register(name, email, password, phone);
      navigate('/repairs');
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8fafc',
        p: { xs: 2, sm: 3 }
      }}
    >
      <Card
        sx={{
          maxWidth: 940,
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
          bgcolor: '#ffffff',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        <Grid container>
          {/* Left Hero Section */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
              color: '#ffffff',
              p: { xs: 3, sm: 4.5 },
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justify: 'space-between'
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Avatar
                  sx={{
                    bgcolor: '#ffffff',
                    color: '#1d4ed8',
                    width: 44,
                    height: 44,
                    borderRadius: 3,
                    boxShadow: '0 4px 14px rgba(255,255,255,0.2)'
                  }}
                >
                  <ConstructionIcon sx={{ fontSize: 26 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, color: '#ffffff' }}>
                    RepairHub
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#93c5fd', fontWeight: 600 }}>
                    Management System
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, lineHeight: 1.3, letterSpacing: -0.5 }}>
                ลงทะเบียนเข้าใช้งาน
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 4, lineHeight: 1.6 }}>
                สร้างบัญชีผู้ใช้งานใหม่สำหรับนักศึกษาและบุคลากรเพื่อแจ้งซ่อมอุปกรณ์และอาคารสถานที่
              </Typography>

              <Stack direction="column" spacing={2.5}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <CheckCircleOutlineIcon sx={{ color: '#60a5fa', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      ส่งคำขอแจ้งซ่อมรวดเร็ว
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      กรอกข้อมูลสถานที่พร้อมแนบรูปภาพความเสียหาย
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <CheckCircleOutlineIcon sx={{ color: '#60a5fa', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      แจ้งเตือนความก้าวหน้า
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      รับการแจ้งเตือนทันทีเมื่อช่างเข้าดำเนินการหรือซ่อมเสร็จ
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Typography variant="caption" sx={{ color: '#64748b', pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              © 2026 UniFix RepairHub. All rights reserved.
            </Typography>
          </Grid>

          {/* Right Form Section */}
          <Grid item xs={12} md={7} sx={{ p: { xs: 3, sm: 4.5 } }}>
            {/* Mobile Header */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ bgcolor: '#1d4ed8', width: 40, height: 40, borderRadius: 2.5 }}>
                <ConstructionIcon sx={{ fontSize: 24, color: '#ffffff' }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  RepairHub
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Management System
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -0.5, mb: 0.5 }}>
                สมัครสมาชิกใหม่ (Register)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                กรอกรายละเอียดด้านล่างเพื่อสร้างบัญชีผู้ใช้งานระบบแจ้งซ่อม
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.5, display: 'block' }}>
                    ชื่อ - นามสกุล *
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    placeholder="เช่น นายรักเรียน ขยันยิ่ง"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2.5,
                        bgcolor: '#ffffff',
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
                          WebkitTextFillColor: '#0f172a !important',
                        }
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.5, display: 'block' }}>
                    อีเมลมหาวิทยาลัย *
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    type="email"
                    placeholder="student@university.ac.th"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2.5,
                        bgcolor: '#ffffff',
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
                          WebkitTextFillColor: '#0f172a !important',
                        }
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.5, display: 'block' }}>
                    เบอร์โทรศัพท์ติดต่อ
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="081-234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2.5,
                        bgcolor: '#ffffff',
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
                          WebkitTextFillColor: '#0f172a !important',
                        }
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.5, display: 'block' }}>
                    รหัสผ่าน *
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                            {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2.5,
                        bgcolor: '#ffffff',
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
                          WebkitTextFillColor: '#0f172a !important',
                        }
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.5, display: 'block' }}>
                    ยืนยันรหัสผ่าน *
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2.5,
                        bgcolor: '#ffffff',
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
                          WebkitTextFillColor: '#0f172a !important',
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<PersonAddOutlinedIcon />}
                sx={{
                  mt: 3.5,
                  py: 1.2,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  bgcolor: '#1d4ed8',
                  '&:hover': { bgcolor: '#1e40af' },
                  boxShadow: '0 4px 14px rgba(29, 78, 216, 0.3)'
                }}
              >
                {loading ? 'กำลังลงทะเบียน...' : 'ยืนยันลงทะเบียน'}
              </Button>
            </Box>

            <Divider sx={{ my: 3, borderColor: '#f1f5f9' }} />

            {/* Login Link */}
            <Box sx={{ textCenter: 'center', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                มีบัญชีผู้ใช้งานอยู่แล้ว?{' '}
                <Link to="/login" style={{ color: '#1d4ed8', fontWeight: 700, textDecoration: 'none' }}>
                  เข้าสู่ระบบที่นี่
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default Register;
