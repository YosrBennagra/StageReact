import React, { useState } from 'react';
import DraggableItem from './DraggableItem';

const DragAndDropTable = () => {
  const [tableData, setTableData] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (day, hour, droppedItem) => {
    if (!isValidItem(droppedItem)) {
      return; // Ignore drop if item is not valid
    }

    console.log("Dropped data:", droppedItem); // Debugging statement

    const updatedTableData = [...tableData];
    const existingCellIndex = updatedTableData.findIndex(
      (cell) => cell.day === day && cell.hour === hour
    );

    if (existingCellIndex !== -1) {
      updatedTableData[existingCellIndex] = { day, hour, item: droppedItem };
    } else {
      updatedTableData.push({ day, hour, item: droppedItem });
    }

    setTableData(updatedTableData);
    console.log("Updated table data:", updatedTableData); // Debugging statement
  };

  const handleDelete = (day, hour) => {
    const updatedTableData = tableData.filter(
      (cell) => !(cell.day === day && cell.hour === hour)
    );
    setTableData(updatedTableData);
  };

  const renderTableCell = (day, hour) => {
    const cellData = tableData.find((row) => row.day === day && row.hour === hour);

    return (
      <td
        key={`${day}-${hour}`}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => {
          const droppedItemData = JSON.parse(e.dataTransfer.getData('text/plain'));
          handleDrop(day, hour, droppedItemData);
        }}
        onClick={() => handleDelete(day, hour)}
        style={{ minHeight: '40px', border: '1px dashed #ccc', position: 'relative' }}
      >
        {cellData && cellData.item && (
          <DraggableItem item={cellData.item} onDelete={() => handleDelete(day, hour)} />
        )}
      </td>
    );
  };

  const isValidItem = (item) => {
    return item && item.title; // Example validation - adjust as per your item structure
  };

  return (
    <div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '8px' }}>Day</th>
            {[...Array(10)].map((_, hour) => (
              <th key={hour + 9} style={{ border: '1px solid #000', padding: '8px' }}>{hour + 9}:00</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, dayIndex) => (
            <tr key={dayIndex}>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{day}</td>
              {[...Array(10)].map((_, hour) => renderTableCell(dayIndex, hour + 9))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DragAndDropTable;
