import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import API from '../api/axios';

const COLORS = ['#1e3a8a', '#0d9488', '#d97706', '#8b5cf6', '#ec4899', '#64748b'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/stats/dashboard');
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล Dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const { summary, topCategory, topLocation, categoryStats, locationStats, monthlyStats } = stats || {};

  const kpiCards = [
    {
      title: 'รายการแจ้งซ่อมทั้งหมด',
      value: summary?.total || 0,
      icon: <BuildIcon sx={{ fontSize: 32, color: '#1e3a8a' }} />,
      bgColor: '#eff6ff',
      borderColor: '#3b82f6'
    },
    {
      title: 'รอดำเนินการ',
      value: summary?.pending || 0,
      icon: <PendingActionsIcon sx={{ fontSize: 32, color: '#d97706' }} />,
      bgColor: '#fef3c7',
      borderColor: '#f59e0b'
    },
    {
      title: 'กำลังดำเนินการ / รออะไหล่',
      value: (summary?.inProgress || 0) + (summary?.accepted || 0) + (summary?.waitingParts || 0),
      icon: <HourglassTopIcon sx={{ fontSize: 32, color: '#7c3aed' }} />,
      bgColor: '#f3e8ff',
      borderColor: '#8b5cf6'
    },
    {
      title: 'ซ่อมเสร็จเรียบร้อย',
      value: summary?.completed || 0,
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 32, color: '#059669' }} />,
      bgColor: '#d1fae5',
      borderColor: '#10b981'
    },
    {
      title: 'ยกเลิก',
      value: summary?.cancelled || 0,
      icon: <CancelOutlinedIcon sx={{ fontSize: 32, color: '#dc2626' }} />,
      bgColor: '#fee2e2',
      borderColor: '#ef4444'
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
          📊 แดชบอร์ดภาพรวมการแจ้งซ่อม
        </Typography>
        <Typography variant="body1" color="text.secondary">
          สรุปข้อมูลทางสถิติจริงจากระบบแจ้งซ่อมและติดตามสถานะภายในมหาวิทยาลัย
        </Typography>
      </Box>

      {/* KPI Cards Grid */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {kpiCards.map((kpi, idx) => (
          <Grid item xs={12} sm={6} md={2.4} key={idx}>
            <Card
              sx={{
                bgcolor: kpi.bgColor,
                borderLeft: `5px solid ${kpi.borderColor}`,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {kpi.title}
                  </Typography>
                  <Avatar sx={{ bgcolor: 'transparent', width: 44, height: 44 }}>
                    {kpi.icon}
                  </Avatar>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {kpi.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Top Highlights */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5, borderLeft: '6px solid #1e3a8a' }}>
            <Avatar sx={{ bgcolor: '#eff6ff', width: 56, height: 56 }}>
              <CategoryIcon sx={{ fontSize: 32, color: '#1e3a8a' }} />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                ประเภทปัญหาที่พบมากที่สุด
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {topCategory ? `${topCategory.name} (${topCategory.count} รายการ)` : 'ไม่มีข้อมูล'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5, borderLeft: '6px solid #0d9488' }}>
            <Avatar sx={{ bgcolor: '#f0fdf4', width: 56, height: 56 }}>
              <LocationOnIcon sx={{ fontSize: 32, color: '#0d9488' }} />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                อาคารที่มีการแจ้งซ่อมมากที่สุด
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                {topLocation ? `${topLocation.buildingName} (${topLocation.count} รายการ)` : 'ไม่มีข้อมูล'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Monthly Trend Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: 420 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              📈 แนวโน้มการแจ้งซ่อมและงานที่สำเร็จรายเดือน
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="count" name="แจ้งซ่อมทั้งหมด" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" name="ซ่อมเสร็จแล้ว" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Category Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: 420 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              🍕 สัดส่วนตามประเภทปัญหา
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <ResponsiveContainer width="100%" height={310}>
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {categoryStats?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value, name) => [`${value} รายการ`, name]} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
