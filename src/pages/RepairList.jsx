import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Button,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  InputAdornment,
  TablePagination,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  Stack
} from '@mui/material';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import StatusBadge from '../components/StatusBadge';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = [
  { value: '', label: 'ทุกสถานะ' },
  { value: 'PENDING', label: 'รอดำเนินการ' },
  { value: 'ACCEPTED', label: 'รับเรื่องแล้ว' },
  { value: 'IN_PROGRESS', label: 'กำลังดำเนินการ' },
  { value: 'WAITING_PARTS', label: 'รออะไหล่' },
  { value: 'COMPLETED', label: 'ซ่อมเสร็จแล้ว' },
  { value: 'CANCELLED', label: 'ยกเลิก' },
];

const RepairList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [viewMode, setViewMode] = useState('board'); // 'board' or 'list'
  const [repairs, setRepairs] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [locationId, setLocationId] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    fetchRepairs();
  }, [search, status, categoryId, locationId, page, rowsPerPage]);

  const fetchMasterData = async () => {
    try {
      const [catRes, locRes] = await Promise.all([
        API.get('/categories'),
        API.get('/locations')
      ]);
      setCategories(catRes.data);
      setLocations(locRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search,
        status,
        categoryId,
        locationId
      };
      const res = await API.get('/repairs', { params });
      setRepairs(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดรายการแจ้งซ่อม');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setCategoryId('');
    setLocationId('');
    setPage(0);
  };

  // Filter repairs into board columns
  const unassignedRepairs = repairs.filter(r => r.status === 'PENDING');
  const pendingReviewRepairs = repairs.filter(r => r.status === 'ACCEPTED' || r.status === 'WAITING_PARTS');
  const inProgressRepairs = repairs.filter(r => r.status === 'IN_PROGRESS');

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header Bar with View Toggle */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -0.5, mb: 0.5 }}>
            การจัดการงาน (Assignment Management)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            บริหารจัดการและมอบหมายงานซ่อมบำรุง
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, val) => val && setViewMode(val)}
            size="small"
            sx={{ bgcolor: '#f1f5f9', p: 0.5, borderRadius: 1.5 }}
          >
            <ToggleButton value="board" sx={{ borderRadius: 1, px: 2, fontWeight: 700, '&.Mui-selected': { bgcolor: '#ffffff', color: '#1d4ed8', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } }}>
              <ViewKanbanOutlinedIcon sx={{ fontSize: 18, mr: 0.8 }} /> บอร์ด
            </ToggleButton>
            <ToggleButton value="list" sx={{ borderRadius: 1, px: 2, fontWeight: 700, '&.Mui-selected': { bgcolor: '#ffffff', color: '#1d4ed8', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } }}>
              <FormatListBulletedOutlinedIcon sx={{ fontSize: 18, mr: 0.8 }} /> รายการ
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            onClick={() => navigate('/create-repair')}
            sx={{ borderRadius: 1.5, px: 2.5, fontWeight: 700, bgcolor: '#1d4ed8' }}
          >
            + New Request
          </Button>
        </Stack>
      </Box>

      {/* Search Filter Bar */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="ค้นหาคำร้อง..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 1.5, bgcolor: '#f8fafc' }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="สถานะ"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(0); }}
              InputProps={{ sx: { borderRadius: 1.5 } }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="หมวดหมู่"
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setPage(0); }}
              InputProps={{ sx: { borderRadius: 1.5 } }}
            >
              <MenuItem value="">ทุกหมวดหมู่</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              size="medium"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              sx={{ borderRadius: 1.5, borderColor: '#cbd5e1', color: '#64748b' }}
            >
              ล้างกรอง
            </Button>
          </Grid>
        </Grid>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>{error}</Alert>}

      {/* BOARD VIEW (Kanban Columns) */}
      {viewMode === 'board' ? (
        <Grid container spacing={2.5}>
          {/* Column 1: Unassigned / PENDING */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', minHeight: 500 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  ยังไม่มอบหมาย
                </Typography>
                <Chip label={unassignedRepairs.length} size="small" sx={{ bgcolor: '#e2e8f0', fontWeight: 800 }} />
              </Box>

              <Stack direction="column" spacing={2}>
                {unassignedRepairs.map((item) => (
                  <Card
                    key={item.id}
                    onClick={() => navigate(`/repairs/${item.id}`)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { boxShadow: '0 8px 20px -5px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip label={`REQ-2023-0${item.id}`} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }} />
                      <Chip label="สูง" size="small" color="error" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                    </Box>

                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                      {item.description?.slice(0, 40)}...
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                      {item.location?.buildingName} ห้อง {item.room}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #f1f5f9' }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                        <Typography variant="caption" color="text.secondary">วันนี้</Typography>
                      </Stack>
                      <Button size="small" variant="contained" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontSize: '0.72rem', fontWeight: 700, py: 0.3 }}>
                        มอบหมาย
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Column 2: Pending Review / ACCEPTED */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', minHeight: 500 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  รอดำเนินการ
                </Typography>
                <Chip label={pendingReviewRepairs.length} size="small" sx={{ bgcolor: '#e2e8f0', fontWeight: 800 }} />
              </Box>

              <Stack direction="column" spacing={2}>
                {pendingReviewRepairs.map((item) => (
                  <Card
                    key={item.id}
                    onClick={() => navigate(`/repairs/${item.id}`)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { boxShadow: '0 8px 20px -5px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip label={`REQ-2023-0${item.id}`} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }} />
                      <Chip label="ปกติ" size="small" color="warning" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                    </Box>

                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                      {item.description?.slice(0, 40)}...
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                      {item.location?.buildingName} ห้อง {item.room}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #f1f5f9' }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: '#3b82f6' }}>
                          {item.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                          {item.user?.name?.split(' ')[0]}
                        </Typography>
                      </Stack>
                    </Box>
                  </Card>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Column 3: In Progress / IN_PROGRESS */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', minHeight: 500 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  กำลังดำเนินการ
                </Typography>
                <Chip label={inProgressRepairs.length} size="small" sx={{ bgcolor: '#e2e8f0', fontWeight: 800 }} />
              </Box>

              <Stack direction="column" spacing={2}>
                {inProgressRepairs.map((item) => (
                  <Card
                    key={item.id}
                    onClick={() => navigate(`/repairs/${item.id}`)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      borderLeft: '4px solid #1d4ed8',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { boxShadow: '0 8px 20px -5px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip label={`REQ-2023-0${item.id}`} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, bgcolor: '#eff6ff', color: '#1d4ed8' }} />
                      <Chip label="ปกติ" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                    </Box>

                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                      {item.description?.slice(0, 40)}...
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                      {item.location?.buildingName} ห้อง {item.room}
                    </Typography>
                  </Card>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        /* LIST VIEW TABLE */
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>ผู้แจ้ง</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>หมวดหมู่</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>สถานที่ / ห้อง</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>วันที่แจ้ง</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>สถานะ</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#64748b' }}>จัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : repairs.map((r) => (
                <TableRow key={r.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1d4ed8' }}>REQ-2023-00{r.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{r.user?.name}</TableCell>
                  <TableCell><Chip label={r.category?.name} size="small" variant="outlined" /></TableCell>
                  <TableCell>{r.location?.buildingName} ({r.room})</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem' }}>{new Date(r.createdAt).toLocaleDateString('th-TH')}</TableCell>
                  <TableCell><StatusBadge status={r.status} size="small" /></TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="contained" onClick={() => navigate(`/repairs/${r.id}`)} sx={{ borderRadius: 2, bgcolor: '#1d4ed8' }}>
                      ดูงาน
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default RepairList;
