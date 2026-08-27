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
  const editData = location.state?.editData;
  const [step, setStep] = useState(1);
  const [editProposalNo, setEditProposalNo] = useState(false);
  const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light-mode'));
  
  // Image Cropper & Library State
  const [savedImages, setSavedImages] = useState({ covers: [], watermarks: [] });
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [formData, setFormData] = useState(editData || {
    // Step 1: Cover
    customerType: 'Commercial',
    companyName: '',
    contactPerson: '',
    capacity: '',
    date: new Date().toISOString().split('T')[0],
    proposalNumber: '',
    coverImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2000&auto=format&fit=crop',
    coverImageOpacity: 100,
    watermarkImage: null,

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
    tariffRate: '',
    costPerWp: '',
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
    paymentAdvance: '20',
    paymentStructure: '20',
    paymentReceipt: '60',

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
  });

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

  const handleWatermarkUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        const base64 = reader.result;
        await saveImageToLibrary('watermark', base64);
        const images = await getSavedImages();
        setSavedImages(images);
        setFormData(prev => ({ ...prev, watermarkImage: base64 }));
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
                    <span>Contact Person Name *</span>
                    <CustomColorPicker name="fieldColors.contactPerson" value={formData.fieldColors?.contactPerson || '#ffffff'} onChange={handleFieldColorChange} title="Text Color" />
                  </label>
                  <input required type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Project size (kWp) *</span>
                    <CustomColorPicker name="fieldColors.capacity" value={formData.fieldColors?.capacity || '#ffffff'} onChange={handleFieldColorChange} title="Text Color" />
                  </label>
                  <input required type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
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
                  <span>Cover background</span>
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
                  {savedImages.covers.map((img, i) => (
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
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ width: '200px', fontSize: '14px' }}>Advance with work order</span>
                  <input type="number" name="paymentAdvance" value={formData.paymentAdvance} onChange={handleChange} className="form-input" style={{ width: '100px' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ width: '200px', fontSize: '14px' }}>After structure & CEIG</span>
                  <input type="number" name="paymentStructure" value={formData.paymentStructure} onChange={handleChange} className="form-input" style={{ width: '100px' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ width: '200px', fontSize: '14px' }}>After receipt of material</span>
                  <input type="number" name="paymentReceipt" value={formData.paymentReceipt} onChange={handleChange} className="form-input" style={{ width: '100px' }} />
                </div>
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
                    <input type="text" name="loanSource" value={formData.loanSource} onChange={handleChange} className="form-input" />
                  </div>
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
              <p style={{ color: 'var(--color-muted-blue)', fontSize: '14px', marginBottom: '16px' }}>* Items are pre-populated. To edit, modify state in code for now (Complex list UI to be fully implemented next).</p>
            </div>
          )}

          {step === 8 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 8: BoM & Warranty</h2>
              <p style={{ color: 'var(--color-muted-blue)', fontSize: '14px', marginBottom: '16px' }}>* Items are pre-populated. To edit, modify state in code for now (Complex list UI to be fully implemented next).</p>
              
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
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Office Address</label>
                  <input type="text" name="contactAddress" value={formData.contactAddress} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Website</label>
                  <input type="text" name="contactWebsite" value={formData.contactWebsite} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--color-border-light)' }}>
            <button type="button" onClick={prevStep} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step === 1 ? 0.3 : 1, pointerEvents: step === 1 ? 'none' : 'auto' }}>
              <ChevronLeft size={20} /> Back
            </button>
            <button type="button" onClick={nextStep} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {step === 10 ? 'Review & Generate' : 'Next Step'} <ChevronRight size={20} />
            </button>
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
          
          {/* Watermark Panel */}
          <div style={{ 
            backgroundColor: 'var(--color-navy)', 
            padding: '16px 12px', 
            borderRadius: '16px', 
            border: '1px solid var(--color-border-light)', 
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
          }}>
             <div style={{ color: 'var(--color-muted-blue)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Watermark</div>
             {formData.watermarkImage ? (
               <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                 <img src={formData.watermarkImage} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                 <div onClick={() => setFormData(prev => ({...prev, watermarkImage: null}))} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', cursor: 'pointer', padding: '2px' }}><Trash2 size={12} /></div>
               </div>
             ) : (
               <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                 <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px dashed var(--color-border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-blue)' }}>
                   <Plus size={16} />
                 </div>
                 <input type="file" accept="image/*" onChange={handleWatermarkUpload} style={{ display: 'none' }} />
               </label>
             )}
             
             {savedImages.watermarks.length > 0 && !formData.watermarkImage && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
                 {savedImages.watermarks.map((img, i) => (
                   <img key={i} src={img} onClick={() => setFormData(prev => ({...prev, watermarkImage: img}))} style={{ width: '32px', height: '32px', objectFit: 'contain', cursor: 'pointer', border: '1px solid var(--color-border-medium)', borderRadius: '4px' }} />
                 ))}
               </div>
             )}
          </div>
        </div>

        <div className="live-preview-wrapper" style={{ zoom: 0.7 }}>
          <ProposalDocument formData={formData} activeStep={step} isLightMode={isLightMode} />
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
    </div>
  );
};

export default ProposalForm;
