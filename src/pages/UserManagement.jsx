import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ROLE_OPTIONS = [
  { value: 'USER', label: 'นักศึกษา / บุคลากร (USER)', color: 'info' },
  { value: 'STAFF', label: 'เจ้าหน้าที่ / ช่างซ่อม (STAFF)', color: 'secondary' },
  { value: 'ADMIN', label: 'ผู้ดูแลระบบ (ADMIN)', color: 'error' },
];

const UserManagement = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('USER');
  const [status, setStatus] = useState('ACTIVE');
  const [password, setPassword] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedUserId(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole('USER');
    setStatus('ACTIVE');
    setPassword('');
    setDialogError('');
    setOpenDialog(true);
  };

  const handleOpenEdit = (user) => {
    setIsEditing(true);
    setSelectedUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    setRole(user.role);
    setStatus(user.status);
    setPassword('');
    setDialogError('');
    setOpenDialog(true);
  };

  const handleSaveUser = async () => {
    setDialogError('');

    if (!name || !email) {
      return setDialogError('กรุณากรอกชื่อและอีเมล');
    }

    if (!isEditing && !password) {
      return setDialogError('กรุณากำหนดรหัสผ่านสำหรับผู้ใช้ใหม่');
    }

    setSubmitting(true);

    try {
      if (isEditing) {
        await API.put(`/users/${selectedUserId}`, {
          name,
          email,
          phone,
          role,
          status,
          password
        });
      } else {
        await API.post('/users', {
          name,
          email,
          phone,
          role,
          status,
          password
        });
      }

      setOpenDialog(false);
      fetchUsers();
    } catch (err) {
      setDialogError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกผู้ใช้งาน');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.id === currentUser?.id) {
      alert('ไม่สามารถลบบัญชีของตนเองที่กำลังใช้งานอยู่ได้');
      return;
    }
    if (!window.confirm(`คุณต้องการลบผู้ใช้ "${user.name}" ใช่หรือไม่?`)) return;

    try {
      await API.delete(`/users/${user.id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน');
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.id === currentUser?.id) {
      alert('ไม่สามารถเปลี่ยนสถานะบัญชีตนเองได้');
      return;
    }
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await API.put(`/users/${user.id}`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      alert('ไม่สามารถเปลี่ยนสถานะผู้ใช้งานได้');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
            👥 จัดการบัญชีผู้ใช้งาน (User Management)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            สำหรับ Admin เพิ่ม แก้ไข ลบ กำหนดสิทธิ์ และเปิด/ปิดการใช้งานบัญชี
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenCreate}
          sx={{ fontWeight: 700, py: 1.2, px: 2.5 }}
        >
          + เพิ่มผู้ใช้งานใหม่
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: 70 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ชื่อ - นามสกุล</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>อีเมล</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>เบอร์ติดต่อ</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>สิทธิ์ (Role)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>สถานะ</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>การจัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  ไม่พบข้อมูลผู้ใช้งาน
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>#{u.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role}
                      size="small"
                      color={u.role === 'ADMIN' ? 'error' : u.role === 'STAFF' ? 'secondary' : 'info'}
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={u.status === 'ACTIVE'}
                          onChange={() => handleToggleStatus(u)}
                          color="success"
                          size="small"
                        />
                      }
                      label={u.status === 'ACTIVE' ? 'เปิดใช้งาน' : 'ระงับใช้งาน'}
                      componentsProps={{ typography: { fontSize: '0.8rem', fontWeight: 600 } }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="แก้ไขข้อมูล">
                      <IconButton color="primary" onClick={() => handleOpenEdit(u)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="ลบผู้ใช้">
                      <IconButton color="error" onClick={() => handleDeleteUser(u)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, bgcolor: 'primary.main', color: '#ffffff' }}>
          {isEditing ? '✏️ แก้ไขข้อมูลผู้ใช้งาน' : '➕ เพิ่มผู้ใช้งานใหม่'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {dialogError && <Alert severity="error" sx={{ mb: 2 }}>{dialogError}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              required
              fullWidth
              label="ชื่อ - นามสกุล"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              required
              fullWidth
              type="email"
              label="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              label="เบอร์โทรศัพท์ติดต่อ"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <TextField
              select
              fullWidth
              label="สิทธิ์ผู้ใช้งาน (Role)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLE_OPTIONS.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="สถานะบัญชี"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="ACTIVE">ACTIVE (เปิดใช้งาน)</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE (ระงับการใช้งาน)</MenuItem>
            </TextField>

            <TextField
              fullWidth
              type="password"
              label={isEditing ? 'เปลี่ยนรหัสผ่าน (เว้นว่างหากไม่ต้องการเปลี่ยน)' : 'รหัสผ่าน'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveUser}
            disabled={submitting}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
