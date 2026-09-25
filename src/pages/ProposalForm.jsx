import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Plus, Trash2, Sun, Moon } from 'lucide-react';
import { getNextProposalNumber, getSavedImages, saveImageToLibrary } from '../utils/storage';
import ProposalDocument from '../pdf/ProposalDocument';
import SiteAddressInput from '../components/SiteAddressInput';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

const PRESET_COLORS = ['#FFFFFF', '#F5F0E8', '#000000', '#1A1A2E', '#0A1B3D', '#F4621F', '#00C2A8', '#D4C5A0'];
const BG_PRESET_COLORS = ['#FFFFFF', '#F5F0E8', '#EAEAEA', '#000000', '#1A1A2E', '#0A1B3D', '#121212', '#222222'];

const CustomColorPicker = ({ value, onChange, name, title, presets = PRESET_COLORS }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const popoverRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetClick = (color) => {
    onChange({ target: { name, value: color } });
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }} ref={popoverRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '22px', height: '22px', borderRadius: '50%', 
          backgroundColor: value || '#ffffff', 
          border: '2px solid var(--color-border-medium)',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
        title={title}
      />
      {isOpen && (
        <div style={{ 
          position: 'absolute', top: '30px', right: 0, 
          backgroundColor: 'var(--color-navy)', 
          border: '1px solid var(--color-teal)',
          borderRadius: '8px', padding: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          zIndex: 1000,
          width: '180px'
        }}>
          <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Standard Palette</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
            {presets.map(color => (
              <div 
                key={color} 
                onClick={() => handlePresetClick(color)}
                style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: color, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)' }}
                title={color}
              />
            ))}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Custom Hex</div>
          <div style={{ position: 'relative', width: '100%', height: '32px', backgroundColor: 'var(--color-bg-hover)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-white)', zIndex: 1, pointerEvents: 'none' }}>PICK CUSTOM COLOR</span>
            <input 
              type="color" 
              name={name}
              value={value || '#ffffff'}
              onChange={onChange}
              style={{ position: 'absolute', top: '-10px', left: '-10px', width: '200%', height: '200%', cursor: 'pointer', opacity: 0 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const defaultScope = [
  { id: 1, name: "Safe Access to Roof", epc: false, cust: true },
  { id: 2, name: "Transit Insurance", epc: true, cust: false },
  { id: 3, name: "Auxiliary Power for Installation", epc: false, cust: true },
  { id: 4, name: "Plumbing Working", epc: true, cust: false },
  { id: 5, name: "Safety Approvals", epc: true, cust: false },
  { id: 6, name: "Infrastructure (Scaffolding)", epc: true, cust: false },
  { id: 7, name: "Material Storage Space", epc: false, cust: true },
  { id: 8, name: "Material Security", epc: false, cust: true }
];

const defaultSchedule = [
  { id: 1, name: "Site Survey & Design", days: "Day 1-7" },
  { id: 2, name: "Detailed Engineering", days: "Day 8-14" },
  { id: 3, name: "Material Procurement", days: "Day 15-28" },
  { id: 4, name: "Installation", days: "Day 29-42" },
  { id: 5, name: "Testing & Inspection", days: "Day 43-49" },
  { id: 6, name: "Commissioning & Handover", days: "Day 50-56" }
];

const defaultBom = [
  { id: 1, component: "Solar Panels/Modules", make: "Waaree", qty: "As per design" },
  { id: 2, component: "Inverter", make: "Solar Yan", qty: "As per design" },
  { id: 3, component: "DC Cable", make: "Polycab", qty: "Lot" },
  { id: 4, component: "AC Cable", make: "KEI", qty: "Lot" },
  { id: 5, component: "Switchgear", make: "L&T", qty: "Lot" }
];

const defaultTerms = [
  { id: 1, title: "Validity", text: "This proposal is valid for 7 days from the date of issue. Prices and terms are subject to change after the validity period." },
  { id: 2, title: "Taxes & Duties", text: "All applicable taxes including GST are included in the quoted price unless explicitly stated otherwise." },
  { id: 3, title: "Freight", text: "Freight charges for delivery of materials to the project site are included in the quoted price." },
  { id: 4, title: "Installation", text: "Installation will be carried out by our certified team. The client must ensure safe access to the installation site." },
  { id: 5, title: "Delivery Period", text: "The estimated delivery and installation timeline is as mentioned in the project schedule. Delays due to force majeure or client-side dependencies are excluded." },
  { id: 6, title: "Force Majeure", text: "Neither party shall be liable for delays or failure in performance resulting from acts of God, natural disasters, pandemics, government actions, or other events beyond reasonable control." },
  { id: 7, title: "Cancellation", text: "Cancellation after order confirmation may attract charges up to the advance amount paid. Materials already procured or customized cannot be returned." },
  { id: 8, title: "Liaison", text: "Net metering application, CEIG approvals, and other regulatory liaison are not included in the scope unless explicitly stated. These can be provided as an add-on service." }
];

const DEFAULT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1592833159057-6fc1253018e4?q=80&w=600&auto=format&fit=crop'
];

const ProposalForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const proposalTypeUrl = searchParams.get('type');
  const editData = location.state?.editData;
  const [step, setStep] = useState(() => {
    if (editData) return 1;
    const savedStep = localStorage.getItem('vykon_proposal_step');
    return savedStep ? parseInt(savedStep, 10) : 1;
  });
  const [editProposalNo, setEditProposalNo] = useState(false);
  const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light-mode'));
  
  // Image Cropper & Library State
  const [savedImages, setSavedImages] = useState({ covers: [], backgrounds: [] });
  const [showCropModal, setShowCropModal] = useState(false);
  const [bgModalPageId, setBgModalPageId] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [formData, setFormData] = useState(() => {
    if (editData) return editData;
    const savedDraft = localStorage.getItem('vykon_proposal_draft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
    return {
    proposalType: proposalTypeUrl || 'final',
    showContactPerson: true,
    // Step 1: Cover
    customerType: 'Commercial',
    companyName: '',
    contactPerson: '',
    capacity: '',
    date: new Date().toISOString().split('T')[0],
    proposalNumber: '',
    coverImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2000&auto=format&fit=crop',
    coverImageOpacity: 100,
    backgroundImage: null,
    pageBackgrounds: {},

    // Step 2: Customer
    consumerNumber: '',
    email: '',
    siteAddress: '',
    lat: null,
    lng: null,
    additionalAddress: '',
    state: '',
    monthlyConsumption: '',

    // Step 3: System & Cost
    tariffRate: '8.5',
    costPerWp: '50',
    year1GenerationPerKwp: '1460',
    degradationRate: '0.7',
    subsidyAmount: '0',

    // Step 4: Pricing & Payment
    taxBenefitAvailable: false,
    taxRate: '25',
    depreciationRate: '40',
    amcEnabled: false,
    amcDetails: 'Extended AMC available after the first year. Subject to 2% annual price increase.',
    amcCostAnnual: '50000',
    paymentTerms: [
      { enabled: true, percent: '20', text: 'Advance with work order' },
      { enabled: true, percent: '20', text: 'After structure & CEIG' },
      { enabled: true, percent: '60', text: 'After receipt of material' }
    ],

    // Step 6: Financing
    isLoan: false,
    loanSource: 'Finance from Vykon',
    downPayment: '0',
    interestRate: '15',
    tenureYears: '5',
    processingFee: '1.5',

    // Step 7: Scope & Timeline
    scopeItems: defaultScope,
    projectSchedule: defaultSchedule,

    // Step 8: BoM & Warranty
    bomItems: defaultBom,
    warrantyPanels: '25',
    warrantyInverter: '5',
    warrantyOther: '1',

    // Step 9: Terms & Conditions
    termsConditions: defaultTerms,
    exclusions: "1. Any civil, structural, or plumbing work not mentioned in the scope\\n2. Replacement of buyer-provided materials or components\\n3. Damage due to negligence, misuse, or unauthorized modifications\\n4. Lightning or surge damage not covered under standard warranty\\n5. Internet connectivity for remote monitoring system",

    // Step 10: Final Page
    contactPhone: '92609 82066',
    contactEmail: 'contact@vykonindustechnologies.com',
    contactAddress: 'Lucknow, Uttar Pradesh, India (Pan India operations)',
    contactWebsite: 'https://vykonindus.com/#hero',
    
    // Theme
    theme: {
      primaryColor: '',
      secondaryColor: '',
      backgroundColor: '',
      cardColor: '',
      textColor: ''
    },
    
    // Field-specific colors
    fieldColors: {}
    };
  });

  // Autosave Draft
  useEffect(() => {
    if (!editData) {
      localStorage.setItem('vykon_proposal_draft', JSON.stringify(formData));
    }
  }, [formData, editData]);

  useEffect(() => {
    if (!editData) {
      localStorage.setItem('vykon_proposal_step', step.toString());
    }
  }, [step, editData]);

  useEffect(() => {
    const fetchImages = async () => {
      const images = await getSavedImages();
      setSavedImages(images);
    };
    fetchImages();
  }, []);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageToCrop(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleBackgroundUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        const base64 = reader.result;
        await saveImageToLibrary('background', base64);
        const images = await getSavedImages();
        setSavedImages(images);
        setFormData(prev => ({ ...prev, backgroundImage: base64 }));
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePageBackgroundChange = (pageId, e) => {
    if (e === null) {
      setFormData(prev => ({
        ...prev,
        pageBackgrounds: { ...(prev.pageBackgrounds || {}), [pageId]: null }
      }));
      return;
    }
    
    if (e === 'open-modal') {
      setBgModalPageId(pageId);
      return;
    }
    
    if (typeof e === 'string') {
      setFormData(prev => ({
        ...prev,
        pageBackgrounds: { ...(prev.pageBackgrounds || {}), [pageId]: e }
      }));
      setBgModalPageId(null);
      return;
    }

    if (e.target && e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        const base64 = reader.result;
        await saveImageToLibrary('background', base64);
        const images = await getSavedImages();
        setSavedImages(images);
        setFormData(prev => ({
          ...prev,
          pageBackgrounds: { ...(prev.pageBackgrounds || {}), [pageId]: base64 }
        }));
        setBgModalPageId(null);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (croppedImage) {
        await saveImageToLibrary('cover', croppedImage);
        const images = await getSavedImages();
        setSavedImages(images);
        setFormData(prev => ({ ...prev, coverImage: croppedImage }));
        setShowCropModal(false);
        setImageToCrop(null);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to crop image.");
    }
  };

  useEffect(() => {
    if (!editData) {
      const fetchProposalNumber = async () => {
        const pNum = await getNextProposalNumber();
        setFormData(prev => ({ ...prev, proposalNumber: pNum }));
      };
      fetchProposalNumber();
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleThemeChange = (e) => {
    const { name, value } = e.target;
    const key = name.split('.')[1];
    setFormData(prev => ({
      ...prev,
      theme: {
        ...(prev.theme || {}),
        [key]: value
      }
    }));
  };

  const handleFieldColorChange = (e) => {
    const { name, value } = e.target;
    const key = name.split('.')[1];
    setFormData(prev => ({
      ...prev,
      fieldColors: {
        ...(prev.fieldColors || {}),
        [key]: value
      }
    }));
  };

  const handlePaymentTermChange = (index, field, value) => {
    const newTerms = [...(formData.paymentTerms || [])];
    newTerms[index] = { ...newTerms[index], [field]: value };
    setFormData(prev => ({ ...prev, paymentTerms: newTerms }));
  };

  const addPaymentTerm = () => {
    setFormData(prev => ({
      ...prev,
      paymentTerms: [...(prev.paymentTerms || []), { enabled: true, percent: '0', text: '' }]
    }));
  };

  const removePaymentTerm = (index) => {
    setFormData(prev => ({
      ...prev,
      paymentTerms: (prev.paymentTerms || []).filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (step < 10) setStep(prev => prev + 1);
    else navigate('/review', { state: { formData } });
  };
  const prevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[...Array(10)].map((_, i) => (
        <div 
          key={i} 
          className={`step-dot ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'completed' : ''}`}
          onClick={() => setStep(i + 1)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );

  return (
    <div className="wizard-layout">
      {/* LEFT COLUMN: FORM */}
      <div className="wizard-left">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 className="subheading" style={{ fontSize: '24px', margin: 0 }}>Create Proposal</h1>
        </div>
        {renderStepIndicator()}
        
        <div className="vykon-card" style={{ padding: '32px' }}>
          {step === 1 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 1: Cover Page</h2>
              
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Customer Type *</span>
                  <CustomColorPicker name="fieldColors.customerType" value={formData.fieldColors?.customerType || '#ffffff'} onChange={handleFieldColorChange} title="Text Color" />
                </label>
                <select name="customerType" value={formData.customerType} onChange={handleChange} className="form-input">
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Client Name / Company *</span>
                    <CustomColorPicker name="fieldColors.companyName" value={formData.fieldColors?.companyName || '#ffffff'} onChange={handleFieldColorChange} title="Text Color" />
                  </label>
                  <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>Contact Person Name</span>
                      <input type="checkbox" name="showContactPerson" checked={formData.showContactPerson !== false} onChange={handleChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} title="Show on cover" />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-muted-blue)', marginLeft: '4px', textTransform: 'uppercase' }}>Name:</span>
                      <CustomColorPicker name="fieldColors.contactPerson" value={formData.fieldColors?.contactPerson || '#ffffff'} onChange={handleFieldColorChange} title="Name Text Color" />
                    </div>
                  </label>
                  <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="form-input" disabled={formData.showContactPerson === false} style={{ opacity: formData.showContactPerson === false ? 0.5 : 1 }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Project size (kWp) *</span>
                    <CustomColorPicker name="fieldColors.capacity" value={formData.fieldColors?.capacity || '#ffffff'} onChange={handleFieldColorChange} title="Text Color" />
                  </label>
                  <input required type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Date</span>
                    <CustomColorPicker name="fieldColors.date" value={formData.fieldColors?.date || '#ffffff'} onChange={handleFieldColorChange} title="Date Text Color" />
                  </label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Proposal no.
                    <span style={{ color: 'var(--color-teal)', cursor: 'pointer', fontSize: '12px' }} onClick={() => setEditProposalNo(!editProposalNo)}>
                      {editProposalNo ? 'Lock' : 'Edit'}
                    </span>
                  </label>
                  <input type="text" name="proposalNumber" value={formData.proposalNumber} onChange={handleChange} className="form-input" disabled={!editProposalNo} style={{ opacity: editProposalNo ? 1 : 0.6 }} />
                </div>
              </div>
              
              <div className="form-group" style={{ marginTop: '24px' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Cover background <span style={{ fontSize: '10px', color: 'var(--color-muted-blue)', fontWeight: 'normal', marginLeft: '8px', textTransform: 'none' }}>(Optimal: 1200x1700px)</span></span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-muted-blue)' }}>Opacity: {formData.coverImageOpacity || 100}%</span>
                    <input 
                      type="range" 
                      min="10" max="100" 
                      name="coverImageOpacity" 
                      value={formData.coverImageOpacity || 100} 
                      onChange={handleChange} 
                      style={{ width: '80px', accentColor: 'var(--color-teal)' }} 
                    />
                  </div>
                </label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                  <button type="button" onClick={() => {
                    const newBackgrounds = { ...formData.pageBackgrounds };
                    for (let i = 1; i <= 10; i++) {
                      newBackgrounds[`page-${i}`] = formData.coverImage;
                    }
                    setFormData(prev => ({ ...prev, pageBackgrounds: newBackgrounds }));
                  }} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '12px', backgroundColor: 'var(--color-navy)' }}>
                    Apply to All Pages
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {DEFAULT_COVER_IMAGES.map((img, i) => (
                    <div 
                      key={`def-${i}`}
                      onClick={() => setFormData(prev => ({...prev, coverImage: img}))}
                      style={{ 
                        width: '80px', height: '80px', borderRadius: '8px', 
                        backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                        cursor: 'pointer', border: formData.coverImage === img ? '3px solid var(--color-teal)' : '2px solid transparent'
                      }}
                    />
                  ))}
                  {Array.from(new Set([...savedImages.covers, ...savedImages.backgrounds]))
                    .filter(img => !DEFAULT_COVER_IMAGES.includes(img))
                    .map((img, i) => (
                    <div 
                      key={`saved-${i}`}
                      onClick={() => setFormData(prev => ({...prev, coverImage: img}))}
                      style={{ 
                        width: '80px', height: '80px', borderRadius: '8px', 
                        backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                        cursor: 'pointer', border: formData.coverImage === img ? '3px solid var(--color-teal)' : '2px solid transparent'
                      }}
                    />
                  ))}
                  <label style={{ 
                    width: '80px', height: '80px', borderRadius: '8px', border: '2px dashed var(--color-border-medium)', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    color: 'var(--color-muted-blue)', fontSize: '10px'
                  }}>
                    <Plus size={20} style={{ marginBottom: '4px' }} />
                    Upload
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 2: Customer Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input required type="text" name="consumerNumber" value={formData.consumerNumber} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Site Address *</label>
                  <SiteAddressInput 
                    value={formData.siteAddress}
                    onChange={(text) => setFormData(prev => ({ ...prev, siteAddress: text }))}
                    onCoordsChange={(lat, lng) => setFormData(prev => ({ ...prev, lat, lng }))}
                    lat={formData.lat}
                    lng={formData.lng}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Additional address details</label>
                  <input type="text" name="additionalAddress" value={formData.additionalAddress} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Average Monthly Consumption (kWh)</label>
                  <input type="number" name="monthlyConsumption" value={formData.monthlyConsumption} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 3: System & Cost</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Project Capacity (kWp) *</span>
                    <CustomColorPicker name="fieldColors.capacity" value={formData.fieldColors?.capacity || '#ffffff'} onChange={handleFieldColorChange} title="Text Color" />
                  </label>
                  <input required type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="form-input" />
                </div>
                {formData.proposalType === 'initial' && (
                  <div className="form-group">
                    <label className="form-label">Material displacement (Optional)</label>
                    <input type="text" name="materialDisplacement" value={formData.materialDisplacement || ''} onChange={handleChange} className="form-input" placeholder="e.g. 500 tons" />
                  </div>
                )}
                {formData.proposalType !== 'initial' && (
                  <>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Electricity Tariff (₹ per kWh) *</span>
                        <CustomColorPicker name="fieldColors.tariffRate" value={formData.fieldColors?.tariffRate || '#ffffff'} onChange={handleFieldColorChange} title="Text Color" />
                      </label>
                      <input required type="number" step="0.01" name="tariffRate" value={formData.tariffRate} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Cost per Wp (₹, excl. GST) *</span>
                        <CustomColorPicker name="fieldColors.costPerWp" value={formData.fieldColors?.costPerWp || '#ffffff'} onChange={handleFieldColorChange} title="Text Color" />
                      </label>
                      <input required type="number" step="0.01" name="costPerWp" value={formData.costPerWp} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year 1 generation per kWp</label>
                      <input type="number" name="year1GenerationPerKwp" value={formData.year1GenerationPerKwp} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Annual Degradation (%)</label>
                      <input type="number" step="0.1" name="degradationRate" value={formData.degradationRate} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subsidy amount (₹)</label>
                      <input type="number" name="subsidyAmount" value={formData.subsidyAmount} onChange={handleChange} className="form-input" />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 4: Pricing & Payment</h2>
              
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-white)' }}>
                  <input type="checkbox" name="taxBenefitAvailable" checked={formData.taxBenefitAvailable} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                  GST / Tax Benefit Available?
                </label>
              </div>

              {formData.taxBenefitAvailable && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div className="form-group">
                    <label className="form-label">Tax rate (%)</label>
                    <input type="number" name="taxRate" value={formData.taxRate} onChange={handleChange} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Depreciation rate (%)</label>
                    <input type="number" name="depreciationRate" value={formData.depreciationRate} onChange={handleChange} className="form-input" />
                  </div>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-white)' }}>
                  <input type="checkbox" name="amcEnabled" checked={formData.amcEnabled} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                  Add Annual Maintenance Plan
                </label>
              </div>

              {formData.amcEnabled && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px' }}>
                  <div className="form-group">
                    <label className="form-label">Service details</label>
                    <textarea name="amcDetails" value={formData.amcDetails} onChange={handleChange} className="form-input" style={{ height: '80px' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Annual cost (₹)</label>
                    <input type="number" name="amcCostAnnual" value={formData.amcCostAnnual} onChange={handleChange} className="form-input" />
                  </div>
                </div>
              )}

              <h3 className="subheading" style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--color-muted-blue)' }}>Payment Terms (%)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {(formData.paymentTerms || []).map((term, index) => (
                  <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={term.enabled !== false} 
                      onChange={(e) => handlePaymentTermChange(index, 'enabled', e.target.checked)} 
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-teal)' }}
                    />
                    <input 
                      type="text" 
                      value={term.text} 
                      onChange={(e) => handlePaymentTermChange(index, 'text', e.target.value)} 
                      className="form-input" 
                      style={{ flex: 1, opacity: term.enabled !== false ? 1 : 0.5 }} 
                      placeholder="Payment term description"
                      disabled={term.enabled === false}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: term.enabled !== false ? 1 : 0.5 }}>
                      <input 
                        type="number" 
                        value={term.percent} 
                        onChange={(e) => handlePaymentTermChange(index, 'percent', e.target.value)} 
                        className="form-input" 
                        style={{ width: '80px' }} 
                        disabled={term.enabled === false}
                      />
                      <span style={{ color: 'var(--color-white)' }}>%</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removePaymentTerm(index)}
                      style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addPaymentTerm}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px dashed var(--color-teal)', color: 'var(--color-teal)', padding: '12px', borderRadius: '4px', cursor: 'pointer', justifyContent: 'center', marginTop: '8px' }}
                >
                  <Plus size={16} /> Add Payment Term
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 5: Project Outcomes</h2>
              <div style={{ backgroundColor: 'rgba(0,194,168,0.1)', border: '1px solid var(--color-teal)', padding: '24px', borderRadius: '8px' }}>
                <h3 className="subheading" style={{ color: 'var(--color-teal)', marginBottom: '8px' }}>Review the project outcomes</h3>
                <p style={{ color: 'var(--color-white)', fontSize: '14px' }}>The chart panel on the right shows the customer's 1-year and 25-year savings, monthly & yearly generation, and payback period — all derived from the inputs you've already given.</p>
                <p style={{ color: 'var(--color-white)', fontSize: '14px', marginTop: '16px', fontWeight: 'bold' }}>Hit Next to proceed.</p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 6: Financing</h2>
              
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-white)' }}>
                  <input type="checkbox" name="isLoan" checked={formData.isLoan} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                  Financing required?
                </label>
              </div>

              {formData.isLoan && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Loan source</label>
                    <select name="loanSource" value={formData.loanSource} onChange={handleChange} className="form-input">
                      <option value="Finance from Vykon">Finance from Vykon</option>
                      <option value="Third Party Finance">Finance from Third Party</option>
                    </select>
                  </div>
                  {formData.loanSource === 'Third Party Finance' && (
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Third Party Finance Details</label>
                      <textarea name="thirdPartyFinanceDetails" value={formData.thirdPartyFinanceDetails || ''} onChange={handleChange} className="form-input" style={{ height: '80px' }} placeholder="Mention bank name, terms, etc." />
                    </div>
                  )}
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Downpayment (equity %)</label>
                    <input type="number" name="downPayment" value={formData.downPayment} onChange={handleChange} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Interest rate (% p.a.)</label>
                    <input type="number" step="0.1" name="interestRate" value={formData.interestRate} onChange={handleChange} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Loan duration (years)</label>
                    <input type="number" name="tenureYears" value={formData.tenureYears} onChange={handleChange} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Processing fee (%)</label>
                    <input type="number" step="0.1" name="processingFee" value={formData.processingFee} onChange={handleChange} className="form-input" />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 7: Scope & Timeline</h2>
              
              <h3 className="subheading" style={{ fontSize: '16px', marginBottom: '16px' }}>Scope of Work</h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: '8px', color: 'var(--color-muted-blue)', fontSize: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div>Task Name</div><div style={{ textAlign: 'center' }}>Vykon (EPC)</div><div style={{ textAlign: 'center' }}>Customer</div><div></div>
                </div>
                {formData.scopeItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: '8px', alignItems: 'center' }}>
                    <input type="text" value={item.name} onChange={(e) => {
                      const newItems = [...formData.scopeItems];
                      newItems[idx].name = e.target.value;
                      setFormData(prev => ({...prev, scopeItems: newItems}));
                    }} className="form-input" />
                    <label style={{ display: 'flex', justifyContent: 'center' }}>
                      <input type="checkbox" checked={item.epc} onChange={(e) => {
                        const newItems = [...formData.scopeItems];
                        newItems[idx].epc = e.target.checked;
                        setFormData(prev => ({...prev, scopeItems: newItems}));
                      }} style={{ width: '16px', height: '16px' }} />
                    </label>
                    <label style={{ display: 'flex', justifyContent: 'center' }}>
                      <input type="checkbox" checked={item.cust} onChange={(e) => {
                        const newItems = [...formData.scopeItems];
                        newItems[idx].cust = e.target.checked;
                        setFormData(prev => ({...prev, scopeItems: newItems}));
                      }} style={{ width: '16px', height: '16px' }} />
                    </label>
                    <button type="button" onClick={() => {
                        setFormData(prev => ({...prev, scopeItems: formData.scopeItems.filter((_, i) => i !== idx)}));
                    }} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  setFormData(prev => ({...prev, scopeItems: [...formData.scopeItems, { id: Date.now(), name: '', epc: true, cust: false }]}));
                }} className="btn-secondary" style={{ marginTop: '8px', padding: '8px', fontSize: '12px' }}>+ Add Scope Item</button>
              </div>

              <h3 className="subheading" style={{ fontSize: '16px', marginTop: '32px', marginBottom: '16px' }}>Project Schedule</h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '8px', color: 'var(--color-muted-blue)', fontSize: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div>Phase Name</div><div>Timeline (Days)</div><div></div>
                </div>
                {formData.projectSchedule.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '8px', alignItems: 'center' }}>
                    <input type="text" value={item.name} onChange={(e) => {
                      const newItems = [...formData.projectSchedule];
                      newItems[idx].name = e.target.value;
                      setFormData(prev => ({...prev, projectSchedule: newItems}));
                    }} className="form-input" />
                    <input type="text" value={item.days} onChange={(e) => {
                      const newItems = [...formData.projectSchedule];
                      newItems[idx].days = e.target.value;
                      setFormData(prev => ({...prev, projectSchedule: newItems}));
                    }} className="form-input" />
                    <button type="button" onClick={() => {
                        setFormData(prev => ({...prev, projectSchedule: formData.projectSchedule.filter((_, i) => i !== idx)}));
                    }} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  setFormData(prev => ({...prev, projectSchedule: [...formData.projectSchedule, { id: Date.now(), name: '', days: '' }]}));
                }} className="btn-secondary" style={{ marginTop: '8px', padding: '8px', fontSize: '12px' }}>+ Add Phase</button>
              </div>
            </div>
          )}

          {step === 8 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 8: BoM & Warranty</h2>
              
              <h3 className="subheading" style={{ fontSize: '16px', marginBottom: '16px' }}>Bill of Materials</h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 40px', gap: '8px', color: 'var(--color-muted-blue)', fontSize: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ textAlign: 'center' }}>Incl.</div><div>Component</div><div>Make</div><div>Quantity</div><div></div>
                </div>
                {formData.bomItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 40px', gap: '8px', alignItems: 'center', opacity: item.enabled === false ? 0.5 : 1 }}>
                    <label style={{ display: 'flex', justifyContent: 'center' }}>
                      <input type="checkbox" checked={item.enabled !== false} onChange={(e) => {
                        const newItems = [...formData.bomItems];
                        newItems[idx].enabled = e.target.checked;
                        setFormData(prev => ({...prev, bomItems: newItems}));
                      }} style={{ width: '16px', height: '16px' }} />
                    </label>
                    <input type="text" value={item.component} onChange={(e) => {
                      const newItems = [...formData.bomItems];
                      newItems[idx].component = e.target.value;
                      setFormData(prev => ({...prev, bomItems: newItems}));
                    }} className="form-input" disabled={item.enabled === false} />
                    <input type="text" value={item.make} onChange={(e) => {
                      const newItems = [...formData.bomItems];
                      newItems[idx].make = e.target.value;
                      setFormData(prev => ({...prev, bomItems: newItems}));
                    }} className="form-input" disabled={item.enabled === false} />
                    <input type="text" value={item.qty} onChange={(e) => {
                      const newItems = [...formData.bomItems];
                      newItems[idx].qty = e.target.value;
                      setFormData(prev => ({...prev, bomItems: newItems}));
                    }} className="form-input" disabled={item.enabled === false} />
                    <button type="button" onClick={() => {
                        setFormData(prev => ({...prev, bomItems: formData.bomItems.filter((_, i) => i !== idx)}));
                    }} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  setFormData(prev => ({...prev, bomItems: [...formData.bomItems, { id: Date.now(), component: '', make: '', qty: '', enabled: true }]}));
                }} className="btn-secondary" style={{ marginTop: '8px', padding: '8px', fontSize: '12px' }}>+ Add Material</button>
              </div>
              
              <h3 className="subheading" style={{ fontSize: '16px', marginTop: '32px', marginBottom: '16px' }}>Warranty Terms</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ width: '200px', fontSize: '14px' }}>PV Modules (yrs)</span>
                  <input type="number" name="warrantyPanels" value={formData.warrantyPanels} onChange={handleChange} className="form-input" style={{ width: '100px' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ width: '200px', fontSize: '14px' }}>Inverter (yrs)</span>
                  <input type="number" name="warrantyInverter" value={formData.warrantyInverter} onChange={handleChange} className="form-input" style={{ width: '100px' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ width: '200px', fontSize: '14px' }}>Other Components (yrs)</span>
                  <input type="number" name="warrantyOther" value={formData.warrantyOther} onChange={handleChange} className="form-input" style={{ width: '100px' }} />
                </div>
              </div>
            </div>
          )}

          {step === 9 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 9: Terms & Conditions</h2>
              <p style={{ color: 'var(--color-muted-blue)', fontSize: '14px', marginBottom: '16px' }}>* Clauses are pre-populated. To edit, modify state in code for now.</p>
              <div className="form-group">
                <label className="form-label">Exclusions</label>
                <textarea name="exclusions" value={formData.exclusions} onChange={handleChange} className="form-input" style={{ height: '200px' }} />
              </div>
            </div>
          )}

          {step === 10 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 10: Final Page</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Primary Office Address</label>
                  <input type="text" name="contactAddress" value={formData.contactAddress} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Secondary Office Address</label>
                  <input type="text" name="contactAddress2" value={formData.contactAddress2 || ''} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Website</label>
                  <input type="text" name="contactWebsite" value={formData.contactWebsite} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--color-border-light)' }}>
            <button type="button" onClick={prevStep} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step === 1 ? 0.3 : 1, pointerEvents: step === 1 ? 'none' : 'auto' }}>
              <ChevronLeft size={20} /> Back
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <button type="button" onClick={nextStep} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {step === 10 ? 'Review & Generate' : 'Next Step'} <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: LIVE PREVIEW */}
      <div className="wizard-right">
        {/* Floating Tool Panel */}
        <div style={{ 
          position: 'fixed',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 100
        }}>
          {/* Theme Panel */}
          <div style={{ 
            backgroundColor: 'var(--color-navy)', 
            padding: '24px 12px', 
            borderRadius: '16px', 
            border: '1px solid var(--color-border-light)', 
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
          }}>
             <div style={{ color: 'var(--color-muted-blue)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Theme</div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                 <CustomColorPicker name="theme.primaryColor" value={formData.theme?.primaryColor || '#ff6b35'} onChange={handleThemeChange} title="Primary" />
                 <span style={{ fontSize: '9px', color: 'var(--color-muted-blue)' }}>Pri</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                 <CustomColorPicker name="theme.secondaryColor" value={formData.theme?.secondaryColor || '#00c2a8'} onChange={handleThemeChange} title="Secondary" />
                 <span style={{ fontSize: '9px', color: 'var(--color-muted-blue)' }}>Sec</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                 <CustomColorPicker name="theme.backgroundColor" value={formData.theme?.backgroundColor || (isLightMode ? '#f5f0e8' : '#0b0c10')} onChange={handleThemeChange} title="Background" presets={BG_PRESET_COLORS} />
                 <span style={{ fontSize: '9px', color: 'var(--color-muted-blue)' }}>Bg</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                 <CustomColorPicker name="theme.cardColor" value={formData.theme?.cardColor || (isLightMode ? '#ffffff' : '#1f2833')} onChange={handleThemeChange} title="Tiles" />
                 <span style={{ fontSize: '9px', color: 'var(--color-muted-blue)' }}>Tile</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                 <CustomColorPicker name="theme.textColor" value={formData.theme?.textColor || (isLightMode ? '#1a1a1a' : '#ffffff')} onChange={handleThemeChange} title="Text" />
                 <span style={{ fontSize: '9px', color: 'var(--color-muted-blue)' }}>Text</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px' }}>
                 <button type="button" onClick={() => setFormData(prev => ({...prev, theme: { primaryColor: '', secondaryColor: '', backgroundColor: '', cardColor: '', textColor: '' }}))} style={{ background: 'none', border: '1px solid var(--color-border-medium)', color: 'var(--color-muted-blue)', padding: '6px 8px', borderRadius: '4px', fontSize: '9px', cursor: 'pointer', textTransform: 'uppercase' }}>Reset</button>
               </div>
             </div>
          </div>
          

        </div>

        <div className="live-preview-wrapper" style={{ zoom: 0.7 }}>
          <ProposalDocument formData={formData} activeStep={step} isLightMode={isLightMode} isEditor={true} onBackgroundChange={handlePageBackgroundChange} />
        </div>
      </div>

      {/* Cropper Modal */}
      {showCropModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1.414} // A4 Aspect Ratio roughly
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
            {/* Translucent Overlay for text */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '30%', height: '42.4%', pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px', zIndex: 10 }}>
              <div style={{ padding: '20px', backgroundColor: 'rgba(0,0,0,0.4)', borderLeft: '4px solid var(--color-orange, #ff6b35)', backdropFilter: 'blur(2px)' }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>PREPARED FOR: {formData.customerType}</p>
                <p style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-display, sans-serif)' }}>{formData.companyName || 'Company Name'}</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Attn: {formData.contactPerson || 'Contact Person'}</p>
              </div>
            </div>
          </div>
          <div style={{ padding: '24px', backgroundColor: '#111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: 'white', marginRight: '16px' }}>Zoom</span>
              <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-secondary" onClick={() => { setShowCropModal(false); setImageToCrop(null); }}>Cancel</button>
              <button className="btn-primary" onClick={handleCropSave}>Save & Apply Cover</button>
            </div>
          </div>
        </div>
      )}

      {/* Background Selector Modal */}
      {bgModalPageId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--color-navy)', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', border: '1px solid var(--color-border-medium)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: 'white', fontFamily: 'var(--font-display, sans-serif)', fontSize: '20px' }}>Select Page Background</h3>
              <button onClick={() => setBgModalPageId(null)} style={{ background: 'none', border: 'none', color: 'var(--color-muted-blue)', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>&times;</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '16px' }}>
              <label style={{ 
                aspectRatio: '1', borderRadius: '8px', border: '2px dashed var(--color-border-medium)', 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                color: 'var(--color-muted-blue)', fontSize: '12px', backgroundColor: 'var(--color-bg)'
              }}>
                <Plus size={24} style={{ marginBottom: '8px' }} />
                Upload New
                <input type="file" accept="image/*" onChange={(e) => handlePageBackgroundChange(bgModalPageId, e)} style={{ display: 'none' }} />
              </label>
              
              {Array.from(new Set([...savedImages.covers, ...savedImages.backgrounds]))
                .filter(img => !DEFAULT_COVER_IMAGES.includes(img))
                .map((img, i) => (
                <div 
                  key={`modal-bg-${i}`}
                  onClick={() => handlePageBackgroundChange(bgModalPageId, img)}
                  style={{ 
                    aspectRatio: '1', borderRadius: '8px', 
                    backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    cursor: 'pointer', border: formData.pageBackgrounds?.[bgModalPageId] === img ? '3px solid var(--color-teal)' : '2px solid transparent'
                  }}
                />
              ))}
            </div>
            
            {formData.pageBackgrounds?.[bgModalPageId] && (
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    handlePageBackgroundChange(bgModalPageId, null);
                    setBgModalPageId(null);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Trash2 size={16} /> Remove Background
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalForm;
