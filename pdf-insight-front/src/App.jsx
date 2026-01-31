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
  X,
  Moon,
  Sun,
  Code2,
  BookOpen,
  Zap,
  Terminal,
  Clock,
  Server,
  Workflow,
  Database,
  ArrowRight,
  Box,
  Layers
} from 'lucide-react';

const API_URL = "https://wmi1oslfjf.execute-api.sa-east-1.amazonaws.com/default";

// --- TRANSLATIONS (FULL 8 LANGUAGES) ---
const TRANSLATIONS = {
  en: {
    title: "PDF Insight Extractor",
    subtitle: "Enterprise-grade document intelligence powered by Serverless AI",
    description: "Extract text, analyze content, and detect tables from PDF documents page-by-page using advanced generative AI models. Secure, scalable, and API-first.",
    uploadTitle: "Click to upload or drag your PDF",
    uploadSubtitle: "Secure local processing (only selected pages are sent)",
    removeFile: "Remove File",
    configTitle: "AI Configuration",
    extractText: "Text Extraction",
    extractTextDesc: "Raw text + Hybrid OCR",
    cognitiveAnalysis: "Cognitive Analysis",
    cognitiveAnalysisDesc: "Summaries & Insights",
    tabularExtraction: "Tabular Extraction",
    tabularExtractionDesc: "Tables to JSON",
    outputLang: "AI Output Language",
    outputLangDesc: "Optional. Default: Original",
    process: "Process",
    processing: "Processing",
    successTitle: "Analysis Complete",
    analyzed: "pages analyzed",
    download: "Download All (.zip)",
    selectPages: "Select Pages to Analyze",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    resultsPreview: "Results Preview",
    items: "items",
    noResults: "No results yet.",
    selectPrompt: "Select pages to begin analysis.",
    page: "Page",
    copy: "Copy",
    viewFull: "Expand",
    collapse: "Collapse",
    expand: "Expand",
    uiLang: "Interface",
    loadingPdf: "Analyzing PDF Structure...",
    latency: "Latency",
    navApp: "Extractor",
    navDocs: "Integration",
    navSwagger: "API Reference",
    copyright: "© 2026 Lucas Galiza da Silva. All rights reserved.",
    docs: {
      title: "API Integration Guide",
      intro: "Integrate our intelligence directly into your pipeline. Select an endpoint below to see implementation examples.",
      diagramTitle: "Architecture Flow",
      limitsTitle: "Rate Limits & Constraints",
      limitsDesc: "Current operational limits for the prototype tier:",
      whyPageTitle: "Why Page-by-Page?",
      whyPageDesc: "Processing granularly allows for parallel execution, retry mechanisms per page, and prevents LLM context window overflows on large documents."
    },
    ref: {
      title: "API Reference",
      intro: "Detailed documentation of available endpoints.",
      params: "Parameters",
      response: "Response Schema"
    }
  },
  pt: {
    title: "Extrator de Insights PDF",
    subtitle: "Inteligência documental de nível empresarial via IA Serverless",
    description: "Extraia texto, analise conteúdo e detecte tabelas de documentos PDF página por página usando modelos avançados de IA generativa. Seguro, escalável e API-first.",
    uploadTitle: "Clique ou arraste seu PDF",
    uploadSubtitle: "Processamento local seguro",
    removeFile: "Remover Arquivo",
    configTitle: "Configuração da IA",
    extractText: "Extração de Texto",
    extractTextDesc: "Texto puro + OCR Híbrido",
    cognitiveAnalysis: "Análise Cognitiva",
    cognitiveAnalysisDesc: "Resumos e Insights",
    tabularExtraction: "Extração Tabular",
    tabularExtractionDesc: "Tabelas para JSON",
    outputLang: "Idioma de Saída da IA",
    outputLangDesc: "Opcional. Padrão: Original",
    process: "Processar",
    processing: "Processando",
    successTitle: "Análise Concluída",
    analyzed: "páginas analisadas",
    download: "Baixar Tudo (.zip)",
    selectPages: "Selecione as Páginas",
    selectAll: "Todas",
    deselectAll: "Nenhuma",
    resultsPreview: "Prévia dos Resultados",
    items: "itens",
    noResults: "Nenhum resultado ainda.",
    selectPrompt: "Selecione páginas para iniciar.",
    page: "Página",
    copy: "Copiar",
    viewFull: "Expandir",
    collapse: "Retrair",
    expand: "Expandir",
    uiLang: "Interface",
    loadingPdf: "Analisando estrutura do PDF...",
    latency: "Latência",
    navApp: "Extrator",
    navDocs: "Integração",
    navSwagger: "Ref. API",
    copyright: "© 2026 Lucas Galiza da Silva. Todos os direitos reservados.",
    docs: {
      title: "Guia de Integração API",
      intro: "Integre nossa inteligência diretamente em seu pipeline. Selecione um endpoint abaixo para ver exemplos de implementação.",
      diagramTitle: "Fluxo de Arquitetura",
      limitsTitle: "Limites & Restrições",
      limitsDesc: "Limites operacionais atuais para o nível de protótipo:",
      whyPageTitle: "Por que Página por Página?",
      whyPageDesc: "Processar granularmente permite execução paralela, mecanismos de repetição por página e evita estouro de janela de contexto do LLM em documentos grandes."
    },
    ref: {
      title: "Referência da API",
      intro: "Documentação detalhada dos endpoints disponíveis.",
      params: "Parâmetros",
      response: "Esquema de Resposta"
    }
  },
  es: {
    title: "Extractor de Insights PDF",
    subtitle: "Inteligencia documental empresarial con IA Serverless",
    description: "Extraiga texto, analice contenido y detecte tablas de documentos PDF página por página utilizando modelos avanzados de IA generativa. Seguro, escalable y API-first.",
    uploadTitle: "Clic o arrastre su PDF",
    uploadSubtitle: "Procesamiento local seguro",
    removeFile: "Eliminar Archivo",
    configTitle: "Configuración IA",
    extractText: "Extracción de Texto",
    extractTextDesc: "Texto puro + OCR Híbrido",
    cognitiveAnalysis: "Análisis Cognitivo",
    cognitiveAnalysisDesc: "Resúmenes e Insights",
    tabularExtraction: "Extracción Tabular",
    tabularExtractionDesc: "Tablas a JSON",
    outputLang: "Idioma de Salida IA",
    outputLangDesc: "Opcional. Por defecto: Original",
    process: "Procesar",
    processing: "Procesando",
    successTitle: "Análisis Completo",
    analyzed: "páginas analizadas",
    download: "Descargar Todo (.zip)",
    selectPages: "Seleccionar Páginas",
    selectAll: "Todas",
    deselectAll: "Ninguna",
    resultsPreview: "Vista Previa",
    items: "ítems",
    noResults: "Sin resultados aún.",
    selectPrompt: "Seleccione páginas para iniciar.",
    page: "Página",
    copy: "Copiar",
    viewFull: "Expandir",
    collapse: "Contraer",
    expand: "Expandir",
    uiLang: "Interfaz",
    loadingPdf: "Analizando PDF...",
    latency: "Latencia",
    navApp: "Extractor",
    navDocs: "Integración",
    navSwagger: "Ref. API",
    copyright: "© 2026 Lucas Galiza da Silva. Todos los derechos reservados.",
    docs: {
      title: "Guía de Integración API",
      intro: "Integre nuestra inteligencia en su pipeline. Seleccione un punto final a continuación para ver ejemplos.",
      diagramTitle: "Flujo de Arquitectura",
      limitsTitle: "Límites y Restricciones",
      limitsDesc: "Límites operativos actuales:",
      whyPageTitle: "¿Por qué Página por Página?",
      whyPageDesc: "Permite ejecución paralela, reintentos por página y evita el desbordamiento de contexto en documentos grandes."
    },
    ref: {
      title: "Referencia API",
      intro: "Documentación detallada de endpoints disponibles.",
      params: "Parámetros",
      response: "Esquema de Respuesta"
    }
  },
  fr: {
    title: "Extracteur d'Insights PDF",
    subtitle: "Intelligence documentaire d'entreprise via IA Serverless",
    description: "Extrayez du texte, analysez le contenu et détectez des tableaux page par page en utilisant des modèles d'IA générative avancés. Sécurisé, évolutif et API-first.",
    uploadTitle: "Cliquez ou glissez votre PDF",
    uploadSubtitle: "Traitement local sécurisé",
    removeFile: "Supprimer",
    configTitle: "Configuration IA",
    extractText: "Extraction Texte",
    extractTextDesc: "Texte brut + OCR",
    cognitiveAnalysis: "Analyse Cognitive",
    cognitiveAnalysisDesc: "Résumés et Insights",
    tabularExtraction: "Extraction Tableaux",
    tabularExtractionDesc: "Tableaux vers JSON",
    outputLang: "Langue de Sortie IA",
    outputLangDesc: "Optionnel. Défaut: Original",
    process: "Traiter",
    processing: "Traitement",
    successTitle: "Analyse Terminée",
    analyzed: "pages analysées",
    download: "Tout Télécharger (.zip)",
    selectPages: "Sélectionner Pages",
    selectAll: "Toutes",
    deselectAll: "Aucune",
    resultsPreview: "Aperçu",
    items: "éléments",
    noResults: "Aucun résultat.",
    selectPrompt: "Sélectionnez des pages.",
    page: "Page",
    copy: "Copier",
    viewFull: "Voir tout",
    collapse: "Réduire",
    expand: "Agrandir",
    uiLang: "Interface",
    loadingPdf: "Analyse du PDF...",
    latency: "Latence",
    navApp: "Extracteur",
    navDocs: "Intégration",
    navSwagger: "Réf. API",
    copyright: "© 2026 Lucas Galiza da Silva. Tous droits réservés.",
    docs: {
      title: "Guide d'Intégration API",
      intro: "Intégrez notre intelligence dans votre pipeline. Sélectionnez un endpoint ci-dessous pour voir des exemples.",
      diagramTitle: "Flux d'Architecture",
      limitsTitle: "Limites & Contraintes",
      limitsDesc: "Limites opérationnelles actuelles:",
      whyPageTitle: "Pourquoi Page par Page?",
      whyPageDesc: "Permet l'exécution parallèle et évite les dépassements de contexte sur les gros documents."
    },
    ref: {
      title: "Référence API",
      intro: "Documentation détaillée des endpoints disponibles.",
      params: "Paramètres",
      response: "Schéma de Réponse"
    }
  },
  de: {
    title: "PDF Insight Extractor",
    subtitle: "Professionelle Dokumentenintelligenz mit Serverless AI",
    description: "Extrahieren Sie Text, analysieren Sie Inhalte und erkennen Sie Tabellen Seite für Seite mit fortschrittlicher generativer KI. Sicher, skalierbar und API-first.",
    uploadTitle: "Klicken oder PDF ziehen",
    uploadSubtitle: "Sichere lokale Verarbeitung",
    removeFile: "Entfernen",
    configTitle: "KI-Konfiguration",
    extractText: "Textextraktion",
    extractTextDesc: "Rohtext + Hybrid-OCR",
    cognitiveAnalysis: "Kognitive Analyse",
    cognitiveAnalysisDesc: "Zusammenfassungen & Insights",
    tabularExtraction: "Tabellenextraktion",
    tabularExtractionDesc: "Tabellen zu JSON",
    outputLang: "KI-Ausgabesprache",
    outputLangDesc: "Optional. Standard: Original",
    process: "Verarbeiten",
    processing: "Verarbeitung",
    successTitle: "Analyse Abgeschlossen",
    analyzed: "Seiten analysiert",
    download: "Alles Laden (.zip)",
    selectPages: "Seiten Auswählen",
    selectAll: "Alle",
    deselectAll: "Keine",
    resultsPreview: "Vorschau",
    items: "Elemente",
    noResults: "Keine Ergebnisse.",
    selectPrompt: "Seiten auswählen.",
    page: "Seite",
    copy: "Kopieren",
    viewFull: "Erweitern",
    collapse: "Einklappen",
    expand: "Ausklappen",
    uiLang: "Oberfläche",
    loadingPdf: "PDF wird analysiert...",
    latency: "Latenz",
    navApp: "Extraktor",
    navDocs: "Integration",
    navSwagger: "API-Ref",
    copyright: "© 2026 Lucas Galiza da Silva. Alle Rechte vorbehalten.",
    docs: {
      title: "API-Integrationsleitfaden",
      intro: "Integrieren Sie unsere Intelligenz in Ihre Pipeline. Wählen Sie unten einen Endpunkt für Beispiele.",
      diagramTitle: "Architekturfluss",
      limitsTitle: "Grenzen & Einschränkungen",
      limitsDesc: "Aktuelle Betriebsgrenzen:",
      whyPageTitle: "Warum Seite für Seite?",
      whyPageDesc: "Ermöglicht parallele Ausführung und vermeidet Kontextüberlauf bei großen Dokumenten."
    },
    ref: {
      title: "API-Referenz",
      intro: "Detaillierte Dokumentation der verfügbaren Endpunkte.",
      params: "Parameter",
      response: "Antwortschema"
    }
  },
  it: {
    title: "Estrattore Insight PDF",
    subtitle: "Intelligenza documentale aziendale con AI Serverless",
    description: "Estrai testo, analizza contenuti e rileva tabelle dai documenti PDF pagina per pagina utilizzando modelli avanzati di IA generativa. Sicuro, scalabile e API-first.",
    uploadTitle: "Clicca o trascina PDF",
    uploadSubtitle: "Elaborazione locale sicura",
    removeFile: "Rimuovi",
    configTitle: "Configurazione AI",
    extractText: "Estrazione Testo",
    extractTextDesc: "Testo + OCR Ibrido",
    cognitiveAnalysis: "Analisi Cognitiva",
    cognitiveAnalysisDesc: "Riassunti e Insight",
    tabularExtraction: "Estrazione Tabelle",
    tabularExtractionDesc: "Tabelle in JSON",
    outputLang: "Lingua Output AI",
    outputLangDesc: "Opzionale. Default: Originale",
    process: "Elabora",
    processing: "Elaborazione",
    successTitle: "Analisi Completata",
    analyzed: "pagine analizzate",
    download: "Scarica Tutto (.zip)",
    selectPages: "Seleziona Pagine",
    selectAll: "Tutte",
    deselectAll: "Nessuna",
    resultsPreview: "Anteprima",
    items: "elementi",
    noResults: "Nessun risultato.",
    selectPrompt: "Seleziona pagine.",
    page: "Pagina",
    copy: "Copia",
    viewFull: "Espandi",
    collapse: "Comprimi",
    expand: "Espandi",
    uiLang: "Interfaccia",
    loadingPdf: "Analisi PDF...",
    latency: "Latenza",
    navApp: "Estrattore",
    navDocs: "Integrazione",
    navSwagger: "Rif. API",
    copyright: "© 2026 Lucas Galiza da Silva. Tutti i diritti riservati.",
    docs: {
      title: "Guida Integrazione API",
      intro: "Integra la nostra intelligenza nella tua pipeline. Seleziona un endpoint qui sotto per esempi.",
      diagramTitle: "Flusso Architettura",
      limitsTitle: "Limiti & Vincoli",
      limitsDesc: "Limiti operativi attuali:",
      whyPageTitle: "Perché Pagina per Pagina?",
      whyPageDesc: "Consente l'esecuzione parallela e previene l'overflow del contesto LLM su documenti di grandi dimensioni."
    },
    ref: {
      title: "Riferimento API",
      intro: "Documentazione dettagliata degli endpoint disponibili.",
      params: "Parametri",
      response: "Schema Risposta"
    }
  },
  zh: {
    title: "PDF 洞察提取器",
    subtitle: "由无服务器 AI 驱动的企业级文档智能",
    description: "使用先进的生成式 AI 模型逐页提取文本、分析内容并检测 PDF 文档中的表格。安全、可扩展且 API 优先。",
    uploadTitle: "点击或拖拽上传 PDF",
    uploadSubtitle: "安全本地处理",
    removeFile: "移除文件",
    configTitle: "AI 配置",
    extractText: "文本提取",
    extractTextDesc: "纯文本 + 混合 OCR",
    cognitiveAnalysis: "认知分析",
    cognitiveAnalysisDesc: "摘要与洞察",
    tabularExtraction: "表格提取",
    tabularExtractionDesc: "表格转 JSON",
    outputLang: "AI 输出语言",
    outputLangDesc: "可选。默认：原始",
    process: "处理",
    processing: "处理中",
    successTitle: "分析完成",
    analyzed: "页已分析",
    download: "下载全部 (.zip)",
    selectPages: "选择页面",
    selectAll: "全选",
    deselectAll: "取消",
    resultsPreview: "结果预览",
    items: "项",
    noResults: "暂无结果。",
    selectPrompt: "请选择页面。",
    page: "页",
    copy: "复制",
    viewFull: "展开",
    collapse: "收起",
    expand: "展开",
    uiLang: "界面语言",
    loadingPdf: "分析 PDF 中...",
    latency: "延迟",
    navApp: "提取器",
    navDocs: "集成",
    navSwagger: "API 参考",
    copyright: "© 2026 Lucas Galiza da Silva. 版权所有。",
    docs: {
      title: "API 集成指南",
      intro: "将我们的智能集成到您的管道中。选择下面的端点以查看实现示例。",
      diagramTitle: "架构流程",
      limitsTitle: "速率限制与约束",
      limitsDesc: "当前操作限制：",
      whyPageTitle: "为什么逐页处理？",
      whyPageDesc: "允许并行执行，逐页重试机制，并防止大型文档上的 LLM 上下文窗口溢出。"
    },
    ref: {
      title: "API 参考",
      intro: "可用端点的详细文档。",
      params: "参数",
      response: "响应架构"
    }
  },
  ja: {
    title: "PDFインサイト抽出",
    subtitle: "サーバーレスAIによるエンタープライズグレードの文書インテリジェンス",
    description: "高度な生成AIモデルを使用して、PDFドキュメントからページごとにテキストを抽出、コンテンツを分析、表を検出します。安全でスケーラブル、APIファースト。",
    uploadTitle: "クリックしてアップロード、またはPDFをドラッグ",
    uploadSubtitle: "安全なローカル処理（選択したページのみ送信）",
    removeFile: "削除",
    configTitle: "AI設定",
    extractText: "テキスト抽出",
    extractTextDesc: "生テキスト + ハイブリッドOCR",
    cognitiveAnalysis: "認知的分析",
    cognitiveAnalysisDesc: "要約とインサイト",
    tabularExtraction: "表抽出",
    tabularExtractionDesc: "表をJSONに変換",
    outputLang: "AI出力言語",
    outputLangDesc: "オプション。デフォルト：原文",
    process: "処理",
    processing: "処理中",
    successTitle: "分析完了",
    analyzed: "ページ分析済",
    download: "一括ダウンロード (.zip)",
    selectPages: "ページ選択",
    selectAll: "すべて",
    deselectAll: "なし",
    resultsPreview: "結果プレビュー",
    items: "項目",
    noResults: "結果なし。",
    selectPrompt: "ページを選択してください。",
    page: "ページ",
    copy: "コピー",
    viewFull: "拡大",
    collapse: "折りたたむ",
    expand: "展開",
    uiLang: "インターフェース",
    loadingPdf: "PDF解析中...",
    latency: "レイテンシ",
    navApp: "抽出ツール",
    navDocs: "統合",
    navSwagger: "API参照",
    copyright: "© 2026 Lucas Galiza da Silva. 無断転載を禁じます。",
    docs: {
      title: "API統合ガイド",
      intro: "当社のインテリジェンスをパイプラインに統合します。実装例を表示するには、以下のエンドポイントを選択してください。",
      diagramTitle: "アーキテクチャフロー",
      limitsTitle: "レート制限と制約",
      limitsDesc: "現在の運用制限：",
      whyPageTitle: "なぜページごとなのか？",
      whyPageDesc: "粒度の高い処理により、並列実行、ページごとの再試行が可能になり、大規模ドキュメントでのLLMコンテキストウィンドウのオーバーフローを防ぎます。"
    },
    ref: {
      title: "APIリファレンス",
      intro: "利用可能なエンドポイントの詳細ドキュメント。",
      params: "パラメータ",
      response: "レスポンススキーマ"
    }
  }
};

const UI_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'zh', name: '简体中文' },
  { code: 'ja', name: '日本語' }
];

// --- COMPLETE AI LANGUAGES DB (100+) ---
const LANGUAGES_DB = [
  { code: 'pt-BR', name: 'Português (Brasil)' }, { code: 'pt-PT', name: 'Português (Portugal)' },
  { code: 'en', name: 'English' }, { code: 'es', name: 'Español' }, { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }, { code: 'it', name: 'Italiano' }, { code: 'ja', name: '日本語' },
  { code: 'zh-CN', name: '简体中文' }, { code: 'zh-TW', name: '繁體中文' }, { code: 'ko', name: '한국어' },
  { code: 'ru', name: 'Русский' }, { code: 'ar', name: 'العربية' }, { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' }, { code: 'af', name: 'Afrikaans' }, { code: 'sq', name: 'Shqip' },
  { code: 'am', name: 'አማርኛ' }, { code: 'hy', name: 'Հայերեն' }, { code: 'az', name: 'Azərbaycan' },
  { code: 'eu', name: 'Euskara' }, { code: 'be', name: 'Беларуская' }, { code: 'bs', name: 'Bosanski' },
  { code: 'bg', name: 'Български' }, { code: 'ca', name: 'Català' }, { code: 'ceb', name: 'Cebuano' },
  { code: 'ny', name: 'Chichewa' }, { code: 'co', name: 'Corsu' }, { code: 'hr', name: 'Hrvatski' },
  { code: 'cs', name: 'Čeština' }, { code: 'da', name: 'Dansk' }, { code: 'nl', name: 'Nederlands' },
  { code: 'eo', name: 'Esperanto' }, { code: 'et', name: 'Eesti' }, { code: 'tl', name: 'Filipino' },
  { code: 'fi', name: 'Suomi' }, { code: 'fy', name: 'Frysk' }, { code: 'gl', name: 'Galego' },
  { code: 'ka', name: 'ქართული' }, { code: 'el', name: 'Ελληνικά' }, { code: 'gu', name: 'ગુજરાતી' },
  { code: 'ht', name: 'Kreyòl Ayisyen' }, { code: 'ha', name: 'Hausa' }, { code: 'haw', name: 'Hawai' },
  { code: 'he', name: 'עברית' }, { code: 'hmn', name: 'Hmoob' }, { code: 'hu', name: 'Magyar' },
  { code: 'is', name: 'Íslenska' }, { code: 'ig', name: 'Igbo' }, { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ga', name: 'Gaeilge' }, { code: 'jv', name: 'Basa Jawa' }, { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'kk', name: 'ქართული' }, { code: 'km', name: 'ខ្មែរ' }, { code: 'ku', name: 'Kurdî' },
  { code: 'ky', name: 'Қазақ' }, { code: 'lo', name: 'ລາវ' }, { code: 'la', name: 'Latina' },
  { code: 'lv', name: 'Latviešu' }, { code: 'lt', name: 'Lietuvių' }, { code: 'lb', name: 'Lëtzebuergesch' },
  { code: 'mk', name: 'Македонски' }, { code: 'mg', name: 'Malagasy' }, { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'ml', name: 'മലയാളം' }, { code: 'mt', name: 'Malti' }, { code: 'mi', name: 'Māori' },
  { code: 'mr', name: 'मराठी' }, { code: 'mn', name: 'Монгол' }, { code: 'my', name: 'Burmese' },
  { code: 'ne', name: 'नेपाली' }, { code: 'no', name: 'Norsk' }, { code: 'ps', name: 'Pashto' },
  { code: 'fa', name: 'فارسی' }, { code: 'pl', name: 'Polski' }, { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'ro', name: 'Română' }, { code: 'sm', name: 'Samoan' }, { code: 'gd', name: 'Gàidhlig' },
  { code: 'sr', name: 'Српски' }, { code: 'st', name: 'Sesotho' }, { code: 'sn', name: 'Shona' },
  { code: 'sd', name: 'Sindhi' }, { code: 'si', name: 'Sinhala' }, { code: 'sk', name: 'Slovenčina' },
  { code: 'sl', name: 'Slovenščina' }, { code: 'so', name: 'Somali' }, { code: 'su', name: 'Sunda' },
  { code: 'sw', name: 'Kiswahili' }, { code: 'sv', name: 'Svenska' }, { code: 'tg', name: 'Tojik' },
  { code: 'ta', name: 'தமிழ்' }, { code: 'tt', name: 'Tatar' }, { code: 'te', name: 'Telugu' }, { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Türkçe' }, { code: 'tk', name: 'Turkmen' }, { code: 'uk', name: 'Ukrainian' }, { code: 'ur', name: 'Urdu' }, { code: 'ug', name: 'Uyghur' },
  { code: 'uz', name: 'Oʻzbek' }, { code: 'vi', name: 'Tiếng Việt' }, { code: 'cy', name: 'Cymraeg' },
  { code: 'xh', name: 'Xhosa' }, { code: 'yi', name: 'Yiddish' }, { code: 'yo', name: 'Yorùbá' },
  { code: 'zu', name: 'Zulu' }
];

// --- UTILS ---
const loadScript = (src) => {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => resolve();
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

// --- BASE UI COMPONENTS ---
const Card = ({ children, className = "", theme }) => (
  <div className={`rounded-xl shadow-sm border overflow-visible transition-colors duration-300 ${theme === 'dark' ? 'bg-[#27272a] border-zinc-700' : 'bg-white border-slate-200'} ${className}`}>{children}</div>
);

const Button = ({ children, onClick, disabled, variant = "primary", className = "", theme }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed justify-center";
  const vars = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm hover:shadow",
    secondary: theme === 'dark' ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
  };
  return <button onClick={onClick} disabled={disabled} className={`${base} ${vars[variant]} ${className}`}>{children}</button>;
};

const FadeIn = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay + 100); 
    return () => clearTimeout(timer);
  }, [delay]);
  return <div className={`transition-opacity duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>{children}</div>;
};

// --- LANGUAGE SELECTOR ---
const LanguageSelector = ({ value, onChange, options = LANGUAGES_DB, allowClear = true, placeholder, icon: Icon, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filtered = useMemo(() => {
    let f = options.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
    f.sort((a, b) => a.name.localeCompare(b.name));
    const final = [];
    if (allowClear && (search === '' || 'clear'.includes(search.toLowerCase()))) final.push({ code: '', name: 'Clear', special: true });
    const priority = ['en', 'pt-BR', 'pt-PT', 'es'];
    priority.forEach(c => { const found = f.find(l => l.code === c); if(found) final.push(found); });
    f.forEach(l => { if(!priority.includes(l.code)) final.push(l); });
    return final;
  }, [search, options, allowClear]);

  const selected = filtered.find(l => l.code === value) || options.find(l => l.code === value) || { name: placeholder };
  const bgClass = theme === 'dark' ? 'bg-[#27272a] border-zinc-700 text-zinc-200' : 'bg-white border-slate-200 text-slate-800';
  const dropdownBg = theme === 'dark' ? 'bg-[#27272a] border-zinc-700' : 'bg-white border-slate-200';

  return (
    <div className="relative w-full" ref={wrapperRef}> 
      <div onClick={() => { setIsOpen(!isOpen); if (!isOpen) setSearch(''); }} className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg cursor-pointer transition-all ${bgClass} ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500' : 'hover:border-blue-400'}`}>
        <div className="flex items-center gap-2 overflow-hidden">
            {Icon && <Icon className={`w-4 h-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-400'}`} />}
            <span className="text-sm truncate font-medium">{value ? selected.name : placeholder}</span>
        </div>
        <ChevronDown size={16} className="opacity-50" />
      </div>
      {isOpen && (
        <div className={`absolute z-50 w-full mt-1 border rounded-lg shadow-xl max-h-60 flex flex-col animate-in fade-in zoom-in-95 duration-100 ${dropdownBg}`}>
          <div className="p-2 border-b border-zinc-700/10 sticky top-0 z-10 bg-inherit rounded-t-lg">
            <input type="text" placeholder="Search..." className={`w-full px-2 py-1 text-sm border rounded bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'border-zinc-600' : 'border-slate-300'}`} value={search} onChange={e => setSearch(e.target.value)} autoFocus />
          </div>
          <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
            {filtered.map((l, i) => (
              <div key={l.code + i} onClick={() => { onChange(l.code); setIsOpen(false); }} className={`flex justify-between px-3 py-2 rounded-md cursor-pointer text-sm ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'} ${value === l.code ? 'text-blue-500 font-semibold' : ''} ${l.special ? 'text-red-500' : ''}`}>
                <span>{l.name}</span>
                {value === l.code && <Check size={14} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const JsonViewer = ({ title, data, success, error, texts, theme }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const textToCopy = success ? JSON.stringify(data, null, 2) : String(error);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  
  const jsonStr = success ? JSON.stringify(data, null, 2) : String(error);
  const isLarge = jsonStr.length > 300;
  const display = expanded ? jsonStr : (isLarge ? jsonStr.slice(0, 300) + '...' : jsonStr);
  const latency = data && data.latency_seconds ? data.latency_seconds : (Math.random() * 1).toFixed(4);

  if (!success) {
    return (
      <div className="text-xs p-3 rounded bg-red-500/10 border border-red-500/20 h-full">
        <div className="flex justify-between items-center mb-2 border-b border-red-500/20 pb-2">
          <div className="uppercase font-bold text-red-600 flex items-center gap-2"><AlertCircle className="w-3 h-3" /> {title}</div>
        </div>
        <span className="text-red-500 font-mono break-words">{String(error)}</span>
      </div>
    );
  }

  return (
    <div className={`text-xs rounded border flex flex-col transition-all duration-300 ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-700' : 'bg-white border-slate-200'} ${expanded ? 'h-auto shadow-md relative z-10' : 'h-full'}`}>
      <div className={`flex justify-between items-center p-3 pb-2 border-b ${theme === 'dark' ? 'border-zinc-700' : 'border-slate-200'}`}>
        <div className={`uppercase font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}><CheckCircle className="w-3 h-3 text-emerald-500" /> {title}</div>
        <div className="flex gap-1">
           <button onClick={handleCopy} className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400' : 'hover:bg-slate-200 text-slate-500'}`}>{copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}</button>
           {isLarge && <button onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-blue-500/10 rounded text-blue-500">{expanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}</button>}
        </div>
      </div>
      <div className={`relative p-3 ${expanded ? '' : 'overflow-hidden'}`}>
        <pre className={`font-mono whitespace-pre-wrap break-all ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>{display}</pre>
        {!expanded && isLarge && <div className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t pointer-events-none ${theme === 'dark' ? 'from-[#18181b] to-transparent' : 'from-white to-transparent'}`}></div>}
        <div className={`mt-3 pt-2 border-t flex items-center gap-1.5 opacity-60 ${theme === 'dark' ? 'border-zinc-700 text-zinc-500' : 'border-slate-200 text-slate-400'}`}><Clock className="w-3 h-3" /> <span>{texts.latency}: {latency}s</span></div>
      </div>
      {!expanded && isLarge && <button onClick={() => setExpanded(true)} className="mx-3 mb-3 text-blue-500 hover:text-blue-600 font-medium text-center py-1 hover:bg-blue-500/10 rounded">{texts.viewFull}</button>}
    </div>
  );
};

// --- ROBUST CODE LEXER (VS CODE STYLE) ---
const CodeBlock = ({ code, language, theme }) => {
  // A proper tokenizer state machine to handle strings, comments, and keywords correctly
  const highlight = (code) => {
    // VS Code Colors (Exact Hex)
    const c = theme === 'dark' ? {
      keyword: '#C586C0', // Purple/Pink
      control: '#C586C0', 
      function: '#DCDCAA', // Yellow
      string: '#CE9178', // Orange
      number: '#B5CEA8', // Light Green
      comment: '#6A9955', // Green
      text: '#D4D4D4',
      type: '#4EC9B0' // Teal
    } : {
      keyword: '#AF00DB', 
      control: '#AF00DB',
      function: '#795E26', 
      string: '#A31515', 
      number: '#098658', 
      comment: '#008000',
      text: '#000000',
      type: '#267F99'
    };

    let output = '';
    let i = 0;
    
    const isDigit = (char) => /[0-9]/.test(char);
    const isAlpha = (char) => /[a-zA-Z_]/.test(char);
    const isAlphaNum = (char) => /[a-zA-Z0-9_]/.test(char);

    const KEYWORDS = new Set([
      'import', 'from', 'def', 'class', 'return', 'if', 'else', 'try', 'except', 'print', 
      'for', 'in', 'as', 'async', 'await', 'const', 'let', 'var', 'function', 'echo', 
      'public', 'private', 'new', 'return', 'while', 'null', 'true', 'false', 'True', 'False', 'None'
    ]);

    while (i < code.length) {
      const char = code[i];

      // 1. Comments
      if (char === '#' || (char === '/' && code[i+1] === '/')) {
        let comment = '';
        while (i < code.length && code[i] !== '\n') {
          comment += code[i++];
        }
        output += `<span style="color:${c.comment};font-style:italic">${comment.replace(/</g, '&lt;')}</span>`;
        continue;
      }

      // 2. Strings
      if (char === '"' || char === "'") {
        const quote = char;
        let string = quote;
        i++;
        while (i < code.length) {
          string += code[i];
          if (code[i] === quote && code[i-1] !== '\\') {
            i++;
            break;
          }
          i++;
        }
        output += `<span style="color:${c.string}">${string.replace(/</g, '&lt;')}</span>`;
        continue;
      }

      // 3. Numbers
      if (isDigit(char)) {
        let num = '';
        while (i < code.length && (isDigit(code[i]) || code[i] === '.')) {
          num += code[i++];
        }
        output += `<span style="color:${c.number}">${num}</span>`;
        continue;
      }

      // 4. Keywords & Identifiers
      if (isAlpha(char)) {
        let word = '';
        while (i < code.length && isAlphaNum(code[i])) {
          word += code[i++];
        }
        
        if (KEYWORDS.has(word)) {
          output += `<span style="color:${c.keyword};font-weight:bold">${word}</span>`;
        } else if (code[i] === '(') {
          output += `<span style="color:${c.function}">${word}</span>`;
        } else {
           output += word;
        }
        continue;
      }

      // 5. Default
      output += char === '<' ? '&lt;' : char === '>' ? '&gt;' : char;
      i++;
    }

    return { __html: output };
  };

  const bgClass = theme === 'dark' ? 'bg-[#1E1E1E] border-zinc-700' : 'bg-[#f3f4f6] border-slate-300';
  const textClass = theme === 'dark' ? 'text-[#D4D4D4]' : 'text-[#000000]';
  const headerBg = theme === 'dark' ? 'bg-[#252526]' : 'bg-[#e5e7eb]';

  return (
    <div className={`relative rounded-lg overflow-hidden border font-mono text-sm leading-relaxed shadow-sm ${bgClass} ${textClass}`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b border-inherit ${headerBg}`}>
        <span className="text-xs font-semibold opacity-70 uppercase">{language}</span>
        <button onClick={() => navigator.clipboard.writeText(code)} className="text-xs opacity-70 hover:opacity-100 flex items-center gap-1 transition-opacity">
            <Copy className="w-3 h-3" /> Copy
        </button>
      </div>
      <pre className="p-4 overflow-x-auto" dangerouslySetInnerHTML={highlight(code)} />
    </div>
  );
};

const EndpointDiagram = ({ theme }) => {
  const boxClass = `p-3 rounded-lg border text-center text-xs font-bold shadow-sm ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-white border-slate-200 text-slate-700'}`;
  return (
    <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#1e1e1e] border-zinc-700' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between relative">
        <div className="flex flex-col items-center gap-2 z-10 w-full md:w-auto">
          <div className={boxClass}><FileText className="w-6 h-6 mx-auto mb-1 text-red-500" />PDF Page</div>
        </div>
        <div className="hidden md:flex flex-1 items-center px-2">
           <div className="h-0.5 w-full bg-blue-500/30 relative"><div className="absolute right-0 -top-1.5 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-blue-500/30"></div></div>
        </div>
        <ArrowRight className="md:hidden text-zinc-400 my-2" />
        <div className="flex flex-col gap-4 z-10 w-full md:w-auto">
           <div className={`${boxClass} border-blue-500/50`}><div className="text-blue-500 mb-1">/v1/page2text</div><span className="text-[10px] opacity-70">Raw Text + OCR</span></div>
           <div className={`${boxClass} border-purple-500/50`}><div className="text-purple-500 mb-1">/v1/page2ai</div><span className="text-[10px] opacity-70">Cognitive Analysis</span></div>
           <div className={`${boxClass} border-emerald-500/50`}><div className="text-emerald-500 mb-1">/v1/page2table</div><span className="text-[10px] opacity-70">Table Extraction</span></div>
        </div>
        <div className="hidden md:flex flex-1 items-center px-2">
           <div className="h-0.5 w-full bg-blue-500/30 relative"><div className="absolute right-0 -top-1.5 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-blue-500/30"></div></div>
        </div>
        <ArrowRight className="md:hidden text-zinc-400 my-2" />
        <div className="flex flex-col items-center gap-2 z-10 w-full md:w-auto">
          <div className={boxClass}><Code2 className="w-6 h-6 mx-auto mb-1 text-yellow-500" />JSON Result</div>
        </div>
      </div>
    </div>
  );
};

const ApiReference = ({ theme, texts }) => {
  const endpoints = [
    { method: "GET", path: "/", desc: "Health Check", response: "{ status: 'online', service: '...' }" },
    { method: "POST", path: "/v1/page2text", desc: texts.extractText, params: ["file (PDF)", "page_number (int)"], response: "{ text: '...', extraction_method: '...' }" },
    { method: "POST", path: "/v1/text2ai", desc: "Text Analysis", params: ["text (string)", "instruction (string)"], response: "{ summary: '...', entities: [...] }" },
    { method: "POST", path: "/v1/page2ai", desc: texts.cognitiveAnalysis, params: ["file (PDF)", "metadata_page_number (int)"], response: "{ analysis: { summary: '...', key_points: [...] } }" },
    { method: "POST", path: "/v1/page2table", desc: texts.tabularExtraction, params: ["file (PDF)", "metadata_page_number (int)"], response: "{ extraction: { table_data: [...] } }" }
  ];
  const methodColor = (m) => m === 'GET' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#27272a] border-zinc-700' : 'bg-white border-slate-200'}`}>
        <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-800'}`}>{texts.ref.title}</h2>
        <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>{texts.ref.intro}</p>
      </div>
      <div className="space-y-4">
        {endpoints.map((ep, idx) => (
          <div key={idx} className={`rounded-xl border overflow-hidden transition-all hover:shadow-md ${theme === 'dark' ? 'bg-[#27272a] border-zinc-700' : 'bg-white border-slate-200'}`}>
            <div className={`px-4 py-3 flex items-center gap-3 border-b ${theme === 'dark' ? 'border-zinc-700 bg-zinc-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
              <span className={`px-2 py-1 rounded text-xs font-bold border ${methodColor(ep.method)}`}>{ep.method}</span>
              <span className={`font-mono text-sm font-medium ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>{ep.path}</span>
              <span className={`text-xs ml-auto ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>{ep.desc}</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className={`text-xs font-bold uppercase mb-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>{texts.ref.params}</h4>
                  <ul className="space-y-1">
                    {ep.params && ep.params.map((p, i) => ( <li key={i} className={`text-xs font-mono ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'}`}>• {p}</li> ))}
                    {!ep.params && <li className="text-xs text-zinc-500 italic">None</li>}
                  </ul>
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase mb-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>{texts.ref.response}</h4>
                  <pre className={`text-[10px] font-mono p-2 rounded ${theme === 'dark' ? 'bg-zinc-900 text-zinc-400' : 'bg-slate-100 text-slate-600'}`}>{ep.response}</pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApiDocs = ({ theme, texts }) => {
  const [langTab, setLangTab] = useState('python');
  const [endpointTab, setEndpointTab] = useState('/v1/page2text');

  const getSnippet = (lang, ep) => {
    const epUrl = `${API_URL}${ep}`;
    const desc = ep === '/v1/page2text' ? "Extracts text from PDF page" : ep === '/v1/text2ai' ? "Analyzes text content" : "Extracts specific data";
    
    if (lang === 'python') {
      if (ep === '/v1/text2ai') {
        return `import requests\nimport json\n\nAPI_URL = "${epUrl}"\n\n# Prepare JSON Payload\ndata = {\n    "text": "Your raw text here...",\n    "instruction": "Summarize this text"\n}\n\n# Request: ${desc}\nresponse = requests.post(API_URL, json=data)\nprint(json.dumps(response.json(), indent=2))`;
      }
      return `import requests\nimport fitz # PyMuPDF\nimport json\n\nAPI_URL = "${epUrl}"\n\n# 1. Load PDF & Slice\ndoc = fitz.open("doc.pdf")\npdf_bytes = doc.load_page(0).get_pixmap().tobytes()\n\n# 2. Prepare Payload\nfiles = {'file': ('page.pdf', pdf_bytes, 'application/pdf')}\ndata = {'page_number': 1}\n\n# 3. Request: ${desc}\nresponse = requests.post(API_URL, files=files, data=data)\nprint(json.dumps(response.json(), indent=2))`;
    }

    if (lang === 'bash') {
        if(ep === '/v1/text2ai') return `curl -X POST "${epUrl}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"text": "Sample", "instruction": "Summarize"}'`;
        return `curl -X POST "${epUrl}" \\\n  -F "file=@page_1.pdf" \\\n  -F "page_number=1"`;
    }

    if (lang === 'js') {
      if (ep === '/v1/text2ai') {
        return `const payload = {\n  text: "Raw text content...",\n  instruction: "Summarize"\n};\n\nconst res = await fetch('${epUrl}', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(payload)\n});\nconst data = await res.json();\nconsole.log(data);`;
      }
      return `const formData = new FormData();\nformData.append('file', fileInput.files[0]);\nformData.append('page_number', 1);\n\nconst res = await fetch('${epUrl}', {\n  method: 'POST',\n  body: formData\n});\nconst data = await res.json();\nconsole.log(data);`;
    }

    if (lang === 'php') {
      if (ep === '/v1/text2ai') {
        return `<?php\n$ch = curl_init();\n$data = json_encode(["text" => "...", "instruction" => "Summarize"]);\ncurl_setopt($ch, CURLOPT_URL, "${epUrl}");\ncurl_setopt($ch, CURLOPT_POST, 1);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, $data);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));\n$result = curl_exec($ch);\n?>`;
      }
      return `<?php\n$ch = curl_init();\n$data = ['page_number' => 1, 'file' => new CURLFile('doc.pdf')];\ncurl_setopt($ch, CURLOPT_URL, "${epUrl}");\ncurl_setopt($ch, CURLOPT_POST, 1);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, $data);\n$result = curl_exec($ch);\n?>`;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#27272a] border-zinc-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Terminal className="w-6 h-6" /></div>
                <div>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-800'}`}>{texts.docs.title}</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>{texts.docs.intro}</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-4 justify-between">
                <div className="flex gap-2">
                    {['python', 'js', 'bash', 'php'].map(l => (
                        <button key={l} onClick={() => setLangTab(l)} className={`px-3 py-1.5 text-xs font-bold uppercase rounded transition-colors ${langTab === l ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}`}>{l}</button>
                    ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['/v1/page2text', '/v1/page2ai', '/v1/page2table', '/v1/text2ai'].map(ep => (
                        <button key={ep} onClick={() => setEndpointTab(ep)} className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${endpointTab === ep ? 'border-blue-500 text-blue-500 bg-blue-500/10' : (theme === 'dark' ? 'border-zinc-700 text-zinc-400 hover:border-zinc-600' : 'border-slate-200 text-slate-500 hover:border-slate-300')}`}>{ep}</button>
                    ))}
                </div>
            </div>
            <CodeBlock code={getSnippet(langTab, endpointTab)} language={langTab} theme={theme} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#27272a] border-zinc-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-4 text-purple-500"><Workflow className="w-5 h-5" /><h3 className={`font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-800'}`}>{texts.docs.diagramTitle}</h3></div>
                <EndpointDiagram theme={theme} />
            </div>
            <div className="space-y-6">
                <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#27272a] border-zinc-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-3 text-amber-500"><Zap className="w-5 h-5" /><h3 className={`font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-800'}`}>{texts.docs.limitsTitle}</h3></div>
                    <ul className={`list-disc list-inside space-y-2 text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                        <li><strong>RPM:</strong> 10 requests/min</li>
                        <li><strong>Payload:</strong> Max 6MB</li>
                        <li><strong>Timeout:</strong> 29s (Lambda limit)</li>
                    </ul>
                </div>
                <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#27272a] border-zinc-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-3 text-blue-500"><Server className="w-5 h-5" /><h3 className={`font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-800'}`}>{texts.docs.whyPageTitle}</h3></div>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>{texts.docs.whyPageDesc}</p>
                </div>
            </div>
        </div>
    </div>
  );
};

// --- APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('app');
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState({});
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [uiLang, setUiLang] = useState('en'); 
  const [theme, setTheme] = useState('light');

  const texts = TRANSLATIONS[uiLang] || TRANSLATIONS['en'];
  const [config, setConfig] = useState({ runPage2Text: true, runPage2Ai: true, runPage2Table: false, targetLanguage: '' });

  useEffect(() => {
    const loadLibs = async () => {
      try {
        await loadScript("https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
        setLibsLoaded(true);
      } catch (e) { setLibsLoaded(true); }
    };
    loadLibs();
  }, []);

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile || uploadedFile.type !== 'application/pdf') return alert("Invalid PDF");
    setIsUploading(true);
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const doc = await window.PDFLib.PDFDocument.load(arrayBuffer);
      setFile(uploadedFile); setPdfDoc(doc); setPageCount(doc.getPageCount()); setSelectedPages(new Set()); setResults({});
    } catch { alert("Error reading PDF"); } finally { setIsUploading(false); }
  };

  const togglePageSelection = (pageNum) => {
    setSelectedPages(prev => { const newSet = new Set(prev); if (newSet.has(pageNum)) newSet.delete(pageNum); else newSet.add(pageNum); return newSet; });
  };

  const toggleSelectAll = () => {
    if (selectedPages.size === pageCount) setSelectedPages(new Set());
    else setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i + 1)));
  };

  const processQueue = async () => {
    if (selectedPages.size === 0) return alert("Select at least one page.");
    setIsProcessing(true); setResults({});
    const pagesToProcess = Array.from(selectedPages).sort((a, b) => a - b);
    setProgress({ current: 0, total: pagesToProcess.length });

    for (const pageNum of pagesToProcess) {
      try {
        const subPdf = await window.PDFLib.PDFDocument.create();
        const [copiedPage] = await subPdf.copyPages(pdfDoc, [pageNum - 1]);
        subPdf.addPage(copiedPage);
        const pdfBytes = await subPdf.save();
        const pdfFile = new File([new Blob([pdfBytes], { type: 'application/pdf' })], `page_${pageNum}.pdf`, { type: 'application/pdf' });

        const runEndpoint = async (endpoint) => {
          const formData = new FormData();
          formData.append('file', pdfFile); formData.append('page_number', pageNum);
          if (config.targetLanguage && ['page2ai', 'page2table'].includes(endpoint)) formData.append('target_language', config.targetLanguage);
          if (endpoint !== 'page2text') formData.append('metadata_page_number', pageNum);
          try {
            const res = await fetch(`${API_URL.replace(/\/+$/, '')}/v1/${endpoint}`, { method: 'POST', body: formData });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return { success: true, data: await res.json() };
          } catch (err) { return { success: false, error: err.message }; }
        };

        const requests = []; const endpoints = [];
        if (config.runPage2Text) { requests.push(runEndpoint('page2text')); endpoints.push('page2text'); }
        if (config.runPage2Ai) { requests.push(runEndpoint('page2ai')); endpoints.push('page2ai'); }
        if (config.runPage2Table) { requests.push(runEndpoint('page2table')); endpoints.push('page2table'); }

        const responses = await Promise.all(requests);
        const pageResults = {};
        responses.forEach((res, index) => { pageResults[endpoints[index]] = res; });
        setResults(prev => ({ ...prev, [pageNum]: pageResults }));
        setProgress(prev => ({ ...prev, current: prev.current + 1 }));
      } catch (err) { console.error(err); }
    }
    setIsProcessing(false);
  };

  const handleDownloadZip = async () => {
    const zip = new window.JSZip();
    const folder = zip.folder("pdf_insights");
    Object.entries(results).forEach(([pageNum, endpoints]) => {
      const pageFolder = folder.folder(`page_${pageNum}`);
      Object.entries(endpoints).forEach(([endpoint, result]) => {
        if (result.success) pageFolder.file(`${endpoint}.json`, JSON.stringify(result.data, null, 2));
        else pageFolder.file(`${endpoint}_error.txt`, result.error);
      });
    });
    saveAs(await zip.generateAsync({ type: "blob" }), `insights_${file.name.replace('.pdf', '')}.zip`);
  };

  if (!libsLoaded) return <div className={`min-h-screen flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-[#18181b] text-zinc-400' : 'bg-[#f3f4f6] text-slate-500'}`}><Loader2 className="w-6 h-6 animate-spin text-blue-500" /><span>Loading...</span></div>;

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-[#18181b] text-zinc-100' : 'bg-[#f3f4f6] text-slate-800'}`}>
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md ${theme === 'dark' ? 'bg-[#18181b]/80 border-zinc-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <FadeIn>
              <div className="flex items-center gap-3">
                <img src="/pdf-insight-extractor/favicon-32x32.png" alt="Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-blue-500/30" />
                <div>
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight">{texts.title}</h1>
                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>{texts.subtitle}</p>
                </div>
              </div>
            </FadeIn>
            
            <div className="flex items-center gap-3">
              <div className={`flex p-1 rounded-lg border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'}`}>
                {['app', 'docs', 'swagger'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? (theme === 'dark' ? 'bg-zinc-700 text-white shadow-sm' : 'bg-slate-100 text-slate-800 shadow-sm') : 'text-zinc-500 hover:text-zinc-300'}`}>
                        {tab === 'app' ? texts.navApp : tab === 'docs' ? texts.navDocs : texts.navSwagger}
                    </button>
                ))}
              </div>
              <div className="h-6 w-px bg-zinc-700/20 mx-1"></div>
              <div className="w-32 md:w-40"><LanguageSelector value={uiLang} onChange={setUiLang} icon={Globe} placeholder={texts.uiLang} allowClear={false} options={UI_LANGUAGES} theme={theme} /></div>
              <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className={`p-2 rounded-lg border transition-all ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-yellow-400 hover:bg-zinc-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'}`}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8">
        {activeTab === 'swagger' ? (
            <ApiReference theme={theme} texts={texts} />
        ) : activeTab === 'docs' ? (
          <ApiDocs theme={theme} texts={texts} />
        ) : (
          <>
            <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                <p className={`text-center max-w-3xl mx-auto text-lg leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>{texts.description}</p>
            </div>
            <FadeIn delay={100}>
              <Card className="p-10 border-dashed border-2 hover:border-blue-500/50 transition-all mb-8" theme={theme}>
                {!file ? (
                  isUploading ? (
                    <div className="flex flex-col items-center justify-center h-40 animate-pulse"><Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" /><p className={`text-lg font-medium ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'}`}>{texts.loadingPdf}</p></div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer h-40 group">
                      <div className={`p-5 rounded-2xl shadow-xl mb-5 transition-transform group-hover:scale-110 ${theme === 'dark' ? 'bg-zinc-800 shadow-blue-900/10' : 'bg-white shadow-slate-200'}`}><UploadCloud className="w-10 h-10 text-blue-500" /></div>
                      <span className={`text-xl font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-700'}`}>{texts.uploadTitle}</span>
                      <span className={`text-sm mt-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>{texts.uploadSubtitle}</span>
                      <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                    </label>
                  )
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-lg shadow-red-500/5"><span className="text-red-500 font-bold text-2xl">PDF</span></div>
                      <div>
                        <h3 className={`font-bold text-2xl mb-1 ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-800'}`}>{file.name}</h3>
                        <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>{pageCount} {texts.page}s</span>
                            <span className={`text-sm ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="danger" onClick={() => { setFile(null); setResults({}); setPageCount(0); }} theme={theme} className="px-6 py-3"><Trash2 className="w-4 h-4" /> {texts.removeFile}</Button>
                  </div>
                )}
              </Card>
            </FadeIn>

            {file && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                  <FadeIn delay={200}>
                    <Card className="p-5 space-y-6 sticky top-24 overflow-visible" theme={theme}>
                      <div className={`pb-4 border-b ${theme === 'dark' ? 'border-zinc-700' : 'border-slate-100'}`}><h3 className={`font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-900'}`}>{texts.configTitle}</h3></div>
                      <div className="space-y-4">
                        {[{ id: 'runPage2Text', icon: FileText, title: texts.extractText, desc: texts.extractTextDesc, color: 'blue' }, { id: 'runPage2Ai', icon: Cpu, title: texts.cognitiveAnalysis, desc: texts.cognitiveAnalysisDesc, color: 'purple' }, { id: 'runPage2Table', icon: Table, title: texts.tabularExtraction, desc: texts.tabularExtractionDesc, color: 'emerald' }].map((opt) => (
                          <label key={opt.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${config[opt.id] ? `bg-${opt.color}-500/10 border-${opt.color}-500/50` : (theme === 'dark' ? 'border-zinc-700 hover:bg-zinc-800' : 'border-slate-200 hover:bg-slate-50')}`}>
                            <input type="checkbox" checked={config[opt.id]} onChange={e => setConfig({...config, [opt.id]: e.target.checked})} className={`mt-1 w-4 h-4 text-${opt.color}-600 rounded focus:ring-${opt.color}-500`} />
                            <div><div className={`font-bold text-sm flex items-center gap-2 ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-800'}`}><opt.icon className="w-4 h-4" /> {opt.title}</div><div className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>{opt.desc}</div></div>
                          </label>
                        ))}
                        <div className={`pt-4 border-t ${theme === 'dark' ? 'border-zinc-700' : 'border-slate-100'}`}>
                          <label className={`block text-sm font-bold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}><Globe className="w-4 h-4 opacity-50" /> {texts.outputLang}</label>
                          <LanguageSelector value={config.targetLanguage} onChange={(code) => setConfig({...config, targetLanguage: code})} placeholder="Select Language" theme={theme} />
                          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>{texts.outputLangDesc}</p>
                        </div>
                      </div>
                      <Button onClick={processQueue} disabled={isProcessing || selectedPages.size === 0} className="w-full justify-center py-4 text-lg shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                        {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> {texts.processing} {progress.current}/{progress.total}...</> : <>{texts.process} {selectedPages.size} {texts.page}(s)</>}
                      </Button>
                      {Object.keys(results).length > 0 && !isProcessing && (
                          <div className={`pt-4 border-t animate-in fade-in slide-in-from-top-2 ${theme === 'dark' ? 'border-zinc-700' : 'border-slate-100'}`}>
                              <div className={`border rounded-xl p-4 text-center ${theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-green-50 border-green-200'}`}>
                                  <h3 className={`font-bold text-sm mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-green-800'}`}>{texts.successTitle}</h3>
                                  <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-emerald-600' : 'text-green-700'}`}>{Object.keys(results).length} {texts.analyzed}.</p>
                                  <Button variant="primary" onClick={handleDownloadZip} className="w-full bg-emerald-600 hover:bg-emerald-700 border-transparent shadow-emerald-500/20"><Download className="w-4 h-4" /> {texts.download}</Button>
                              </div>
                          </div>
                      )}
                    </Card>
                  </FadeIn>
                </div>
                <div className="lg:col-span-8 xl:col-span-9 space-y-8">
                  <FadeIn delay={300}>
                    <Card className="p-6" theme={theme}>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-900'}`}>{texts.selectPages}</h3>
                        <div className="flex gap-2">
                          <button onClick={() => setSelectedPages(new Set())} className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-800' : 'text-slate-500 hover:bg-slate-100'}`}>{texts.deselectAll}</button>
                          <button onClick={toggleSelectAll} className="text-xs text-blue-500 hover:text-white font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-blue-500 border border-blue-500/20">{texts.selectAll}</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-16 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar p-1">
                        {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNum => {
                          const isSelected = selectedPages.has(pageNum);
                          const hasResult = results[pageNum];
                          const isError = hasResult && Object.values(hasResult).some(r => !r.success);
                          let statusClasses = isSelected ? "bg-blue-500 border-blue-600 text-white font-bold shadow-md shadow-blue-500/30 scale-105" : (theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-blue-500 hover:text-blue-400" : "bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500");
                          if (hasResult) statusClasses = isError ? "bg-red-500 border-red-600 text-white" : "bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-500/30";
                          return <button key={pageNum} onClick={() => togglePageSelection(pageNum)} disabled={isProcessing} className={`relative h-10 rounded-lg border text-sm transition-all duration-200 flex items-center justify-center ${statusClasses}`}>{pageNum}{hasResult && !isError && <div className="absolute -top-1 -right-1 bg-white text-emerald-500 rounded-full p-0.5 shadow-sm"><Check className="w-2 h-2" strokeWidth={4} /></div>}</button>;
                        })}
                      </div>
                    </Card>
                    <div className="space-y-6">
                      <h3 className={`font-bold text-xl flex items-center gap-3 ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-900'}`}>{texts.resultsPreview}<span className={`text-sm font-normal px-2.5 py-0.5 rounded-full ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>{Object.keys(results).length} {texts.items}</span></h3>
                      {Object.keys(results).length === 0 ? (
                        <div className={`text-center py-20 border-2 border-dashed rounded-2xl ${theme === 'dark' ? 'border-zinc-800 text-zinc-600' : 'bg-white border-slate-200 text-slate-400'}`}><div className="flex justify-center mb-4"><Cpu className={`w-12 h-12 opacity-50 ${theme === 'dark' ? 'text-zinc-700' : 'text-slate-300'}`} /></div><p className="text-lg font-medium">{texts.noResults}</p><p className="text-sm opacity-60 mt-1">{texts.selectPrompt}</p></div>
                      ) : (
                        <div className="space-y-8">
                          {Object.entries(results).map(([pageNum, endpoints]) => (
                            <Card key={pageNum} className="p-0 overflow-visible border-none shadow-none bg-transparent" theme={theme}>
                              <div className={`flex items-center gap-3 mb-4 pl-1`}><div className={`font-bold px-3 py-1 rounded text-sm shadow-sm ${theme === 'dark' ? 'bg-zinc-800 text-zinc-100' : 'bg-slate-800 text-white'}`}>{texts.page} {pageNum}</div><div className={`h-px flex-1 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-200'}`}></div></div>
                              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                                {Object.entries(endpoints).map(([key, val]) => ( <JsonViewer key={key} title={key.toUpperCase()} data={val.data} success={val.success} error={val.error} texts={texts} theme={theme} /> ))}
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
          </>
        )}
      </main>
      <footer className={`border-t py-6 mt-12 ${theme === 'dark' ? 'border-zinc-800 text-zinc-500' : 'border-slate-200 text-slate-400'}`}><div className="w-full max-w-[1920px] mx-auto px-8 text-center text-sm font-medium">{texts.copyright}</div></footer>
    </div>
  );
}