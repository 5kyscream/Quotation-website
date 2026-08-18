import React, { forwardRef, useEffect, useRef } from 'react';
import { calculateFinancials, formatCurrency } from '../utils/calculations';
import { brandConfig } from '../config/brand';
import { Zap, Check, ArrowRight, Sun, Calendar, Settings, Shield, Clock, Banknote, PenTool, ClipboardList, ZapIcon, Cpu, Mail, MapPin, Globe, Phone } from 'lucide-react';
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

const Page = ({ children, id }) => (
  <div id={id} className="pdf-page" style={{ padding: '40px', position: 'relative', marginBottom: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
    <div className="left-accent-bar"></div>
    {children}
  </div>
);

const SectionHeader = ({ title, highlight }) => (
  <div style={{ borderBottom: '1px solid var(--color-teal)', marginBottom: '24px', paddingBottom: '12px' }}>
    <h2 className="headline-1" style={{ fontSize: '32px' }}>
      {title} <span className="headline-2">{highlight}</span>
    </h2>
  </div>
);

const ProposalDocument = forwardRef(({ formData, activeStep, layout = 'column' }, ref) => {
  const containerRef = useRef(null);
  const fin = calculateFinancials(formData);

  // Sync scroll with activeStep
  useEffect(() => {
    if (activeStep && containerRef.current && layout === 'column') {
      let targetPage = 1;
      switch(activeStep) {
        case 1: targetPage = 1; break; // Cover
        case 2: targetPage = 2; break; // Customer
        case 3: targetPage = 2; break; // Cost & generation impacts Page 2 heavily
        case 4: targetPage = 3; break; // Pricing & Payment
        case 5: targetPage = 4; break; // Outcomes
        case 6: targetPage = formData.isLoan ? 5 : 4; break; // Financing
        case 7: targetPage = formData.isLoan ? 6 : 5; break; // Scope
        case 8: targetPage = formData.isLoan ? 7 : 6; break; // BoM
        case 9: targetPage = formData.isLoan ? 8 : 7; break; // Terms
        case 10: targetPage = formData.isLoan ? 10 : 9; break; // Contact (skip About page)
        default: targetPage = 1;
      }
      
      const el = containerRef.current.querySelector(`#page-${targetPage}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeStep, formData.isLoan, layout]);

  // Chart Data
  const monthlyGenData = Array.from({ length: 12 }, (_, i) => ({
    name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    value: Math.round(fin.annualGeneration / 12 * (1 + Math.sin(i) * 0.1))
  }));

  const gen25YrData = Array.from({ length: 25 }, (_, i) => ({
    year: `20${25 + i}`,
    value: Math.round(fin.annualGeneration * Math.pow(1 - (parseFloat(formData.degradationRate)/100), i))
  }));

  let cumulative = 0;
  let currentTariff = parseFloat(formData.tariffRate);
  let currentGen = fin.annualGeneration;
  const savings25YrData = Array.from({ length: 25 }, (_, i) => {
    cumulative += currentGen * currentTariff;
    currentTariff *= 1.03; // 3% escalation default
    currentGen *= (1 - (parseFloat(formData.degradationRate)/100));
    return { year: `20${25 + i}`, value: Math.round(cumulative / 100000) };
  });

  return (
    <div ref={(el) => { containerRef.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }} style={{ display: 'flex', flexDirection: layout, gap: layout === 'row' ? '40px' : '0' }}>
      
      {/* PAGE 1: COVER (Step 1) */}
      <Page id="page-1">
        <div className="bg-grid"></div>
        <div className="bg-ghost-initials">VS</div>
        <div className="bg-diagonal-teal"></div>
        <Logo />
        
        <div style={{ marginTop: '160px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-block', padding: '6px 12px', border: '1.5px solid var(--color-teal)', color: 'var(--color-teal)', backgroundColor: 'rgba(0,194,168,0.06)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px' }}>
            PROPOSAL NO: {formData.proposalNumber}
          </div>
          
          <h1 className="headline-1" style={{ fontSize: '80px', marginBottom: '8px' }}>
            {formData.capacity} kWp <br />
            <span className="headline-2">SOLAR PV SOLUTION</span>
          </h1>
          
          <div style={{ marginTop: '60px', borderLeft: '4px solid var(--color-orange)', paddingLeft: '24px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-muted-blue)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', marginBottom: '8px' }}>PREPARED FOR: {formData.customerType}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '32px', lineHeight: 1.2 }}>{formData.companyName}</p>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-earth)', fontSize: '14px', marginTop: '8px' }}>Attn: {formData.contactPerson}</p>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-earth)', fontSize: '14px' }}>{formData.date}</p>
          </div>
        </div>
      </Page>

      {/* PAGE 2: BENEFITS IN NUMBERS & CUSTOMER DETAILS (Step 2) */}
      <Page id="page-2">
        <SectionHeader title="Benefits in" highlight="Numbers" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div className="vykon-card" style={{ borderColor: 'var(--color-bg-card)' }}>
            <ZapIcon size={20} color="var(--color-teal)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: 'var(--color-muted-blue)', textTransform: 'uppercase', fontWeight: 600 }}>Plant Capacity</div>
            <div style={{ fontSize: '24px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formData.capacity} kWp</div>
          </div>
          <div className="vykon-card" style={{ borderColor: 'var(--color-bg-card)' }}>
            <Banknote size={20} color="var(--color-orange)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: 'var(--color-muted-blue)', textTransform: 'uppercase', fontWeight: 600 }}>Project Cost (Gross)</div>
            <div style={{ fontSize: '24px', color: 'var(--color-orange)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(fin.grandTotal)}</div>
          </div>
          <div className="vykon-card" style={{ borderColor: 'var(--color-bg-card)' }}>
            <Calendar size={20} color="var(--color-teal)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: 'var(--color-muted-blue)', textTransform: 'uppercase', fontWeight: 600 }}>1st Year Est. Savings</div>
            <div style={{ fontSize: '24px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(fin.firstYearSavings)}</div>
          </div>
          
          <div className="vykon-card" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-muted-blue)', textTransform: 'uppercase', fontWeight: 600 }}>Average Annual Savings</div>
            <div style={{ fontSize: '20px', color: 'var(--color-white)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(fin.averageAnnualSavings)}</div>
          </div>
          <div className="vykon-card" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-muted-blue)', textTransform: 'uppercase', fontWeight: 600 }}>Lifetime Savings (25 Yrs)</div>
            <div style={{ fontSize: '20px', color: 'var(--color-white)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(fin.lifetimeSavings)}</div>
          </div>
          <div className="vykon-card" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-muted-blue)', textTransform: 'uppercase', fontWeight: 600 }}>1st Year Generation</div>
            <div style={{ fontSize: '20px', color: 'var(--color-white)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{fin.annualGeneration.toLocaleString()} kWh</div>
          </div>

          <div className="vykon-card" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-muted-blue)', textTransform: 'uppercase', fontWeight: 600 }}>EMI</div>
            <div style={{ fontSize: '20px', color: 'var(--color-white)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formData.isLoan ? formatCurrency(fin.monthlyEMI) : '—'}</div>
          </div>
          <div className="vykon-card" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-muted-blue)', textTransform: 'uppercase', fontWeight: 600 }}>Annual Returns</div>
            <div style={{ fontSize: '20px', color: 'var(--color-white)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{fin.annualReturns.toFixed(1)}%</div>
          </div>
          <div className="vykon-card" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-muted-blue)', textTransform: 'uppercase', fontWeight: 600 }}>Payback Period</div>
            <div style={{ fontSize: '20px', color: 'var(--color-white)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{fin.paybackYears}Y {fin.paybackRemainingMonths}M</div>
          </div>
        </div>

        <SectionHeader title="Customer" highlight="Details" />
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ flex: 1, backgroundColor: 'var(--color-bg-hover)', borderRadius: '8px', overflow: 'hidden', position: 'relative', minHeight: '160px' }}>
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.siteAddress || 'India')}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
              title="Site Map"
            ></iframe>
          </div>
          <div style={{ flex: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)' }}>Company Name</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{formData.companyName || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)' }}>Contact Person</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{formData.contactPerson || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)' }}>Phone / Email</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{formData.consumerNumber || '—'} <br/> {formData.email || ''}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)' }}>Avg Monthly Consumption</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{formData.monthlyConsumption ? `${formData.monthlyConsumption} kWh` : '—'}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)' }}>Site Address</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{formData.siteAddress} {formData.additionalAddress} {formData.state}</div>
              </div>
            </div>
          </div>
        </div>
      </Page>

      {/* PAGE 3: SYSTEM PRICING (Step 4) */}
      <Page id="page-3">
        <SectionHeader title="System" highlight="Pricing" />
        
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
              <td>Supply & Installation of Solar PV System</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(fin.projectCost)}</td>
            </tr>
            {fin.subsidyAmount > 0 && (
              <tr>
                <td>Subsidy</td>
                <td>Government Subsidy Deduction</td>
                <td style={{ textAlign: 'right', color: 'var(--color-teal)' }}>- {formatCurrency(formData.subsidyAmount)}</td>
              </tr>
            )}
            <tr>
              <td>Taxes</td>
              <td>GST @ {formData.gstRate}%</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(fin.gstAmount)}</td>
            </tr>
            <tr className="total-row">
              <td colSpan="2" style={{ color: 'var(--color-orange)' }}>Grand Total</td>
              <td style={{ textAlign: 'right', color: 'var(--color-orange)' }}>{formatCurrency(fin.grandTotal)}</td>
            </tr>
          </tbody>
        </table>

        {formData.amcEnabled && (
          <>
            <h3 className="subheading" style={{ fontSize: '16px', marginBottom: '12px' }}>Optional Annual Maintenance Contract</h3>
            <table className="vykon-table">
              <thead>
                <tr>
                  <th className="teal-header" style={{ width: '30%' }}>Services</th>
                  <th className="teal-header" style={{ width: '50%' }}>Details</th>
                  <th className="teal-header" style={{ width: '20%', textAlign: 'right' }}>Annual Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Annual Maintenance Contract</td>
                  <td>{formData.amcDetails}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(formData.amcCostAnnual)}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        {formData.taxBenefitAvailable && (
          <>
            <h3 className="subheading" style={{ fontSize: '16px', marginBottom: '12px' }}>Incentives & Tax Credit</h3>
            <table className="vykon-table">
              <thead>
                <tr>
                  <th style={{ width: '70%' }}>Incentive Type</th>
                  <th style={{ width: '30%', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>GST Input Credit</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(fin.gstInputCredit)}</td>
                </tr>
                <tr>
                  <td>Accelerated Depreciation Benefit (Estimated Lifetime)</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(fin.acceleratedDepreciation)}</td>
                </tr>
                <tr className="total-row">
                  <td style={{ color: 'var(--color-teal)' }}>Total Estimated Benefits</td>
                  <td style={{ textAlign: 'right', color: 'var(--color-teal)' }}>{formatCurrency(fin.totalIncentives)}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        <h3 className="subheading" style={{ fontSize: '16px', marginBottom: '12px' }}>Payment Terms</h3>
        <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '24px', borderRadius: '8px', border: '1px solid var(--color-bg-hover)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', width: '30%' }}>
              <div style={{ fontSize: '28px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{formData.paymentAdvance}%</div>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '4px' }}>Advance with work order</div>
            </div>
            <ArrowRight size={24} color="var(--color-muted-blue)" />
            <div style={{ textAlign: 'center', width: '30%' }}>
              <div style={{ fontSize: '28px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{formData.paymentStructure}%</div>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '4px' }}>After structure & CEIG</div>
            </div>
            <ArrowRight size={24} color="var(--color-muted-blue)" />
            <div style={{ textAlign: 'center', width: '30%' }}>
              <div style={{ fontSize: '28px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{formData.paymentReceipt}%</div>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '4px' }}>After receipt of material</div>
            </div>
          </div>
        </div>
      </Page>

      {/* PAGE 4: PROJECT OUTCOMES (Step 5) */}
      <Page id="page-4">
        <SectionHeader title="Project" highlight="Outcomes" />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '16px' }}>
            <ZapIcon size={20} color="var(--color-teal)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '24px', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(fin.firstYearSavings)}</div>
            <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)', textTransform: 'uppercase' }}>1st Year Savings</div>
          </div>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '16px' }}>
            <Banknote size={20} color="var(--color-orange)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '24px', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(fin.lifetimeSavings)}</div>
            <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)', textTransform: 'uppercase' }}>Lifetime Savings (25 Yrs)</div>
          </div>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '16px' }}>
            <Calendar size={20} color="var(--color-teal)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '24px', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{fin.paybackYears}Y {fin.paybackRemainingMonths}M</div>
            <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)', textTransform: 'uppercase' }}>Payback Period</div>
          </div>
        </div>

        <h3 className="subheading" style={{ fontSize: '14px', marginBottom: '12px' }}>1st Year Monthly Generation (kWh)</h3>
        <div style={{ height: '140px', marginBottom: '24px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyGenData}>
              <XAxis dataKey="name" stroke="var(--color-muted-blue)" fontSize={10} tickLine={false} axisLine={{ stroke: 'var(--color-border-light)' }} />
              <YAxis stroke="var(--color-muted-blue)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'var(--color-bg-hover)'}} contentStyle={{backgroundColor: 'var(--color-navy)', border: '1px solid var(--color-teal)', color: 'white'}} />
              <Bar dataKey="value" fill="var(--color-teal)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="subheading" style={{ fontSize: '14px', marginBottom: '12px' }}>25 Year Annual Generation (kWh)</h3>
        <div style={{ height: '140px', marginBottom: '24px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gen25YrData} margin={{ left: -10 }}>
              <XAxis dataKey="year" stroke="var(--color-muted-blue)" fontSize={10} tickLine={false} axisLine={{ stroke: 'var(--color-border-light)' }} interval={2} />
              <YAxis stroke="var(--color-muted-blue)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
              <Tooltip cursor={{fill: 'var(--color-bg-hover)'}} contentStyle={{backgroundColor: 'var(--color-navy)', border: '1px solid var(--color-orange)', color: 'white'}} />
              <Bar dataKey="value" fill="var(--color-orange)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="subheading" style={{ fontSize: '14px', marginBottom: '12px' }}>25 Year Cumulative Savings (Lakhs INR)</h3>
        <div style={{ height: '140px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={savings25YrData} margin={{ left: -10 }}>
              <XAxis dataKey="year" stroke="var(--color-muted-blue)" fontSize={10} tickLine={false} axisLine={{ stroke: 'var(--color-border-light)' }} interval={2} />
              <YAxis stroke="var(--color-muted-blue)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => `₹${value}L`} cursor={{fill: 'var(--color-bg-hover)'}} contentStyle={{backgroundColor: 'var(--color-navy)', border: '1px solid var(--color-teal)', color: 'white'}} />
              <Bar dataKey="value" fill="var(--color-teal)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Page>

      {/* PAGE 5: LOAN OPTION (Step 6 - Conditional) */}
      {formData.isLoan && (
        <Page id="page-5">
          <SectionHeader title="Loan" highlight="Option" />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '40px', backgroundColor: 'var(--color-navy)', padding: '32px', borderRadius: '8px' }}>
            <div style={{ flex: '0 0 120px', display: 'flex', justifyContent: 'center' }}>
              <Banknote size={80} color="var(--color-teal)" />
            </div>
            <div>
              <div style={{ fontSize: '16px', color: 'var(--color-muted-blue)', marginBottom: '4px' }}>Bridging the Financing Gap with</div>
              <div style={{ fontSize: '32px', color: 'var(--color-orange)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '16px' }}>{formData.loanSource}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div className="vykon-check"><Check size={14} strokeWidth={3} /></div><span style={{ fontSize: '16px' }}>Collateral Free Loans</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div className="vykon-check"><Check size={14} strokeWidth={3} /></div><span style={{ fontSize: '16px' }}>Minimum Documentation</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div className="vykon-check"><Check size={14} strokeWidth={3} /></div><span style={{ fontSize: '16px' }}>Hassle Free Process</span></div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="vykon-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <Banknote size={24} color="var(--color-teal)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '24px', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(fin.loanAmount)}</div>
              <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)', marginTop: '8px', textTransform: 'uppercase' }}>Eligible Loan Amount</div>
            </div>
            <div className="vykon-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <Calendar size={24} color="var(--color-orange)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '24px', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formData.tenureYears} Years</div>
              <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)', marginTop: '8px', textTransform: 'uppercase' }}>Tenure</div>
            </div>
            <div className="vykon-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <Settings size={24} color="var(--color-teal)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '24px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(fin.monthlyEMI)}</div>
              <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)', marginTop: '8px', textTransform: 'uppercase' }}>Monthly Installment</div>
            </div>
          </div>
          
          <p style={{ fontSize: '10px', color: 'var(--color-muted-blue)', marginBottom: '32px', fontStyle: 'italic' }}>
            *The loan details are based on a financial structure with a {formData.downPayment}% upfront down payment, an annual interest rate of {formData.interestRate}%, and a repayment period of {formData.tenureYears} years.
          </p>

          <h3 className="subheading" style={{ fontSize: '16px', marginBottom: '12px' }}>Loan Option Summary</h3>
          <table className="vykon-table">
            <thead>
              <tr>
                <th style={{ width: '70%' }}>Name</th>
                <th style={{ width: '30%', textAlign: 'right' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Upfront Investment</td>
                <td style={{ textAlign: 'right' }}>{formatCurrency(fin.upfrontInvestment)}</td>
              </tr>
              <tr>
                <td>GST Return Benefits</td>
                <td style={{ textAlign: 'right' }}>{formData.taxBenefitAvailable ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td>Accelerated Depreciation Benefits</td>
                <td style={{ textAlign: 'right' }}>{formData.taxBenefitAvailable ? 'Yes' : 'No'}</td>
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

      {/* PAGE 6: SCOPE OF WORK & TIMELINE (Step 7) */}
      <Page id={formData.isLoan ? "page-6" : "page-5"}>
        <SectionHeader title="Scope of" highlight="Work" />
        <table className="vykon-table">
          <thead>
            <tr>
              <th style={{ width: '60%' }}>Name</th>
              <th style={{ width: '20%', textAlign: 'center' }}>EPC</th>
              <th style={{ width: '20%', textAlign: 'center' }}>Customer</th>
            </tr>
          </thead>
          <tbody>
            {formData.scopeItems.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td style={{ textAlign: 'center' }}>{item.epc && <div className="vykon-check"><Check size={14} strokeWidth={3} /></div>}</td>
                <td style={{ textAlign: 'center' }}>{item.cust && <div className="vykon-check"><Check size={14} strokeWidth={3} /></div>}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ height: '32px' }}></div>
        <SectionHeader title="Project" highlight="Schedule" />
        <div style={{ backgroundColor: 'var(--color-navy)', padding: '40px 24px', borderRadius: '8px', border: '1px solid var(--color-border-light)' }}>
          <div className="vykon-timeline">
            {formData.projectSchedule.map((phase, idx) => {
              const colors = ['var(--color-teal)', 'var(--color-orange)'];
              const color = colors[idx % 2];
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: `${100 / formData.projectSchedule.length}%`, zIndex: 2 }}>
                  <div className="timeline-node" style={{ borderColor: color }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }}></div>
                  </div>
                  <div className="timeline-content">
                    <div style={{ fontSize: '11px', color: color, fontWeight: 'bold' }}>{idx + 1}. {phase.name}</div>
                    <div style={{ fontSize: '9px', color: 'var(--color-muted-blue)', marginTop: '2px' }}>{phase.days}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Page>

      {/* PAGE 7: BoM & Warranty (Step 8) */}
      <Page id={formData.isLoan ? "page-7" : "page-6"}>
        <SectionHeader title="Bill of" highlight="Materials" />
        <table className="vykon-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Component</th>
              <th style={{ width: '40%' }}>Make</th>
              <th style={{ width: '20%', textAlign: 'center' }}>Qty.</th>
            </tr>
          </thead>
          <tbody>
            {formData.bomItems.map((item, idx) => (
              <tr key={idx}>
                <td>{item.component}</td>
                <td>{item.make}</td>
                <td style={{ textAlign: 'center' }}>{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ height: '32px' }}></div>
        <SectionHeader title="Warranty" highlight="Terms" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '32px 16px' }}>
            <Sun size={28} color="var(--color-orange)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '32px', color: 'var(--color-orange)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{formData.warrantyPanels} Years</div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)' }}>PV Modules</div>
          </div>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '32px 16px' }}>
            <Cpu size={28} color="var(--color-teal)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '32px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{formData.warrantyInverter} Years</div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)' }}>Inverter</div>
          </div>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '32px 16px' }}>
            <Shield size={28} color="var(--color-earth)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '32px', color: 'var(--color-earth)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{formData.warrantyOther} Year{formData.warrantyOther > 1 ? 's' : ''}*</div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)' }}>Other Components</div>
          </div>
        </div>
        <p style={{ fontSize: '10px', color: 'var(--color-muted-blue)', lineHeight: 1.5 }}>
          *{brandConfig.warrantyFootnote}
        </p>
      </Page>

      {/* PAGE 8: Terms & Conditions (Step 9) */}
      <Page id={formData.isLoan ? "page-8" : "page-7"}>
        <SectionHeader title="Terms &" highlight="Conditions" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {formData.termsConditions.map((term, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '24px' }}>
              <div style={{ width: '120px', flexShrink: 0, color: 'var(--color-teal)', fontSize: '12px', fontWeight: 600 }}>{term.title}</div>
              <div style={{ color: 'var(--color-white)', fontSize: '12px', lineHeight: 1.5 }}>{term.text}</div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
            <div style={{ width: '120px', flexShrink: 0, color: 'var(--color-orange)', fontSize: '12px', fontWeight: 600 }}>Exclusions</div>
            <div style={{ color: 'var(--color-white)', fontSize: '12px', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{formData.exclusions}</div>
          </div>
        </div>
      </Page>

      {/* PAGE 9: About Vykon (Stats) (Auto-injected) */}
      <Page id={formData.isLoan ? "page-9" : "page-8"}>
        <SectionHeader title="About" highlight={brandConfig.companyName} />
        <p style={{ color: 'var(--color-white)', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
          We are dedicated to providing state-of-the-art solar infrastructure solutions across India. 
          Our commitment to quality, precise engineering, and customer satisfaction has made us a trusted partner in the renewable energy sector.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
           <div className="vykon-card" style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ fontSize: '40px', color: 'var(--color-orange)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{brandConfig.stats.capacity}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)', textTransform: 'uppercase' }}>Installed Solar Capacity</div>
          </div>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ fontSize: '40px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{brandConfig.stats.clients}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)', textTransform: 'uppercase' }}>Clients & Lab Partners</div>
          </div>
          <div className="vykon-card" style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ fontSize: '40px', color: 'var(--color-earth)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{brandConfig.stats.sites}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)', textTransform: 'uppercase' }}>Commissioned Sites</div>
          </div>
        </div>
      </Page>

      {/* PAGE 10: Environmental & Contact (Step 10) */}
      <Page id={formData.isLoan ? "page-10" : "page-9"}>
        <SectionHeader title="Environmental" highlight="Impact" />
        <p style={{ color: 'var(--color-white)', fontSize: '12px', lineHeight: 1.6, marginBottom: '24px' }}>
          Our goal is to provide clean, renewable, green energy to discern customers such as yourself. By choosing solar energy, you're not just investing in clean, renewable power — you're joining us in creating a more sustainable future for generations to come. Let's work together to make a positive impact on our planet.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '40px' }}>
           <div className="vykon-card" style={{ backgroundColor: 'rgba(0,194,168,0.1)', borderColor: 'var(--color-teal)', textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: '28px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{fin.co2Offset.toLocaleString(undefined, {maximumFractionDigits:0})} Tonnes</div>
            <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)', textTransform: 'uppercase' }}>CO2 Offset</div>
          </div>
          <div className="vykon-card" style={{ backgroundColor: 'rgba(0,194,168,0.1)', borderColor: 'var(--color-teal)', textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: '28px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{fin.treesEquivalent.toLocaleString(undefined, {maximumFractionDigits:0})} Nos.</div>
            <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)', textTransform: 'uppercase' }}>Trees Planted</div>
          </div>
          <div className="vykon-card" style={{ backgroundColor: 'rgba(0,194,168,0.1)', borderColor: 'var(--color-teal)', textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: '28px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{fin.distanceDriven.toLocaleString(undefined, {maximumFractionDigits:0})} Lakh Kms</div>
            <div style={{ fontSize: '10px', color: 'var(--color-muted-blue)', textTransform: 'uppercase' }}>Distance Driven</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', backgroundColor: 'var(--color-navy)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ width: '40%', backgroundColor: 'var(--color-orange)', padding: '24px', color: 'white' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>Contact Information</h3>
            <p style={{ fontSize: '10px', marginBottom: '24px' }}>We'd love to hear from you!</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> {formData.contactPhone}</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><MapPin size={14} style={{ marginTop: '2px' }} /> {formData.contactAddress}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> {formData.contactEmail}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={14} /> {formData.contactWebsite}</div>
            </div>
          </div>
          <div style={{ width: '60%', padding: '24px', display: 'flex', alignItems: 'center' }}>
            <p style={{ fontSize: '9px', color: 'var(--color-muted-blue)', lineHeight: 1.5 }}>
              DISCLAIMER: {brandConfig.disclaimer}
            </p>
          </div>
        </div>
      </Page>
    </div>
  );
});

export default ProposalDocument;
