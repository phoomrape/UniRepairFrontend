import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Switch,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import API from '../api/axios';

const MasterDataManagement = () => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Category Dialog State
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [catEditingId, setCatEditingId] = useState(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Location Dialog State
  const [locDialogOpen, setLocDialogOpen] = useState(false);
  const [locEditingId, setLocEditingId] = useState(null);
  const [locBuildingName, setLocBuildingName] = useState('');
  const [locDesc, setLocDesc] = useState('');

  const [dialogError, setDialogError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      setLoading(true);
      const [catRes, locRes] = await Promise.all([
        API.get('/categories?includeInactive=true'),
        API.get('/locations?includeInactive=true')
      ]);
      setCategories(catRes.data);
      setLocations(locRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลประเภทและสถานที่');
    } finally {
      setLoading(false);
    }
  };

  // Category Handlers
  const handleOpenCatCreate = () => {
    setCatEditingId(null);
    setCatName('');
    setCatDesc('');
    setDialogError('');
    setCatDialogOpen(true);
  };

  const handleOpenCatEdit = (cat) => {
    setCatEditingId(cat.id);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setDialogError('');
    setCatDialogOpen(true);
  };

  const handleSaveCat = async () => {
    if (!catName.trim()) return setDialogError('กรุณาระบุชื่อประเภทปัญหา');
    setSubmitting(true);
    try {
      if (catEditingId) {
        await API.put(`/categories/${catEditingId}`, { name: catName, description: catDesc });
      } else {
        await API.post('/categories', { name: catName, description: catDesc });
      }
      setCatDialogOpen(false);
      fetchMasterData();
    } catch (err) {
      setDialogError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกประเภทปัญหา');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCatActive = async (cat) => {
    try {
      await API.put(`/categories/${cat.id}`, { isActive: !cat.isActive });
      fetchMasterData();
    } catch (err) {
      alert('ไม่สามารถอัปเดตสถานะได้');
    }
  };

  const handleDeleteCat = async (cat) => {
    if (!window.confirm(`ลบประเภทปัญหา "${cat.name}" ใช่หรือไม่?`)) return;
    try {
      await API.delete(`/categories/${cat.id}`);
      fetchMasterData();
    } catch (err) {
      alert('ไม่สามารถลบได้ หากมีการอ้างอิงข้อมูลการแจ้งซ่อมอยู่แล้ว');
    }
  };

  // Location Handlers
  const handleOpenLocCreate = () => {
    setLocEditingId(null);
    setLocBuildingName('');
    setLocDesc('');
    setDialogError('');
    setLocDialogOpen(true);
  };

  const handleOpenLocEdit = (loc) => {
    setLocEditingId(loc.id);
    setLocBuildingName(loc.buildingName);
    setLocDesc(loc.description || '');
    setDialogError('');
    setLocDialogOpen(true);
  };

  const handleSaveLoc = async () => {
    if (!locBuildingName.trim()) return setDialogError('กรุณาระบุชื่ออาคาร/สถานที่');
    setSubmitting(true);
    try {
      if (locEditingId) {
        await API.put(`/locations/${locEditingId}`, { buildingName: locBuildingName, description: locDesc });
      } else {
        await API.post('/locations', { buildingName: locBuildingName, description: locDesc });
      }
      setLocDialogOpen(false);
      fetchMasterData();
    } catch (err) {
      setDialogError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกอาคาร/สถานที่');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLocActive = async (loc) => {
    try {
      await API.put(`/locations/${loc.id}`, { isActive: !loc.isActive });
      fetchMasterData();
    } catch (err) {
      alert('ไม่สามารถอัปเดตสถานะได้');
    }
  };

  const handleDeleteLoc = async (loc) => {
    if (!window.confirm(`ลบอาคาร "${loc.buildingName}" ใช่หรือไม่?`)) return;
    try {
      await API.delete(`/locations/${loc.id}`);
      fetchMasterData();
    } catch (err) {
      alert('ไม่สามารถลบได้ หากมีการอ้างอิงข้อมูลการแจ้งซ่อมอยู่แล้ว');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
          ⚙️ จัดการประเภทปัญหา และ อาคารสถานที่ (Master Data)
        </Typography>
        <Typography variant="body1" color="text.secondary">
          จัดการหมวดหมู่อุปกรณ์ที่รับแจ้งซ่อม และรายชื่ออาคารภายในมหาวิทยาลัย
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Categories Management Table */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ประเภทปัญหา (Categories)
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenCatCreate}
              >
                เพิ่มประเภท
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>ชื่อประเภท</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>สถานะ</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{c.description || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={c.isActive}
                          onChange={() => handleToggleCatActive(c)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary" onClick={() => handleOpenCatEdit(c)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteCat(c)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Locations Management Table */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationCityIcon color="secondary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  อาคาร / สถานที่ (Locations)
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenLocCreate}
              >
                เพิ่มอาคาร
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>ชื่ออาคาร / สถานที่</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>สถานะ</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locations.map((l) => (
                    <TableRow key={l.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{l.buildingName}</Typography>
                        <Typography variant="caption" color="text.secondary">{l.description || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={l.isActive}
                          onChange={() => handleToggleLocActive(l)}
                          size="small"
                          color="secondary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary" onClick={() => handleOpenLocEdit(l)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteLoc(l)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Category Dialog */}
      <Dialog open={catDialogOpen} onClose={() => setCatDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {catEditingId ? 'แก้ไขประเภทปัญหา' : 'เพิ่มประเภทปัญหาใหม่'}
        </DialogTitle>
        <DialogContent>
          {dialogError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{dialogError}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              required
              fullWidth
              label="ชื่อประเภทปัญหา"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="คำอธิบายเพิ่มเติม"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCatDialogOpen(false)}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleSaveCat} disabled={submitting}>
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>

      {/* Location Dialog */}
      <Dialog open={locDialogOpen} onClose={() => setLocDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {locEditingId ? 'แก้ไขข้อมูลอาคาร' : 'เพิ่มอาคาร/สถานที่ใหม่'}
        </DialogTitle>
        <DialogContent>
          {dialogError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{dialogError}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              required
              fullWidth
              label="ชื่ออาคาร / สถานที่"
              value={locBuildingName}
              onChange={(e) => setLocBuildingName(e.target.value)}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="คำอธิบายเพิ่มเติม"
              value={locDesc}
              onChange={(e) => setLocDesc(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setLocDialogOpen(false)}>ยกเลิก</Button>
          <Button variant="contained" color="secondary" onClick={handleSaveLoc} disabled={submitting}>
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MasterDataManagement;
