import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { getNextProposalNumber } from '../utils/storage';
import ProposalDocument from '../pdf/ProposalDocument';

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

const ProposalForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  const [step, setStep] = useState(1);
  const [editProposalNo, setEditProposalNo] = useState(false);
  const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light-mode'));
  
  const [formData, setFormData] = useState(editData || {
    // Step 1: Cover
    customerType: 'Commercial',
    companyName: '',
    contactPerson: '',
    capacity: '',
    date: new Date().toISOString().split('T')[0],
    proposalNumber: '',
    coverImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2000&auto=format&fit=crop',

    // Step 2: Customer
    consumerNumber: '',
    email: '',
    siteAddress: '',
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
    contactWebsite: 'https://vykonindus.com/#hero'
  });

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
          <button 
            type="button"
            onClick={() => {
              const newMode = !isLightMode;
              setIsLightMode(newMode);
              if (newMode) document.body.classList.add('light-mode');
              else document.body.classList.remove('light-mode');
            }} 
            style={{ 
              background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-medium)', 
              color: 'var(--color-white)', padding: '6px 12px', borderRadius: '4px', 
              cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px',
              fontWeight: 600
            }}
          >
            {isLightMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
        {renderStepIndicator()}
        
        <div className="vykon-card" style={{ padding: '32px' }}>
          {step === 1 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 1: Cover Page</h2>
              
              <div className="form-group">
                <label className="form-label">Customer Type *</label>
                <select name="customerType" value={formData.customerType} onChange={handleChange} className="form-input">
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Client Name / Company *</label>
                  <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Person Name *</label>
                  <input required type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Project size (kWp) *</label>
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
                  <input required type="text" name="siteAddress" value={formData.siteAddress} onChange={handleChange} className="form-input" />
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
                  <label className="form-label">Project Capacity (kWp) *</label>
                  <input required type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Electricity Tariff (₹ per kWh) *</label>
                  <input required type="number" step="0.01" name="tariffRate" value={formData.tariffRate} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Cost per Wp (₹, excl. GST) *</label>
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
        <div className="live-preview-wrapper" style={{ zoom: 0.7 }}>
          <ProposalDocument formData={formData} activeStep={step} />
        </div>
      </div>
    </div>
  );
};

export default ProposalForm;
