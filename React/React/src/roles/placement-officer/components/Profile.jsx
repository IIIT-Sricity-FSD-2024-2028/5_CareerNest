// Data Flow (roles/placement-officer/components/Profile.jsx):
// Backend API -> Redux Thunks/Slices (authSlice, placementOfficerSlice, usersSlice) -> useSelector(selectSession, selectOfficerData, selectPlacementProfileUi, selectCurrentUser) -> UI render
// User Actions -> dispatch(updateSessionUser, fetchUserById, updateUser, updateSession, updateDraft, saveInlineEdit) -> Slice reducers/thunks -> Redux state update
import { phoneError, phoneInputProps } from '../../../shared/utils/phone.js';
import { infoDialog } from '../../../shared/components/AppDialog.jsx';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './styles/p1.css';
import { useDispatch, useSelector } from 'react-redux';
import { errorMessage } from '../../../services/api.js';
import { selectSession, updateSessionUser } from '../../../store/slices/authSlice.js';
import {
  
  selectOfficerData,
  selectPlacementProfileUi,
  setPlacementPage,
  setPlacementProfileUi,
} from '../store/placementOfficerSlice.js';
import { fetchUserById, selectCurrentUser, updateUser } from '../../../store/slices/usersSlice.js';
import { officerInitials } from '../utils/officerIdentity.js';
import ChangePasswordModal from '../../../shared/components/ChangePasswordModal';

function StyledInput({ hasError, ...props }) {
  return (
    <input
      {...props}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = hasError ? '#ef4444' : '#7c3aed';
        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(${hasError ? '239,68,68' : '124,58,237'},.1)`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = hasError ? '#ef4444' : '#d1d5db';
        e.currentTarget.style.boxShadow = 'none';
      }}
      style={{
        display: 'block', width: '100%', boxSizing: 'border-box',
        padding: '10px 12px', fontSize: '14px', color: '#1e2939',
        borderRadius: '8px', fontFamily: 'inherit', outline: 'none',
        border: `1.5px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
        boxShadow: 'none',
        background: '#fff', transition: 'border-color .15s, box-shadow .15s',
      }}
    />
  );
}

function StyledTextarea({ hasError, rows = 3, ...props }) {
  return (
    <textarea
      {...props}
      rows={rows}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = hasError ? '#ef4444' : '#7c3aed';
        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(${hasError ? '239,68,68' : '124,58,237'},.1)`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = hasError ? '#ef4444' : '#d1d5db';
        e.currentTarget.style.boxShadow = 'none';
      }}
      style={{
        display: 'block', width: '100%', boxSizing: 'border-box',
        padding: '10px 12px', fontSize: '14px', color: '#1e2939',
        borderRadius: '8px', fontFamily: 'inherit', outline: 'none', resize: 'vertical',
        border: `1.5px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
        boxShadow: 'none',
        background: '#fff', transition: 'border-color .15s, box-shadow .15s',
      }}
    />
  );
}

function SectionEditButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Edit ${label}`}
      style={{
        padding: '5px 12px', background: '#f5f3ff', border: '1.5px solid #e9d5ff',
        borderRadius: '8px', color: '#7c3aed', fontSize: '12px', fontWeight: 600,
        cursor: 'pointer', transition: 'background .15s',
      }}
      onMouseEnter={(event) => { event.currentTarget.style.background = '#ede9fe'; }}
      onMouseLeave={(event) => { event.currentTarget.style.background = '#f5f3ff'; }}
    >
      Edit
    </button>
  );
}

function InlineEditActions({ onSave, onCancel }) {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '14px' }}>
      <button type="button" onClick={onCancel} style={{ padding: '7px 12px', border: '1px solid #d1d5db', borderRadius: '7px', background: '#fff', color: '#374151', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
      <button type="button" onClick={onSave} style={{ padding: '7px 12px', border: 0, borderRadius: '7px', background: '#7c3aed', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Save</button>
    </div>
  );
}

/* â”€â”€ Main Profile Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function Profile({ activePage = 'profile' }) {
  const dispatch = useDispatch();
  const session = useSelector(selectSession) || {};
  const updateSession = (u) => dispatch(updateSessionUser({ user: u }));
  const initialsOf = officerInitials;
  const user = useSelector(selectCurrentUser) || {};
  const extra = user.resumeData?.officerProfile || {};
  const userData = {
    name: user.name, email: user.email, initials: initialsOf(user.name),
    role: user.headline || 'Placement Officer', phone: user.phone || '',
    department: user.department || '', institution: user.university || '',
    employeeId: extra.employeeId || '', joined: user.joinedDate || '',
    location: user.location || '', bio: user.about || '',
    education: extra.education || [], skills: extra.skills || [], achievements: extra.achievements || [],
    social: { linkedin: user.socialLinks?.linkedin || '', website: user.socialLinks?.portfolio || '' },
  };
  const officerData = useSelector(selectOfficerData);

  useEffect(() => {
    if (session.id) dispatch(fetchUserById(session.id));
  }, [dispatch, session.id]);

  const { editingSection, draft, isChangePasswordOpen } = useSelector(selectPlacementProfileUi);
  const setEditingSection = (v) => dispatch(setPlacementProfileUi({ editingSection: v }));
  const setDraft = (updater) => {
    const next = typeof updater === 'function' ? updater(draft) : updater;
    dispatch(setPlacementProfileUi({ draft: next }));
  };
  const setIsChangePasswordOpen = (v) => dispatch(setPlacementProfileUi({ isChangePasswordOpen: v }));


  const stats = officerData.stats;
  const actItems = [
    { label: 'Drives Managed',       value: stats.published,                                              color: '#7c3aed' },
    { label: 'Students Placed',      value: stats.studentsPlaced,                                         color: '#10b981' },
    { label: 'Recruiters Onboarded', value: (officerData.recruiters || []).filter(r => r.status === 'active').length, color: '#3b82f6' },
    { label: 'Total Applications',   value: stats.totalApps,                                              color: '#f59e0b' },
    { label: 'Placement Rate',       value: `${stats.placementRate}%`,                                    color: '#ec4899' },
    { label: 'Candidates',           value: stats.totalCandidates,                                        color: '#06b6d4' },
  ];

  const startInlineEdit = (section) => {
    const educationText = (userData.education || []).map((item) => [item.degree, item.institution, item.year].filter(Boolean).join(' | ')).join('\n');
    const achievementsText = (userData.achievements || []).map((item) => [item.title, item.desc].filter(Boolean).join(' | ')).join('\n');
    const drafts = {
      personal: { name: userData.name, email: userData.email, phone: userData.phone, institution: userData.institution, department: userData.department, location: userData.location, employeeId: userData.employeeId },
      about: { bio: userData.bio },
      education: { educationText },
      achievements: { achievementsText },
      skills: { skillsText: (userData.skills || []).join(', ') },
      links: { linkedin: userData.social?.linkedin || '', website: userData.social?.website || '' },
    };
    setDraft(drafts[section] || {});
    setEditingSection(section);
  };

  const updateDraft = (key) => (event) => setDraft((current) => ({ ...current, [key]: event.target.value }));

  const handleSave = async (form) => {
    if (phoneError(form.phone)) { infoDialog(phoneError(form.phone)); return false; }
    const next = {
      ...userData,
      name:        form.name,
      email:       userData.email,
      phone:       form.phone,
      institution: form.institution,
      department:  form.department,
      location:    form.location,
      employeeId:  form.employeeId,
      bio:         form.bio,
      education:   form.education,
      skills:      form.skills,
      achievements: form.achievements,
      social: { linkedin: form.linkedin, website: form.website },
      initials: initialsOf(form.name),
    };
    try {
      await dispatch(updateUser({
        id: session.id,
        data: {
          name: next.name, phone: next.phone, university: next.institution, department: next.department,
          location: next.location, about: next.bio,
          socialLinks: { linkedin: next.social.linkedin, portfolio: next.social.website },
          resumeData: { officerProfile: { employeeId: next.employeeId, education: next.education, skills: next.skills, achievements: next.achievements } },
        },
      })).unwrap();
      const nextSession = { ...session, name: next.name, email: next.email };
      if (!updateSession(nextSession)) return;
      infoDialog('Profile updated successfully.');
    } catch (error) {
      infoDialog(errorMessage(error, 'Could not save your profile.'));
    }
  };

  const saveInlineEdit = async () => {
    const baseForm = {
      name: userData.name, email: userData.email, phone: userData.phone, institution: userData.institution,
      department: userData.department, location: userData.location, employeeId: userData.employeeId,
      bio: userData.bio, education: userData.education, skills: userData.skills, achievements: userData.achievements,
      linkedin: userData.social?.linkedin || '', website: userData.social?.website || '',
    };
    if (editingSection === 'personal') Object.assign(baseForm, draft);
    if (editingSection === 'about') baseForm.bio = draft.bio || '';
    if (editingSection === 'education') {
      baseForm.education = (draft.educationText || '').split('\n').map((row) => row.trim()).filter(Boolean).map((row) => {
        const [degree = '', institution = '', year = ''] = row.split('|').map((part) => part.trim());
        return { degree, institution, year };
      });
    }
    if (editingSection === 'achievements') {
      baseForm.achievements = (draft.achievementsText || '').split('\n').map((row) => row.trim()).filter(Boolean).map((row) => {
        const [title = '', desc = ''] = row.split('|').map((part) => part.trim());
        return { title, desc };
      });
    }
    if (editingSection === 'skills') baseForm.skills = (draft.skillsText || '').split(',').map((skill) => skill.trim()).filter(Boolean);
    if (editingSection === 'links') { baseForm.linkedin = draft.linkedin || ''; baseForm.website = draft.website || ''; }
    await handleSave(baseForm);
    setEditingSection(null);
  };

  return (
    <div className="frame">
      <Sidebar activePage={activePage} />

      <Header title="Placement Officer Profile" profile={userData} />

      <main className="main-content" id="mainContent">
        {/* Back navigation button */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => {
              dispatch(setPlacementPage('p1'));
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '8px', color: '#374151', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            â† Back to Dashboard
          </button>

          <button
            onClick={() => setIsChangePasswordOpen(true)}
            style={{
              padding: '9px 16px', background: '#fff', border: '1.5px solid #ddd6fe', borderRadius: '10px',
              color: '#6d28d9', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              marginLeft: 'auto', marginRight: '-2px',
            }}
          >
            Change Password
          </button>

          <button
            onClick={() => startInlineEdit('about')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '9px 20px', background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(124,58,237,.3)', transition: 'opacity .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            âœï¸ Edit Profile
          </button>
        </div>

        {/* Hero Card */}
        <div className="hero-card" style={{ marginBottom: '24px' }}>
          <div className="pm-header">
            <div className="pm-avatar">{officerInitials(userData.name)}</div>
            <div className="pm-header-info">
              <h1 className="pm-name">{userData.name || 'Placement Officer'}</h1>
              <div className="pm-role-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                {userData.role || 'Senior Placement Officer'}
              </div>
            </div>
          </div>
          {editingSection === 'about' ? (
            <div style={{ marginTop: '18px' }}>
              <StyledTextarea rows={3} value={draft.bio || ''} onChange={updateDraft('bio')} placeholder="Short professional bio..." />
              <InlineEditActions onSave={saveInlineEdit} onCancel={() => setEditingSection(null)} />
            </div>
          ) : (
            <div className="pm-bio">{userData.bio || 'Dedicated placement officer bridging academia and industry.'}</div>
          )}
        </div>

        {/* Two-Column: Personal Info & Activity Overview */}
        <div className="panels-row" style={{ marginBottom: '24px' }}>
          <div className="panel">
            <div className="panel-header" style={{ justifyContent: 'space-between' }}>
              <h3>Personal Information</h3>
              <button
                onClick={() => startInlineEdit('personal')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '5px 12px', background: '#f5f3ff', border: '1.5px solid #e9d5ff',
                  borderRadius: '8px', color: '#7c3aed', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', transition: 'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#ede9fe'}
                onMouseLeave={e => e.currentTarget.style.background = '#f5f3ff'}
              >
                âœï¸ Edit
              </button>
            </div>
            <div className="panel-body">
              {editingSection === 'personal' ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                    <StyledInput value={draft.name || ''} onChange={updateDraft('name')} placeholder="Full name" />
                    <StyledInput type="email" value={draft.email || ''} readOnly aria-readonly="true" />
                    <StyledInput {...phoneInputProps} value={draft.phone || ''} onChange={updateDraft('phone')} placeholder="Phone number" />
                    <StyledInput value={draft.employeeId || ''} onChange={updateDraft('employeeId')} placeholder="Employee ID" />
                    <StyledInput value={draft.institution || ''} onChange={updateDraft('institution')} placeholder="Institution" />
                    <StyledInput value={draft.department || ''} onChange={updateDraft('department')} placeholder="Department" />
                    <StyledInput value={draft.location || ''} onChange={updateDraft('location')} placeholder="Location" />
                  </div>
                  <InlineEditActions onSave={saveInlineEdit} onCancel={() => setEditingSection(null)} />
                </>
              ) : <div className="pm-info-grid">
                <div className="pm-info-item">
                  <div className="pm-info-label">Email</div>
                  <div className="pm-info-value">{userData.email}</div>
                </div>
                <div className="pm-info-item">
                  <div className="pm-info-label">Phone</div>
                  <div className="pm-info-value">{userData.phone}</div>
                </div>
                <div className="pm-info-item">
                  <div className="pm-info-label">Institution</div>
                  <div className="pm-info-value">{userData.institution}</div>
                </div>
                <div className="pm-info-item">
                  <div className="pm-info-label">Department</div>
                  <div className="pm-info-value">{userData.department}</div>
                </div>
                <div className="pm-info-item">
                  <div className="pm-info-label">Location</div>
                  <div className="pm-info-value">{userData.location}</div>
                </div>
                <div className="pm-info-item">
                  <div className="pm-info-label">Employee ID</div>
                  <div className="pm-info-value">{userData.employeeId}</div>
                </div>
              </div>}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Activity Overview</h3>
            </div>
            <div className="panel-body">
              <div className="pm-stats-grid">
                {actItems.map((item, idx) => (
                  <div className="pm-stat-item" key={idx}>
                    <div className="pm-stat-value" style={{ color: item.color }}>
                      {item.value}
                    </div>
                    <div className="pm-stat-label">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column: Education & Achievements + Skills & Links */}
        <div className="panels-row">
          <div className="panel">
            <div className="panel-header" style={{ justifyContent: 'space-between' }}>
              <h3>Education</h3>
              <SectionEditButton label="education" onClick={() => startInlineEdit('education')} />
            </div>
            <div className="panel-body">
              {editingSection === 'education' ? (
                <>
                  <StyledTextarea rows={4} value={draft.educationText || ''} onChange={updateDraft('educationText')} placeholder={'One qualification per line: Degree | Institution | Year'} />
                  <InlineEditActions onSave={saveInlineEdit} onCancel={() => setEditingSection(null)} />
                </>
              ) : <div className="pm-edu-timeline">
                {(userData.education || []).map((ed, idx) => (
                  <div className="pm-edu-item" key={idx}>
                    <div className="pm-edu-dot" />
                    <div>
                      <div className="pm-edu-degree">{ed.degree}</div>
                      <div className="pm-edu-inst">{ed.institution} &bull; {ed.year}</div>
                    </div>
                  </div>
                ))}
              </div>}
            </div>

            <div className="panel-header" style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px', justifyContent: 'space-between' }}>
              <h3>Achievements &amp; Honors</h3>
              <SectionEditButton label="achievements" onClick={() => startInlineEdit('achievements')} />
            </div>
            <div className="panel-body">
              {editingSection === 'achievements' ? (
                <>
                  <StyledTextarea rows={4} value={draft.achievementsText || ''} onChange={updateDraft('achievementsText')} placeholder={'One achievement per line: Title | Description'} />
                  <InlineEditActions onSave={saveInlineEdit} onCancel={() => setEditingSection(null)} />
                </>
              ) : <div className="pm-achieve-list">
                {(userData.achievements || []).map((a, idx) => (
                  <div className="pm-achieve-card" key={idx}>
                    <div className="pm-achieve-icon">ðŸ†</div>
                    <div>
                      <div className="pm-achieve-title">{a.title}</div>
                      <div className="pm-achieve-desc">{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header" style={{ justifyContent: 'space-between' }}>
              <h3>Skills &amp; Expertise</h3>
              <SectionEditButton label="skills and expertise" onClick={() => startInlineEdit('skills')} />
            </div>
            <div className="panel-body">
              {editingSection === 'skills' ? (
                <>
                  <StyledInput value={draft.skillsText || ''} onChange={updateDraft('skillsText')} placeholder="Separate skills with commas" />
                  <InlineEditActions onSave={saveInlineEdit} onCancel={() => setEditingSection(null)} />
                </>
              ) : <div className="pm-skills-wrap">
                {(userData.skills || []).map((s, idx) => (
                  <span className="pm-skill" key={idx}>{s}</span>
                ))}
              </div>}
            </div>

            {userData.social && (
              <>
                <div className="panel-header" style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px', justifyContent: 'space-between' }}>
                  <h3>Professional Links</h3>
                  <SectionEditButton label="professional links" onClick={() => startInlineEdit('links')} />
                </div>
                <div className="panel-body">
                  {editingSection === 'links' ? (
                    <>
                      <div style={{ display: 'grid', gap: '12px' }}>
                        <StyledInput value={draft.linkedin || ''} onChange={updateDraft('linkedin')} placeholder="LinkedIn URL" />
                        <StyledInput value={draft.website || ''} onChange={updateDraft('website')} placeholder="Website URL" />
                      </div>
                      <InlineEditActions onSave={saveInlineEdit} onCancel={() => setEditingSection(null)} />
                    </>
                  ) : <div className="pm-social-row" style={{ flexDirection: 'column' }}>
                    {userData.social.linkedin && (
                      <a className="pm-social-link" href={`https://${userData.social.linkedin}`} target="_blank" rel="noreferrer">
                        ðŸ”— LinkedIn Profile
                      </a>
                    )}
                    {userData.social.website && (
                      <a className="pm-social-link" href={`https://${userData.social.website}`} target="_blank" rel="noreferrer">
                        ðŸŒ Institutional Webpage
                      </a>
                    )}
                  </div>}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        userId={session.id}
      />
    </div>
  );
}
