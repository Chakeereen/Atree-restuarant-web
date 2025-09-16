// actions/pdf.ts
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * แปลง HTMLElement เป็น PDF และดาวน์โหลด
 * @param element - HTML element ที่จะ convert
 * @param fileName - ชื่อไฟล์ PDF เช่น "bill_order_123.pdf"
 */
export const convertToPDF = async (element: HTMLElement, fileName: string) => {
  if (!element) throw new Error("Element not found");

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // margin 10mm
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
  pdf.save(fileName);
};
