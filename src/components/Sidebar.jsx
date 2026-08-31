import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
  Chip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import FormatListBulletIcon from '@mui/icons-material/FormatListBulleted';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 260;

const Sidebar = ({ open, onClose, isMobile }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const role = user?.role || 'USER';

  const navItems = [
    ...(role === 'ADMIN' || role === 'STAFF'
      ? [{ label: 'แดชบอร์ดสรุปผล', icon: <DashboardIcon />, path: '/dashboard' }]
      : []),
    { label: 'แจ้งซ่อมอุปกรณ์', icon: <AddCircleOutlineIcon />, path: '/create-repair' },
    {
      label: role === 'USER' ? 'ติดตามการแจ้งซ่อม' : 'รายการแจ้งซ่อมทั้งหมด',
      icon: <FormatListBulletIcon />,
      path: '/repairs'
    },
    { label: 'ประวัติแจ้งซ่อมของฉัน', icon: <HistoryIcon />, path: '/my-history' },
    ...(role === 'ADMIN'
      ? [
          { label: 'จัดการผู้ใช้งาน', icon: <PeopleIcon />, path: '/users', isAdmin: true },
          { label: 'จัดการประเภท/สถานที่', icon: <CategoryIcon />, path: '/master-data', isAdmin: true }
        ]
      : [])
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <Box sx={{ p: 2.5 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1 }}>
          เมนูหลัก
        </Typography>
      </Box>

      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? '#ffffff' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.main' : 'rgba(30, 58, 138, 0.08)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#ffffff',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#ffffff' : 'primary.main',
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 600 : 500
                  }}
                />
                {item.isAdmin && (
                  <Chip label="Admin" size="small" color="error" variant={isActive ? "filled" : "outlined"} sx={{ height: 20, fontSize: '0.65rem' }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, m: 2, bgcolor: '#f1f5f9', borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          UniRepair v1.0.0
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
          ระบบแจ้งซ่อมสำหรับโปรเจคจบ
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: '1px solid #e2e8f0',
            backgroundColor: '#ffffff'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
