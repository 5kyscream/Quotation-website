import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const ProposalForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Client Details
    companyName: '',
    contactPerson: '',
    consumerNumber: '',
    monthlyConsumption: '',
    siteAddress: '',
    proposalNumber: `VP-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    
    // System Specs
    capacity: '',
    tariffRate: '',
    panelMake: 'Waaree',
    inverterMake: 'Solar Yan',
    dcCableMake: 'Polycab',
    acCableMake: 'KEI',
    switchgearMake: 'L&T',
    
    // Financial Settings
    baseCost: '',
    gstRate: '8.9',
    isLoan: false,
    downPayment: '40',
    interestRate: '10',
    tenureYears: '5',
    escalationRate: '3'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
    } else {
      // Navigate to preview and pass state
      navigate('/preview', { state: { formData } });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="subheading" style={{ fontSize: '32px' }}>Create New Proposal</h1>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ 
              flex: 1, 
              height: '4px', 
              backgroundColor: s <= step ? 'var(--color-orange)' : 'rgba(255,255,255,0.1)',
              borderRadius: '2px'
            }} />
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-navy)', padding: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 1: Client Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Person *</label>
                  <input required type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Consumer Number (Phone)</label>
                  <input type="text" name="consumerNumber" value={formData.consumerNumber} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Avg. Monthly Consumption (kWh)</label>
                  <input type="number" name="monthlyConsumption" value={formData.monthlyConsumption} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Site Address</label>
                  <input type="text" name="siteAddress" value={formData.siteAddress} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Proposal Number</label>
                  <input type="text" name="proposalNumber" value={formData.proposalNumber} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 2: System Specs</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Plant Capacity (kWp) *</label>
                  <input required type="number" step="0.1" name="capacity" value={formData.capacity} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tariff Rate (₹/unit) *</label>
                  <input required type="number" step="0.01" name="tariffRate" value={formData.tariffRate} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Panel Make</label>
                  <input type="text" name="panelMake" value={formData.panelMake} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Inverter Make</label>
                  <input type="text" name="inverterMake" value={formData.inverterMake} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">DC Cable Make</label>
                  <input type="text" name="dcCableMake" value={formData.dcCableMake} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">AC Cable Make</label>
                  <input type="text" name="acCableMake" value={formData.acCableMake} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Switchgear Make</label>
                  <input type="text" name="switchgearMake" value={formData.switchgearMake} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="ui-label" style={{ color: 'var(--color-teal)', marginBottom: '24px' }}>Step 3: Financial Settings</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Base Cost per kWp (₹) *</label>
                  <input required type="number" name="baseCost" value={formData.baseCost} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">GST Rate (%)</label>
                  <input type="number" step="0.1" name="gstRate" value={formData.gstRate} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tariff Escalation Rate (%/yr)</label>
                  <input type="number" step="0.1" name="escalationRate" value={formData.escalationRate} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-white)' }}>
                    <input type="checkbox" name="isLoan" checked={formData.isLoan} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                    Enable Loan Option
                  </label>
                </div>

                {formData.isLoan && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Down Payment (%)</label>
                      <input type="number" name="downPayment" value={formData.downPayment} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Interest Rate (%)</label>
                      <input type="number" step="0.1" name="interestRate" value={formData.interestRate} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tenure (Years)</label>
                      <input type="number" name="tenureYears" value={formData.tenureYears} onChange={handleChange} className="form-input" />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChevronLeft size={20} /> Back
              </button>
            ) : <div></div>}
            
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {step === 3 ? 'Preview & Export' : 'Next Step'} <ChevronRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalForm;
