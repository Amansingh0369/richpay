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
  // gold and the Boldonse accent face; the leads stay white Poppins.
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
    { value: 'Less than 15 minutes', label: 'Approval' },
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

     NOTE: these ranges come from the calculator spec. They used to contradict
     the Products section, which stated 3-12 months and up to 24% p.a. for the
     Personal Loan; that section has since been removed, so the calculator is
     now the ONLY place the site states terms — and it states 6%/month, i.e.
     60% p.a., over up to 36 months. Removing the conflicting copy did not
     reconcile the numbers, it just left this side of it unopposed. Confirm
     these are the rates being disclosed before launch.
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
    { value: 'Less than 15 minutes', label: 'Approval time' },
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
  eyebrow: 'Our story',
  title: 'Clarity was always the missing piece',
  body: [
    'RichPay Fincorp Private Limited (formerly known as Malwa Leasing & Credits Private Limited) is registered as an NBFC – Investment & Credit Company (NBFC-ICC) with the Reserve Bank of India. RichPay Fincorp Private Limited (formerly known as Malwa Leasing & Credits Private Limited) started retail operations under the brand name “RichPay” in June 2026.',
    'We are a technology-driven NBFC and operate as a ‘Digital Lender’ offering unsecured personal loans to individuals spread across 450 cities / towns across the country.',
    'Our vision is to become one of India’s most trusted digital lending platforms — making credit accessible, affordable, transparent, and customer-centric. We bridge the gap between traditional financial services and the evolving needs of today’s borrowers through innovative technology and responsible lending.',
  ],
  mission: {
    title: 'Our Mission',
    body: 'Provide fast, hassle-free access to credit — with full transparency, privacy protection, and compliance with RBI guidelines.',
  },
  valuesTitle: 'What we stand for',
  values: [
    { title: 'Transparency', body: 'All charges disclosed upfront — no fine print, no surprises.' },
    { title: 'Responsibility', body: 'We lend based on repayment capacity, not just eligibility.' },
    { title: 'Speed', body: 'Fully digital — apply, verify, and receive funds fast.' },
    { title: 'Inclusion', body: 'Credit for salaried and self-employed Indians across the country.' },
  ],
  contactTitle: 'Get in Touch',
  partner: {
    title: 'RBI-Registered NBFC Partner',
    body: 'Operated in association with RichPay Fincorp Private Limited (formerly known as Malwa Leasing & Credits Private Limited) — fully compliant with the RBI Fair Practices Code.',
  },
}

export const numbers = {
  eyebrow: 'By the numbers',
  title: 'Momentum you can measure',
  items: [
    { value: '₹25Cr+', label: 'Credit Facilitated' },
    { value: '34,000+', label: 'Borrowers Served' },
    { value: '15 min', label: 'Avg. Approval Time' },
    { value: '100%', label: 'Digital Process' },
  ],
}

/* ⚠️ UNRECONCILED, AND NOW PUBLISHED — turned on by request.
   The client's source document contradicts itself and this has NOT been fixed:
   the About copy above says retail operations under the RichPay brand started
   in June 2026, while this timeline says founded 2021, 500 loans by 2022 and
   34,000+ borrowers by 2024. Those cannot both be true — a lender cannot have
   served 34,000 borrowers two years before it began retail operations. The
   source doc's own warning was "Don't publish both narratives as-is."
   For an RBI-registered NBFC this is a misleading-advertising exposure, not a
   copy nit. Set SHOW_JOURNEY back to false, or fix the dates, before launch. */
export const SHOW_JOURNEY = true
export const journey = {
  eyebrow: 'Our journey',
  title: 'How we got here',
  items: [
    { year: '2021', title: 'Founded', body: 'RichPay FinCorp launched with a mission to make personal lending fast and transparent.' },
    { year: '2022', title: 'First 500 Loans', body: 'Reached 500 approved loans within the first year of operations.' },
    { year: '2024', title: '34,000+ Borrowers', body: 'Over ₹25Cr facilitated. 34,000+ borrowers served across India.' },
  ],
}

export const mobile = {
  eyebrow: 'Mobile first',
  title: 'Same clarity, anywhere.',
  sub: 'Check rates, apply, and track your loan from any device. The RichPay experience is fully mobile-optimised.',
  features: [
    { title: 'Instant loan status', body: 'Real-time updates on your application and disbursement.' },
    { title: 'Clear EMI schedule', body: 'See every payment date and amount, months in advance.' },
    { title: 'One-tap support', body: 'Chat, call, or email — support is always a tap away.' },
    { title: 'Biometric security', body: 'Face ID and fingerprint login for instant, secure access.' },
  ],
  storeNote: 'Coming soon on',
  /* Illustrative in-app screen. Not a real account and not live data — the
     component describes it as an example for assistive tech rather than
     announcing the figures as fact. */
  app: {
    brand: 'RichPay',
    greeting: 'Good morning, Priya',
    loanLabel: 'Active loan',
    amount: '₹3,00,000',
    emiLabel: 'EMI',
    emi: '₹13,500 / month',
    repaidLabel: 'Repaid',
    repaidPct: 40,
    actions: ['Pay EMI', 'Statement', 'Support'],
    activityTitle: 'Recent Activity',
    activity: [
      { title: 'EMI Paid', date: '1 Jun', amount: '−₹13,500', kind: 'out' },
      { title: 'Disbursed', date: '3 May', amount: '+₹3,00,000', kind: 'in' },
    ],
    /* Sub-screens behind the quick actions and the tab bar. All dummy — see the
       note above. No figure here is a quoted rate or a promised timeline. */
    screens: {
      pay: {
        title: 'Pay EMI',
        headline: 'Next instalment',
        amount: '₹13,500',
        due: 'Due 1 Jul 2026',
        rows: [
          ['Principal', '₹11,270'],
          ['Interest', '₹2,230'],
          ['Instalment', '5 of 24'],
        ],
        methodLabel: 'Payment method',
        method: 'HDFC Bank •••• 4412',
        cta: 'Pay ₹13,500',
        note: 'Example screen — no payment is taken here.',
      },
      statement: {
        title: 'Statement',
        period: 'June 2026',
        rows: [
          ['1 Jun', 'EMI paid', '−₹13,500'],
          ['1 May', 'EMI paid', '−₹13,500'],
          ['3 May', 'Loan disbursed', '+₹3,00,000'],
          ['2 May', 'Processing fee', '−₹2,500'],
        ],
        summary: [
          ['Repaid to date', '₹1,20,000'],
          ['Outstanding', '₹1,80,000'],
        ],
      },
      support: {
        title: 'Support',
        options: [
          { icon: 'chat', title: 'Chat with us', body: 'Mon to Sat, 10am – 7pm' },
          { icon: 'phone', title: '+91-93556-00811', body: 'Speak to the team' },
          { icon: 'mail', title: 'support@richpayfincorp.com', body: 'Written queries and documents' },
        ],
        note: 'Grievance escalation details are on the website.',
      },
      profile: {
        title: 'Profile',
        name: 'Priya Sharma',
        initials: 'PS',
        member: 'Customer since May 2026',
        rows: [
          ['Mobile', '+91 98••• ••210'],
          ['Email', 'p•••••@email.com'],
          ['KYC', 'Verified'],
        ],
      },
    },
  },
}

export const finalCta = {
  title: 'Your next financial chapter starts here.',
  sub: 'Join 34,000+ Indians who borrow smarter, with full transparency, through RichPay Fincorp.',
  points: ['4.8-star rated', 'RBI-aligned', 'Zero hidden fees', 'Approval in less than 15 minutes'],
  cta: 'Talk to an advisor',
  secondary: 'Check eligibility',
}

export const footer = {
  // `href` is optional. Entries without one have no route yet and render as an
  // inert '#'. SmartLink decides how each href is navigated.
  columns: [
    {
      title: 'Products', links: [
        { label: 'Personal Loan', href: '#calculator' },
        { label: 'Short Term Loan', href: '#calculator' },
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
