import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '120px 48px 80px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ 
          background: 'var(--surface-container)', 
          borderRadius: 24, 
          padding: 48,
          border: '2px solid var(--primary-container)'
        }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            background: 'var(--primary-container)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--on-primary-container)' }}>
              celebration
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>
            Thank You for Your Interest!
          </h1>

          <p style={{ fontSize: '1.125rem', color: 'var(--on-surface-variant)', marginBottom: 32 }}>
            Our team will reach out to you soon. In the meantime, feel free to contact us directly.
          </p>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 16, 
            paddingTop: 24, 
            borderTop: '1px solid var(--surface)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>email</span>
              <span style={{ fontWeight: 600 }}>admin@neshedu.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>call</span>
              <span style={{ fontWeight: 600 }}>+91 9634620272</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;