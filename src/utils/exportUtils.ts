import type { Workout } from '../store/workoutStore';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Format workout data for export
const formatWorkoutData = (workout: Workout) => {
  const rows = [
    // Header row
    ['Workout Details', '', '', '', ''],
    ['Name:', workout.name, '', 'Date:', new Date(workout.date).toLocaleDateString()],
    ['Status:', workout.completed ? 'Completed' : 'In Progress', '', 'Duration:', workout.duration ? `${workout.duration} minutes` : 'N/A'],
    ['', '', '', '', ''],
    // Exercise header
    ['Exercise', 'Sets', 'Reps', 'Weight', 'Notes'],
  ];

  // Add exercise rows
  workout.exercises.forEach(ex => {
    const exercise = ex.exercise;
    const row = [
      exercise.name,
      ex.sets.toString(),
      ex.reps?.toString() || 'N/A',
      ex.weight ? `${ex.weight} kg` : 'N/A',
      ex.notes || ''
    ];
    rows.push(row);
  });

  return rows;
};

// Export to CSV
export const exportToCSV = (workouts: Workout[]) => {
  const csvContent = workouts.map(workout => {
    const rows = formatWorkoutData(workout);
    return rows.map(row => row.join(',')).join('\n');
  }).join('\n\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `workouts_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to PDF
export const exportToPDF = (workouts: Workout[]) => {
  const doc = new jsPDF();
  let yOffset = 20;

  workouts.forEach((workout, index) => {
    if (index > 0) {
      doc.addPage();
      yOffset = 20;
    }

    // Add workout details
    doc.setFontSize(16);
    doc.text(workout.name, 20, yOffset);
    yOffset += 10;

    doc.setFontSize(12);
    doc.text(`Date: ${new Date(workout.date).toLocaleDateString()}`, 20, yOffset);
    yOffset += 7;
    doc.text(`Status: ${workout.completed ? 'Completed' : 'In Progress'}`, 20, yOffset);
    yOffset += 7;
    if (workout.duration) {
      doc.text(`Duration: ${workout.duration} minutes`, 20, yOffset);
      yOffset += 7;
    }
    yOffset += 10;

    // Add exercises table
    const tableData = workout.exercises.map(ex => [
      ex.exercise.name,
      ex.sets.toString(),
      ex.reps?.toString() || 'N/A',
      ex.weight ? `${ex.weight} kg` : 'N/A',
      ex.notes || ''
    ]);

    (doc as any).autoTable({
      startY: yOffset,
      head: [['Exercise', 'Sets', 'Reps', 'Weight', 'Notes']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });
  });

  doc.save(`workouts_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export to Excel (XLSX)
export const exportToExcel = (workouts: Workout[]) => {
  const workbook = new (window as any).ExcelJS.Workbook();
  
  workouts.forEach(workout => {
    const worksheet = workbook.addWorksheet(workout.name);
    const rows = formatWorkoutData(workout);
    
    rows.forEach(row => {
      worksheet.addRow(row);
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2C3E50' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' } };

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });
  });

  workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `workouts_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
  });
};

// Export to Google Sheets (multiple workouts)
export const exportMultipleToGoogleSheets = async (workouts: Workout[]) => {
  try {
    // Create a new spreadsheet
    const response = await window.gapi.client.sheets.spreadsheets.create({
      properties: {
        title: `Workouts_${new Date().toISOString().split('T')[0]}`
      }
    });

    const spreadsheetId = response.result.spreadsheetId;
    const requests = [];

    // Add each workout as a new sheet
    for (const workout of workouts) {
      const sheetName = workout.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
      requests.push({
        addSheet: {
          properties: {
            title: sheetName
          }
        }
      });
    }

    // Create all sheets
    await window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: { requests }
    });

    // Get the created sheets
    const sheetsResponse = await window.gapi.client.sheets.spreadsheets.get({
      spreadsheetId
    });

    // Update each sheet with workout data
    for (let i = 0; i < workouts.length; i++) {
      const workout = workouts[i];
      const sheet = sheetsResponse.result.sheets[i + 1]; // +1 because first sheet is default
      const values = formatWorkoutData(workout);

      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheet.properties.title}!A1:E${values.length}`,
        valueInputOption: 'RAW',
        resource: { values }
      });

      // Format the sheet
      await window.gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: sheet.properties.sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.2,
                      green: 0.2,
                      blue: 0.2
                    },
                    textFormat: {
                      bold: true,
                      foregroundColor: {
                        red: 1,
                        green: 1,
                        blue: 1
                      }
                    }
                  }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)'
              }
            },
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId: sheet.properties.sheetId,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: 5
                }
              }
            }
          ]
        }
      });
    }

    return {
      success: true,
      url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
    };
  } catch (error) {
    console.error('Error exporting to Google Sheets:', error);
    throw error;
  }
}; 