import WindowControls from '#components/WindowControls';
import WindowWrapper from '#hoc/WindowWrapper'
import { Download } from 'lucide-react';
import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
const Resume = () => {
  return (
    <>
    <div id='window-header'>
      <WindowControls target="resume"/>
      <h2>Resume.pdf</h2>
      <a href="files/Resume2.pdf" download className='cursor-pointer' title='Download Resume'>
      <Download className='icon'/></a>
    </div>
    <Document file="files/Resume2.pdf">
      <Page pageNumber={1} renderTextLayer renderAnnotationLayer/>
     
    </Document>
    </>
  )
}

const ResumeWindow = WindowWrapper(Resume, "resume");

export default ResumeWindow
