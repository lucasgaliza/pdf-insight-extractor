import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Cpu, 
  Table, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Download, 
  Settings,
  Trash2,
  Globe,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Search,
  ChevronDown,
  X
} from 'lucide-react';

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = (e) => {
        resolve(); 
    };
    document.head.appendChild(script);
  });
};

const saveAs = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const FadeIn = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay + 300); 
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-opacity duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
};

const LANGUAGES_DB = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'ar', name: 'العربية' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'bg', name: 'Български' },
  { code: 'ca', name: 'Català' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'hr', name: 'Hrvatski' },
  { code: 'cs', name: 'Čeština' },
  { code: 'da', name: 'Dansk' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'en', name: 'English' },
  { code: 'et', name: 'Eesti' },
  { code: 'fi', name: 'Suomi' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'he', name: 'עברית' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'hu', name: 'Magyar' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ko', name: '한국어' },
  { code: 'lv', name: 'Latviešu' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'mr', name: 'मराठी' },
  { code: 'no', name: 'Norsk' },
  { code: 'fa', name: 'فارسی' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt', name: 'Português' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'ro', name: 'Română' },
  { code: 'ru', name: 'Русский' },
  { code: 'sr', name: 'Српски' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'sl', name: 'Slovenščina' },
  { code: 'es', name: 'Español' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'sv', name: 'Svenska' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'th', name: 'ไทย' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'uk', name: 'Українська' },
  { code: 'ur', name: 'اردو' },
  { code: 'vi', name: 'Tiếng Việt' },
];

const LanguageSelector = ({ value, onChange, options = LANGUAGES_DB, allowClear = true, placeholder = "Select Language", icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredLanguages = useMemo(() => {
    let filtered = options.filter(lang => 
      lang.name.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    const finalList = [];

    if (allowClear && (search === '' || 'clear'.includes(search.toLowerCase()) || 'limpar'.includes(search.toLowerCase()))) {
      finalList.push({ code: '', name: `Clear (Original Language)`, special: true });
    }

    const priorityLangs = ['en', 'pt'];
    priorityLangs.forEach(code => {
        const found = filtered.find(l => l.code === code);
        if (found) finalList.push(found);
    });

    filtered.forEach(lang => {
       if (!priorityLangs.includes(lang.code)) finalList.push(lang);
    });

    return finalList;
  }, [search, options, allowClear]);

  const selectedLang = filteredLanguages.find(l => l.code === value) || options.find(l => l.code === value) || { name: placeholder };

  return (
    <div className="relative w-full notranslate" ref={wrapperRef}> 
      <div 
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) setSearch(''); }}
        className={`
          w-full flex items-center justify-between px-3 py-2 bg-white border rounded-lg cursor-pointer transition-all group
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300 hover:border-slate-400'}
        `}
      >
        <div className="flex items-center gap-2 overflow-hidden">
            {Icon && <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />}
            <span className={`text-sm truncate ${!value && allowClear ? 'text-slate-500' : 'text-slate-800'}`}>
            {value ? selectedLang.name : placeholder}
            </span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 flex flex-col animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-slate-100 bg-slate-50 rounded-t-lg sticky top-0 z-10">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-2.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search language..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
            {filteredLanguages.map((lang, index) => {
              const isSelected = value === lang.code;
              const isClear = lang.code === '';
              
              return (
                <div
                  key={lang.code + index}
                  onClick={() => {
                    onChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm transition-colors
                    ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}
                    ${isClear ? 'text-red-500 hover:bg-red-50 font-medium border-b border-slate-100 mb-1' : ''}
                    ${['en', 'pt'].includes(lang.code) ? 'font-medium border-b border-slate-100 mb-1' : ''}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {isClear && <X size={14} />}
                    <span className="notranslate">{lang.name}</span>
                  </div>
                  {isSelected && <Check size={14} />}
                </div>
              );
            })}
            
            {filteredLanguages.length === 0 && (
              <div className="px-3 py-4 text-center text-sm text-slate-500">
                No language found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled, variant = "primary", className = "" }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed justify-center";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm hover:shadow",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95",
    outline: "border border-slate-300 text-slate-600 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const JsonViewer = ({ title, data, success, error }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = success ? JSON.stringify(data, null, 2) : error;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!success) {
    return (
      <div className="text-xs p-3 rounded bg-red-50 border border-red-200 h-full">
        <div className="flex justify-between items-center mb-2 border-b border-red-100 pb-2">
          <div className="uppercase font-bold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-3 h-3" /> {title}
          </div>
        </div>
        <span className="text-red-600 font-mono break-words">{error}</span>
      </div>
    );
  }

  const jsonString = JSON.stringify(data, null, 2);
  const isLarge = jsonString.length > 300;
  const displayString = expanded ? jsonString : (isLarge ? jsonString.slice(0, 300) + '...' : jsonString);

  return (
    <div className={`text-xs p-3 rounded bg-slate-50 border border-slate-200 flex flex-col transition-all duration-300 ${expanded ? 'h-auto shadow-md ring-1 ring-blue-200 relative z-10' : 'h-full'}`}>
      <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
        <div className="uppercase font-bold text-slate-600 flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-green-500" /> {title}
        </div>
        <div className="flex gap-1">
           <button 
            onClick={handleCopy} 
            className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
            title="Copy JSON"
          >
            {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
          </button>
          {isLarge && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="p-1 hover:bg-blue-100 rounded text-blue-600 transition-colors flex items-center gap-1"
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
      
      <div className={`relative ${expanded ? '' : 'overflow-hidden'}`}>
        <pre className={`font-mono text-slate-700 whitespace-pre-wrap break-all ${expanded ? 'overflow-visible' : ''}`}>
          {displayString}
        </pre>
        
        {!expanded && isLarge && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
        )}
      </div>
      
      {!expanded && isLarge && (
        <button 
          onClick={() => setExpanded(true)}
          className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-center w-full py-1 hover:bg-blue-50 rounded transition-colors"
        >
          View full
        </button>
      )}
    </div>
  );
};

export default function App() {
  const [apiUrl, setApiUrl] = useState('https://wmi1oslfjf.execute-api.sa-east-1.amazonaws.com/default');
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState({});
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [interfaceLang, setInterfaceLang] = useState('');
  
  const [config, setConfig] = useState({
    runPage2Text: true,
    runPage2Ai: true,
    runPage2Table: false,
    targetLanguage: ''
  });

  useEffect(() => {
    const loadLibs = async () => {
      try {
        await loadScript("https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
        setLibsLoaded(true);

        window.googleTranslateElementInit = () => {
           if (!document.getElementById('google_translate_element').hasChildNodes()) {
             new window.google.translate.TranslateElement(
               { pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
               'google_translate_element'
             );
           }
        };
        await loadScript("https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit");
        
      } catch (e) {
        console.error("Failed to load libraries:", e);
        setLibsLoaded(true);
      }
    };
    loadLibs();
  }, []);

  const handleInterfaceLanguageChange = (langCode) => {
    setInterfaceLang(langCode);
    
    const triggerTranslation = (attempts = 0) => {
        const googleSelect = document.querySelector('.goog-te-combo');
        
        if (googleSelect) {
            googleSelect.value = langCode;
            googleSelect.dispatchEvent(new Event('change', { bubbles: true }));
        } else if (attempts < 20) { 
            setTimeout(() => triggerTranslation(attempts + 1), 500);
        }
    };
    
    triggerTranslation();
  };

  if (!libsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span>Loading libraries...</span>
      </div>
    );
  }

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile || uploadedFile.type !== 'application/pdf') {
      alert("Please upload a valid PDF file.");
      return;
    }

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const doc = await window.PDFLib.PDFDocument.load(arrayBuffer);
      setFile(uploadedFile);
      setPdfDoc(doc);
      setPageCount(doc.getPageCount());
      setSelectedPages(new Set()); 
      setResults({});
    } catch (error) {
      console.error("Erro ao carregar PDF:", error);
      alert("Error reading PDF file. Check if it is corrupted.");
    }
  };

  const togglePageSelection = (pageNum) => {
    const newSelection = new Set(selectedPages);
    if (newSelection.has(pageNum)) {
      newSelection.delete(pageNum);
    } else {
      newSelection.add(pageNum);
    }
    setSelectedPages(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedPages.size === pageCount) {
      setSelectedPages(new Set());
    } else {
      const all = new Set(Array.from({ length: pageCount }, (_, i) => i + 1));
      setSelectedPages(all);
    }
  };

  const processQueue = async () => {
    if (selectedPages.size === 0) return alert("Select at least one page.");
    if (!config.runPage2Text && !config.runPage2Ai && !config.runPage2Table) {
      return alert("Select at least one extraction type (Text, AI, or Table).");
    }

    setIsProcessing(true);
    setResults({});
    const pagesToProcess = Array.from(selectedPages).sort((a, b) => a - b);
    setProgress({ current: 0, total: pagesToProcess.length });

    for (const pageNum of pagesToProcess) {
      try {
        const subPdf = await window.PDFLib.PDFDocument.create();
        const [copiedPage] = await subPdf.copyPages(pdfDoc, [pageNum - 1]);
        subPdf.addPage(copiedPage);
        const pdfBytes = await subPdf.save();
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        const pdfFile = new File([pdfBlob], `page_${pageNum}.pdf`, { type: 'application/pdf' });

        const requests = [];
        const pageResults = {};

        const runEndpoint = async (endpoint) => {
          const formData = new FormData();
          formData.append('file', pdfFile);
          formData.append('page_number', pageNum);
          if (config.targetLanguage && (endpoint === 'page2ai' || endpoint === 'page2table')) {
            formData.append('target_language', config.targetLanguage);
          }
          if (endpoint !== 'page2text') {
              formData.append('metadata_page_number', pageNum);
          }

          try {
            const cleanUrl = apiUrl.replace(/\/+$/, '');
            const res = await fetch(`${cleanUrl}/v1/${endpoint}`, {
              method: 'POST',
              body: formData,
            });
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            pageResults[endpoint] = { success: true, data };
          } catch (err) {
            pageResults[endpoint] = { success: false, error: err.message };
          }
        };

        if (config.runPage2Text) requests.push(runEndpoint('page2text'));
        if (config.runPage2Ai) requests.push(runEndpoint('page2ai'));
        if (config.runPage2Table) requests.push(runEndpoint('page2table'));

        await Promise.all(requests);

        setResults(prev => ({ ...prev, [pageNum]: pageResults }));
        setProgress(prev => ({ ...prev, current: prev.current + 1 }));

      } catch (err) {
        console.error(`Fatal error on page ${pageNum}:`, err);
      }
    }

    setIsProcessing(false);
  };

  const handleDownloadZip = async () => {
    const zip = new window.JSZip();
    const folder = zip.folder("pdf_insights");

    Object.entries(results).forEach(([pageNum, endpoints]) => {
      const pageFolder = folder.folder(`page_${pageNum}`);
      Object.entries(endpoints).forEach(([endpoint, result]) => {
        if (result.success) {
          pageFolder.file(`${endpoint}.json`, JSON.stringify(result.data, null, 2));
        } else {
          pageFolder.file(`${endpoint}_error.txt`, result.error);
        }
      });
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `insights_${file.name.replace('.pdf', '')}.zip`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">
      
      <style>{`
        .goog-te-banner-frame,
        iframe.goog-te-banner-frame,
        iframe[id^=":"] {
            visibility: hidden !important;
            height: 0 !important;
            display: none !important;
            width: 0 !important;
            z-index: -1000 !important;
        }
        
        body {
            top: 0px !important; 
            position: static !important;
            margin-top: 0px !important;
        }

        #google_translate_element {
            position: absolute;
            top: 0;
            left: 0;
            width: 1px;
            height: 1px;
            overflow: hidden;
            opacity: 0.01; 
            pointer-events: none;
            z-index: -1000;
        }

        .goog-tooltip, 
        .goog-te-balloon-frame, 
        .goog-te-spinner-pos {
            display: none !important;
            visibility: hidden !important;
        }
        .goog-tooltip:hover {
            display: none !important;
        }
        
        .goog-text-highlight {
            background-color: transparent !important;
            box-shadow: none !important;
        }
        font {
          background-color: transparent !important;
          box-shadow: none !important;
        }
      `}</style>

      <div id="google_translate_element"></div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
          <FadeIn>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-8 h-8 text-blue-600" />
                PDF Insight Extractor
              </h1>
              <p className="text-slate-500 mt-1">Interface for document processing with Serverless AI</p>
            </div>
          </FadeIn>
          
          <div className="flex flex-col md:flex-row items-end md:items-center gap-3 w-full md:w-auto">
            
            <div className="w-full md:w-48">
                <LanguageSelector 
                   value={interfaceLang}
                   onChange={handleInterfaceLanguageChange}
                   icon={Globe}
                   placeholder="Interface Language"
                   allowClear={false}
                />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
              <Settings className="w-4 h-4 text-slate-400 ml-2" />
              <input 
                type="text" 
                value={apiUrl} 
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="API URL"
                className="outline-none text-sm w-full md:w-80 text-slate-600 placeholder:text-slate-300"
              />
            </div>
          </div>
        </header>

        <FadeIn delay={100}>
          <Card className="p-8 border-dashed border-2 border-slate-300 hover:border-blue-400 transition-colors bg-slate-50/30">
            {!file ? (
              <label className="flex flex-col items-center justify-center cursor-pointer h-32 group">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                </div>
                <span className="font-semibold text-lg text-slate-700">Click to upload or drag your PDF</span>
                <span className="text-sm text-slate-400 mt-1">Secure local processing (only selected pages are sent)</span>
                <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
              </label>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center border border-red-100 shadow-sm">
                    <span className="text-red-600 font-bold text-xl">PDF</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800">{file.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                          {pageCount} pages
                        </span>
                        <span className="text-slate-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>
                <Button variant="danger" onClick={() => { setFile(null); setResults({}); setPageCount(0); }}>
                  <Trash2 className="w-4 h-4" /> Remove File
                </Button>
              </div>
            )}
          </Card>
        </FadeIn>

        {file && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-4 space-y-6">
              <FadeIn delay={200}>
                <Card className="p-5 space-y-5 sticky top-6 overflow-visible">
                  <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">AI Configuration</h3>
                  
                  <div className="space-y-3">
                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${config.runPage2Text ? 'bg-blue-50 border-blue-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input type="checkbox" checked={config.runPage2Text} onChange={e => setConfig({...config, runPage2Text: e.target.checked})} className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                      <div>
                        <div className="font-bold text-slate-800 text-sm flex items-center gap-2"><FileText className="w-4 h-4" /> Text Extraction</div>
                        <div className="text-xs text-slate-500 mt-0.5">Raw text + Hybrid OCR if needed</div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${config.runPage2Ai ? 'bg-purple-50 border-purple-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input type="checkbox" checked={config.runPage2Ai} onChange={e => setConfig({...config, runPage2Ai: e.target.checked})} className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                      <div>
                        <div className="font-bold text-slate-800 text-sm flex items-center gap-2"><Cpu className="w-4 h-4" /> Cognitive Analysis</div>
                        <div className="text-xs text-slate-500 mt-0.5">Summaries, Entities, and Intelligent Insights</div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${config.runPage2Table ? 'bg-emerald-50 border-emerald-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input type="checkbox" checked={config.runPage2Table} onChange={e => setConfig({...config, runPage2Table: e.target.checked})} className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                      <div>
                        <div className="font-bold text-slate-800 text-sm flex items-center gap-2"><Table className="w-4 h-4" /> Tabular Extraction</div>
                        <div className="text-xs text-slate-500 mt-0.5">Detects tables and converts to JSON</div>
                      </div>
                    </label>

                    <div className="pt-4 border-t border-slate-100">
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" /> Output Language (Optional)
                      </label>
                      <LanguageSelector 
                        value={config.targetLanguage} 
                        onChange={(code) => setConfig({...config, targetLanguage: code})}
                        placeholder="Select Language"
                      />
                      <p className="text-xs text-slate-400 mt-2">If empty, keeps original document language.</p>
                    </div>
                  </div>

                  <Button 
                    onClick={processQueue} 
                    disabled={isProcessing || selectedPages.size === 0} 
                    className="w-full justify-center py-3 text-lg shadow-blue-200 shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all"
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing {progress.current}/{progress.total}...</>
                    ) : (
                      <>Process {selectedPages.size} page(s)</>
                    )}
                  </Button>

                  {Object.keys(results).length > 0 && !isProcessing && (
                      <div className="pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                              <h3 className="font-bold text-green-800 text-sm mb-1">Processing Completed!</h3>
                              <p className="text-green-700 text-xs mb-3">{Object.keys(results).length} pages analyzed.</p>
                              <Button variant="primary" onClick={handleDownloadZip} className="w-full bg-green-600 hover:bg-green-700 border-transparent shadow-green-200">
                                  <Download className="w-4 h-4" /> Download all (.zip)
                              </Button>
                          </div>
                      </div>
                  )}
                </Card>
              </FadeIn>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <FadeIn delay={300}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">Select pages to analyze</h3>
                    <button onClick={toggleSelectAll} className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 px-3 py-1 rounded transition-colors">
                      {selectedPages.size === pageCount ? "Deselect all" : "Select all"}
                    </button>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar p-1">
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNum => {
                      const isSelected = selectedPages.has(pageNum);
                      const hasResult = results[pageNum];
                      const isError = hasResult && Object.values(hasResult).some(r => !r.success);

                      let statusClasses = isSelected 
                          ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500 font-bold" 
                          : "bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500";
                      
                      if (hasResult) {
                            statusClasses = isError 
                              ? "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500" 
                              : "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500";
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => togglePageSelection(pageNum)}
                          disabled={isProcessing}
                          className={`
                            relative h-10 rounded-lg border text-sm transition-all duration-200
                            flex items-center justify-center
                            ${statusClasses}
                          `}
                        >
                          {pageNum}
                          {hasResult && !isError && <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5"><Check className="w-2 h-2" /></div>}
                        </button>
                      );
                    })}
                  </div>
                </Card>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      Results Preview
                      <span className="text-sm font-normal text-slate-400 ml-2 bg-slate-100 px-2 py-0.5 rounded-full">
                          {Object.keys(results).length} items
                      </span>
                  </h3>
                  
                  {Object.keys(results).length === 0 ? (
                    <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                      <div className="flex justify-center mb-2">
                          <Cpu className="w-10 h-10 text-slate-200" />
                      </div>
                      <p>No results to display yet.</p>
                      <p className="text-sm mt-1">Select pages and click Process.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(results).map(([pageNum, endpoints]) => (
                        <Card key={pageNum} className="p-0 overflow-visible border-none shadow-none bg-transparent">
                          <div className="flex items-center gap-3 mb-3 pl-1">
                              <div className="bg-slate-800 text-white font-bold px-3 py-1 rounded text-sm">Page {pageNum}</div>
                              <div className="h-px bg-slate-200 flex-1"></div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {Object.entries(endpoints).map(([key, val]) => (
                              <JsonViewer 
                                  key={key} 
                                  title={key.toUpperCase()} 
                                  data={val.data} 
                                  success={val.success} 
                                  error={val.error}
                              />
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}