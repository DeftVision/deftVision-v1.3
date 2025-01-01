import Papa from 'papaparse'

export function exportToCSV(data, fileName) {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.csv`)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}