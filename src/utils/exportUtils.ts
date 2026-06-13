import html2canvas from 'html2canvas';

export const exportToImage = async (
  elementId: string,
  filename: string = 'achievement-card.png'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    backgroundColor: '#1a1a2e',
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const createExportContainer = (content: string): HTMLElement => {
  const container = document.createElement('div');
  container.id = 'export-container';
  container.innerHTML = content;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  document.body.appendChild(container);
  return container;
};

export const removeExportContainer = (): void => {
  const container = document.getElementById('export-container');
  if (container) {
    document.body.removeChild(container);
  }
};
