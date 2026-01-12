// ==================== STATE ====================
let state = {
    farmData: {
        producer: '',
        farm: '',
        area: '',
        culture: 'soja',
        plantingDate: '',
        grainPrice: '',
        dueDate: ''
    },
    insumos: [],
    consolidation: {
        unitPrices: {} // { productKey: price }
    },
    settings: {
        defaultGrainPrice: '',
        unitPreference: 'kg',
        liquidUnitPreference: 'L',
        decimalPlaces: 2,
        autoFillArea: true,
        showAreaWarnings: true,
        exportFileName: 'AgriCotacao',
        includeTimelineInPDF: false
    }
};

let insumoIdCounter = 1;

// ==================== FENOLOGY ====================
const fenology = {
    soja: {
        V2: 14,
        V4: 22,
        R1: 45,
        R5: 76
    },
    milho: {
        V4: 14,
        V8: 28,
        VT: 45,
        R1: 55
    }
};

// ==================== DOM ELEMENTS ====================
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const insumosContainer = document.getElementById('insumos-container');
const addInsumoBtn = document.getElementById('add-insumo-btn');
const addInsumoDropdown = document.getElementById('add-insumo-dropdown');
const printBtn = document.getElementById('print-btn');
const sidecar = document.getElementById('sidecar');
const sidecarOverlay = document.getElementById('sidecar-overlay');
const closeSidecar = document.getElementById('close-sidecar');
const sidecarTitle = document.getElementById('sidecar-title');
const sidecarBody = document.getElementById('sidecar-body');
const generateTimelineBtn = document.getElementById('generate-timeline-btn');

// ==================== INIT ====================
function init() {
    loadState();
    bindEvents();
    renderFarmData();
    renderInsumos();
}

// ==================== STORAGE ====================
function saveState() {
    try {
        localStorage.setItem('agricotacao-farm', JSON.stringify(state.farmData));
        localStorage.setItem('agricotacao-insumos', JSON.stringify(state.insumos));
        localStorage.setItem('agricotacao-consolidation', JSON.stringify(state.consolidation));
        localStorage.setItem('agricotacao-settings', JSON.stringify(state.settings));
    } catch (e) {
        console.error('Erro ao salvar:', e);
    }
}

function loadState() {
    try {
        const farmData = localStorage.getItem('agricotacao-farm');
        const insumos = localStorage.getItem('agricotacao-insumos');
        const consolidation = localStorage.getItem('agricotacao-consolidation');
        const settings = localStorage.getItem('agricotacao-settings');
        
        if (farmData) {
            state.farmData = { ...state.farmData, ...JSON.parse(farmData) };
        }
        if (insumos) {
            state.insumos = JSON.parse(insumos);
            const maxId = state.insumos.reduce((max, i) => Math.max(max, i.id), 0);
            insumoIdCounter = maxId + 1;
        }
        if (consolidation) {
            state.consolidation = JSON.parse(consolidation);
        }
        if (settings) {
            state.settings = { ...state.settings, ...JSON.parse(settings) };
        }
    } catch (e) {
        console.error('Erro ao carregar:', e);
    }
}
switch (insumo.type) {
            case 'fertilizer':
                dap = -30;
                break;
            case 'defensive':
                dap = fenologyData[insumo.stage] || 0;
                break;
            default:
                dap = 0;
        }
        
        const appDate = new Date(baseDate);
        appDate.setDate(appDate.getDate() + dap);
        
        const products = insumo.products.map(p => p.name).filter(n => n).join(', ');
        if (products) {
            timelineData.push([
                dap >= 0 ? `DAP ${dap}` : `${Math.abs(dap)}d antes`,
                appDate.toLocaleDateString('pt-BR'),
                typeInfo.name,
                products.substring(0, 40) + (products.length > 40 ? '...' : '')
            ]);
        }
    });
    
    if (timelineData.length > 0) {
        doc.autoTable({
            startY: finalY,
            head: [['Período', 'Data', 'Tipo', 'Produtos']],
            body: timelineData,
            theme: 'striped',
            headStyles: {
                fillColor: [52, 199, 89],
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 8,
                cellPadding: 3
            }
        });
    }
}

doc.setTextColor(150);
doc.setFontSize(8);
doc.setFont(undefined, 'normal');
doc.text('Gerado por AgriCotação Pro em ' + new Date().toLocaleDateString('pt-BR'), 105, 285, { align: 'center' });

const filename = `${state.settings.exportFileName || 'AgriCotacao'}_${state.farmData.farm || 'Fazenda'}_${new Date().toISOString().split('T')[0]}.pdf`;
doc.save(filename);
