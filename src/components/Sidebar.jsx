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
  Avatar,
  IconButton
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 250;

const Sidebar = ({ open, onClose, isMobile }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const role = user?.role || 'USER';

  const navItems = [
    ...(role === 'ADMIN' || role === 'STAFF'
      ? [{ label: 'แดชบอร์ด', icon: <DashboardOutlinedIcon />, path: '/dashboard' }]
      : []),
    {
      label: 'รายการแจ้งซ่อม',
      icon: <BuildCircleOutlinedIcon />,
      path: '/repairs'
    },
    { label: 'ประวัติแจ้งซ่อมของฉัน', icon: <BarChartOutlinedIcon />, path: '/my-history' },
    { label: 'การแจ้งเตือน', icon: <NotificationsNoneOutlinedIcon />, path: '/notifications' },
    ...(role === 'ADMIN'
      ? [
          { label: 'จัดการผู้ใช้งาน', icon: <PeopleOutlineOutlinedIcon />, path: '/users' },
          { label: 'ตั้งค่าระบบ', icon: <SettingsOutlinedIcon />, path: '/master-data' }
        ]
      : [])
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 40,
            height: 40,
            borderRadius: 2,
            boxShadow: '0 4px 10px rgba(29, 78, 216, 0.3)'
          }}
        >
          <ConstructionIcon sx={{ color: '#ffffff', fontSize: 22 }} />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 800, color: 'text.primary', leading: 1.1 }}>
            RepairHub
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>
            Management System
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#f1f5f9' }} />

      {/* Nav List */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 1.5,
                  py: 1.2,
                  px: 2,
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#1d4ed8' : '#475569',
                  '&:hover': {
                    backgroundColor: isActive ? '#eff6ff' : '#f8fafc',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    '& .MuiListItemIcon-root': {
                      color: '#1d4ed8',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#1d4ed8' : '#64748b',
                    minWidth: 38
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#f1f5f9' }} />

      {/* Logout Footer */}
      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1.5,
            py: 1.2,
            px: 2,
            color: '#dc2626',
            '&:hover': {
              backgroundColor: '#fef2f2',
            }
          }}
        >
          <ListItemIcon sx={{ color: '#dc2626', minWidth: 38 }}>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="ออกจากระบบ"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          />
        </ListItemButton>
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
            borderRight: '1px solid #f1f5f9',
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
