/* ============================================================================
   RichPay — SITE CONTENT
   Source of truth for copy: brand/CONTENT-SPEC.md (extracted from the client's
   RichPay.pdf) reconciled against the live site richpayfincorp.com.
   Edit copy HERE, not inside components.
   ========================================================================== */

export const company = {
  name: 'RichPay Fincorp',
  legalName: 'RichPay Fincorp Private Limited',
  formerName: 'Malwa Leasing & Credits Private Limited',
  phone: '+91-93556-00811',
  phoneHref: 'tel:+919355600811',
  // TODO(client): the source PDF redacts this as "[email protected]" — confirm real address.
  email: 'support@richpayfincorp.com',
  address:
    'Office No. 510, 5th Floor, Surya Kiran Building, K.G. Marg, Connaught Place, New Delhi – 110001',
  cities: '450+',
}

export const nav = [
  { label: 'How it works', href: '#process' },
  { label: 'Products', href: '#products' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'Trust & Security', href: '#trust' },
  { label: 'About', href: '#about' },
]

export const hero = {
  eyebrow: 'RBI-registered NBFC',
  // Each line is a plain lead + one emphasis word. The emphasis words carry the
  // gold and the serif accent face; the leads stay white Poppins.
  headlineLines: [
    { lead: 'Borrow with', accent: 'clarity.' },
    { lead: 'Decide with', accent: 'confidence.' },
  ],
  sub: 'Loans in minutes. Transparent fees. Growth for years.',
  primaryCta: 'Check eligibility',
  secondaryCta: 'Explore products',
  stats: [
    { value: '34,000+', label: 'Customers' },
    { value: '4.8', label: 'Google rated', star: true },
    { value: '<15 min', label: 'Approval' },
  ],
  // Panel 1 of the hero's right-hand stack — an illustrative approval.
  approvalCard: {
    label: 'Approved',
    amount: '₹2,50,000',
    meta: 'Under 15 min',
    caption: 'Personal loan · disbursed to bank account',
    progressLabel: 'Application progress',
    steps: ['Documents submitted', 'Credit check passed', 'Loan approved'],
  },
  // Panel 2 — regulatory trust strip. Every claim here is drawn from copy already
  // approved elsewhere on the page (see `trust` and `about`); invent nothing new.
  trustStrip: {
    label: 'Regulated & secure',
    items: [
      { icon: 'bank', text: 'RBI-registered NBFC-ICC' },
      { icon: 'lock', text: '256-bit encryption' },
      { icon: 'pin', text: '450+ cities' },
    ],
  },
}

export const process = {
  eyebrow: 'The process',
  title: 'From application to account',
  steps: [
    { n: '01', title: 'Apply in minutes', body: 'Fill out a short form on any device. No branch visits, no paperwork.' },
    { n: '02', title: 'Smart credit matching', body: 'Our system finds the right lending partner for your profile, fast.' },
    { n: '03', title: 'Clear decision', body: 'Get a clear yes or no with full transparency on terms.' },
    { n: '04', title: 'Money in your account', body: 'Funds are disbursed directly, often within 24 hours of approval.' },
  ],
}

export const why = {
  eyebrow: 'Why RichPay',
  title: 'Built differently, for you.',
  sub: 'The core brand philosophy is simple: the borrower comes first.',
  items: [
    // `featured` promotes an item to the bento's large navy tile.
    { title: 'Transparent pricing', body: 'Every fee, rate and charge is shown upfront. No surprises at disbursement.', icon: 'receipt', featured: true },
    { title: 'Decisions in 10 minutes', body: 'Automated matching and review enable a decision within 10 minutes of applying.', icon: 'clock' },
    { title: 'Tenures that fit your life', body: 'Tenures ranging from 3 to 60 months, depending on the product.', icon: 'calendar' },
    { title: 'Zero prepayment penalty', body: 'Pay off your loan early without a prepayment penalty.', icon: 'shield' },
  ],
  // Proof tile. Verbatim from `numbers` — deliberately NOT '₹25 Cr+', which
  // StatsBand already shows two sections above as 'Total disbursed'; the same
  // figure under a second label reads as two different numbers.
  stat: { value: '100%', label: 'Digital process' },
  cta: { eyebrow: 'Next step', label: 'Check your eligibility', href: '#calculator' },
}

export const bandStats = [
  { value: '₹25 Cr+', label: 'Total disbursed' },
  { value: '34,000+', label: 'Happy borrowers' },
  { value: '24 hrs', label: 'Average disbursal' },
]

export const products = {
  eyebrow: 'Our products',
  title: 'Credit that matches the need',
  sub: 'Two clear products, priced upfront. No fine print.',
  items: [
    {
      name: 'Personal Loan',
      amount: '₹50,000 – ₹5,00,000',
      rate: 'Up to 24% p.a.',
      tenure: '3 – 12 months',
      positioning: 'A personal loan for everyday financial needs, whether planned or unexpected.',
      points: ['For planned and unplanned expenses', 'Available to salaried & self-employed individuals'],
      featured: true,
    },
    {
      name: 'Short-Term Loan',
      amount: '₹10,000 – ₹2,00,000',
      rate: 'Up to 24% p.a.',
      tenure: '7 – 90 days',
      positioning: 'Short-term access to funds when customers need money quickly.',
      points: ['Designed to bridge the gap before the next paycheck', 'Fully digital, disbursed in hours'],
      featured: false,
    },
    {
      name: 'Emergency Loan',
      amount: 'On request',
      rate: 'As per eligibility',
      tenure: 'Flexible',
      positioning: 'For urgent, unavoidable expenses that cannot wait.',
      points: ['Referenced in the product line-up', 'Speak to an advisor for terms'],
      featured: false,
    },
  ],
}

export const calculator = {
  eyebrow: 'Loan calculator',
  title: 'Know your repayment, instantly',
  sub: 'Move the sliders to see exactly what you would pay back.',
  amount: { min: 10000, max: 200000, step: 5000, default: 50000 },
  tenure: { min: 7, max: 90, step: 1, default: 30 },
  rate: { min: 0.24, max: 1, step: 0.01, default: 0.5 },
  claims: ['Fully digital', 'No hidden charges', 'Disbursement in hours', 'Foreclosure allowed'],
  // Required regulatory disclosure — do not remove.
  disclosure:
    'This calculation uses flat simple interest and is indicative only. Actual charges are disclosed before acceptance and remain subject to eligibility and credit assessment.',
}

export const trust = {
  eyebrow: 'Trust & security',
  title: 'Built on a foundation of trust',
  items: [
    { title: 'SSL secured', body: '256-bit encryption on all data in transit.', icon: 'lock' },
    { title: 'RBI-aligned', body: 'Operating with registered NBFC partners.', icon: 'bank' },
    { title: 'Data privacy', body: 'Zero third-party data sharing.', icon: 'eye' },
  ],
  stats: [
    { value: '34,000+', label: 'Borrowers served' },
    { value: '₹25 Cr+', label: 'Disbursed' },
    { value: '4.8', label: 'Customer rating', star: true },
    { value: '<15 min', label: 'Approval time' },
  ],
}

export const testimonials = {
  eyebrow: 'Customer stories',
  title: 'Real people, real results',
  items: [
    { name: 'Priya Sharma', role: 'Graphic Designer', city: 'Mumbai', amount: '₹3,00,000', initials: 'PS',
      quote: 'I saw the full cost upfront — no fine print surprises. The studio setup was funded in 18 hours.' },
    { name: 'Rohit Gupta', role: 'Software Engineer', city: 'Bangalore', amount: '₹1,50,000', initials: 'RG',
      quote: 'During a medical emergency the last thing I needed was confusion. The clarity on interest rates made the decision easy.' },
    { name: 'Anita Desai', role: 'Small Business Owner', city: 'Pune', amount: '₹2,00,000', initials: 'AD',
      quote: 'My bakery oven broke down on a Tuesday. Same-day access and transparent charges got me running again.' },
    { name: 'Vikram Nair', role: 'Teacher', city: 'Chennai', amount: '₹1,00,000', initials: 'VN',
      quote: 'Unexpected medical bills are stressful enough. Having a clear repayment plan from day one mattered.' },
  ],
}

export const about = {
  eyebrow: 'About RichPay',
  title: 'Clarity was always the missing piece',
  body: [
    'RichPay Fincorp Private Limited, formerly known as Malwa Leasing & Credits Private Limited, is registered as an NBFC, Investment & Credit Company (NBFC-ICC) with the Reserve Bank of India.',
    'RichPay is a technology-driven digital lender offering unsecured personal loans across approximately 450 cities and towns in India.',
  ],
  vision: {
    title: 'Vision',
    body: "To become one of India's most trusted digital lending platforms by making credit accessible, affordable, transparent and customer-centric.",
  },
  mission: {
    title: 'Mission',
    body: 'Provide fast, hassle-free access to credit, with full transparency, privacy protection, and compliance with RBI guidelines.',
  },
  values: [
    { title: 'Transparency', body: 'All charges disclosed upfront. No fine print, no surprises.' },
    { title: 'Responsibility', body: 'Lending based on repayment capacity, not just eligibility.' },
    { title: 'Speed', body: 'Fully digital application, verification and funding.' },
    { title: 'Inclusion', body: 'Credit access for salaried and self-employed Indians across the country.' },
  ],
}

export const numbers = {
  eyebrow: 'By the numbers',
  title: 'Momentum you can measure',
  items: [
    { value: '₹25 Cr+', label: 'Credit facilitated' },
    { value: '34,000+', label: 'Borrowers served' },
    { value: '15 min', label: 'Average approval time' },
    { value: '100%', label: 'Digital process' },
  ],
}

/* ⚠️ BLOCKED — the client's source document contradicts itself:
   About says the RichPay retail brand launched June 2026, while this timeline
   says founded 2021. The source doc explicitly warns: "Don't publish both
   narratives as-is." Rendering is gated behind SHOW_JOURNEY until the client
   confirms the real dates. Everything else on the page is unaffected. */
export const SHOW_JOURNEY = false
export const journey = {
  eyebrow: 'Our journey',
  title: 'How we got here',
  items: [
    { year: '2021', title: 'Founded', body: 'RichPay Fincorp launched with a mission to make personal lending fast and transparent.' },
    { year: '2022', title: 'First 500 loans', body: 'Reached 500 approved loans within the first year.' },
    { year: '2024', title: '34,000+ borrowers', body: 'Over ₹25 Cr facilitated and 34,000+ borrowers served across India.' },
  ],
}

export const mobile = {
  eyebrow: 'Mobile experience',
  title: 'Same clarity, anywhere.',
  sub: 'Everything you can do on the web, in your pocket.',
  features: [
    'Check rates before you apply',
    'Apply for loans in minutes',
    'Track loan status in real time',
    'View EMI schedules months ahead',
    'One-tap support — chat, call or email',
    'Biometric security with Face ID and fingerprint',
  ],
  storeNote: 'Coming soon',
}

export const finalCta = {
  title: 'Your next financial chapter starts here.',
  sub: 'Join 34,000+ Indians who borrow smarter, with full transparency, through RichPay Fincorp.',
  points: ['4.8-star rated', 'RBI-aligned', 'Zero hidden fees', '<15 min approval'],
  cta: 'Talk to an advisor',
  secondary: 'Check eligibility',
}

export const footer = {
  // `href` is optional. Entries without one have no route yet and render as an
  // inert '#'. SmartLink decides how each href is navigated.
  columns: [
    { title: 'Products', links: [
      { label: 'Personal Loan', href: '#products' },
      { label: 'Short Term Loan', href: '#products' },
      { label: 'Emergency Loan', href: '#products' },
    ] },
    { title: 'Company', links: [
      { label: 'About', href: '#about' },
      { label: 'Customer Stories', href: '#testimonials' },
      { label: 'Trust & Security', href: '#trust' },
      { label: 'FAQs' },
    ] },
    { title: 'Legal', links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Fair Practice Code' },
      { label: 'Interest Rate Policy' },
      { label: 'Refund & Cancellation Policy' },
      { label: 'Grievance Redressal' },
    ] },
  ],
  disclaimer:
    'All loans are subject to eligibility, credit assessment and regulatory requirements. RichPay Fincorp Private Limited is a registered NBFC-ICC with the Reserve Bank of India.',
}
