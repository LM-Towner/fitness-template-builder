import type { Workout } from '../store/workoutStore';

// This would be your Google Sheets API key and client ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

// Load the Google Sheets API
const loadGoogleSheetsAPI = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
          scope: 'https://www.googleapis.com/auth/spreadsheets'
        }).then(resolve).catch(reject);
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

// Initialize the Google Sheets API
let isInitialized = false;
const initializeGoogleSheets = async () => {
  if (!isInitialized) {
    await loadGoogleSheetsAPI();
    isInitialized = true;
  }
};

// Format workout data for Google Sheets
const formatWorkoutForSheets = (workout: Workout) => {
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

// Export workout to Google Sheets
export const exportToGoogleSheets = async (workout: Workout) => {
  try {
    await initializeGoogleSheets();

    // Get the current date and time for the sheet name
    const date = new Date();
    const sheetName = `Workout_${date.toISOString().split('T')[0]}`;

    // Create a new sheet
    await window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [{
          addSheet: {
            properties: {
              title: sheetName
            }
          }
        }]
      }
    });

    // Get the sheet ID
    const response = await window.gapi.client.sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });
    const sheet = response.result.sheets.find(s => s.properties.title === sheetName);
    if (!sheet) throw new Error('Failed to create sheet');

    // Format the workout data
    const values = formatWorkoutForSheets(workout);

    // Update the sheet with workout data
    await window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:E${values.length}`,
      valueInputOption: 'RAW',
      resource: {
        values
      }
    });

    // Format the sheet
    await window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          // Format header row
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
          // Auto-resize columns
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

    return {
      success: true,
      url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=${sheet.properties.sheetId}`
    };
  } catch (error) {
    console.error('Error exporting to Google Sheets:', error);
    throw error;
  }
}; 