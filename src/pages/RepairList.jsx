import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
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
  TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
            📋 รายการแจ้งซ่อมทั้งหมด
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ค้นหา กรอง และติดตามสถานะคำขอแจ้งซ่อมภายในมหาวิทยาลัย
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/create-repair')}
          sx={{ py: 1.2, px: 3, fontWeight: 700 }}
        >
          + แจ้งซ่อมใหม่
        </Button>
      </Box>

      {/* Filter Card */}
      <Card sx={{ p: 2.5, mb: 3, bgcolor: '#ffffff' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="ค้นหา (ผู้แจ้ง, ปัญหา, ห้อง...)"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="สถานะ"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(0); }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="ประเภทปัญหา"
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setPage(0); }}
            >
              <MenuItem value="">ทุกประเภท</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="สถานที่ / อาคาร"
              value={locationId}
              onChange={(e) => { setLocationId(e.target.value); setPage(0); }}
            >
              <MenuItem value="">ทุกอาคาร</MenuItem>
              {locations.map((l) => (
                <MenuItem key={l.id} value={l.id}>
                  {l.buildingName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={1.5}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              color="inherit"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              sx={{ py: 0.9 }}
            >
              ล้างกรอง
            </Button>
          </Grid>
        </Grid>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Table Container */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: 80 }}>เลขที่</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ผู้แจ้ง</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ประเภทปัญหา</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>สถานที่ / ห้อง</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>วันที่แจ้ง</TableCell>
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
            ) : repairs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  ไม่พบข้อมูลรายการแจ้งซ่อมตามเงื่อนไข
                </TableCell>
              </TableRow>
            ) : (
              repairs.map((r) => (
                <TableRow key={r.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    #{r.id.toString().padStart(4, '0')}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.user?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.user?.phone || r.user?.email}</Typography>
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
                    <Tooltip title="ดูรายละเอียด & อัปเดตสถานะ">
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/repairs/${r.id}`)}
                        sx={{ borderRadius: 2, fontSize: '0.8rem' }}
                      >
                        รายละเอียด
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="จำนวนต่อหน้า:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
        />
      </TableContainer>
    </Box>
  );
};

export default RepairList;
