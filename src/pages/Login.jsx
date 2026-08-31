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
  Chip,
  Stack,
  InputAdornment,
  IconButton
} from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e1b4b 100%)',
        p: 2
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
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
              bgcolor: 'primary.main',
              width: 56,
              height: 56,
              margin: '0 auto 12px',
              boxShadow: '0 4px 14px rgba(30, 58, 138, 0.4)'
            }}
          >
            <BuildCircleIcon sx={{ fontSize: 36 }} />
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
            ระบบแจ้งซ่อมมหาวิทยาลัย
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            เข้าสู่ระบบเพื่อแจ้งซ่อมหรือติดตามสถานะการดำเนินการ
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, textAlign: 'left', borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ textAlign: 'left' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="อีเมล / Username"
              name="email"
              autoComplete="email"
              autoFocus
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
              margin="normal"
              required
              fullWidth
              name="password"
              label="รหัสผ่าน"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.4, fontSize: '1rem', fontWeight: 700 }}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>

            <Box sx={{ textCenter: 'center', mt: 1, mb: 3 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                ยังไม่มีบัญชีผู้ใช้?{' '}
                <Link to="/register" style={{ color: '#1e3a8a', fontWeight: 600, textDecoration: 'none' }}>
                  สมัครสมาชิกที่นี่
                </Link>
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" icon={false} sx={{ textAlign: 'left', borderRadius: 2, bgcolor: '#f0f9ff' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1, color: '#0369a1' }}>
              🔑 บัญชีสำหรับทดสอบระบบ (คลิกเพื่อเลือก):
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip
                label="Admin (admin / admin123)"
                size="small"
                color="error"
                clickable
                onClick={() => handleQuickLogin('admin@university.ac.th', 'admin123')}
              />
              <Chip
                label="Officer (officer1 / Officer@123)"
                size="small"
                color="warning"
                clickable
                onClick={() => handleQuickLogin('officer1@university.ac.th', 'Officer@123')}
              />
              <Chip
                label="Agency (agency1 / Agency@123)"
                size="small"
                color="success"
                clickable
                onClick={() => handleQuickLogin('agency1@university.ac.th', 'Agency@123')}
              />
              <Chip
                label="Staff (staff / staff123)"
                size="small"
                color="secondary"
                clickable
                onClick={() => handleQuickLogin('staff@university.ac.th', 'staff123')}
              />
              <Chip
                label="Student (student / user123)"
                size="small"
                color="primary"
                clickable
                onClick={() => handleQuickLogin('student@university.ac.th', 'user123')}
              />
            </Stack>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
