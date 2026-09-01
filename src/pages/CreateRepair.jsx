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
  Paper,
  Divider,
  Stack,
  Avatar
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
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
  const [priority, setPriority] = useState('Medium');
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
      if (file.size > 10 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 10MB');
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
    <Box sx={{ maxWidth: 860, margin: '0 auto', pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -0.5, mb: 0.5 }}>
          Create New Request
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please fill in the details below to submit a new maintenance or repair ticket.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 1.5 }}>ส่งข้อมูลแจ้งซ่อมสำเร็จ! กำลังนำท่านไปยังหน้ารายการ...</Alert>}

      <Card sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Box component="form" onSubmit={handleSubmit}>

          {/* Section 1: Basic Information */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <InfoOutlinedIcon sx={{ color: '#1d4ed8', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                Basic Information
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, display: 'block' }}>
              หัวข้อ (Subject) *
            </Typography>
            <TextField
              fullWidth
              required
              placeholder="e.g., Leaking AC Unit in Meeting Room A"
              value={description.split('\n')[0] || ''}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2.5 }}
              InputProps={{ sx: { borderRadius: 1.5, bgcolor: '#ffffff' } }}
            />

            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, display: 'block' }}>
              รายละเอียด (Description)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Provide detailed information about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputProps={{ sx: { borderRadius: 1.5, bgcolor: '#ffffff' } }}
            />
          </Box>

          <Divider sx={{ mb: 4, borderColor: '#f1f5f9' }} />

          {/* Section 2: Classification & Location */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CategoryOutlinedIcon sx={{ color: '#1d4ed8', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Classification
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, display: 'block' }}>
                ประเภท (Category)
              </Typography>
              <TextField
                select
                fullWidth
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                sx={{ mb: 2.5 }}
                InputProps={{ sx: { borderRadius: 1.5 } }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>

              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, display: 'block' }}>
                ความเร่งด่วน (Priority)
              </Typography>
              <Stack direction="row" spacing={1}>
                {['Low', 'Medium', 'High'].map((p) => (
                  <Button
                    key={p}
                    variant={priority === p ? 'contained' : 'outlined'}
                    onClick={() => setPriority(p)}
                    sx={{
                      flex: 1,
                      borderRadius: 1.5,
                      py: 1,
                      fontWeight: 700,
                      borderColor: '#e2e8f0',
                      color: priority === p ? '#ffffff' : '#64748b',
                      bgcolor: priority === p ? '#1d4ed8' : '#ffffff',
                      '&:hover': { bgcolor: priority === p ? '#1e40af' : '#f8fafc' }
                    }}
                  >
                    {p}
                  </Button>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOnOutlinedIcon sx={{ color: '#1d4ed8', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Location & Schedule
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, display: 'block' }}>
                สถานที่/อาคาร (Building)
              </Typography>
              <TextField
                select
                fullWidth
                required
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                sx={{ mb: 2.5 }}
                InputProps={{ sx: { borderRadius: 1.5 } }}
              >
                {locations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>
                    {loc.buildingName}
                  </MenuItem>
                ))}
              </TextField>

              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, display: 'block' }}>
                ห้อง/บริเวณ (Room)
              </Typography>
              <TextField
                fullWidth
                required
                placeholder="e.g., Floor 3, Room 304"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                InputProps={{ sx: { borderRadius: 1.5 } }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 4, borderColor: '#f1f5f9' }} />

          {/* Section 3: Attachments Upload Dropzone */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AttachFileOutlinedIcon sx={{ color: '#1d4ed8', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                Attachments
              </Typography>
            </Box>

            {!imagePreview ? (
              <Box
                component="label"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                  border: '2px dashed #cbd5e1',
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#f1f5f9', borderColor: '#1d4ed8' }
                }}
              >
                <Avatar sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', mb: 1.5, width: 48, height: 48 }}>
                  <CloudUploadOutlinedIcon />
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  SVG, PNG, JPG or PDF (max. 10MB)
                </Typography>
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Box>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  bgcolor: '#f8fafc',
                  borderRadius: 2
                }}
              >
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{ width: 100, height: 75, objectFit: 'cover', borderRadius: 1.5 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
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
          </Box>

          {/* Form Footer Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pt: 2 }}>
            <Button
              variant="text"
              onClick={() => navigate('/repairs')}
              sx={{ color: '#64748b', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              sx={{ borderRadius: 1.5, borderColor: '#cbd5e1', color: '#334155', fontWeight: 700 }}
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={<SendIcon />}
              sx={{
                borderRadius: 1.5,
                px: 3,
                py: 1,
                bgcolor: '#1d4ed8',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(29, 78, 216, 0.3)'
              }}
            >
              {submitting ? 'กำลังส่งข้อมูล...' : 'Submit Request'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default CreateRepair;
