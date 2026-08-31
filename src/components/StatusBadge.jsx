import React from 'react';
import { Chip } from '@mui/material';
import ClockIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export const STATUS_CONFIG = {
  PENDING: {
    label: 'รอดำเนินการ',
    color: '#d97706',
    bgColor: '#fef3c7',
    icon: <ClockIcon fontSize="small" />,
  },
  ACCEPTED: {
    label: 'รับเรื่องแล้ว',
    color: '#0284c7',
    bgColor: '#e0f2fe',
    icon: <AssignmentTurnedInIcon fontSize="small" />,
  },
  IN_PROGRESS: {
    label: 'กำลังดำเนินการ',
    color: '#7c3aed',
    bgColor: '#f3e8ff',
    icon: <BuildIcon fontSize="small" />,
  },
  WAITING_PARTS: {
    label: 'รออะไหล่',
    color: '#c2410c',
    bgColor: '#ffedd5',
    icon: <HourglassEmptyIcon fontSize="small" />,
  },
  COMPLETED: {
    label: 'ซ่อมเสร็จแล้ว',
    color: '#059669',
    bgColor: '#d1fae5',
    icon: <CheckCircleIcon fontSize="small" />,
  },
  CANCELLED: {
    label: 'ยกเลิก',
    color: '#dc2626',
    bgColor: '#fee2e2',
    icon: <CancelIcon fontSize="small" />,
  },
};

const StatusBadge = ({ status, size = 'medium' }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: '#64748b',
    bgColor: '#f1f5f9',
    icon: null,
  };

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size={size}
      sx={{
        fontWeight: 600,
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.color}30`,
        '& .MuiChip-icon': {
          color: 'inherit',
        },
      }}
    />
  );
};

export default StatusBadge;
