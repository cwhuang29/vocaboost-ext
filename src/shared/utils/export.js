export const exportCSV = (csvStr, filename) => {
  const csvFile = new Blob([csvStr], { type: 'text/csv' });
  const downloadLink = document.createElement('a');

  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';

  document.body.appendChild(downloadLink);
  downloadLink.click();
};

/*
const exportCSV = (csvRows) => {
  const csvContent = `data:text/csv;charset=utf-8,${csvRows.map((e) => e.join(',')).join('\n')}`;
  const encodedUri = encodeURI(csvContent);

  console.log(encodedUri);
  window.open(encodedUri); // ERROR
};
*/
