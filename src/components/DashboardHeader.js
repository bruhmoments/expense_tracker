import React, { useEffect, useState } from 'react';
import { CHeader, CNav, CNavItem, CNavLink, CButton, CContainer, CRow, CCol } from '@coreui/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const DashboardHeader = ({ onFilterChange, startDate, endDate }) => {
    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localEndDate, setLocalEndDate] = useState(endDate);

    useEffect(() => {
        setLocalStartDate(startDate);
        setLocalEndDate(endDate);
    }, [startDate, endDate]);

    const handleFilterChange = (e) => {
        e.preventDefault();
        const filteredStartDate = localStartDate.toISOString().split('T')[0];
        const filteredEndDate = localEndDate.toISOString().split('T')[0];
        onFilterChange({
            start_date: filteredStartDate,
            end_date: filteredEndDate,
        });
    
        setLocalStartDate(new Date(filteredStartDate));
        setLocalEndDate(new Date(filteredEndDate));
    };

return (
    <CHeader>
      <CNav>
        <CNavItem>
          <CNavLink href="#">Filter: </CNavLink>
        </CNavItem>
        <CNavItem>
          <form onSubmit={handleFilterChange} style={{ display: 'flex', alignItems: 'center' }}>
            <CContainer>
                <CRow>
                    <CCol>
                        From:
                    </CCol>
                    <CCol>
                        To:
                    </CCol>
                </CRow>
                <CRow>
                    <CCol>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setLocalStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            style={{ marginRight: '10px', padding: '5px' }}
                        />
                    </CCol>
                    <CCol>
                        <DatePicker
                            selected={endDate}
                            onChange={date => setLocalEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            style={{ marginRight: '10px', padding: '5px' }}
                        />
                    </CCol>
                </CRow>
            </CContainer>
            <CButton type="submit" color="primary">Filter</CButton>
          </form>
        </CNavItem>
      </CNav>
    </CHeader>
  );
};

export default DashboardHeader;
