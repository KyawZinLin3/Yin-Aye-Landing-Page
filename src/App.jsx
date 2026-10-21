import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  Clock3,
  FileCheck2,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';
import farmersImage from '../hero-optimized.jpg';
import womanImage from '../woman-farmer-optimized.jpg';
import advisorImage from '../community-advisor-optimized.jpg';
import MyanmarMap from './MyanmarMap.jsx';
import { applicationSteps, company, contactDetails, faqs, loanProducts } from './data/siteContent.js';
import { LanguageProvider, useLanguage } from './i18n.jsx';

const navigation = [
  ['Home', '/'],
  ['About Us', '/about'],
  ['Loan Services', '/loan-services'],
  ['How to Apply', '/how-to-apply'],
  ['Service Areas', '/service-areas'],
  ['FAQs', '/faqs'],
];

const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';

function Brand({ footer = false }) {
  const { t } = useLanguage();
  return (
    <a className={`brand ${footer ? 'brand-footer' : ''}`} href="/" aria-label={`${company.name} ${t('home')}`}>
      <span className="brand-name">Yin Aye<span className="brand-dot">.</span></span>
      <span className="brand-caption">{t('Finance Company Limited')}</span>
    </a>
  );
}

function Eyebrow({ children }) {
  return <span className="eyebrow"><span className="eyebrow-dot" />{children}</span>;
}

function LanguagePicker() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnOutsideClick = event => {
      if (!pickerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = event => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const chooseLanguage = nextLanguage => {
    setLanguage(nextLanguage);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="language-picker" ref={pickerRef}>
      <button
        className="language-picker-trigger"
        type="button"
        ref={triggerRef}
        aria-label={t('Select language')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
      >
        <span>{language === 'en' ? 'English' : 'မြန်မာ'}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="language-picker-menu" role="menu" aria-label={t('Select language')}>
          <button className="language-picker-option" type="button" role="menuitemradio" aria-checked={language === 'en'} onClick={() => chooseLanguage('en')}>
            <span>English</span>{language === 'en' && <Check size={15} aria-hidden="true" />}
          </button>
          <button className="language-picker-option" type="button" role="menuitemradio" aria-checked={language === 'my'} onClick={() => chooseLanguage('my')}>
            <span lang="my">မြန်မာ</span>{language === 'my' && <Check size={15} aria-hidden="true" />}
          </button>
        </div>
      )}
    </div>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, t } = useLanguage();
  return (
    <>
      <div className="utility">
        <div className="container utility-inner">
          <span lang={language}>{language === 'en' ? company.name : company.myanmarName}</span>
          <span>{t('Peace of Mind')} · {t('Serving communities in Myanmar')}</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-inner">
          <Brand />
          <button className="menu-toggle" aria-label={t(menuOpen ? 'Close navigation' : 'Open navigation')} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav id="primary-navigation" className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label={t('Main navigation')}>
            {navigation.map(([label, href]) => <a key={href} href={href} className={currentPath === href ? 'current-page' : undefined} aria-current={currentPath === href ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{t(label)}</a>)}
            <a className={`nav-cta${currentPath === '/contact' ? ' current-page' : ''}`} href="/contact" aria-current={currentPath === '/contact' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{t('Contact Us')} <ArrowUpRight size={14} aria-hidden="true" /></a>
            <LanguagePicker />
          </nav>
        </div>
      </header>
    </>
  );
}

function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-copy">
          <Eyebrow>{t('Yin Aye means')} {t('Peace of Mind')}</Eyebrow>
          <h1>{t('Peace of Mind for Your')} <em>{t('Financial Journey')}</em></h1>
          <p>{t(`Welcome to ${company.name}. Established in ${company.established}, we are committed to providing accessible financial services with a focus on trust, transparency, and peace of mind.`)}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="/loan-services">{t('Explore Our Services')} <ArrowRight size={16} aria-hidden="true" /></a>
            <a className="text-link" href="/contact">{t('Contact Us')} <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
          <div className="hero-trust">
            <span className="trust-mark"><ShieldCheck size={18} aria-hidden="true" /></span>
            <span><strong>{t('Trust. Transparency. Peace of mind.')}</strong><br />{t('A Myanmar microfinance company since')} {company.established}</span>
          </div>
        </div>
        <div className="hero-visual" aria-label={t('Myanmar families and communities')}>
          <div className="hero-photo-main"><img src={farmersImage} alt={t('Farmers working together in a green Myanmar rice field')} fetchPriority="high" decoding="async" /></div>
          <div className="hero-photo-small"><img src={advisorImage} alt={t('A local advisor meeting with a Myanmar community member')} fetchPriority="high" decoding="async" /></div>
          <div className="hero-photo-bottom"><img src={womanImage} alt={t('A Myanmar woman growing vegetables in her garden')} fetchPriority="high" decoding="async" /></div>
          <span className="photo-note"><span className="note-icon"><ShieldCheck size={17} aria-hidden="true" /></span><span><strong>{t('Peace of Mind')}</strong><br />{t('At every step')}</span></span>
          <span className="hero-spark spark-one" aria-hidden="true">✳</span>
          <span className="hero-spark spark-two" aria-hidden="true">✳</span>
        </div>
      </div>
    </section>
  );
}

function CompanyFact({ icon: Icon, label, value, detail }) {
  const { t } = useLanguage();
  return (
    <article className="fact-card">
      <span className="fact-icon"><Icon size={20} strokeWidth={1.8} aria-hidden="true" /></span>
      <div><span className="fact-label">{t(label)}</span><strong>{t(value)}</strong>{detail && <small>{t(detail)}</small>}</div>
    </article>
  );
}

function AboutSection() {
  const { t } = useLanguage();
  return (
    <section className="about section" id="about">
      <div className="container about-grid">
        <div className="about-photos">
          <div className="about-photo-large"><img src={womanImage} alt={t('A Myanmar woman tending fresh produce in her garden')} loading="lazy" decoding="async" /></div>
          <div className="about-photo-small"><img src={advisorImage} alt={t('A local community finance conversation')} loading="lazy" decoding="async" /></div>
          <div className="quote-card"><span className="quote-mark" aria-hidden="true">“</span><p>{t('Yin Aye means Peace of Mind — a principle that guides how we want customers to experience financial services.')}</p><span>{company.name}</span></div>
        </div>
        <div className="about-copy">
          <Eyebrow>{t('About Yin Aye Finance')}</Eyebrow>
          <h2>{t('Building Trust, Supporting')} <em>{t('Financial Confidence')}</em></h2>
          <p className="section-lead">{t(`${company.name} was established in ${company.established}. Our name, “Yin Aye,” represents ${company.brandMeaning} — a principle that guides how we want customers to experience financial services.`)}</p>
          <p>{t('We are a Myanmar microfinance company focused on accessible financial services, trust and transparency. We aim to make every interaction clear and welcoming.')}</p>
        </div>
      </div>
      <div className="container facts-grid" aria-label={t('Company information')}>
        <CompanyFact icon={Clock3} label="Established" value={company.established} />
        <CompanyFact icon={Building2} label="Company registration" value={company.registrationNumber} detail="Registered company" />
        <CompanyFact icon={BadgeCheck} label="Microfinance operating license" value={company.microfinanceLicense} detail="Licensed microfinance company" />
        <CompanyFact icon={Landmark} label="Serving communities" value={company.country} detail="Service coverage details below" />
      </div>
    </section>
  );
}

function LoanProductCard({ product }) {
  const { t } = useLanguage();
  const fields = [
    [t('Loan amount'), product.amountRange],
    [t('Interest rate'), product.interestRate],
    [t('Repayment period'), product.repaymentPeriod],
    [t('Applicable fees'), product.fees],
    [t('Eligibility'), product.eligibility],
  ];
  return (
    <article className="loan-card">
      <span className="program-tag">{t('Loan service')}</span>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <dl className="loan-facts">{fields.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {product.learnMoreUrl && <a className="card-link" href={product.learnMoreUrl}>{t('Learn more')} <ArrowRight size={14} aria-hidden="true" /></a>}
      {!product.learnMoreUrl && <span className="pending-label">{t('More information pending')}</span>}
    </article>
  );
}

function LoanServicesSection() {
  const { t } = useLanguage();
  return (
    <section className="programmes section" id="loan-services">
      <div className="container">
        <div className="section-heading">
          <Eyebrow>{t('Loan services')}</Eyebrow>
          <h2>{t('Financial Solutions for')} <em>{t('Your Needs')}</em></h2>
          <p>{t('Explore our financial services and find information about available loan options.')}</p>
        </div>
        {loanProducts.length > 0 ? (
          <div className="loan-grid">{loanProducts.map(product => <LoanProductCard key={product.id} product={product} />)}</div>
        ) : (
          <div className="pending-panel" role="status">
            <span className="pending-icon"><FileCheck2 size={23} aria-hidden="true" /></span>
            <div><h3>{t('Loan product information is being confirmed')}</h3><p>{t('Details about loan names, amounts, rates, repayment periods, fees and eligibility will be added when confirmed by Yin Aye Finance.')}</p></div>
            <span className="pending-badge">{t('Details pending')}</span>
          </div>
        )}
      </div>
    </section>
  );
}

function ApplicationStep({ step, index }) {
  return <article className="apply-step"><span className="step-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></article>;
}

function HowToApplySection() {
  const { t } = useLanguage();
  return (
    <section className="section apply-section" id="how-to-apply">
      <div className="container apply-grid">
        <div className="section-heading">
          <Eyebrow>{t('How to apply')}</Eyebrow>
          <h2>{t('A Clear Path to')} <em>{t('Financial Support')}</em></h2>
          <p>{t('We are preparing clear information about the application process. Confirmed steps will be shared here.')}</p>
        </div>
        <div className="apply-steps">
          {applicationSteps.length > 0
            ? applicationSteps.map((step, index) => <ApplicationStep key={step.id} step={step} index={index} />)
            : <div className="pending-panel pending-compact"><span className="pending-icon"><Clock3 size={22} aria-hidden="true" /></span><div><h3>{t('Application steps pending confirmation')}</h3><p>{t('Yin Aye Finance has not yet confirmed its application process. No online application or document upload is offered on this website.')}</p></div></div>}
        </div>
      </div>
    </section>
  );
}

function ServiceAreasSection() {
  const { t } = useLanguage();
  return (
    <section className="section service-areas" id="service-areas">
      <div className="container">
        <div className="section-heading">
          <Eyebrow>{t('Service areas')}</Eyebrow>
          <h2>{t('Serving')} <em>{t('Yangon')}</em></h2>
          <p>{t('Explore Myanmar’s states and regions. Yangon Region is highlighted as our currently listed service area.')}</p>
        </div>
        <MyanmarMap />
      </div>
    </section>
  );
}

function FAQSection() {
  const { t } = useLanguage();
  return (
    <section className="section faq-section" id="faqs">
      <div className="container faq-grid">
        <div className="section-heading"><Eyebrow>{t('FAQs')}</Eyebrow><h2>{t('Frequently Asked')} <em>{t('Questions')}</em></h2><p>{t('Clear information matters. We’ll update these answers as details are confirmed.')}</p></div>
        <div className="faq-list">{faqs.map((faq, index) => (
          <details className="faq-item" key={faq.question}>
            <summary><span className="faq-count">{String(index + 1).padStart(2, '0')}</span><span>{t(faq.question)}</span><ChevronDown size={17} aria-hidden="true" /></summary>
            <p>{t(faq.answer)}</p>
          </details>
        ))}</div>
      </div>
    </section>
  );
}

function ContactValue({ label, value, icon: Icon, href }) {
  const { t } = useLanguage();
  return <div className="contact-value"><span><Icon size={17} aria-hidden="true" /></span><div><small>{t(label)}</small>{value ? <a href={href}>{value}</a> : <strong className="pending-label">{t('Pending confirmation')}</strong>}</div></div>;
}

function ContactSection() {
  const { t } = useLanguage();
  return (
    <section className="contact-section section" id="contact">
      <div className="container contact-grid">
        <div className="contact-copy"><Eyebrow>{t('Contact us')}</Eyebrow><h2>{t('We’re Here to')} <em>{t('Help')}</em></h2><p>{t('Have questions about our financial services? Get in touch with Yin Aye Finance using the contact details below.')}</p><span className="contact-company">{company.name}</span></div>
        <div className="contact-card">
          <ContactValue label="Company phone" value={contactDetails.phone} icon={Phone} href={contactDetails.phone ? `tel:${contactDetails.phone}` : undefined} />
          <ContactValue label="Official email" value={contactDetails.email} icon={Mail} href={contactDetails.email ? `mailto:${contactDetails.email}` : undefined} />
          <ContactValue label="Registered or head office" value={contactDetails.address} icon={MapPin} />
          <ContactValue label="Business hours" value={contactDetails.businessHours} icon={Clock3} />
          <ContactValue label="Facebook page" value={contactDetails.facebook} icon={ArrowUpRight} href={contactDetails.facebook || undefined} />
          <p className="contact-note">{t('Business hours and Facebook details are pending confirmation. This website does not collect financial or identity information.')}</p>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const { language, t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-brand"><Brand footer /><p className="footer-myanmar" lang={language}>{language === 'en' ? company.name : company.myanmarName}</p><p>{t('Peace of Mind')} — {t('a principle guiding our financial services in Myanmar.')}</p></div>
        <div className="footer-links">
          <div><strong>{t('Explore')}</strong>{navigation.slice(0, 5).map(([label, href]) => <a href={href} key={href}>{t(label)}</a>)}</div>
          <div><strong>{t('Company')}</strong><span>{t('Established')} {company.established}</span><span>{t('Registration No.')} {company.registrationNumber}</span><span>{t('Microfinance Operating License No.')} {company.microfinanceLicense}</span></div>
          <div><strong>{t('Contact')}</strong><a href={`tel:${contactDetails.phone}`}>{t('Phone:')} {contactDetails.phone}</a><a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a><span className="footer-contact-address">{t('Office:')} {contactDetails.address}</span><span className="privacy-pending">{t('Privacy Policy (pending)')}</span></div>
        </div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} {company.name}. {t('All rights reserved.')}</span><span>{t('Myanmar · Microfinance / Financial Services')}</span></div>
    </footer>
  );
}

export function App() {
  const pageContent = {
    '/': <><HeroSection /><AboutSection /><LoanServicesSection /><HowToApplySection /><ServiceAreasSection /><FAQSection /><ContactSection /></>,
    '/about': <AboutSection />,
    '/loan-services': <LoanServicesSection />,
    '/how-to-apply': <HowToApplySection />,
    '/service-areas': <ServiceAreasSection />,
    '/faqs': <FAQSection />,
    '/contact': <ContactSection />,
  };

  return <LanguageProvider><>
    <SiteHeader />
    <main>{pageContent[currentPath] || pageContent['/']}</main>
    <SiteFooter />
  </></LanguageProvider>;
}

export default App;
