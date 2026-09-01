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
  Chip,
  Stack,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN' || user.role === 'STAFF') {
        navigate('/dashboard');
      } else {
        navigate('/repairs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
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
          maxWidth: 920,
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
              p: { xs: 3, sm: 4 },
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
                    borderRadius: 2,
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
                ระบบแจ้งซ่อมและติดตามสถานะ
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 4, lineHeight: 1.6 }}>
                ยกระดับการให้บริการซ่อมบำรุงอุปกรณ์และอาคารสถานที่ภายในมหาวิทยาลัย ด้วยระบบดิจิทัลที่ทันสมัย
              </Typography>

              <Stack direction="column" spacing={2.5}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <CheckCircleOutlineIcon sx={{ color: '#60a5fa', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      ติดตามสถานะแบบ Real-time
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      อัปเดตความก้าวหน้าการปฏิบัติงานของช่างทุกขั้นตอน
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <CheckCircleOutlineIcon sx={{ color: '#60a5fa', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      มอบหมายงานและวิเคราะห์สถิติ
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      สำหรับเจ้าหน้าที่และผู้บริหารในการบริหารจัดการภาพรวม
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
            <Box sx={{ display: { xs: 'block', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ bgcolor: '#1d4ed8', width: 40, height: 40, borderRadius: 2 }}>
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
                เข้าสู่ระบบ (Sign In)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                กรอกข้อมูลบัญชีเพื่อเข้าใช้งานระบบแจ้งซ่อม UniFix
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 1.5 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, display: 'block' }}>
                ชื่อผู้ใช้งาน หรือ อีเมล *
              </Typography>
              <TextField
                margin="dense"
                required
                fullWidth
                id="email"
                placeholder="เช่น admin@university.ac.th หรือ student"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 1.5,
                    bgcolor: '#ffffff',
                    fontSize: '0.9rem',
                    '& input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
                      WebkitTextFillColor: '#0f172a !important',
                    }
                  }
                }}
                sx={{ mb: 2 }}
              />

              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, display: 'block' }}>
                รหัสผ่าน *
              </Typography>
              <TextField
                margin="dense"
                required
                fullWidth
                name="password"
                placeholder="กรอกรหัสผ่าน"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
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
                    borderRadius: 1.5,
                    bgcolor: '#ffffff',
                    fontSize: '0.9rem',
                    '& input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
                      WebkitTextFillColor: '#0f172a !important',
                    }
                  }
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                      sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#1d4ed8' } }}
                    />
                  }
                  label={<Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#64748b' }}>จำฉันไว้ในระบบ</Typography>}
                />
                <Link to="#" style={{ color: '#1d4ed8', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                  ลืมรหัสผ่าน?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.3,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: 1.5,
                  bgcolor: '#1d4ed8',
                  '&:hover': { bgcolor: '#1e40af' },
                  boxShadow: '0 4px 14px rgba(29, 78, 216, 0.3)'
                }}
              >
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </Button>
            </Box>

            {/* Quick Demo Login Accounts */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #f1f5f9' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 1.2 }}>
                🔑 บัญชีทดสอบระบบ (คลิกเพื่อเลือกเติมข้อมูล):
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip
                  label="Admin"
                  size="small"
                  color="error"
                  clickable
                  onClick={() => handleQuickLogin('admin@university.ac.th', 'admin123')}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label="Officer (officer1)"
                  size="small"
                  color="warning"
                  clickable
                  onClick={() => handleQuickLogin('officer1@university.ac.th', 'Officer@123')}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label="Agency (agency1)"
                  size="small"
                  color="success"
                  clickable
                  onClick={() => handleQuickLogin('agency1@university.ac.th', 'Agency@123')}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label="Student"
                  size="small"
                  color="primary"
                  clickable
                  onClick={() => handleQuickLogin('student@university.ac.th', 'user123')}
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
            </Box>

            <Divider sx={{ my: 2.5, borderColor: '#f1f5f9' }} />

            {/* Register Link */}
            <Box sx={{ textCenter: 'center', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ยังไม่มีบัญชีผู้ใช้งาน?{' '}
                <Link to="/register" style={{ color: '#1d4ed8', fontWeight: 700, textDecoration: 'none' }}>
                  สมัครสมาชิกใหม่ที่นี่
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default Login;
