import React, { useEffect, useState } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CNavItem, CSidebar, CSidebarNav, CSpinner, CSidebarHeader, CSidebarBrand, CNavGroup, CModal, CModalHeader, CModalTitle, CModalBody, CForm, CFormInput, CModalFooter, CButton } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilMoney, cilPlus, cilSettings, cilUser } from '@coreui/icons';
import { CChart } from '@coreui/react-chartjs';
import API from '../api/api';
import DashboardHeader from './DashboardHeader';
import Logout from './Logout';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  
  // Date Filter
  const [startDate, setStartDate] = useState(() => {
    const savedStartDate = localStorage.getItem('startDate');
    return savedStartDate ? new Date(savedStartDate) : new Date();
  });
  
  const [endDate, setEndDate] = useState(() => {
    const savedEndDate = localStorage.getItem('endDate');
    return savedEndDate ? new Date(savedEndDate) : new Date();
  });
  
  
  const [formData, setFormData] = useState({
    id: '',
    description: '',
    amount: '',
    created_at: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const openEditModal = (expense) => {
    setFormData(expense);
    setEditVisible(true);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      await API.post('/expenses', {
        description: formData.description,
        amount: formData.amount,
      });
      setCreateVisible(false);
      await refreshData();
    } catch (err) {
      setError('Failed to create new expense')
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      await API.put('/expenses', {
        id: formData.id,
        description: formData.description,
        amount: formData.amount,
      });
      setEditVisible(false);
      await refreshData();
    } catch (err) {
      setError(`Failed to edit ${formData.description}`)
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Seharusnya pakai await API.delete(`/expenses/${formData.id}`); karena menggunakan body bukanlah best practicenya 
      await API.delete('/expenses', {
        data: { id: formData.id },
      });  
      setDeleteVisible(false);
      await refreshData();
    } catch (err) {
      setError(`Failed to delete ${formData.description}`)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        const expensesResponse = await API.get(`/expenses?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
        setExpenses(expensesResponse.data.data || []);

        const statsResponse = await API.get(`/expenses/stats?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
        setStats(statsResponse.data.data || []);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    localStorage.setItem('startDate', startDate.toISOString());
    localStorage.setItem('endDate', endDate.toISOString());

    fetchDashboardData();
  }, [startDate, endDate]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      const expensesResponse = await API.get(`/expenses?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
      setExpenses(expensesResponse.data.data || []);

      const statsResponse = await API.get(`/expenses/stats?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
      setStats(statsResponse.data.data || []);
    } catch (error) {
      setError('Failed to fetch expenses.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // Full screen height
          width: '100vw', // Full screen width
          backgroundColor: '#f8f9fa', // Optional background color
        }}
      >
        <CSpinner color="primary" />
      </div>
    );
      
  if (error) return <p>{error}</p>;

  const chartLabels = stats.map((stat) => stat.month);
  const chartData = stats.map((stat) => parseFloat(stat.total_amount));

  const handleFilterChange = ({ start_date, end_date }) => {
    setStartDate(new Date(start_date));
    setEndDate(new Date(end_date));
  };  

  const handleTimePeriodChange = (period, evt) => {
    let newStartDate = new Date();
    let newEndDate = new Date();
    evt.preventDefault();

    switch (period) {
      case '1Day':
        newStartDate.setDate(newEndDate.getDate() - 1);
        break;
      case '1Week':
        newStartDate.setDate(newEndDate.getDate() - 7);
        break;
      case '1Month':
        newStartDate.setMonth(newEndDate.getMonth() - 1);
        break;
      case '3Months':
        newStartDate.setMonth(newEndDate.getMonth() - 3);
        break;
      case '6Months':
        newStartDate.setMonth(newEndDate.getMonth() - 6);
        break;
      case '1Year':
        newStartDate.setFullYear(newEndDate.getFullYear() - 1);
        break;
      case 'YearToDate':
        newStartDate.setFullYear(newEndDate.getFullYear());
        newStartDate.setMonth(0);
        newStartDate.setDate(1);
        break;
      default:
        break;
    }
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <CContainer>
      {/* Sidebar */}
      <CSidebar className="border-end" colorScheme="dark" style={{ position: 'fixed', top: '0', left: '0', height: '100%', width: '250px' }}>
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand>Welcome, {localStorage.getItem('username') ? localStorage.getItem('username') : 'Stranger'}!</CSidebarBrand>
        </CSidebarHeader>
        <CSidebarNav>
          <CNavItem href="#" onClick={() => setCreateVisible(true)}><CIcon customClassName="nav-icon" icon={cilPlus} /> New Expense</CNavItem>
          <CNavGroup
            toggler={
              <>
                <CIcon customClassName="nav-icon" icon={cilMoney} /> Expenses
              </>
            }
          >
            <CNavItem href="#" onClick={(e) => handleTimePeriodChange('1Day', e)}>1 Day</CNavItem>
            <CNavItem href="#" onClick={(e) => handleTimePeriodChange('1Week', e)}>1 Week</CNavItem>
            <CNavItem href="#" onClick={(e) => handleTimePeriodChange('1Month', e)}>1 Month</CNavItem>
            <CNavItem href="#" onClick={(e) => handleTimePeriodChange('3Months', e)}>3 Months</CNavItem>
            <CNavItem href="#" onClick={(e) => handleTimePeriodChange('6Months', e)}>6 Months</CNavItem>
            <CNavItem href="#" onClick={(e) => handleTimePeriodChange('1Year', e)}>1 Year</CNavItem>
            <CNavItem href="#" onClick={(e) => handleTimePeriodChange('YearToDate', e)}>Year to Date</CNavItem>
          </CNavGroup>
          <CNavGroup
            toggler={
              <>
                <CIcon customClassName="nav-icon" icon={cilSettings} /> Settings
              </>
            }
          >
            <CNavItem href="#"><CIcon customClassName="nav-icon" icon={cilUser} /> Account</CNavItem>
            <Logout />
          </CNavGroup>
        </CSidebarNav>
      </CSidebar>

      {/* Navbar */}
      <DashboardHeader onFilterChange={handleFilterChange} startDate={startDate} endDate={endDate} />

      {/* Create Modal */}
      <CModal visible={createVisible} onClose={() => setCreateVisible(false)}>
        <CModalHeader>
          <CModalTitle>Create Expense</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter expense description"
            />
            <CFormInput
              name="amount"
              type="number"
              label="Amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setCreateVisible(false)}>Close</CButton>
          <CButton color="primary" onClick={handleCreate}>Save</CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Modal */}
      <CModal visible={editVisible} onClose={() => setEditVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Expense</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter expense description"
            />
            <CFormInput
              name="amount"
              type="number"
              label="Amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
            />
            {/* <CFormInput
              name="created_at"
              type="datetime-local" // Allows both date and time input
              label="Date and Time"
              value={formData.created_at ? new Date(formData.created_at).toISOString().slice(0, 16) : ''} // Format to "YYYY-MM-DDTHH:mm"
              onChange={handleInputChange}
            /> */}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditVisible(false)}>Close</CButton>
          <CButton color="primary" onClick={handleEdit}>Save</CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Modal */}
      <CModal visible={deleteVisible} onClose={() => setDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h5>Are you sure you want to delete this expense?</h5 >
          {formData.description}
          <br/>
          Rp. {new Intl.NumberFormat('id-ID').format(formData.amount)}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={() => handleDelete(formData.id)}
          >
            Delete
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Main Content Area */}
      <CRow style={{ margin: '16px 0 0 0'}}>
        {/* Summary Cards */}
        <CCol md={4}>
          <CCard>
            <CCardHeader>Total Spending</CCardHeader>
            <CCardBody>
            Rp. {new Intl.NumberFormat('id-ID').format(stats.reduce((sum, stat) => sum + parseFloat(stat.total_amount), 0))}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard>
            <CCardHeader>Total Transactions</CCardHeader>
            <CCardBody>{expenses.length}</CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Line Chart */}
      <CRow className="mt-4">
        <CCol>
          <CCard>
            <CCardHeader>Monthly Spending</CCardHeader>
            <CCardBody>
            <CChart
              type="line"
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    label: 'Spending',
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    data: chartData,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    ticks: {
                      callback: function(value) {
                        return 'Rp ' + new Intl.NumberFormat('id-ID').format(value) ;
                      },
                    },
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
              style={{ position: 'relative', width: '100%', height: '33vh' }}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Expenses Table */}
      <CRow className="mt-4" style={{ margin: '0 0 16px 0'}}>
        <CCol>
          <CCard>
            <CCardHeader>List of Expenses</CCardHeader>
            <CCardBody>
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {expenses.map((expense) => (
                    <CTableRow key={expense.id}>
                      <CTableDataCell>{expense.description}</CTableDataCell>
                      <CTableDataCell>Rp. {new Intl.NumberFormat('id-ID').format(expense.amount)}</CTableDataCell>
                      <CTableDataCell>
                        {new Intl.DateTimeFormat('id-ID', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        }).format(new Date(expense.created_at))}
                      </CTableDataCell>
                      {/* <CTableDataCell>{new Date(expense.created_at).toString()}</CTableDataCell> */}
                      <CTableDataCell>
                        <CButton
                          color="warning"
                          size="sm"
                          onClick={() => openEditModal(expense)}
                        >
                          Update
                        </CButton>{' '}
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => {
                            setFormData(expense);
                            setDeleteVisible(true);
                          }}
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Dashboard;
