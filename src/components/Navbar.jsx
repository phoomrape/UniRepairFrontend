import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  Divider,
  ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ROLE_LABELS = {
  ADMIN: { label: 'ผู้ดูแลระบบ (Admin)', color: 'error' },
  STAFF: { label: 'เจ้าหน้าที่/ช่างซ่อม', color: 'secondary' },
  USER: { label: 'นักศึกษา / บุคลากร', color: 'info' }
};

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate('/login');
  };

  const roleInfo = user ? ROLE_LABELS[user.role] || { label: user.role, color: 'default' } : null;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#ffffff',
        color: '#0f172a',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              boxShadow: '0 2px 8px rgba(30, 58, 138, 0.3)'
            }}
          >
            <BuildCircleIcon fontSize="medium" />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'primary.main' }}>
              UniRepair
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
              ระบบแจ้งซ่อมและติดตามสถานะภายในมหาวิทยาลัย
            </Typography>
          </Box>
        </Box>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {roleInfo && (
              <Chip
                label={roleInfo.label}
                color={roleInfo.color}
                size="small"
                sx={{ fontWeight: 600, display: { xs: 'none', sm: 'inline-flex' } }}
              />
            )}

            <Tooltip title="โปรไฟล์ผู้ใช้งาน">
              <IconButton onClick={handleOpenMenu} sx={{ p: 0.5 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36, fontWeight: 600 }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  width: 220,
                  mt: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.8rem' }}>
                  {user.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.2 }}>
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                ออกจากระบบ
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
