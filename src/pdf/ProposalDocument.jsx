import React, { forwardRef } from 'react';
import { calculateFinancials, formatCurrency } from '../utils/calculations';
import { Zap, Check, ArrowRight, Sun, Calendar, Settings, Shield, Clock, Banknote, PenTool, ClipboardList, ZapIcon, Cpu } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-orange)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <Zap size={24} />
    </div>
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', color: 'white', lineHeight: 1 }}>VYKON</div>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px', color: 'var(--color-orange)', letterSpacing: '2px', marginTop: '2px' }}>PROPOSAL STUDIO</div>
    </div>
  </div>
);

const Footer = () => (
  <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '60px', height: '6px', backgroundColor: 'var(--color-orange)', borderRadius: '3px' }}></div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'rgba(255,255,255,0.9)', fontSize: '22px', letterSpacing: '1px' }}>VYKON INDUS TECHNOLOGIES</div>
        <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>careers@vykonindustechnologies.com</div>
      </div>
    </div>
  </div>
);

const Page = ({ children, className = '' }) => (
  <div className={`pdf-page ${className}`} style={{ padding: '40px', position: 'relative' }}>
    <div className="left-accent-bar"></div>
    {children}
    <Footer />
  </div>
);

const SectionHeader = ({ title, highlight }) => (
  <div style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', marginBottom: '24px', paddingBottom: '12px' }}>
    <h2 className="headline-1" style={{ fontSize: '36px' }}>
      {title} <span className="headline-2">{highlight}</span>
    </h2>
  </div>
);

const ProposalDocument = forwardRef(({ formData }, ref) => {
  const fin = calculateFinancials(formData);

  // Chart Data
  const monthlyGenData = Array.from({ length: 12 }, (_, i) => ({
    name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    value: Math.round(fin.annualGeneration / 12 * (1 + Math.sin(i) * 0.1)) // simple curve simulation
  }));

  const gen25YrData = Array.from({ length: 25 }, (_, i) => ({
    year: `20${25 + i}`,
    value: Math.round(fin.annualGeneration * Math.pow(0.99, i))
  }));

  let cumulative = 0;
  let currentTariff = parseFloat(formData.tariffRate);
  let currentGen = fin.annualGeneration;
  const savings25YrData = Array.from({ length: 25 }, (_, i) => {
    cumulative += currentGen * currentTariff;
    currentTariff *= (1 + (parseFloat(formData.escalationRate || 0) / 100)); // Default escalation if not provided
    currentGen *= 0.99;
    return { year: `20${25 + i}`, value: Math.round(cumulative / 100000) }; // in Lakhs
  });

  return (
    <div ref={ref} style={{ backgroundColor: '#000', padding: '20px' }}>
      
      {/* PAGE 1: COVER */}
      <Page className="bg-grid">
        <div className="bg-ghost-initials">VS</div>
        <div className="bg-diagonal-teal"></div>
        <Logo />
        
        <div style={{ marginTop: '160px' }}>
          <div style={{ display: 'inline-block', padding: '6px 12px', border: '1.5px solid var(--color-teal)', color: 'var(--color-teal)', backgroundColor: 'rgba(0,194,168,0.06)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px' }}>
            PROPOSAL NO: {formData.proposalNumber}
          </div>
          
          <h1 className="headline-1" style={{ fontSize: '96px', marginBottom: '8px' }}>
            {formData.capacity} kWp <br />
            <span className="headline-2">SOLAR POWER PLANT</span>
          </h1>
          
          <div style={{ marginTop: '60px', borderLeft: '4px solid var(--color-orange)', paddingLeft: '24px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-muted-blue)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', marginBottom: '8px' }}>PREPARED FOR</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '36px', lineHeight: 1.2 }}>{formData.companyName}</p>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-earth)', fontSize: '16px', marginTop: '8px' }}>Attn: {formData.contactPerson}</p>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-earth)', fontSize: '16px' }}>{formData.siteAddress}</p>
          </div>
        </div>
      </Page>

      {/* PAGE 2: SYSTEM PRICING & PAYMENT TERMS */}
      <Page>
        <SectionHeader title="SYSTEM" highlight="PRICING" />
        
        <h3 className="subheading" style={{ fontSize: '20px', marginBottom: '12px' }}>Project Cost</h3>
        <table className="vykon-table">
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Component</th>
              <th style={{ width: '50%' }}>Details</th>
              <th style={{ width: '20%', textAlign: 'right' }}>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Solar Power Generating System</td>
              <td>Supply & Installation of Solar PV System with one year AMC included *</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(fin.projectCost)}</td>
            </tr>
            <tr>
              <td>Taxes</td>
              <td>GST @ {formData.gstRate || 13.8}%</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(fin.gstAmount)}</td>
            </tr>
            <tr className="total-row">
              <td colSpan="2" style={{ color: 'var(--color-teal)' }}>Grand Total</td>
              <td style={{ textAlign: 'right', color: 'var(--color-teal)' }}>{formatCurrency(fin.grandTotal)}</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '12px', color: 'var(--color-muted-blue)', marginTop: '-16px', marginBottom: '24px' }}>* AMC includes monitoring and quarterly visits</p>

        <h3 className="subheading" style={{ fontSize: '20px', marginBottom: '12px' }}>Optional Annual Maintenance Contract</h3>
        <table className="vykon-table">
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Services</th>
              <th style={{ width: '50%' }}>Details</th>
              <th style={{ width: '20%', textAlign: 'right' }}>Annual Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Annual Maintenance Contract</td>
              <td>For 5 years</td>
              <td style={{ textAlign: 'right' }}>₹0</td>
            </tr>
          </tbody>
        </table>

        <SectionHeader title="INCENTIVES" highlight="& TAX CREDIT" />
        <table className="vykon-table">
          <thead>
            <tr>
              <th className="teal-header" style={{ width: '70%' }}>Incentive Type</th>
              <th className="teal-header" style={{ width: '30%', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GST Input Credit</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(fin.gstInputCredit)}</td>
            </tr>
            <tr>
              <td>Accelerated Depreciation Benefit (1st Year)</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(fin.acceleratedDepreciation)}</td>
            </tr>
            <tr className="total-row">
              <td style={{ color: 'var(--color-orange)' }}>Total Benefits</td>
              <td style={{ textAlign: 'right', color: 'var(--color-orange)' }}>{formatCurrency(fin.totalIncentives)}</td>
            </tr>
          </tbody>
        </table>

        <SectionHeader title="PAYMENT" highlight="TERMS" />
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', width: '30%' }}>
              <div style={{ fontSize: '36px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>20%</div>
              <div style={{ fontSize: '14px', color: 'white', marginTop: '8px' }}>Advance with work order</div>
            </div>
            <ArrowRight size={32} color="var(--color-muted-blue)" />
            <div style={{ textAlign: 'center', width: '30%' }}>
              <div style={{ fontSize: '36px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>20%</div>
              <div style={{ fontSize: '14px', color: 'white', marginTop: '8px' }}>After structure design approval and CEIG</div>
            </div>
            <ArrowRight size={32} color="var(--color-muted-blue)" />
            <div style={{ textAlign: 'center', width: '30%' }}>
              <div style={{ fontSize: '36px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>60%</div>
              <div style={{ fontSize: '14px', color: 'white', marginTop: '8px' }}>After receipt of material</div>
            </div>
          </div>
        </div>
      </Page>

      {/* PAGE 3: PROJECT OUTCOMES */}
      <Page>
        <SectionHeader title="PROJECT" highlight="OUTCOMES" />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '20px' }}>
            <ZapIcon size={24} color="var(--color-teal)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)', marginBottom: '8px', textTransform: 'uppercase' }}>1st Year Savings</div>
            <div style={{ fontSize: '28px', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(fin.firstYearSavings)}</div>
          </div>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '20px' }}>
            <Banknote size={24} color="var(--color-orange)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)', marginBottom: '8px', textTransform: 'uppercase' }}>Lifetime Savings (25 Yrs)</div>
            <div style={{ fontSize: '28px', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(fin.lifetimeSavings)}</div>
          </div>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '20px' }}>
            <Calendar size={24} color="var(--color-teal)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)', marginBottom: '8px', textTransform: 'uppercase' }}>Payback Period</div>
            <div style={{ fontSize: '28px', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{fin.paybackYears}Y {fin.paybackRemainingMonths}M</div>
          </div>
        </div>

        <h3 className="subheading" style={{ fontSize: '16px', marginBottom: '16px' }}>1st Year Monthly Generation (kWh)</h3>
        <div style={{ height: '180px', marginBottom: '32px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyGenData}>
              <XAxis dataKey="name" stroke="var(--color-muted-blue)" fontSize={12} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <YAxis stroke="var(--color-muted-blue)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: 'var(--color-navy)', border: '1px solid var(--color-teal)', color: 'white'}} />
              <Bar dataKey="value" fill="var(--color-teal)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="subheading" style={{ fontSize: '16px', marginBottom: '16px' }}>25 Year Annual Generation (kWh)</h3>
        <div style={{ height: '180px', marginBottom: '32px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gen25YrData} margin={{ left: -10 }}>
              <XAxis dataKey="year" stroke="var(--color-muted-blue)" fontSize={10} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} interval={2} />
              <YAxis stroke="var(--color-muted-blue)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: 'var(--color-navy)', border: '1px solid var(--color-orange)', color: 'white'}} />
              <Bar dataKey="value" fill="var(--color-orange)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="subheading" style={{ fontSize: '16px', marginBottom: '16px' }}>25 Year Cumulative Savings (Lakhs INR)</h3>
        <div style={{ height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={savings25YrData} margin={{ left: -10 }}>
              <XAxis dataKey="year" stroke="var(--color-muted-blue)" fontSize={10} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} interval={2} />
              <YAxis stroke="var(--color-muted-blue)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => `₹${value}L`} cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: 'var(--color-navy)', border: '1px solid var(--color-teal)', color: 'white'}} />
              <Bar dataKey="value" fill="var(--color-teal)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Page>

      {/* PAGE 4: LOAN OPTION (Conditional) */}
      {formData.isLoan && (
        <Page>
          <SectionHeader title="LOAN" highlight="OPTION" />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '40px', backgroundColor: 'var(--color-navy)', padding: '32px', borderRadius: '8px' }}>
            <div style={{ flex: '0 0 120px', display: 'flex', justifyContent: 'center' }}>
              <Banknote size={80} color="var(--color-teal)" />
            </div>
            <div>
              <div style={{ fontSize: '16px', color: 'var(--color-muted-blue)', marginBottom: '4px' }}>Bridging the Financing Gap with</div>
              <div style={{ fontSize: '32px', color: 'var(--color-orange)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '16px' }}>Vykon's Solar Loans</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div className="vykon-check"><Check size={14} strokeWidth={3} /></div><span style={{ fontSize: '16px' }}>Collateral Free Loans</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div className="vykon-check"><Check size={14} strokeWidth={3} /></div><span style={{ fontSize: '16px' }}>Minimum Documentation</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div className="vykon-check"><Check size={14} strokeWidth={3} /></div><span style={{ fontSize: '16px' }}>Hassle Free Process</span></div>
              </div>
            </div>
          </div>
          
          <p style={{ color: 'var(--color-earth)', marginBottom: '24px', fontSize: '14px', lineHeight: 1.6 }}>
            We offer flexible loan options to help you install solar PV systems. This allows you to start saving on your monthly electricity bills right away while keeping your initial investment low.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '16px' }}>
            <div className="vykon-card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <Banknote size={24} color="var(--color-teal)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '28px', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(fin.loanAmount)}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)', marginTop: '8px', textTransform: 'uppercase' }}>Eligible Loan Amount</div>
            </div>
            <div className="vykon-card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <Calendar size={24} color="var(--color-orange)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '28px', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formData.tenureYears} Years</div>
              <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)', marginTop: '8px', textTransform: 'uppercase' }}>Tenure</div>
            </div>
            <div className="vykon-card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <Settings size={24} color="var(--color-teal)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '28px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(fin.monthlyEMI)}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)', marginTop: '8px', textTransform: 'uppercase' }}>Monthly Installment</div>
            </div>
          </div>
          
          <p style={{ fontSize: '11px', color: 'var(--color-muted-blue)', marginBottom: '40px', fontStyle: 'italic' }}>
            *The loan details are based on a financial structure with a {formData.downPayment}% upfront down payment, an annual interest rate of {formData.interestRate}%, and a repayment period of {formData.tenureYears} years.
          </p>

          <SectionHeader title="LOAN OPTION" highlight="SUMMARY" />
          <table className="vykon-table">
            <thead>
              <tr>
                <th style={{ width: '70%' }}>Name</th>
                <th style={{ width: '30%', textAlign: 'right' }}>Loan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Upfront Investment</td>
                <td style={{ textAlign: 'right' }}>{formatCurrency(fin.grandTotal * (formData.downPayment/100))}</td>
              </tr>
              <tr>
                <td>GST Return Benefits</td>
                <td style={{ textAlign: 'right' }}>Yes</td>
              </tr>
              <tr>
                <td>Accelerated Depreciation Benefits</td>
                <td style={{ textAlign: 'right' }}>Yes</td>
              </tr>
              <tr>
                <td>Payback Period</td>
                <td style={{ textAlign: 'right' }}>{fin.paybackYears}Y {fin.paybackRemainingMonths}M</td>
              </tr>
              <tr>
                <td>Average Annual Return</td>
                <td style={{ textAlign: 'right' }}>{fin.annualReturns.toFixed(1)}%</td>
              </tr>
              <tr className="total-row">
                <td style={{ color: 'var(--color-teal)' }}>Monthly Installment</td>
                <td style={{ textAlign: 'right', color: 'var(--color-teal)' }}>{formatCurrency(fin.monthlyEMI)}</td>
              </tr>
            </tbody>
          </table>
        </Page>
      )}

      {/* PAGE 5: SCOPE OF WORK & PROJECT SCHEDULE */}
      <Page>
        <SectionHeader title="SCOPE OF" highlight="WORK" />
        
        <table className="vykon-table">
          <thead>
            <tr>
              <th style={{ width: '60%' }}>Name</th>
              <th style={{ width: '20%', textAlign: 'center' }}>EPC</th>
              <th style={{ width: '20%', textAlign: 'center' }}>Customer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Safe Access to Roof</td>
              <td style={{ textAlign: 'center' }}></td>
              <td style={{ textAlign: 'center' }}><div className="vykon-check"><Check size={16} strokeWidth={3} /></div></td>
            </tr>
            <tr>
              <td>Transit Insurance</td>
              <td style={{ textAlign: 'center' }}><div className="vykon-check"><Check size={16} strokeWidth={3} /></div></td>
              <td style={{ textAlign: 'center' }}></td>
            </tr>
            <tr>
              <td>Auxiliary Power for Installation</td>
              <td style={{ textAlign: 'center' }}></td>
              <td style={{ textAlign: 'center' }}><div className="vykon-check"><Check size={16} strokeWidth={3} /></div></td>
            </tr>
            <tr>
              <td>Plumbing Working</td>
              <td style={{ textAlign: 'center' }}><div className="vykon-check"><Check size={16} strokeWidth={3} /></div></td>
              <td style={{ textAlign: 'center' }}></td>
            </tr>
            <tr>
              <td>Safety Approvals</td>
              <td style={{ textAlign: 'center' }}><div className="vykon-check"><Check size={16} strokeWidth={3} /></div></td>
              <td style={{ textAlign: 'center' }}></td>
            </tr>
            <tr>
              <td>Infrastructure (Scaffolding)</td>
              <td style={{ textAlign: 'center' }}><div className="vykon-check"><Check size={16} strokeWidth={3} /></div></td>
              <td style={{ textAlign: 'center' }}></td>
            </tr>
            <tr>
              <td>Material Storage Space</td>
              <td style={{ textAlign: 'center' }}></td>
              <td style={{ textAlign: 'center' }}><div className="vykon-check"><Check size={16} strokeWidth={3} /></div></td>
            </tr>
            <tr>
              <td>Material Security</td>
              <td style={{ textAlign: 'center' }}></td>
              <td style={{ textAlign: 'center' }}><div className="vykon-check"><Check size={16} strokeWidth={3} /></div></td>
            </tr>
          </tbody>
        </table>

        <div style={{ height: '40px' }}></div>
        <SectionHeader title="PROJECT" highlight="SCHEDULE" />
        
        <div style={{ backgroundColor: 'var(--color-navy)', padding: '60px 40px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="vykon-timeline">
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16.6%', zIndex: 2 }}>
              <div className="timeline-node" style={{ borderColor: 'var(--color-teal)' }}><PenTool size={20} color="var(--color-teal)" /></div>
              <div className="timeline-content">
                <div style={{ fontSize: '12px', color: 'var(--color-teal)', fontWeight: 'bold' }}>1. Site Survey</div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)' }}>Day 1-7</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16.6%', zIndex: 2 }}>
              <div className="timeline-node" style={{ borderColor: 'var(--color-orange)' }}><ClipboardList size={20} color="var(--color-orange)" /></div>
              <div className="timeline-content">
                <div style={{ fontSize: '12px', color: 'var(--color-orange)', fontWeight: 'bold' }}>2. Engineering</div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)' }}>Day 8-14</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16.6%', zIndex: 2 }}>
              <div className="timeline-node" style={{ borderColor: 'var(--color-teal)' }}><Clock size={20} color="var(--color-teal)" /></div>
              <div className="timeline-content">
                <div style={{ fontSize: '12px', color: 'var(--color-teal)', fontWeight: 'bold' }}>3. Procurement</div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)' }}>Day 15-28</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16.6%', zIndex: 2 }}>
              <div className="timeline-node" style={{ borderColor: 'var(--color-orange)' }}><Settings size={20} color="var(--color-orange)" /></div>
              <div className="timeline-content">
                <div style={{ fontSize: '12px', color: 'var(--color-orange)', fontWeight: 'bold' }}>4. Installation</div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)' }}>Day 29-42</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16.6%', zIndex: 2 }}>
              <div className="timeline-node" style={{ borderColor: 'var(--color-teal)' }}><Shield size={20} color="var(--color-teal)" /></div>
              <div className="timeline-content">
                <div style={{ fontSize: '12px', color: 'var(--color-teal)', fontWeight: 'bold' }}>5. Testing</div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)' }}>Day 43-49</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16.6%', zIndex: 2 }}>
              <div className="timeline-node" style={{ borderColor: 'var(--color-orange)' }}><ZapIcon size={20} color="var(--color-orange)" /></div>
              <div className="timeline-content">
                <div style={{ fontSize: '12px', color: 'var(--color-orange)', fontWeight: 'bold' }}>6. Commissioning</div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)' }}>Day 50-56</div>
              </div>
            </div>

          </div>
          <p style={{ textAlign: 'right', fontSize: '10px', color: 'var(--color-muted-blue)', marginTop: '40px' }}>Note: Final implementation timelines to proceed post technical site survey</p>
        </div>
      </Page>

      {/* PAGE 6: BILL OF MATERIALS & WARRANTY */}
      <Page>
        <SectionHeader title="BILL OF" highlight="MATERIALS" />
        
        <table className="vykon-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Component</th>
              <th style={{ width: '40%' }}>Make</th>
              <th style={{ width: '20%', textAlign: 'center' }}>Qty.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Solar Panels/Modules</td>
              <td>{formData.panelMake}</td>
              <td style={{ textAlign: 'center' }}>As per design</td>
            </tr>
            <tr>
              <td>Inverter</td>
              <td>{formData.inverterMake}</td>
              <td style={{ textAlign: 'center' }}>As per design</td>
            </tr>
            <tr>
              <td>DC Cable</td>
              <td>{formData.dcCableMake}</td>
              <td style={{ textAlign: 'center' }}>Lot</td>
            </tr>
            <tr>
              <td>AC Cable</td>
              <td>{formData.acCableMake}</td>
              <td style={{ textAlign: 'center' }}>Lot</td>
            </tr>
            <tr>
              <td>Switchgear</td>
              <td>{formData.switchgearMake}</td>
              <td style={{ textAlign: 'center' }}>Lot</td>
            </tr>
          </tbody>
        </table>

        <div style={{ height: '40px' }}></div>
        <SectionHeader title="WARRANTY" highlight="TERMS" />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Sun size={32} color="var(--color-orange)" style={{ marginBottom: '16px' }} />
            <div style={{ fontSize: '36px', color: 'var(--color-orange)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>25 Years</div>
            <div style={{ fontSize: '14px', color: 'var(--color-muted-blue)', marginTop: '4px' }}>PV Modules</div>
          </div>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Cpu size={32} color="var(--color-teal)" style={{ marginBottom: '16px' }} />
            <div style={{ fontSize: '36px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>5 Years</div>
            <div style={{ fontSize: '14px', color: 'var(--color-muted-blue)', marginTop: '4px' }}>Inverter</div>
          </div>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Shield size={32} color="var(--color-earth)" style={{ marginBottom: '16px' }} />
            <div style={{ fontSize: '36px', color: 'var(--color-earth)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>1 Year*</div>
            <div style={{ fontSize: '14px', color: 'var(--color-muted-blue)', marginTop: '4px' }}>Other Components</div>
          </div>
        </div>
        
        <p style={{ fontSize: '11px', color: 'var(--color-muted-blue)', lineHeight: 1.6 }}>
          *OEM products have manufacturer warranties. System warranty provided by Vykon Indus Technologies. Other component items have 1-year warranty. See warranty documents & T&Cs for details.
        </p>
      </Page>
      
    </div>
  );
});

export default ProposalDocument;
