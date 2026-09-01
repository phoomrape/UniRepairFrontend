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
  CircularProgress,
  Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StatusBadge from '../components/StatusBadge';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const MyHistory = () => {
  const navigate = useNavigate();

  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyRepairs();
  }, []);

  const fetchMyRepairs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/repairs?myHistory=true');
      setRepairs(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดประวัติแจ้งซ่อม');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
          🕒 ประวัติการแจ้งซ่อมของฉัน
        </Typography>
        <Typography variant="body1" color="text.secondary">
          รายการคำขอแจ้งซ่อมทั้งหมดที่คุณเคยส่งเข้าระบบ
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: 90 }}>เลขที่</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ประเภทปัญหา</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>สถานที่ / ห้อง</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>วันที่แจ้งซ่อม</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>สถานะ</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>การจัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : repairs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  ท่านยังไม่มีประวัติการแจ้งซ่อมในระบบ
                </TableCell>
              </TableRow>
            ) : (
              repairs.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    #{r.id.toString().padStart(4, '0')}
                  </TableCell>
                  <TableCell>
                    <Chip label={r.category?.name} size="small" variant="outlined" sx={{ color: 'primary.main', fontWeight: 600 }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.location?.buildingName}</Typography>
                    <Typography variant="caption" color="text.secondary">ห้อง: {r.room}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem' }}>
                    {new Date(r.createdAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/repairs/${r.id}`)}
                    >
                      ดูรายละเอียด
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyHistory;
