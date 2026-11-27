// Data Flow (roles/recruiter/components/Dashboard.jsx):
// Backend API -> Redux Thunks/Slices (recruiterSlice) -> useSelector(selectOpportunitiesWithCount, selectRecruiter) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Plus, 
  ArrowRight 
} from 'lucide-react';
import {
  
  selectOpportunitiesWithCount,
  selectRecruiter,
  setRecruiterTab,
} from '../store/recruiterSlice.js';

export default function Dashboard() {
  const dispatch = useDispatch();
  // Redux data source: recruiterSlice (recruiter profile, applications, and opportunities with applicant counts).
  const { recruiter, applications } = useSelector(selectRecruiter, shallowEqual);
  const opportunities = useSelector(selectOpportunitiesWithCount);
  const firstName = recruiter.name ? recruiter.name.split(' ')[0] : 'Recruiter';
  
  // Calculate real-time stats from data
  const totalOpportunities = opportunities.length;
  const totalApplications = applications.length;
  const shortlistedCount = applications.filter(a => ['Shortlisted', 'Interview', 'Offered'].includes(a.status)).length;
  const referredCount = applications.filter(a => a.isReferred).length;

  return (
    <div>
      {/* BANNER */}
      <section className="welcome-banner">
        <div className="banner-text">
          <h2>Welcome, {firstName}!</h2>
          <p>{recruiter.company} - Recruiter Dashboard</p>
        </div>
        <div className="banner-actions">
          <button 
            className="btn-primary-white" 
            onClick={() => {
              dispatch(setRecruiterTab('post'));
            }}
          >
            <Plus size={16} />
            <span>Post Opportunity</span>
          </button>
          <button 
            className="btn-secondary-white" 
            onClick={() => {
              dispatch(setRecruiterTab('applications'));
            }}
          >
            <Users size={16} />
            <span>View Applications</span>
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Briefcase size={22} />
          </div>
          <div className="stat-number">{totalOpportunities}</div>
          <div className="stat-label">Posted Opportunities</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <Users size={22} />
          </div>
          <div className="stat-number">{totalApplications}</div>
          <div className="stat-label">Total Applications</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <TrendingUp size={22} />
          </div>
          <div className="stat-number">{shortlistedCount}</div>
          <div className="stat-label">Shortlisted & Active</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper emerald">
            <CheckCircle size={22} />
          </div>
          <div className="stat-number">{referredCount}</div>
          <div className="stat-label">Referred Candidates</div>
        </div>
      </section>

      {/* BOTTOM 2-COLUMN SECTION */}
      <section className="dashboard-grid">
        {/* LEFT: MY OPPORTUNITIES */}
        <div className="dashboard-box">
          <div className="box-header">
            <h3>My Opportunities</h3>
            <button 
              className="view-all-link"
              onClick={() => {
                dispatch(setRecruiterTab('opportunities'));
              }}
            >
              <span>View all</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="box-list">
            {opportunities.slice(0, 3).map((opp) => (
              <div key={opp.id} className="job-item">
                <div className="job-info-left">
                  <div className="job-title">{opp.title} ({opp.jobId})</div>
                  <div className="job-meta">
                    {opp.applications} applicants - Deadline: {opp.deadline}
                  </div>
                </div>
                <span className="badge-status published">{opp.status}</span>
              </div>
            ))}
            {opportunities.length === 0 && (
              <p style={{ color: '#9CA3AF', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No opportunities posted yet. Click "+ Post Opportunity" to start.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: RECENT APPLICATIONS */}
        <div className="dashboard-box">
          <div className="box-header">
            <h3>Recent Applications</h3>
            <button 
              className="view-all-link"
              onClick={() => {
                dispatch(setRecruiterTab('applications'));
              }}
            >
              <span>View all</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="box-list">
            {applications.slice(0, 4).map((app) => {
              const statusClass = (app.status || 'applied').toLowerCase();
              return (
                <div key={app.id} className="applicant-card-mini">
                  <div className="applicant-left">
                    <div className="avatar-mini">{app.initials}</div>
                    <div>
                      <div className="app-name">
                        {app.name} {app.isReferred && <span style={{ color: '#D97706', fontSize: '11px' }}>Referred</span>}
                      </div>
                      <div className="app-sub">{app.branch} - CGPA: {app.cgpa}</div>
                    </div>
                  </div>
                  <span className={`badge-status ${statusClass}`}>{app.status}</span>
                </div>
              );
            })}
            {applications.length === 0 && (
              <p style={{ color: '#9CA3AF', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No applications received yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
