import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  Skeleton,
  IconButton,
  Tooltip
} from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
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
  Cell
} from 'recharts';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = ['#3b82f6', '#0284c7', '#d97706', '#10b981', '#ef4444', '#64748b'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentRepairs, setRecentRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, repairsRes] = await Promise.all([
        API.get('/stats/dashboard'),
        API.get('/repairs?limit=5')
      ]);
      setStats(statsRes.data);
      setRecentRepairs(repairsRes.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูล Dashboard ได้');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  // Skeleton Loading State
  if (loading && !refreshing) {
    return (
      <Box sx={{ pb: 4 }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Skeleton variant="text" width={200} height={36} />
            <Skeleton variant="text" width={320} height={20} />
          </Box>
          <Skeleton variant="rounded" width={120} height={36} sx={{ borderRadius: 1.5 }} />
        </Box>

        {/* KPI Cards Skeleton */}
        <Grid container spacing={2} sx={{ mb: 3.5 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
              <Skeleton variant="rounded" height={110} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>

        {/* Charts Skeleton */}
        <Grid container spacing={3} sx={{ mb: 3.5 }}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>

        {/* Table Skeleton */}
        <Skeleton variant="rounded" height={280} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchStats} sx={{ fontWeight: 700 }}>
              ลองอีกครั้ง
            </Button>
          }
          sx={{ borderRadius: 1.5, mb: 3, textAlign: 'left' }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const { summary, categoryStats, monthlyStats } = stats || {};
  const totalCount = summary?.total || 0;

  // Compact KPI Cards configuration
  const kpiCards = [
    {
      title: 'งานทั้งหมด',
      value: totalCount,
      subtitle: 'คำร้องทั้งหมดในระบบ',
      icon: <AssignmentOutlinedIcon sx={{ color: '#0f172a', fontSize: 22 }} />,
      bgColor: '#f1f5f9',
      color: '#0f172a'
    },
    {
      title: 'งานใหม่',
      value: summary?.pending || 0,
      subtitle: 'รอเจ้าหน้าที่รับเรื่อง',
      icon: <NewReleasesOutlinedIcon sx={{ color: '#1d4ed8', fontSize: 22 }} />,
      bgColor: '#eff6ff',
      color: '#1d4ed8'
    },
    {
      title: 'กำลังดำเนินการ',
      value: (summary?.inProgress || 0) + (summary?.accepted || 0),
      subtitle: 'อยู่ระหว่างซ่อมแซม',
      icon: <MoreHorizOutlinedIcon sx={{ color: '#0284c7', fontSize: 22 }} />,
      bgColor: '#e0f2fe',
      color: '#0284c7'
    },
    {
      title: 'รออะไหล่',
      value: summary?.waitingParts || 0,
      subtitle: 'รอจัดซื้อ/สั่งอะไหล่',
      icon: <HourglassEmptyOutlinedIcon sx={{ color: '#d97706', fontSize: 22 }} />,
      bgColor: '#fef3c7',
      color: '#d97706'
    },
    {
      title: 'เสร็จสิ้น',
      value: summary?.completed || 0,
      subtitle: 'ซ่อมแซมสมบูรณ์แล้ว',
      icon: <CheckCircleOutlinedIcon sx={{ color: '#059669', fontSize: 22 }} />,
      bgColor: '#dcfce7',
      color: '#059669'
    },
    {
      title: 'เกินกำหนด',
      value: summary?.overdue || 0,
      subtitle: 'เกินระยะเวลา SLA',
      icon: <WarningAmberOutlinedIcon sx={{ color: '#dc2626', fontSize: 22 }} />,
      bgColor: '#ffe4e6',
      color: '#dc2626'
    }
  ];

  // Donut chart status data
  const statusDonutData = [
    { name: 'งานใหม่', count: summary?.pending || 0, color: '#1d4ed8' },
    { name: 'กำลังดำเนินการ', count: (summary?.inProgress || 0) + (summary?.accepted || 0), color: '#0284c7' },
    { name: 'รออะไหล่', count: summary?.waitingParts || 0, color: '#d97706' },
    { name: 'เสร็จสิ้น', count: summary?.completed || 0, color: '#10b981' },
    { name: 'ยกเลิก', count: summary?.cancelled || 0, color: '#64748b' }
  ].filter(item => item.count > 0);

  return (
    <Box sx={{ pb: 4, maxWidth: 1280, margin: '0 auto' }}>
      {/* Dashboard Header */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -0.5, mb: 0.3 }}
          >
            แดชบอร์ด (Dashboard)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ภาพรวมข้อมูลการแจ้งซ่อมและสถานะการดำเนินงานระบบ UniFix
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip
            icon={<CalendarTodayOutlinedIcon sx={{ fontSize: '14px !important' }} />}
            label="ข้อมูล ณ ปัจจุบัน"
            size="small"
            variant="outlined"
            sx={{ borderRadius: 2, color: '#64748b', borderColor: '#e2e8f0', bgcolor: '#ffffff', fontWeight: 600 }}
          />

          <Tooltip title="รีเฟรชข้อมูล">
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 1.5,
                '&:hover': { bgcolor: '#f8fafc' }
              }}
            >
              <RefreshIcon sx={{ fontSize: 20, color: '#475569', animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>

          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={() => navigate('/repairs')}
            sx={{
              borderRadius: 1.5,
              borderColor: '#cbd5e1',
              color: '#334155',
              fontWeight: 700,
              px: 2,
              py: 0.8
            }}
          >
            ดูรายงาน
          </Button>
        </Stack>
      </Box>

      {/* 6 Compact KPI Cards System */}
      <Grid container spacing={2} sx={{ mb: 3.5 }}>
        {kpiCards.map((kpi, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={idx}>
            <Card
              sx={{
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                boxShadow: 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 8px 20px -5px rgba(0,0,0,0.06)',
                  borderColor: '#cbd5e1',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.78rem' }}
                  >
                    {kpi.title}
                  </Typography>
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: kpi.bgColor,
                      borderRadius: 2
                    }}
                  >
                    {kpi.icon}
                  </Avatar>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: kpi.color, fontSize: '1.75rem', mb: 0.3 }}>
                  {kpi.value.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block' }}>
                  {kpi.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Chart 1: Periodic Repair Trend */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              boxShadow: 'none',
              height: '100%',
              minHeight: 380
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                แนวโน้มการแจ้งซ่อม (สถิติรายเดือน)
              </Typography>
              <Chip label="6 เดือนล่าสุด" size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 700, fontSize: '0.75rem' }} />
            </Box>

            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={monthlyStats} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="count" name="แจ้งซ่อมทั้งหมด" fill="#1d4ed8" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Chart 2: Requests by Status Donut Chart */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              boxShadow: 'none',
              height: '100%',
              minHeight: 380,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
              สัดส่วนงานตามสถานะ
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                position: 'relative'
              }}
            >
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={statusDonutData.length > 0 ? statusDonutData : [{ name: 'ไม่มีข้อมูล', count: 1, color: '#cbd5e1' }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="name"
                  >
                    {(statusDonutData.length > 0 ? statusDonutData : [{ color: '#cbd5e1' }]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val, name) => [`${val} รายการ`, name]} />
                </PieChart>
              </ResponsiveContainer>

              {/* Donut Center Count */}
              <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                  {totalCount.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  งานทั้งหมด
                </Typography>
              </Box>
            </Box>

            {/* Status Breakdown Legend */}
            <Stack direction="column" spacing={1} sx={{ mt: 1, pt: 1, borderTop: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#1d4ed8' }} />
                  งานใหม่ (Pending)
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{summary?.pending || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#0284c7' }} />
                  กำลังดำเนินการ (In Progress)
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{(summary?.inProgress || 0) + (summary?.accepted || 0)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#d97706' }} />
                  รออะไหล่ (Waiting Parts)
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{summary?.waitingParts || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                  เสร็จสิ้น (Completed)
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{summary?.completed || 0}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Repairs Table Section */}
      <Card sx={{ p: 0, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f1f5f9'
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
            รายการแจ้งซ่อมล่าสุด
          </Typography>
          <Button
            size="small"
            onClick={() => navigate('/repairs')}
            endIcon={<ArrowForwardIcon />}
            sx={{ textTransform: 'none', color: '#1d4ed8', fontWeight: 700 }}
          >
            ดูทั้งหมด
          </Button>
        </Box>

        {recentRepairs.length === 0 ? (
          /* Empty State */
          <Box sx={{ py: 6, textCenter: 'center', textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#f1f5f9', color: '#94a3b8', width: 54, height: 54, margin: '0 auto', mb: 1.5 }}>
              <InboxOutlinedIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 0.5 }}>
              ยังไม่มีข้อมูลการแจ้งซ่อมในระบบ
            </Typography>
            <Typography variant="caption" color="text.secondary">
              เมื่อมีการแจ้งซ่อมเข้ามา ข้อมูลรายการล่าสุดจะถูกนำมาแสดงที่นี่
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>เลขที่คำร้อง</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>หัวข้อ / ปัญหา</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>หมวดหมู่</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>ผู้แจ้ง</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>วันที่แจ้ง</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>ความสำคัญ</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>สถานะ</TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>การจัดการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentRepairs.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1d4ed8' }}>
                      REQ-2023-00{item.id}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                      {item.description?.slice(0, 40) || 'ไม่มีหัวข้อ'}...
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.82rem', color: '#475569' }}>
                      <Chip label={item.category?.name || 'ทั่วไป'} size="small" variant="outlined" sx={{ fontWeight: 600, height: 22, fontSize: '0.72rem' }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.82rem', color: '#475569' }}>
                      {item.user?.name || '-'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {new Date(item.createdAt).toLocaleDateString('th-TH')}
                    </TableCell>
                    <TableCell>
                      <Chip label="ปานกลาง" size="small" color="warning" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/repairs/${item.id}`)}
                        sx={{ borderRadius: 2, bgcolor: '#1d4ed8', fontSize: '0.75rem', py: 0.3 }}
                      >
                        รายละเอียด
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};

export default Dashboard;
