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

/* Only the X profile is a real, published account. LinkedIn and Instagram were
   placeholder '#' links here and point at bare site roots on the live site, so
   they are omitted rather than shipped as dead icons. */
export const social = [
  { name: 'X', icon: 'x', href: 'https://x.com/richpay_finance' },
]

/* The live loan portal. Apply and Repay both land on it, matching the current
   production site. External, so these open in a new tab. */
export const portal = {
  url: 'https://richpayfincorp.finaxle.com/welcome',
  apply: 'Apply',
  repay: 'Repay',
}

/* Header navigation. Deliberately three items, matching the live site.
   Contact Us is a mailto, so it carries its own accessible name — "Contact Us"
   alone gives no warning that activating it launches a mail client.
   The address comes from `company` so there is one source of truth for it. */
export const nav = [
  { label: 'Home', href: '#top' },
  { label: 'About Us', href: '#about' },
  {
    label: 'Contact Us',
    href: `mailto:${company.email}`,
    aria: `Contact Us — email ${company.email}`,
  },
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
    amount: '2,50,000',
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
  sub: 'Every product decision at RichPay starts with one question: is this good for the borrower?',
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
  title: 'Financial products that fit your life',
  sub: 'Short-term and personal loans — fully digital, transparent terms, no hidden charges.',
  items: [
    {
      name: 'Personal Loan',
      amount: '₹50,000 – ₹5,00,000',
      rate: 'Up to 24% p.a.',
      tenure: '3 – 12 months',
      positioning: 'A personal loan for everyday financial needs, whether planned or unexpected.',
      points: ['For planned and unplanned expenses', 'Available to salaried & self-employed individuals'],
    },
    {
      name: 'Short-Term Loan',
      amount: '₹10,000 – ₹2,00,000',
      rate: 'Up to 24% p.a.',
      tenure: '7 – 90 days',
      positioning: 'Short-term access to funds when customers need money quickly.',
      points: ['Designed to bridge the gap before the next paycheck', 'Fully digital, disbursed in hours'],
    },
  ],
}

export const calculator = {
  eyebrow: 'Loan calculator',
  title: 'Know your repayment, instantly',
  sub: 'Move the sliders to see exactly what you would pay back.',
  // Required regulatory disclosure — do not remove. Each product appends its
  // own method line to this in the UI.
  disclosure:
    'Actual charges are disclosed before acceptance and remain subject to eligibility and credit assessment.',

  /* Two products, two different interest methods — this is the whole reason the
     calculator has a switch:
       · short-term runs FLAT simple interest per day (P x r x days)
       · personal runs a REDUCING-BALANCE EMI per month

     NOTE: these ranges come from the calculator spec and do NOT match the
     Products section on the same page, which states 3-12 months and up to
     24% p.a. for the Personal Loan. 6%/month is 60% p.a. and 36 months is
     three years. Two different sets of terms for one product need reconciling.
  */
  products: [
    {
      id: 'short-term',
      label: 'Short-Term Loan',
      caption: 'Short Term Loan / Emergency',
      method: 'flat',
      amount: { min: 10000, max: 200000, step: 5000, default: 50000 },
      tenure: { min: 7, max: 90, step: 1, default: 30, unit: 'days', label: 'Tenure (Days)' },
      rate: { min: 0.24, max: 1, step: 0.01, default: 0.5, per: 'day', label: 'Interest Rate / day' },
      headline: 'Total payable',
      claims: ['Fully digital', 'No hidden charges', 'Disbursement in hours', 'Foreclosure allowed'],
    },
    {
      id: 'personal',
      label: 'Personal Loan',
      caption: 'Salaried & Self-Employed',
      method: 'emi',
      amount: { min: 50000, max: 500000, step: 10000, default: 200000 },
      tenure: { min: 3, max: 36, step: 1, default: 12, unit: 'months', label: 'Tenure' },
      rate: { min: 1.5, max: 6, step: 0.1, default: 1.5, per: 'month', label: 'Interest Rate / month' },
      headline: 'Monthly EMI',
      claims: ['Salaried & self-employed', 'No prepayment penalty', 'Transparent pricing', 'Fast approval'],
    },
  ],
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

/* PLACEHOLDER COPY. None of these are real customers. Before this site goes
   live they must be replaced with genuine, consented quotes — an RBI-registered
   NBFC publishing invented customer testimonials is misleading advertising, not
   just a content gap. Kept deliberately free of rate figures and approval
   promises so nothing here contradicts the product pages. */
export const testimonials = {
  eyebrow: 'Customer stories',
  title: 'Real people, real results',
  items: [
    {
      name: 'Priya Sharma', role: 'Graphic Designer', city: 'Mumbai', amount: '₹3,00,000', initials: 'PS',
      quote: 'I saw the full cost upfront — no fine print surprises. The studio setup was funded in 18 hours.'
    },
    {
      name: 'Rohit Gupta', role: 'Software Engineer', city: 'Bangalore', amount: '₹1,50,000', initials: 'RG',
      quote: 'During a medical emergency the last thing I needed was confusion. The clarity on interest rates made the decision easy.'
    },
    {
      name: 'Anita Desai', role: 'Small Business Owner', city: 'Pune', amount: '₹2,00,000', initials: 'AD',
      quote: 'My bakery oven broke down on a Tuesday. Same-day access and transparent charges got me running again.'
    },
    {
      name: 'Vikram Nair', role: 'Teacher', city: 'Chennai', amount: '₹1,00,000', initials: 'VN',
      quote: 'Unexpected medical bills are stressful enough. Having a clear repayment plan from day one mattered.'
    },
    {
      name: 'Kavita Reddy', role: 'Staff Nurse', city: 'Hyderabad', amount: '₹45,000', initials: 'KR',
      quote: 'The repayment schedule was mailed to me before I signed, so I knew every due date well before the school term started.'
    },
    {
      name: 'Sandeep Yadav', role: 'Fleet Owner', city: 'Lucknow', amount: '₹4,50,000', initials: 'SY',
      quote: 'Being self-employed, I expected a pile of questions. Sharing my returns and bank statements was enough to get the working capital I needed.'
    },
    {
      name: 'Meera Krishnan', role: 'Dentist', city: 'Kochi', amount: '₹2,75,000', initials: 'MK',
      quote: 'I closed the loan four months early after a good quarter — there was no penalty for paying ahead.'
    },
    {
      name: 'Imran Sheikh', role: 'Electrician', city: 'Ahmedabad', amount: '₹25,000', initials: 'IS',
      quote: 'The clutch in my work van gave out before a big wiring job. The money reached my account the same evening and I met the deadline.'
    },
    {
      name: 'Sneha Banerjee', role: 'HR Manager', city: 'Kolkata', amount: '₹1,75,000', initials: 'SB',
      quote: 'I finished the whole application from my phone during a work trip. No branch visit, no courier, no printouts to sign.'
    },
    {
      name: 'Harpreet Singh', role: 'Auto Parts Dealer', city: 'Ludhiana', amount: '₹3,25,000', initials: 'HS',
      quote: 'I called twice with questions about my EMI date, and the same person picked up both times and explained everything patiently.'
    },
    {
      name: 'Deepak Sahu', role: 'Logistics Supervisor', city: 'Bhubaneswar', amount: '₹60,000', initials: 'DS',
      quote: 'After my bonus came through in March, I foreclosed the loan online in a few clicks and got the closure letter by email.'
    },
    {
      name: 'Tanvi Joshi', role: 'Freelance Photographer', city: 'Indore', amount: '₹85,000', initials: 'TJ',
      quote: 'The processing fee and every charge were listed on one screen before I accepted — I saved a screenshot for my records.'
    },
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
    {
      title: 'Products', links: [
        { label: 'Personal Loan', href: '#products' },
        { label: 'Short Term Loan', href: '#products' },
      ]
    },
    {
      title: 'Company', links: [
        { label: 'About', href: '#about' },
        { label: 'Customer Stories', href: '#testimonials' },
        { label: 'Trust & Security', href: '#trust' },
        { label: 'FAQs', href: '/faq' },
      ]
    },
    {
      title: 'Legal', links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Fair Practice Code', href: '/fair-practice-code' },
        { label: 'Interest Rate Policy', href: '/interest-rate-policy' },
        { label: 'Refund & Cancellation Policy', href: '/refund-cancellation-policy' },
        { label: 'Grievance Redressal', href: '/grievance' },
      ]
    },
  ],
  disclaimer:
    'All loans are subject to eligibility, credit assessment and regulatory requirements. RichPay Fincorp Private Limited is a registered NBFC-ICC with the Reserve Bank of India.',
}
