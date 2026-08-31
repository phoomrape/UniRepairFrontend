import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  InputAdornment,
  IconButton
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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

    setLoading(true);

    try {
      await register(name, email, password, phone);
      navigate('/repairs');
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e1b4b 100%)',
        p: 2
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          width: '100%',
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          bgcolor: '#ffffff'
        }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
              width: 56,
              height: 56,
              margin: '0 auto 12px',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)'
            }}
          >
            <PersonAddIcon sx={{ fontSize: 32 }} />
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
            สมัครสมาชิกใหม่
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            สำหรับนักศึกษาและบุคลากรเพื่อเข้าใช้งานระบบแจ้งซ่อม
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, textAlign: 'left', borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ textAlign: 'left' }}>
            <TextField
              margin="dense"
              required
              fullWidth
              id="name"
              label="ชื่อ - นามสกุล"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="dense"
              required
              fullWidth
              id="email"
              label="อีเมลมหาวิทยาลัย"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="dense"
              fullWidth
              id="phone"
              label="เบอร์โทรศัพท์ติดต่อ"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="dense"
              required
              fullWidth
              name="password"
              label="รหัสผ่าน"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              margin="dense"
              required
              fullWidth
              name="confirmPassword"
              label="ยืนยันรหัสผ่าน"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              color="secondary"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.4, fontSize: '1rem', fontWeight: 700 }}
            >
              {loading ? 'กำลังลงทะเบียน...' : 'ยืนยันลงทะเบียน'}
            </Button>

            <Box sx={{ textCenter: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                มีบัญชีผู้ใช้งานแล้ว?{' '}
                <Link to="/login" style={{ color: '#0d9488', fontWeight: 600, textDecoration: 'none' }}>
                  เข้าสู่ระบบ
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
