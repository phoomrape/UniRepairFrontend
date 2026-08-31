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
  TextField,
  InputAdornment,
  Button,
  Badge,
  Tooltip,
  Divider,
  ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: 'calc(100% - 250px)' },
        ml: { md: '250px' },
        zIndex: (theme) => theme.zIndex.drawer - 1,
        backgroundColor: '#ffffff',
        color: '#0f172a',
        boxShadow: 'none',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggleSidebar}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Global Search Bar - Centered */}
        <Box sx={{ flexGrow: 1, maxWidth: 480, mx: 'auto', display: { xs: 'none', sm: 'block' } }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search requests..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
                bgcolor: '#f8fafc',
                fontSize: '0.88rem',
                '& fieldset': { border: '1px solid #e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' }
              }
            }}
          />
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<HelpOutlineIcon sx={{ fontSize: 18 }} />}
            sx={{ color: '#64748b', fontSize: '0.85rem', display: { xs: 'none', md: 'inline-flex' } }}
          >
            Help
          </Button>

          <IconButton onClick={() => navigate('/notifications')} sx={{ color: '#64748b' }}>
            <Badge color="error" variant="dot">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-repair')}
            sx={{
              borderRadius: 2.5,
              px: 2.2,
              py: 0.9,
              fontWeight: 700,
              fontSize: '0.88rem',
              boxShadow: '0 4px 14px rgba(29, 78, 216, 0.25)'
            }}
          >
            + New Request
          </Button>

          {user && (
            <Tooltip title="Account Settings">
              <IconButton onClick={handleOpenMenu} sx={{ p: 0.5 }}>
                <Avatar sx={{ bgcolor: 'primary.dark', width: 38, height: 38, fontWeight: 700, fontSize: '0.9rem' }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          )}

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
                borderRadius: 3,
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.78rem' }}>
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: '#dc2626', py: 1.2 }}>
              <ListItemIcon sx={{ color: '#dc2626' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
