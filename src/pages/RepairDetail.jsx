import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Divider,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import CancelIcon from '@mui/icons-material/Cancel';
import StatusBadge, { STATUS_CONFIG } from '../components/StatusBadge';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const RepairDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [staffUsers, setStaffUsers] = useState([]);

  // Action Modal State
  const [openModal, setOpenModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [note, setNote] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);

  // Photo Dialog Modal
  const [photoOpen, setPhotoOpen] = useState(false);

  useEffect(() => {
    fetchDetail();
    if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
      fetchStaffList();
    }
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/repairs/${id}`);
      setRepair(res.data);
      setNewStatus(res.data.status);
      setAssignedTo(res.data.assignedTo || '');
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลการแจ้งซ่อมได้');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffList = async () => {
    try {
      const res = await API.get('/users?role=STAFF');
      setStaffUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setActionSubmitting(true);
      await API.put(`/repairs/${id}/status`, {
        status: newStatus,
        assignedTo: assignedTo ? parseInt(assignedTo) : null,
        note
      });
      setOpenModal(false);
      setNote('');
      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleCancelByStudent = async () => {
    if (!window.confirm('คุณต้องการยกเลิกคำขอแจ้งซ่อมนี้ใช่หรือไม่?')) return;
    try {
      await API.put(`/repairs/${id}/cancel`, { note: 'ผู้แจ้งซ่อมยกเลิกรายการด้วยตนเอง' });
      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'ไม่สามารถยกเลิกคำขอได้');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !repair) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>{error || 'ไม่พบข้อมูล'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/repairs')}>
          กลับสู่รายการแจ้งซ่อม
        </Button>
      </Box>
    );
  }

  const isStaffOrAdmin = user?.role === 'ADMIN' || user?.role === 'STAFF';
  const isOwner = user?.id === repair.userId;

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/repairs')} color="inherit">
          ย้อนกลับ
        </Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {isStaffOrAdmin && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => setOpenModal(true)}
              sx={{ fontWeight: 700 }}
            >
              จัดการสถานะ & มอบหมายงาน
            </Button>
          )}

          {isOwner && repair.status === 'PENDING' && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleCancelByStudent}
              sx={{ fontWeight: 700 }}
            >
              ยกเลิกคำขอ
            </Button>
          )}
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column: Repair Details */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>
                  คำขอแจ้งซ่อม #{repair.id.toString().padStart(4, '0')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {repair.category?.name}
                </Typography>
              </Box>
              <StatusBadge status={repair.status} size="medium" />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <PersonIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      ข้อมูลผู้แจ้ง
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{repair.user?.name}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    อีเมล: {repair.user?.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    เบอร์ติดต่อ: {repair.user?.phone || 'ไม่ได้ระบุ'}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <LocationOnIcon color="secondary" fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      สถานที่และห้อง
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{repair.location?.buildingName}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    ห้อง: {repair.room}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    วันที่แจ้ง: {new Date(repair.createdAt).toLocaleString('th-TH')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Description */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              รายละเอียดปัญหาที่แจ้ง:
            </Typography>
            <Paper variant="outlined" sx={{ p: 2.5, bgcolor: '#ffffff', mb: 3 }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {repair.description}
              </Typography>
            </Paper>

            {/* Attached Photo */}
            {repair.image && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  รูปภาพประกอบปัญหา:
                </Typography>
                <Box
                  component="img"
                  src={repair.image}
                  alt="Repair photo"
                  onClick={() => setPhotoOpen(true)}
                  sx={{
                    width: '100%',
                    maxHeight: 280,
                    objectFit: 'cover',
                    borderRadius: 3,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.01)' }
                  }}
                />
                <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 0.5 }}>
                  (คลิกที่รูปภาพเพื่อขยายใหญ่)
                </Typography>
              </Box>
            )}

            {/* Assigned Technician */}
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BuildIcon sx={{ color: '#059669' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    ผู้รับผิดชอบการซ่อม:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#047857' }}>
                    {repair.technician ? `${repair.technician.name} (${repair.technician.phone || repair.technician.email})` : 'ยังไม่ได้มอบหมายช่างซ่อม'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Card>
        </Grid>

        {/* Right Column: Interactive Stepper Timeline & Logs */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
              ⏱️ Timeline ประวัติการดำเนินงาน
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stepper orientation="vertical" activeStep={repair.logs?.length - 1 || 0}>
              {repair.logs?.map((log, index) => {
                const config = STATUS_CONFIG[log.newStatus] || {};
                return (
                  <Step key={log.id} active expanded>
                    <StepLabel
                      StepIconComponent={() => (
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: config.bgColor || '#e2e8f0',
                            color: config.color || '#475569',
                            fontSize: '0.8rem',
                            fontWeight: 700
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      )}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {config.label || log.newStatus}
                        </Typography>
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Paper variant="outlined" sx={{ p: 1.5, my: 1, bgcolor: '#f8fafc', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.5 }}>
                          {log.note || 'ไม่มีหมายเหตุ'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          โดย: {log.user?.name} ({log.user?.role})
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          เวลา: {new Date(log.createdAt).toLocaleString('th-TH')}
                        </Typography>
                      </Paper>
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>
          </Card>
        </Grid>
      </Grid>

      {/* Action Dialog Modal for Staff/Admin */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, bgcolor: 'primary.main', color: '#ffffff' }}>
          ⚙️ จัดการสถานะและมอบหมายช่างซ่อม
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              select
              fullWidth
              label="เปลี่ยนสถานะงานซ่อม"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="PENDING">รอดำเนินการ</MenuItem>
              <MenuItem value="ACCEPTED">รับเรื่องแล้ว</MenuItem>
              <MenuItem value="IN_PROGRESS">กำลังดำเนินการ</MenuItem>
              <MenuItem value="WAITING_PARTS">รออะไหล่</MenuItem>
              <MenuItem value="COMPLETED">ซ่อมเสร็จแล้ว</MenuItem>
              <MenuItem value="CANCELLED">ยกเลิก</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="มอบหมายช่างผู้รับผิดชอบ"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <MenuItem value="">-- ไม่ระบุ / ยกเลิกการมอบหมาย --</MenuItem>
              {staffUsers.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name} ({s.phone || s.email})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="หมายเหตุการซ่อม / รายละเอียดการเปลี่ยนสถานะ"
              placeholder="เช่น เข้าตรวจสอบแล้วพบแอร์รั่ว สั่งซื้ออะไหล่คอยล์เย็น หรือ ซ่อมแซมระบบไฟเรียบร้อย"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateStatus}
            disabled={actionSubmitting}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {actionSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Expanded Photo Dialog */}
      <Dialog open={photoOpen} onClose={() => setPhotoOpen(false)} maxWidth="md">
        <DialogContent sx={{ p: 1, textAlign: 'center', bgcolor: '#000000' }}>
          <Box
            component="img"
            src={repair.image}
            alt="Expanded repair photo"
            sx={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RepairDetail;
