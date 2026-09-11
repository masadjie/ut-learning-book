/**
 * Minimalist Pure JavaScript ZIP Builder (Store Mode 0 / Deflate)
 * Zero dependencies, produces standard zip / docx files.
 */
class MiniZip {
  constructor() {
    this.files = [];
  }

  add(path, content) {
    let data;
    if (typeof content === 'string') {
      data = new TextEncoder().encode(content);
    } else if (content instanceof Uint8Array) {
      data = content;
    } else if (content instanceof ArrayBuffer) {
      data = new Uint8Array(content);
    } else {
      throw new Error('Unsupported content type');
    }
    this.files.push({ path, data });
  }

  static crc32(data) {
    let table = MiniZip._crcTable;
    if (!table) {
      table = MiniZip._crcTable = new Int32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
          c = (c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c;
      }
    }
    let crc = -1;
    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF];
    }
    return (crc ^ -1) >>> 0;
  }

  generateBlob(mimeType = 'application/octet-stream') {
    const localHeaders = [];
    const centralEntries = [];
    let offset = 0;

    for (const file of this.files) {
      const pathBytes = new TextEncoder().encode(file.path);
      const crc = MiniZip.crc32(file.data);
      const size = file.data.length;

      const localHeader = new Uint8Array(30 + pathBytes.length);
      const lv = new DataView(localHeader.buffer);
      lv.setUint32(0, 0x04034b50, true);
      lv.setUint16(4, 20, true);
      lv.setUint16(6, 0, true);
      lv.setUint16(8, 0, true);
      lv.setUint16(10, 0, true);
      lv.setUint16(12, 0, true);
      lv.setUint32(14, crc, true);
      lv.setUint32(18, size, true);
      lv.setUint32(22, size, true);
      lv.setUint16(26, pathBytes.length, true);
      lv.setUint16(28, 0, true);
      localHeader.set(pathBytes, 30);

      localHeaders.push(localHeader, file.data);

      const centralHeader = new Uint8Array(46 + pathBytes.length);
      const cv = new DataView(centralHeader.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, 0, true);
      cv.setUint16(14, 0, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, size, true);
      cv.setUint32(24, size, true);
      cv.setUint16(28, pathBytes.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);
      centralHeader.set(pathBytes, 46);

      centralEntries.push(centralHeader);

      offset += localHeader.length + size;
    }

    const centralDirOffset = offset;
    let centralDirSize = 0;
    for (const ch of centralEntries) {
      centralDirSize += ch.length;
    }

    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, this.files.length, true);
    ev.setUint16(10, this.files.length, true);
    ev.setUint32(12, centralDirSize, true);
    ev.setUint32(16, centralDirOffset, true);
    ev.setUint16(20, 0, true);

    const allParts = [...localHeaders, ...centralEntries, eocd];
    return new Blob(allParts, { type: mimeType });
  }
}

/**
 * Enhanced BookExporter supporting genuine Word (.docx Landscape) and Direct PDF
 */
class BookExporter {
  /**
   * Build a genuine Microsoft Word (.docx) package with embedded Landscape screenshots
   */
  static async toDocxBlob(bookData) {
    const zip = new MiniZip();
    const title = bookData.title || 'Modul Universitas Terbuka';
    const scanDate = bookData.scanDate || new Date().toLocaleString('id-ID');

    // 1. [Content_Types].xml
    let contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
    zip.add('[Content_Types].xml', contentTypesXml);

    // 2. _rels/.rels
    let relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
    zip.add('_rels/.rels', relsXml);

    const docRels = [];
    let docXmlBody = '';

    // Cover Page
    docXmlBody += `
      <w:p>
        <w:pPr>
          <w:jc w:val="center"/>
          <w:spacing w:before="400" w:after="200"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
            <w:b/>
            <w:sz w:val="56"/>
            <w:color w:val="004D99"/>
          </w:rPr>
          <w:t>${this.escapeXml(title)}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:jc w:val="center"/>
          <w:spacing w:after="200"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
            <w:color w:val="666666"/>
            <w:sz w:val="24"/>
          </w:rPr>
          <w:t>Waktu Scan: ${this.escapeXml(scanDate)} | Total Halaman: ${bookData.pages.length}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:jc w:val="center"/>
          <w:spacing w:after="400"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
            <w:color w:val="0284C7"/>
            <w:b/>
            <w:sz w:val="22"/>
          </w:rPr>
          <w:t>Metode Ekstraksi: ***** (Confidential / Protected)</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:jc w:val="center"/>
          <w:spacing w:after="600"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
            <w:i/>
            <w:color w:val="888888"/>
            <w:sz w:val="20"/>
          </w:rPr>
          <w:t>UT Book Scanner v1.0.0 by Adjie Kurniawan</w:t>
        </w:r>
      </w:p>
    `;

    // Process each page
    let imageCounter = 1;
    for (let i = 0; i < bookData.pages.length; i++) {
      const page = bookData.pages[i];
      const pageTitle = page.title || `Halaman ${i + 1}`;

      // Page break
      docXmlBody += `
        <w:p>
          <w:r>
            <w:br w:type="page"/>
          </w:r>
        </w:p>
      `;

      // Page Title Heading
      docXmlBody += `
        <w:p>
          <w:pPr>
            <w:spacing w:before="180" w:after="120"/>
            <w:pBdr>
              <w:bottom w:val="single" w:sz="6" w:space="4" w:color="0284C7"/>
            </w:pBdr>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
              <w:b/>
              <w:sz w:val="28"/>
              <w:color w:val="003366"/>
            </w:rPr>
            <w:t>${this.escapeXml(pageTitle)}</w:t>
          </w:r>
        </w:p>
      `;

      // Embed Image
      if (page.image && page.image.startsWith('data:image/')) {
        const rId = `rIdImg${imageCounter}`;
        const ext = page.image.includes('png') ? 'png' : 'jpeg';
        const imgFileName = `image${imageCounter}.${ext}`;
        
        const base64Data = page.image.split(',')[1];
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        zip.add(`word/media/${imgFileName}`, binaryData);

        docRels.push(`  <Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${imgFileName}"/>`);

        // Calculate aspect ratio
        const imgW = page.width || 1600;
        const imgH = page.height || 900;
        const aspect = imgW / imgH;

        // Max area in A4 Landscape
        const maxEmuW = 9200000;
        const maxEmuH = 5400000;

        let emuW = maxEmuW;
        let emuH = Math.round(emuW / aspect);

        if (emuH > maxEmuH) {
          emuH = maxEmuH;
          emuW = Math.round(emuH * aspect);
        }

        const docPrId = imageCounter + 100;

        docXmlBody += `
          <w:p>
            <w:pPr>
              <w:jc w:val="center"/>
              <w:spacing w:before="60" w:after="120"/>
            </w:pPr>
            <w:r>
              <w:drawing>
                <wp:inline distT="0" distB="0" distL="0" distR="0" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
                  <wp:extent cx="${emuW}" cy="${emuH}"/>
                  <wp:effectExtent l="0" t="0" r="0" b="0"/>
                  <wp:docPr id="${docPrId}" name="Screenshot ${imageCounter}"/>
                  <wp:cNvGraphicFramePr>
                    <a:graphicFrameLocks noChangeAspect="1" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/>
                  </wp:cNvGraphicFramePr>
                  <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                    <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                      <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                        <pic:nvPicPr>
                          <pic:cNvPr id="${docPrId}" name="${imgFileName}"/>
                          <pic:cNvPicPr/>
                        </pic:nvPicPr>
                        <pic:blipFill>
                          <a:blip r:embed="${rId}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>
                          <a:stretch>
                            <a:fillRect/>
                          </a:stretch>
                        </pic:blipFill>
                        <pic:spPr>
                          <a:xfrm>
                            <a:off x="0" y="0"/>
                            <a:ext cx="${emuW}" cy="${emuH}"/>
                          </a:xfrm>
                          <a:prstGeom prst="rect">
                            <a:avLst/>
                          </a:prstGeom>
                        </pic:spPr>
                      </pic:pic>
                    </a:graphicData>
                  </a:graphic>
                </wp:inline>
              </w:drawing>
            </w:r>
          </w:p>
        `;

        imageCounter++;
      }
    }

    // 3. word/_rels/document.xml.rels
    let docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${docRels.join('\n')}
</Relationships>`;
    zip.add('word/_rels/document.xml.rels', docRelsXml);

    // 4. word/document.xml
    let fullDocXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
            xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
            xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
            xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
            xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>
    ${docXmlBody}
    <w:sectPr>
      <w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>
      <w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="360" w:footer="360" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;
    zip.add('word/document.xml', fullDocXml);

    return zip.generateBlob('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  }

  /**
   * Export to Direct PDF via Native Browser Print Window
   * Opens high-resolution landscape printable page and triggers print / Save to PDF
   */
  static openPrintablePDF(bookData) {
    const title = bookData.title || 'Modul Universitas Terbuka';
    const pagesHtml = bookData.pages.map((p, idx) => `
      <div class="pdf-page">
        <div class="pdf-header">${this.escapeXml(p.title || `Halaman ${idx + 1}`)}</div>
        ${p.image ? `<img src="${p.image}" class="pdf-img" alt="Halaman ${idx + 1}">` : ''}
      </div>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${this.escapeXml(title)} - UT Book Scanner v1.0.0</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #ffffff;
            color: #1e293b;
          }
          .pdf-page {
            page-break-after: always;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 10px;
          }
          .pdf-page:last-child {
            page-break-after: avoid;
          }
          .pdf-header {
            font-size: 14pt;
            font-weight: bold;
            color: #004d99;
            margin-bottom: 8px;
            border-bottom: 2px solid #0284c7;
            width: 100%;
            padding-bottom: 4px;
          }
          .pdf-img {
            max-width: 100%;
            max-height: 88vh;
            object-fit: contain;
            border-radius: 4px;
          }
          @media print {
            .no-print { display: none !important; }
            body { background: white; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="background: #0284c7; color: white; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; position: fixed; top: 0; left: 0; right: 0; z-index: 9999;">
          <div>
            <strong>${this.escapeXml(title)}</strong> (${bookData.pages.length} Halaman) | <span style="font-family: monospace; font-weight: bold; letter-spacing: 2px;">Metode: *****</span> | <em>UT Book Scanner v1.0.0 by Adjie Kurniawan</em>
          </div>
          <button onclick="window.print()" style="background: #ffffff; color: #0284c7; font-weight: bold; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">
            🖨️ Cetak / Simpan sebagai PDF (A4 Landscape)
          </button>
        </div>
        <div style="margin-top: 50px;">
          ${pagesHtml}
        </div>
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 600);
          };
        <\/script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      // Fallback: download as printable HTML
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      this.downloadFile(blob, `${(title).replace(/[^a-zA-Z0-9_-]/g, '_')}_Printable.html`);
    }
  }

  static downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }

  static escapeXml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

// Export for module or browser globals
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BookExporter;
} else if (typeof window !== 'undefined') {
  window.BookExporter = BookExporter;
}
