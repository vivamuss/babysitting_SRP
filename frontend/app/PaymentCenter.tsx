import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaRupeeSign, FaHistory, FaCreditCard, FaBank, FaMobileAlt, FaChartPie } from 'react-icons/fa';

// Professional color palette
const colors = {
  primary: "#6d28d9",       // Purple
  secondary: "#4A5BD7",     // Deep blue
  background: "#F5F7FA",    // Light gray background
  card: "#FFFFFF",          // Pure white cards
  textPrimary: "#1A1A1A",   // True black for text
  textSecondary: "#5E6E82", // Gray text
  success: "#28A745",       // Green for success
  warning: "#FFC107",       // Yellow for warning
  danger: "#DC3545",        // Red for danger
  border: "#E2E8F0"         // Subtle border color
};

interface PaymentTransaction {
  _id: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}

interface PaymentSummary {
  totalAmount: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  methodDistribution: Record<string, number>;
}

const PaymentCenter: React.FC = () => {
  const [method, setMethod] = useState('Cash');
  const [amount, setAmount] = useState('');
  const [report, setReport] = useState<PaymentTransaction[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('process');

  // Process Payment
  const processPayment = async () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/process-payment', {
        amount: parseFloat(amount),
        method,
      });
      alert('Payment processed successfully!');
      setAmount('');
      fetchReport();
      fetchSummary();
    } catch (err) {
      console.error(err);
      alert('Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Payment Report
  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/payment-reports');
      setReport(res.data.transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Payment Summary
  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/payment-summary');
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    fetchSummary();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'failed':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cash':
        return <FaMoneyBillWave />;
      case 'upi':
        return <FaMobileAlt />;
      case 'bank transfer':
        return <FaBank />;
      default:
        return <FaCreditCard />;
    }
  };

  const renderSummaryCard = (title: string, value: string | number, icon: React.ReactNode, color: string) => {
    return (
      <div style={{ ...styles.summaryCard, borderLeft: `4px solid ${color}` }}>
        <div style={{ ...styles.summaryIcon, color }}>
          {icon}
        </div>
        <div>
          <h4 style={styles.summaryTitle}>{title}</h4>
          <p style={styles.summaryValue}>{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FaRupeeSign style={styles.headerIcon} />
        <h2 style={styles.headerText}>Payment Center</h2>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.tabContainer}>
        <button 
          style={activeTab === 'process' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('process')}
        >
          <FaMoneyBillWave style={{ marginRight: '8px' }} />
          Process Payment
        </button>
        <button 
          style={activeTab === 'report' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('report')}
        >
          <FaHistory style={{ marginRight: '8px' }} />
          Payment History
        </button>
      </div>

      {/* Main Content Area with Scroll */}
      <div style={styles.contentContainer}>
        {/* Process Payment Section */}
        {activeTab === 'process' && (
          <div style={styles.card}>
            <h4 style={styles.sectionTitle}>
              <FaMoneyBillWave style={styles.sectionIcon} />
              Process Payment
            </h4>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Amount (₹)</label>
              <input
                style={styles.input}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter payment amount"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Method</label>
              <select 
                style={styles.select}
                value={method} 
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>

            <button 
              style={styles.primaryButton}
              onClick={processPayment}
              disabled={isLoading || !amount}
            >
              {isLoading ? 'Processing...' : 'Process Payment'}
            </button>
          </div>
        )}

        {/* Payment Report Section */}
        {activeTab === 'report' && (
          <div style={styles.card}>
            <h4 style={styles.sectionTitle}>
              <FaHistory style={styles.sectionIcon} />
              Payment History
            </h4>
            
            {isLoading ? (
              <div style={styles.loading}>Loading transactions...</div>
            ) : report.length === 0 ? (
              <div style={styles.emptyState}>No transactions found</div>
            ) : (
              <div style={styles.tableWrapper}>
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeaderRow}>
                        <th style={styles.tableHeader}>Method</th>
                        <th style={styles.tableHeader}>Amount</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.map((t) => (
                        <tr key={t._id} style={styles.tableRow}>
                          <td style={styles.tableCell}>
                            <span style={styles.methodIcon}>{getMethodIcon(t.method)}</span>
                            {t.method}
                          </td>
                          <td style={styles.tableCell}>₹{t.amount.toFixed(2)}</td>
                          <td style={{ ...styles.tableCell, color: getStatusColor(t.status) }}>
                            {t.status}
                          </td>
                          <td style={styles.tableCell}>
                            {new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: colors.background,
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.card,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  headerIcon: {
    fontSize: '2rem',
    color: colors.primary,
    marginRight: '1rem'
  },
  headerText: {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: colors.textPrimary,
    margin: 0
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: colors.card,
    padding: '0 2rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  tab: {
    padding: '1rem 1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: `3px solid transparent`,
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    color: colors.textSecondary,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center'
  },
  activeTab: {
    padding: '1rem 1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: `3px solid ${colors.primary}`,
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    color: colors.primary,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center'
  },
  contentContainer: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto' as const,
    scrollBehavior: 'smooth' as const
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    marginBottom: '2rem'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.3rem',
    fontWeight: 600,
    color: colors.textPrimary,
    marginTop: 0,
    marginBottom: '1.5rem'
  },
  sectionIcon: {
    marginRight: '0.8rem',
    color: colors.primary
  },
  formGroup: {
    marginBottom: '1.5rem',
    maxWidth: '400px'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: 500,
    color: colors.textPrimary
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    fontSize: '1rem',
    transition: 'border 0.2s ease',
    boxSizing: 'border-box' as const,
    '&:focus': {
      outline: 'none',
      borderColor: colors.primary,
      boxShadow: `0 0 0 2px ${colors.primary}20`
    }
  },
  select: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    fontSize: '1rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'border 0.2s ease',
    '&:focus': {
      outline: 'none',
      borderColor: colors.primary,
      boxShadow: `0 0 0 2px ${colors.primary}20`
    }
  },
  primaryButton: {
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '150px',
    '&:hover': {
      backgroundColor: '#5b21b6',
      transform: 'translateY(-1px)'
    },
    '&:disabled': {
      backgroundColor: '#c4b5fd',
      cursor: 'not-allowed',
      transform: 'none'
    }
  },
  loading: {
    padding: '2rem',
    textAlign: 'center' as const,
    color: colors.textSecondary
  },
  emptyState: {
    padding: '2rem',
    textAlign: 'center' as const,
    color: colors.textSecondary,
    fontStyle: 'italic'
  },
  tableWrapper: {
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    overflow: 'hidden'
  },
  tableContainer: {
    overflowX: 'auto' as const,
    maxHeight: 'calc(100vh - 300px)',
    overflowY: 'auto' as const
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '0.95rem'
  },
  tableHeaderRow: {
    backgroundColor: colors.background,
    position: 'sticky' as const,
    top: 0,
    zIndex: 10
  },
  tableHeader: {
    padding: '1rem',
    textAlign: 'left' as const,
    fontWeight: 600,
    color: colors.textPrimary,
    backgroundColor: colors.background
  },
  tableRow: {
    borderBottom: `1px solid ${colors.border}`,
    '&:hover': {
      backgroundColor: colors.background
    }
  },
  tableCell: {
    padding: '1rem',
    color: colors.textPrimary,
    verticalAlign: 'middle' as const
  },
  methodIcon: {
    marginRight: '0.5rem',
    color: colors.textSecondary
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)'
    }
  },
  summaryIcon: {
    fontSize: '1.5rem',
    marginRight: '1rem',
    padding: '0.8rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(109, 40, 217, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  summaryTitle: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: colors.textSecondary,
    margin: '0 0 0.3rem 0'
  },
  summaryValue: {
    fontSize: '1.3rem',
    fontWeight: 600,
    color: colors.textPrimary,
    margin: 0
  }
};

export default PaymentCenter;