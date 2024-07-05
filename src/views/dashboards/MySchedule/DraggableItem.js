import React from 'react';
import { Box } from '@chakra-ui/react';
import { IconButton } from '@mui/material';
import { IconTrash } from '@tabler/icons';

const DraggableItem = ({ item, onDelete }) => {
  const { title, color } = item;

  const handleDragStart = (e) => {
    const itemData = JSON.stringify(item);
    console.log("Drag start item data:", itemData); // Debugging statement
    e.dataTransfer.setData('text/plain', itemData);
  };

  const handleDelete = () => {
    onDelete(item); // Call onDelete function with the item as parameter
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{ backgroundColor: color === 'default' ? '#1a97f5' : '#39b69a', color: 'white', cursor: 'grab', minWidth: '100px', minHeight: '40px', padding: '8px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}
    >
      <Box p={2} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        {onDelete && ( // Check if onDelete function is provided
          <IconButton onClick={handleDelete}>
            <IconTrash style={{ cursor: 'pointer' }} />
          </IconButton>
        )}
      </Box>
    </div>
  );
};

export default DraggableItem;
