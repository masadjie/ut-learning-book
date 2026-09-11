/**
 * Popup Script for UT Book Auto-Scanner
 * by Adjie Kurniawan
 */

document.addEventListener('DOMContentLoaded', async () => {
  const statusBadge = document.getElementById('status-badge');
  const bookTitleEl = document.getElementById('book-title');
  const pageCountEl = document.getElementById('page-count');
  const docLabelInput = document.getElementById('doc-label-input');
  const delayInput = document.getElementById('delay-input');
  const delayDisplay = document.getElementById('delay-display');
  const maxPagesSelect = document.getElementById('max-pages-select');
  const maxPagesCustomInput = document.getElementById('max-pages-custom-input');
  const btnStart = document.getElementById('btn-start');
  const btnStop = document.getElementById('btn-stop');
  const btnCapture = document.getElementById('btn-capture');
  const btnClear = document.getElementById('btn-clear');
  const btnExportDoc = document.getElementById('btn-export-doc');
  const btnExportPdf = document.getElementById('btn-export-pdf');
  const previewList = document.getElementById('preview-list');

  let currentBookData = {
    title: '',
    customLabel: '',
    pages: [],
    isScanning: false,
    delaySeconds: 2.5,
    maxPages: 15
  };

  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  async function sendTabMessage(message) {
    try {
      const tab = await getActiveTab();
      if (!tab || !tab.id) return null;
      return await chrome.tabs.sendMessage(tab.id, message);
    } catch (e) {
      return null;
    }
  }

  async function refreshState() {
    const tabRes = await sendTabMessage({ action: 'GET_STATUS' });
    if (tabRes) {
      currentBookData.isScanning = tabRes.isScanning;
      if (tabRes.bookTitle) currentBookData.title = tabRes.bookTitle;
      if (tabRes.customLabel) currentBookData.customLabel = tabRes.customLabel;
      if (tabRes.pages) currentBookData.pages = tabRes.pages;
      if (tabRes.delaySeconds) currentBookData.delaySeconds = tabRes.delaySeconds;
      if (typeof tabRes.maxPages === 'number') currentBookData.maxPages = tabRes.maxPages;
    }

    updateUI();
  }

  function updateUI() {
    bookTitleEl.textContent = currentBookData.title || 'Modul UT (Kotobee)';
    pageCountEl.textContent = `${currentBookData.pages.length} Bagian`;

    if (docLabelInput) {
      if (currentBookData.customLabel) {
        docLabelInput.value = currentBookData.customLabel;
      } else if (!docLabelInput.value && currentBookData.title) {
        docLabelInput.value = currentBookData.title;
      }
    }

    delayInput.value = currentBookData.delaySeconds || 2.5;
    delayDisplay.textContent = `${parseFloat(delayInput.value).toFixed(1)}s`;

    if (maxPagesSelect && typeof currentBookData.maxPages === 'number') {
      const knownValues = ['5', '10', '15', '25', '50', '0'];
      if (knownValues.includes(String(currentBookData.maxPages))) {
        maxPagesSelect.value = String(currentBookData.maxPages);
        if (maxPagesCustomInput) maxPagesCustomInput.classList.add('ut-hidden');
      } else {
        maxPagesSelect.value = 'custom';
        if (maxPagesCustomInput) {
          maxPagesCustomInput.classList.remove('ut-hidden');
          maxPagesCustomInput.value = String(currentBookData.maxPages);
        }
      }
    }

    if (currentBookData.isScanning) {
      statusBadge.textContent = 'SCANNING';
      statusBadge.className = 'badge scanning';
      btnStart.style.display = 'none';
      btnStop.style.display = 'flex';
    } else {
      statusBadge.textContent = 'IDLE';
      statusBadge.className = 'badge idle';
      btnStart.style.display = 'flex';
      btnStop.style.display = 'none';
    }

    if (currentBookData.pages.length === 0) {
      previewList.innerHTML = '<div class="empty-state">Belum ada materi yang discan. Buka modul di Kotobee dan klik Mulai Auto-Scan.</div>';
    } else {
      previewList.innerHTML = '';
      currentBookData.pages.forEach((p, idx) => {
        const item = document.createElement('div');
        item.className = 'preview-item';
        item.innerHTML = `
          <span class="preview-index">#${idx + 1}</span>
          <span class="preview-title">${p.title || 'Bagian Modul'}</span>
        `;
        previewList.appendChild(item);
      });
      previewList.scrollTop = previewList.scrollHeight;
    }
  }

  if (docLabelInput) {
    docLabelInput.addEventListener('input', (e) => {
      currentBookData.customLabel = e.target.value;
      sendTabMessage({ action: 'SET_LABEL', label: e.target.value });
    });
  }

  if (maxPagesSelect) {
    maxPagesSelect.addEventListener('change', (e) => {
      if (e.target.value === 'custom') {
        if (maxPagesCustomInput) {
          maxPagesCustomInput.classList.remove('ut-hidden');
          maxPagesCustomInput.focus();
        }
      } else {
        if (maxPagesCustomInput) maxPagesCustomInput.classList.add('ut-hidden');
        currentBookData.maxPages = parseInt(e.target.value, 10);
      }
    });
  }

  delayInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    delayDisplay.textContent = `${val.toFixed(1)}s`;
    currentBookData.delaySeconds = val;
  });

  btnStart.addEventListener('click', async () => {
    const delay = parseFloat(delayInput.value);
    let maxPages = 15;
    if (maxPagesSelect.value === 'custom') {
      const customVal = maxPagesCustomInput ? parseInt(maxPagesCustomInput.value, 10) : 0;
      maxPages = (customVal > 0) ? customVal : 15;
    } else {
      maxPages = parseInt(maxPagesSelect.value, 10);
    }
    const customLabel = docLabelInput ? docLabelInput.value : '';
    await sendTabMessage({ action: 'START_SCAN', delay, maxPages, customLabel });
    currentBookData.isScanning = true;
    updateUI();
  });

  btnStop.addEventListener('click', async () => {
    await sendTabMessage({ action: 'STOP_SCAN' });
    currentBookData.isScanning = false;
    updateUI();
  });

  btnCapture.addEventListener('click', async () => {
    const res = await sendTabMessage({ action: 'CAPTURE_NOW' });
    if (res && res.success) {
      await refreshState();
    } else {
      alert('Gagal mengambil screenshot. Pastikan tab Kotobee aktif.');
    }
  });

  btnClear.addEventListener('click', async () => {
    if (confirm('Hapus seluruh data materi yang sudah discan?')) {
      await sendTabMessage({ action: 'CLEAR_DATA' });
      currentBookData.pages = [];
      updateUI();
    }
  });

  function getExportTitle() {
    const labelVal = docLabelInput ? docLabelInput.value.trim() : '';
    return labelVal || currentBookData.customLabel || currentBookData.title || 'Modul Universitas Terbuka';
  }

  btnExportDoc.addEventListener('click', async () => {
    if (currentBookData.pages.length === 0) {
      alert('Belum ada materi yang discan!');
      return;
    }
    const finalTitle = getExportTitle();
    const payload = {
      title: finalTitle,
      pages: currentBookData.pages
    };
    const blob = await BookExporter.toDocxBlob(payload);
    const safeTitle = finalTitle.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_') || 'Modul_UT';
    BookExporter.downloadFile(blob, `${safeTitle}.docx`);
  });

  btnExportPdf.addEventListener('click', () => {
    if (currentBookData.pages.length === 0) {
      alert('Belum ada materi yang discan!');
      return;
    }
    const finalTitle = getExportTitle();
    const payload = {
      title: finalTitle,
      pages: currentBookData.pages
    };
    BookExporter.openPrintablePDF(payload);
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'STATE_UPDATED') {
      refreshState();
    }
  });

  await refreshState();
});
