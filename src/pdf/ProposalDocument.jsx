import React, { forwardRef } from 'react';
import { calculateFinancials, formatCurrency } from '../utils/calculations';
import { Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

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
      <div style={{ width: '48px', height: '5px', backgroundColor: 'var(--color-orange)' }}></div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '14px', letterSpacing: '1px' }}>VYKON INDUS TECHNOLOGIES</div>
        <div style={{ fontFamily: 'var(--font-body)', color: 'var(--color-muted-blue)', fontSize: '12px' }}>contact@vykonindustechnologies.com</div>
      </div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'white' }}>
        Close <span style={{ color: 'var(--color-teal)' }}>Precise.</span>
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '10px', color: 'var(--color-earth)', letterSpacing: '2px', marginTop: '4px' }}>
        SOLAR INFRASTRUCTURE · INDIA
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

const ProposalDocument = forwardRef(({ formData }, ref) => {
  const fin = calculateFinancials(formData);

  // Chart Data
  const monthlyGenData = Array.from({ length: 12 }, (_, i) => ({
    name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    value: Math.round(fin.annualGeneration / 12 * (1 + Math.sin(i) * 0.1)) // simple curve simulation
  }));

  const gen25YrData = Array.from({ length: 25 }, (_, i) => ({
    year: i + 1,
    value: Math.round(fin.annualGeneration * Math.pow(0.99, i))
  }));

  let cumulative = 0;
  let currentTariff = parseFloat(formData.tariffRate);
  let currentGen = fin.annualGeneration;
  const savings25YrData = Array.from({ length: 25 }, (_, i) => {
    cumulative += currentGen * currentTariff;
    currentTariff *= (1 + (parseFloat(formData.escalationRate) / 100));
    currentGen *= 0.99;
    return { year: i + 1, value: Math.round(cumulative) };
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

      {/* PAGE 2: BENEFITS & CUSTOMER DETAILS */}
      <Page>
        <h2 className="headline-1" style={{ fontSize: '48px', marginBottom: '40px' }}>
          EXECUTIVE <span className="headline-2">SUMMARY</span>
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <StatBox value={formatCurrency(fin.firstYearSavings)} label="1ST YEAR SAVINGS" color="var(--color-teal)" />
          <StatBox value={formatCurrency(fin.averageAnnualSavings)} label="AVG ANNUAL SAVINGS" />
          <StatBox value={formatCurrency(fin.lifetimeSavings)} label="LIFETIME SAVINGS (25 YRS)" />
          <StatBox value={formatCurrency(fin.grandTotal)} label="TOTAL INVESTMENT" color="var(--color-white)" />
          <StatBox value={`${fin.paybackYears}Y ${fin.paybackRemainingMonths}M`} label="PAYBACK PERIOD" color="var(--color-teal)" />
          <StatBox value={`${fin.annualReturns.toFixed(1)}%`} label="ANNUAL RETURNS (ROI)" />
        </div>

        <div style={{ backgroundColor: 'var(--color-navy)', padding: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="subheading" style={{ fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>CUSTOMER PROFILE</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <DetailItem label="Company" value={formData.companyName} />
            <DetailItem label="Contact" value={formData.contactPerson} />
            <DetailItem label="Address" value={formData.siteAddress} />
            <DetailItem label="Phone" value={formData.consumerNumber} />
            <DetailItem label="Avg Consumption" value={`${formData.monthlyConsumption} kWh/month`} />
            <DetailItem label="Current Tariff" value={`₹ ${formData.tariffRate} / unit`} />
          </div>
        </div>
      </Page>

      {/* PAGE 3: PRICING */}
      <Page>
        <h2 className="headline-1" style={{ fontSize: '48px', marginBottom: '40px' }}>
          COMMERCIAL <span className="headline-2">PROPOSAL</span>
        </h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-navy)', borderLeft: '3px solid var(--color-teal)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'white', fontFamily: 'var(--font-body)' }}>Description</th>
              <th style={{ padding: '16px', textAlign: 'right', color: 'white', fontFamily: 'var(--font-body)' }}>Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <td style={{ padding: '16px', color: 'white' }}>Design, Supply & Installation of {formData.capacity} kWp Solar Plant</td>
              <td style={{ padding: '16px', textAlign: 'right', color: 'white' }}>{formatCurrency(fin.projectCost)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <td style={{ padding: '16px', color: 'white' }}>GST @ {formData.gstRate}%</td>
              <td style={{ padding: '16px', textAlign: 'right', color: 'white' }}>{formatCurrency(fin.gstAmount)}</td>
            </tr>
            <tr style={{ backgroundColor: 'rgba(244,98,31,0.1)' }}>
              <td style={{ padding: '16px', color: 'var(--color-orange)', fontWeight: 'bold' }}>GRAND TOTAL</td>
              <td style={{ padding: '16px', textAlign: 'right', color: 'var(--color-orange)', fontWeight: 'bold', fontSize: '20px' }}>{formatCurrency(fin.grandTotal)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div>
            <h3 className="subheading" style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--color-teal)' }}>TAX BENEFITS</h3>
            <div style={{ backgroundColor: 'var(--color-navy)', padding: '24px', borderRadius: '8px' }}>
              <DetailItem label="GST Input Credit" value={formatCurrency(fin.gstInputCredit)} />
              <div style={{ height: '16px' }}></div>
              <DetailItem label="Accelerated Depreciation (1st Year)" value={formatCurrency(fin.acceleratedDepreciation)} />
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '16px 0' }}></div>
              <DetailItem label="Total Effective Incentives" value={formatCurrency(fin.totalIncentives)} />
            </div>
          </div>
          <div>
            <h3 className="subheading" style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--color-orange)' }}>PAYMENT TERMS</h3>
            <div style={{ backgroundColor: 'var(--color-navy)', padding: '24px', borderRadius: '8px' }}>
              <DetailItem label="Advance along with PO" value="20%" />
              <div style={{ height: '16px' }}></div>
              <DetailItem label="Against Proforma Invoice before dispatch" value="60%" />
              <div style={{ height: '16px' }}></div>
              <DetailItem label="After Installation & Commissioning" value="20%" />
            </div>
          </div>
        </div>
      </Page>

      {/* PAGE 4: OUTCOMES & CHARTS */}
      <Page>
        <h2 className="headline-1" style={{ fontSize: '48px', marginBottom: '40px' }}>
          PROJECT <span className="headline-2">OUTCOMES</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: 'var(--color-navy)', padding: '20px', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--color-muted-blue)', fontSize: '12px', marginBottom: '16px' }}>MONTHLY GENERATION ESTIMATE (kWh)</h4>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyGenData}>
                  <XAxis dataKey="name" stroke="var(--color-muted-blue)" fontSize={10} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: 'var(--color-navy)', border: 'none', color: 'white'}} />
                  <Bar dataKey="value" fill="var(--color-teal)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'var(--color-navy)', padding: '20px', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--color-muted-blue)', fontSize: '12px', marginBottom: '16px' }}>25-YEAR GENERATION DEGRADATION (kWh)</h4>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gen25YrData}>
                  <XAxis dataKey="year" stroke="var(--color-muted-blue)" fontSize={10} />
                  <Tooltip contentStyle={{backgroundColor: 'var(--color-navy)', border: 'none', color: 'white'}} />
                  <Line type="monotone" dataKey="value" stroke="var(--color-orange)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-navy)', padding: '20px', borderRadius: '8px', height: '300px' }}>
          <h4 style={{ color: 'var(--color-muted-blue)', fontSize: '12px', marginBottom: '16px' }}>CUMULATIVE SAVINGS OVER 25 YEARS (INR)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={savings25YrData}>
              <XAxis dataKey="year" stroke="var(--color-muted-blue)" fontSize={10} />
              <YAxis stroke="var(--color-muted-blue)" fontSize={10} tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`} />
              <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{backgroundColor: 'var(--color-navy)', border: 'none', color: 'white'}} />
              <Area type="monotone" dataKey="value" stroke="var(--color-teal)" fill="var(--color-teal)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Page>

      {/* PAGE 5: LOAN OPTION (Conditional) */}
      {formData.isLoan && (
        <Page>
          <h2 className="headline-1" style={{ fontSize: '48px', marginBottom: '40px' }}>
            FINANCING <span className="headline-2">OPTION</span>
          </h2>
          
          <div style={{ backgroundColor: 'rgba(0,194,168,0.05)', border: '1px solid var(--color-teal)', padding: '32px', borderRadius: '8px', marginBottom: '40px' }}>
            <h3 className="subheading" style={{ fontSize: '24px', marginBottom: '24px', color: 'var(--color-teal)' }}>LOAN STRUCTURE</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <DetailItem label="Total Project Cost (Inc. GST)" value={formatCurrency(fin.grandTotal)} />
              <DetailItem label={`Down Payment (${formData.downPayment}%)`} value={formatCurrency(fin.grandTotal * (formData.downPayment/100))} />
              <DetailItem label="Loan Amount" value={formatCurrency(fin.loanAmount)} />
              <DetailItem label="Interest Rate" value={`${formData.interestRate}%`} />
              <DetailItem label="Tenure" value={`${formData.tenureYears} Years`} />
              <DetailItem label="Estimated Monthly EMI" value={formatCurrency(fin.monthlyEMI)} valueColor="var(--color-orange)" />
            </div>
          </div>
          
          <div style={{ backgroundColor: 'var(--color-navy)', padding: '32px', borderRadius: '8px' }}>
            <h3 className="subheading" style={{ fontSize: '20px', marginBottom: '16px' }}>NET UPFRONT OUTFLOW</h3>
            <p style={{ color: 'var(--color-earth)', marginBottom: '16px' }}>Considering tax benefits (GST Input Credit & Accelerated Depreciation for 1st Year) against the down payment.</p>
            <DetailItem label="Down Payment Required" value={formatCurrency(fin.grandTotal * (formData.downPayment/100))} />
            <div style={{ height: '12px' }}></div>
            <DetailItem label="Less: Tax Benefits" value={`- ${formatCurrency(fin.totalIncentives)}`} />
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '16px 0' }}></div>
            <DetailItem label="Effective Net Investment" value={formatCurrency(Math.max(0, fin.upfrontInvestment))} valueColor="var(--color-teal)" />
          </div>
        </Page>
      )}

      {/* PAGE 6: SCOPE & TIMELINE */}
      <Page>
        <h2 className="headline-1" style={{ fontSize: '48px', marginBottom: '40px' }}>
          PROJECT <span className="headline-2">EXECUTION</span>
        </h2>

        <h3 className="subheading" style={{ fontSize: '24px', marginBottom: '20px' }}>SCOPE OF WORK</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <td style={{ padding: '16px', color: 'var(--color-teal)', width: '30%', fontWeight: 'bold' }}>Engineering</td>
              <td style={{ padding: '16px', color: 'white' }}>Site survey, shadow analysis, structural design, electrical SLD, and layout planning.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <td style={{ padding: '16px', color: 'var(--color-teal)', fontWeight: 'bold' }}>Procurement</td>
              <td style={{ padding: '16px', color: 'white' }}>Supply of Solar Modules, Inverters, MMS, Cables, and all BoS components to site.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <td style={{ padding: '16px', color: 'var(--color-teal)', fontWeight: 'bold' }}>Installation</td>
              <td style={{ padding: '16px', color: 'white' }}>Civil works, module mounting, electrical wiring, earthing, and safety systems.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <td style={{ padding: '16px', color: 'var(--color-teal)', fontWeight: 'bold' }}>Commissioning</td>
              <td style={{ padding: '16px', color: 'white' }}>Testing, net-metering liaison (if applicable), and handover with performance demo.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="subheading" style={{ fontSize: '24px', marginBottom: '20px' }}>ESTIMATED SCHEDULE (4-6 WEEKS)</h3>
        <div style={{ position: 'relative', borderLeft: '2px solid var(--color-orange)', marginLeft: '12px', paddingBottom: '20px' }}>
          <TimelineItem week="Week 1" text="Advance Payment & Site Engineering" />
          <TimelineItem week="Week 2-3" text="Material Procurement & Dispatch" />
          <TimelineItem week="Week 4-5" text="Civil & Mechanical Installation at Site" />
          <TimelineItem week="Week 6" text="Electrical Integration, Testing & Commissioning" />
        </div>
      </Page>

      {/* PAGE 7: BoM & WARRANTY */}
      <Page>
        <h2 className="headline-1" style={{ fontSize: '48px', marginBottom: '40px' }}>
          BOM & <span className="headline-2">WARRANTY</span>
        </h2>

        <h3 className="subheading" style={{ fontSize: '24px', marginBottom: '20px' }}>BILL OF MATERIALS</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-navy)', borderLeft: '3px solid var(--color-teal)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'white' }}>Component</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'white' }}>Make / Brand</th>
            </tr>
          </thead>
          <tbody>
            <BomRow item="Solar Modules" make={formData.panelMake} />
            <BomRow item="String Inverter" make={formData.inverterMake} />
            <BomRow item="DC Cables" make={formData.dcCableMake} />
            <BomRow item="AC Cables" make={formData.acCableMake} />
            <BomRow item="Switchgear / Protection" make={formData.switchgearMake} />
            <BomRow item="Module Mounting Structure" make="HDG Steel / Aluminum" />
          </tbody>
        </table>

        <h3 className="subheading" style={{ fontSize: '24px', marginBottom: '20px' }}>WARRANTY TERMS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: 'var(--color-navy)', padding: '20px', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--color-orange)', fontSize: '18px', marginBottom: '8px' }}>Solar Modules</h4>
            <p style={{ color: 'white', fontSize: '14px' }}>10-12 Years Product Warranty<br/>25 Years Linear Performance Warranty</p>
          </div>
          <div style={{ backgroundColor: 'var(--color-navy)', padding: '20px', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--color-orange)', fontSize: '18px', marginBottom: '8px' }}>Inverters</h4>
            <p style={{ color: 'white', fontSize: '14px' }}>5-7 Years Standard Product Warranty</p>
          </div>
          <div style={{ backgroundColor: 'var(--color-navy)', padding: '20px', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--color-orange)', fontSize: '18px', marginBottom: '8px' }}>Workmanship</h4>
            <p style={{ color: 'white', fontSize: '14px' }}>1 Year from date of commissioning</p>
          </div>
          <div style={{ backgroundColor: 'var(--color-navy)', padding: '20px', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--color-orange)', fontSize: '18px', marginBottom: '8px' }}>Other BoS</h4>
            <p style={{ color: 'white', fontSize: '14px' }}>As per original equipment manufacturer</p>
          </div>
        </div>
      </Page>

      {/* PAGE 8: ABOUT VYKON */}
      <Page className="bg-grid">
        <div className="bg-diagonal-teal" style={{ top: 'auto', bottom: '-100px', left: '-100px', right: 'auto' }}></div>
        <h2 className="headline-1" style={{ fontSize: '48px', marginBottom: '40px' }}>
          ABOUT <span className="headline-2">VYKON</span>
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: 'white', fontSize: '16px', lineHeight: 1.8 }}>
          <p>
            Vykon Indus Technologies is a premier EPC company specializing in utility-scale and commercial solar infrastructure across India. With a relentless focus on engineering excellence and precision execution, we deliver end-to-end solar solutions that empower businesses to transition to clean, profitable energy.
          </p>
          <p>
            Our portfolio spans over 44+ MW of installed capacity across 21+ active sites, ranging from large-scale ground mounts to complex industrial rooftops. We partner with Tier-1 global manufacturers to ensure every plant we build performs at peak efficiency for its 25-year lifecycle.
          </p>
        </div>

        <h3 className="subheading" style={{ fontSize: '24px', marginTop: '60px', marginBottom: '24px' }}>TRUSTED BY INDUSTRY LEADERS</h3>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {['LOOM', 'GOLDI', 'VEDANTA', 'JOULE', 'CLN', 'SUNGARNER'].map(partner => (
            <div key={partner} style={{ padding: '12px 24px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: 'var(--color-muted-blue)', fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '2px' }}>
              {partner}
            </div>
          ))}
        </div>
      </Page>

      {/* PAGE 9: T&C */}
      <Page>
        <h2 className="headline-1" style={{ fontSize: '48px', marginBottom: '40px' }}>
          TERMS & <span className="headline-2">CONDITIONS</span>
        </h2>
        
        <ul style={{ color: 'var(--color-earth)', fontSize: '14px', lineHeight: 1.8, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <li><strong>Validity:</strong> This proposal is valid for 15 days from the date of issue.</li>
          <li><strong>Statutory Approvals:</strong> While Vykon will assist in documentation, the cost and responsibility of securing net-metering or CEIG approvals rest with the client.</li>
          <li><strong>Civil Works:</strong> Any major civil modifications required on the existing roof structure are excluded unless explicitly stated in the BoM.</li>
          <li><strong>Water & Electricity:</strong> Uninterrupted water and electricity for construction purposes must be provided by the client free of cost.</li>
          <li><strong>Taxation:</strong> Any changes in GST or statutory taxes by the government prior to invoicing will be charged at actuals.</li>
          <li><strong>Force Majeure:</strong> Vykon shall not be liable for delays caused by natural disasters, strikes, or supply chain disruptions beyond our control.</li>
          <li><strong>Cancellation:</strong> Cancellation post PO issuance will attract a penalty equivalent to the advance amount or actual expenses incurred, whichever is higher.</li>
        </ul>
      </Page>

      {/* PAGE 10: IMPACT & CONTACT */}
      <Page>
        <h2 className="headline-1" style={{ fontSize: '48px', marginBottom: '40px' }}>
          ENVIRONMENTAL <span className="headline-2">IMPACT</span>
        </h2>

        <p style={{ color: 'white', marginBottom: '40px', fontSize: '18px' }}>Over the 25-year lifespan of this solar plant, you will contribute significantly to a greener planet.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '80px' }}>
          <div style={{ backgroundColor: 'rgba(0,194,168,0.1)', border: '1px solid var(--color-teal)', padding: '32px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', color: 'var(--color-teal)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{fin.co2Offset.toFixed(0)}</div>
            <div style={{ fontSize: '12px', color: 'white', letterSpacing: '1px', marginTop: '8px' }}>TONNES OF CO2 OFFSET</div>
          </div>
          <div style={{ backgroundColor: 'rgba(244,98,31,0.1)', border: '1px solid var(--color-orange)', padding: '32px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', color: 'var(--color-orange)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{fin.treesEquivalent.toFixed(0)}</div>
            <div style={{ fontSize: '12px', color: 'white', letterSpacing: '1px', marginTop: '8px' }}>EQUIVALENT TREES PLANTED</div>
          </div>
          <div style={{ backgroundColor: 'var(--color-navy)', border: '1px solid rgba(255,255,255,0.2)', padding: '32px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{fin.distanceDriven.toFixed(1)}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)', letterSpacing: '1px', marginTop: '8px' }}>LAKH KM DRIVEN AVOIDED</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'auto' }}>
          <h3 className="headline-2" style={{ fontSize: '36px', marginBottom: '16px' }}>READY TO ENERGIZE?</h3>
          <p style={{ color: 'white', fontSize: '18px', marginBottom: '8px' }}>Contact our engineering team to proceed.</p>
          <p style={{ color: 'var(--color-teal)', fontSize: '24px', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '1px' }}>contact@vykonindustechnologies.com</p>
        </div>
      </Page>
    </div>
  );
});

// Helper Components
const StatBox = ({ value, label, color = 'var(--color-orange)' }) => (
  <div style={{ backgroundColor: 'var(--color-navy)', padding: '24px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '36px', color, marginBottom: '4px' }}>{value}</div>
    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: 'var(--color-earth)', letterSpacing: '1px' }}>{label}</div>
  </div>
);

const DetailItem = ({ label, value, valueColor = 'white' }) => (
  <div>
    <div style={{ fontSize: '12px', color: 'var(--color-muted-blue)', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '16px', color: valueColor, fontWeight: 500 }}>{value}</div>
  </div>
);

const TimelineItem = ({ week, text }) => (
  <div style={{ position: 'relative', paddingLeft: '24px', marginBottom: '24px' }}>
    <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-orange)' }}></div>
    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-teal)', fontSize: '14px', marginBottom: '4px' }}>{week}</div>
    <div style={{ color: 'white', fontSize: '14px' }}>{text}</div>
  </div>
);

const BomRow = ({ item, make }) => (
  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <td style={{ padding: '16px', color: 'var(--color-teal)' }}>{item}</td>
    <td style={{ padding: '16px', color: 'white' }}>{make}</td>
  </tr>
);

export default ProposalDocument;
