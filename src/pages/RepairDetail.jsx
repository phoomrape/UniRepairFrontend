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
  Chip,
  Stack,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !repair) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>{error || 'ไม่พบข้อมูล'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/repairs')}>
          กลับสู่รายการแจ้งซ่อม
        </Button>
      </Box>
    );
  }

  const isStaffOrAdmin = user?.role === 'ADMIN' || user?.role === 'STAFF';

  // Workflow timeline steps for RepairHub
  const timelineSteps = [
    { label: 'Requested (แจ้งซ่อม)', date: new Date(repair.createdAt).toLocaleString('th-TH'), done: true },
    { label: 'Received (รับเรื่อง)', date: repair.logs?.find(l => l.newStatus === 'ACCEPTED') ? 'เสร็จสิ้น' : 'รอรับเรื่อง', done: repair.status !== 'PENDING' },
    { label: 'Investigating (ตรวจสอบ)', date: 'กำลังตรวจสอบ', done: repair.status === 'IN_PROGRESS' || repair.status === 'COMPLETED' },
    { label: 'Assigned (มอบหมาย)', date: repair.technician ? repair.technician.name : 'ยังไม่มอบหมาย', done: !!repair.assignedTo },
    { label: 'In Progress (กำลังดำเนินการ)', date: repair.status === 'IN_PROGRESS' ? 'เริ่มดำเนินการ' : '-', done: repair.status === 'IN_PROGRESS' || repair.status === 'COMPLETED' },
    { label: 'Completed (เสร็จสิ้น)', date: repair.completedAt ? new Date(repair.completedAt).toLocaleString('th-TH') : '-', done: repair.status === 'COMPLETED' }
  ];

  return (
    <Box sx={{ maxWidth: 1080, margin: '0 auto', pb: 5 }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 2, fontSize: '0.85rem' }}>
        <MuiLink underline="hover" color="inherit" onClick={() => navigate('/repairs')} sx={{ cursor: 'pointer' }}>
          รายการแจ้งซ่อม
        </MuiLink>
        <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
          REQ-2023-00{repair.id}
        </Typography>
      </Breadcrumbs>

      {/* Title & Top Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -0.5, mb: 0.5 }}>
            {repair.description?.split('\n')[0] || repair.category?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            แจ้งเมื่อ: {new Date(repair.createdAt).toLocaleString('th-TH')} โดย {repair.user?.name}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          {isStaffOrAdmin && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setOpenModal(true)}
                sx={{ borderRadius: 1.5, borderColor: '#cbd5e1', color: '#334155', fontWeight: 700 }}
              >
                แก้ไข
              </Button>
              <Button
                variant="contained"
                startIcon={<BuildIcon />}
                onClick={() => setOpenModal(true)}
                sx={{ borderRadius: 1.5, bgcolor: '#1d4ed8', fontWeight: 700 }}
              >
                รับงาน
              </Button>
            </>
          )}
        </Stack>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Left Column: Details & Comments */}
        <Grid item xs={12} md={8}>
          {/* Details Card */}
          <Card sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoOutlinedIcon sx={{ color: '#1d4ed8', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  รายละเอียดงาน
                </Typography>
              </Box>
              <Chip label={repair.status} size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 800 }} />
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                  รหัสงาน (TICKET ID)
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  REQ-2023-00{repair.id}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                  หมวดหมู่ (CATEGORY)
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {repair.category?.name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                  สถานที่ (LOCATION)
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {repair.location?.buildingName}, ห้อง {repair.room}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                  ระดับความสำคัญ (PRIORITY)
                </Typography>
                <Chip label="ปานกลาง (Medium)" size="small" color="warning" sx={{ fontWeight: 700, height: 22, fontSize: '0.72rem' }} />
              </Grid>
            </Grid>

            {/* Description Box */}
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.8 }}>
              รายละเอียดปัญหา (DESCRIPTION)
            </Typography>
            <Paper variant="outlined" sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {repair.description}
              </Typography>
            </Paper>

            {/* Technician info */}
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.8 }}>
              ช่างผู้รับผิดชอบ (ASSIGNED TECH)
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', width: 36, height: 36, fontWeight: 700, fontSize: '0.85rem' }}>
                {repair.technician?.name?.charAt(0) || 'T'}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {repair.technician ? repair.technician.name : 'ยังไม่มอบหมายช่าง'}
                </Typography>
              </Box>
            </Stack>
          </Card>

          {/* Work logs & Comments */}
          <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <ModeCommentOutlinedIcon sx={{ color: '#1d4ed8', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                บันทึกการปฏิบัติงาน & ความคิดเห็น
              </Typography>
            </Box>

            <Stack direction="column" spacing={2}>
              {repair.logs?.map((log) => (
                <Paper key={log.id} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700 }}>
                      {log.user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        {log.user?.name} ({log.user?.role})
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(log.createdAt).toLocaleString('th-TH')}
                      </Typography>
                    </Box>
                    <Chip label={log.newStatus} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                  </Box>

                  <Typography variant="body2" sx={{ color: '#334155', mt: 1 }}>
                    {log.note || 'อัปเดตสถานะงานซ่อม'}
                  </Typography>

                  {/* Attached photo preview */}
                  {repair.image && (
                    <Box sx={{ mt: 1.5 }}>
                      <Paper variant="outlined" sx={{ p: 1, display: 'inline-block', borderRadius: 1.5 }}>
                        <Box
                          component="img"
                          src={repair.image}
                          alt="Attached preview"
                          onClick={() => setPhotoOpen(true)}
                          sx={{ width: 140, height: 100, objectFit: 'cover', borderRadius: 1, cursor: 'pointer' }}
                        />
                      </Paper>
                    </Box>
                  )}
                </Paper>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Right Column: Actions Control & Progress Timeline */}
        <Grid item xs={12} md={4}>
          {/* Actions Box */}
          <Card sx={{ p: 2.5, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
              จัดการสถานะ
            </Typography>

            <Stack direction="column" spacing={1.5}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AccessTimeOutlinedIcon />}
                onClick={() => { setNewStatus('ACCEPTED'); setOpenModal(true); }}
                sx={{ borderRadius: 1.5, py: 1, borderColor: '#cbd5e1', color: '#334155', fontWeight: 700 }}
              >
                รับเรื่อง / รอดำเนินการ
              </Button>
              <Button
                variant="outlined"
                fullWidth
                color="success"
                startIcon={<CheckCircleOutlinedIcon />}
                onClick={() => { setNewStatus('COMPLETED'); setOpenModal(true); }}
                sx={{ borderRadius: 1.5, py: 1, fontWeight: 700 }}
              >
                ซ่อมเสร็จแล้ว
              </Button>
              <Button
                variant="outlined"
                fullWidth
                color="error"
                startIcon={<HighlightOffOutlinedIcon />}
                onClick={() => { setNewStatus('CANCELLED'); setOpenModal(true); }}
                sx={{ borderRadius: 1.5, py: 1, fontWeight: 700 }}
              >
                ยกเลิกคำร้อง
              </Button>
            </Stack>
          </Card>

          {/* Progress Timeline */}
          <Card sx={{ p: 2.5, borderRadius: 4, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <TimelineOutlinedIcon sx={{ color: '#1d4ed8', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                ความคืบหน้า (Timeline)
              </Typography>
            </Box>

            <Stack direction="column" spacing={2.5} sx={{ position: 'relative', pl: 1 }}>
              {timelineSteps.map((step, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      bgcolor: step.done ? '#1d4ed8' : '#e2e8f0',
                      color: step.done ? '#ffffff' : '#64748b'
                    }}
                  >
                    {idx + 1}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: step.done ? '#0f172a' : '#94a3b8' }}>
                      {step.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {step.date}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Action Dialog Modal for Staff/Admin */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, bgcolor: '#1d4ed8', color: '#ffffff' }}>
          จัดการสถานะและมอบหมายช่างซ่อม
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
              placeholder="ระบุรายละเอียดเพิ่มเติม"
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
            sx={{ fontWeight: 700, px: 3, bgcolor: '#1d4ed8' }}
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
