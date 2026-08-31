import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CreateRepair = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingMaster, setLoadingMaster] = useState(true);

  const [categoryId, setCategoryId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      setLoadingMaster(true);
      const [catRes, locRes] = await Promise.all([
        API.get('/categories'),
        API.get('/locations')
      ]);
      setCategories(catRes.data);
      setLocations(locRes.data);
      if (catRes.data.length > 0) setCategoryId(catRes.data[0].id);
      if (locRes.data.length > 0) setLocationId(locRes.data[0].id);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลประเภทปัญหาหรือสถานที่ได้');
    } finally {
      setLoadingMaster(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!categoryId || !locationId || !room.trim() || !description.trim()) {
      return setError('กรุณากรอกข้อมูลให้ครบถ้วนทุกช่องที่มีเครื่องหมาย *');
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('categoryId', categoryId);
      formData.append('locationId', locationId);
      formData.append('room', room.trim());
      formData.append('description', description.trim());
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await API.post('/repairs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/repairs');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการส่งคำขอแจ้งซ่อม');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingMaster) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
          📝 ฟอร์มแจ้งซ่อมอุปกรณ์ / อาคารสถานที่
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ระบุรายละเอียดอุปกรณ์ที่ชำรุดและสถานที่เพื่อให้เจ้าหน้าที่เข้าตรวจสอบและดำเนินการ
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>ส่งข้อมูลแจ้งซ่อมสำเร็จ! กำลังนำท่านไปยังหน้ารายการ...</Alert>}

      <Card sx={{ p: { xs: 2, sm: 3 } }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ชื่อผู้แจ้ง"
                  value={user?.name || ''}
                  disabled
                  helperText="อ้างอิงจากบัญชีผู้ใช้งานที่เข้าสู่ระบบ"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="เบอร์โทรศัพท์ติดต่อ"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เช่น 081-234-5678"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  required
                  label="ประเภทปัญหา"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  required
                  label="อาคาร / สถานที่"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc.id} value={loc.id}>
                      {loc.buildingName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="ระบุห้อง / บริเวณที่พบปัญหา"
                  placeholder="เช่น ห้องเรียน CB102, ห้องน้ำชั้น 2, โต๊ะหน้าห้องแล็บ"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="อธิบายรายละเอียดปัญหา"
                  placeholder="ระบุอาการชำรุด ลักษณะความเสียหาย หรือรายละเอียดอื่นๆ ที่เป็นประโยชน์ต่อช่าง"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  แนบรูปภาพประกอบ (ถ้ามี - รองรับ JPG, PNG ขนาดไม่เกิน 5MB)
                </Typography>

                {!imagePreview ? (
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      py: 3,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      borderColor: 'grey.400',
                      bgcolor: '#f8fafc',
                      color: 'text.secondary',
                      '&:hover': { bgcolor: '#f1f5f9', borderColor: 'primary.main' }
                    }}
                  >
                    คลิกหรือเลือกไฟล์รูปภาพที่นี่
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </Button>
                ) : (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      bgcolor: '#f8fafc',
                      position: 'relative'
                    }}
                  >
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 2 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                        {imageFile?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(imageFile?.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                    <IconButton color="error" onClick={handleRemoveImage}>
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                )}
              </Grid>

              <Grid item xs={12} sx={{ mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={submitting}
                  startIcon={<SendIcon />}
                  sx={{ py: 1.5, fontSize: '1.05rem', fontWeight: 700 }}
                >
                  {submitting ? 'กำลังส่งข้อมูล...' : 'ส่งคำขอแจ้งซ่อม'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateRepair;
