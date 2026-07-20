import * as Clipboard from 'expo-clipboard';

export const copySurveyId = async (id: string): Promise<boolean> => {
  try {
    await Clipboard.setStringAsync(id);
    return true;
  } catch (error) {
    return false;
  }
};

export const copyContactNumber = async (number: string): Promise<boolean> => {
  try {
    await Clipboard.setStringAsync(number);
    return true;
  } catch (error) {
    return false;
  }
};

export const copyLocation = async (lat: number, lng: number): Promise<boolean> => {
  try {
    await Clipboard.setStringAsync(`${lat}, ${lng}`);
    return true;
  } catch (error) {
    return false;
  }
};

export const pasteNotes = async (): Promise<string | null> => {
  try {
    const text = await Clipboard.getStringAsync();
    return text || null;
  } catch (error) {
    return null;
  }
};

export const clearClipboard = async (): Promise<boolean> => {
  try {
    await Clipboard.setStringAsync('');
    return true;
  } catch (error) {
    return false;
  }
};
