// Data Flow (roles/recruiter/components/Profile.jsx):
// Backend API -> Redux Thunks/Slices (authSlice, recruiterSlice, usersSlice) -> useSelector(selectSession, selectRecruiter, selectRecruiterProfileUi) -> UI render
// User Actions -> dispatch(updateSessionUser, updateUser, updateSession) -> Slice reducers/thunks -> Redux state update
import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { errorMessage } from '../../../services/api.js';
import { infoDialog } from '../../../shared/components/AppDialog.jsx';
import { phoneInputProps } from '../../../shared/utils/phone.js';
import ChangePasswordModal from '../../../shared/components/ChangePasswordModal.jsx';
import { selectSession, updateSessionUser } from '../../../store/slices/authSlice.js';
import {
  initRecruiterProfileUi,
  selectRecruiter,
  selectRecruiterProfileUi,
  setRecruiterProfileFormField,
  setRecruiterProfileUi,
} from '../store/recruiterSlice.js';
import { updateUser } from '../../../store/slices/usersSlice.js';
import { Edit3, AlertCircle } from 'lucide-react';

export default function Profile() {
  const dispatch = useDispatch();
  const updateSession = (u) => dispatch(updateSessionUser({ user: u }));
  const session = useSelector(selectSession);
  const { recruiter } = useSelector(selectRecruiter, shallowEqual);
  const userId = session?.id;
  const { passwordOpen, saving, isEditing, formData, errors } = useSelector(selectRecruiterProfileUi);

  useEffect(() => {
    dispatch(initRecruiterProfileUi({ ...recruiter }));
  }, [dispatch, recruiter.name, recruiter.email, recruiter.company, recruiter.role, recruiter.department, recruiter.phone, recruiter.location]);

  const validate = (data = formData) => {
    const errs = {};

    // Full Name: only alphabets and spaces
    if (!data.name || !data.name.trim()) {
      errs.name = 'Full Name is required.';
    } else if (!/^[A-Za-z\s]+$/.test(data.name.trim())) {
      errs.name = 'Full Name must contain only letters and spaces.';
    }

    // Company Name: only alphabets and spaces
    if (!data.company || !data.company.trim()) {
      errs.company = 'Company Name is required.';
    } else if (!/^[A-Za-z\s]+$/.test(data.company.trim())) {
      errs.company = 'Company Name must contain only letters and spaces.';
    }

    // Designation / Role: only alphabets and spaces
    if (!data.role || !data.role.trim()) {
      errs.role = 'Designation is required.';
    } else if (!/^[A-Za-z\s]+$/.test(data.role.trim())) {
      errs.role = 'Designation must contain only letters and spaces.';
    }

    // Department: only alphabets and spaces
    if (data.department && !/^[A-Za-z\s]+$/.test(data.department.trim())) {
      errs.department = 'Department must contain only letters and spaces.';
    }

    // Email Address: valid email format
    if (!data.email || !data.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    // Phone Number: only digits
    if (!data.phone || !data.phone.trim()) {
      errs.phone = 'Phone Number is required.';
    } else if (!/^\d{10}$/.test(data.phone)) {
      errs.phone = 'Phone Number must contain exactly 10 digits, with no spaces or special characters.';
    }

    return errs;
  };

  const handleToggleEdit = () => {
    if (!isEditing) {
      const initialData = { ...recruiter };
      dispatch(setRecruiterProfileUi({ formData: initialData, errors: validate(initialData), isEditing: true }));
    } else {
      dispatch(setRecruiterProfileUi({ isEditing: false, errors: {} }));
    }
  };

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    dispatch(setRecruiterProfileFormField({ field, value }));
    const errs = validate(updated);
    dispatch(setRecruiterProfileUi({ errors: { ...errors, [field]: errs[field] } }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate(formData);
    dispatch(setRecruiterProfileUi({ errors: errs }));
    if (Object.keys(errs).length > 0) {
      return;
    }
    dispatch(setRecruiterProfileUi({ saving: true }));
    try {
      const user = await dispatch(updateUser({
        id: session.id,
        data: {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          department: formData.department,
          company: formData.company,
          headline: formData.role,
        },
      })).unwrap();
      updateSession({ ...session, name: user.name, company: user.company });
      infoDialog('Profile information saved successfully!');
      dispatch(setRecruiterProfileUi({ isEditing: false }));
    } catch (error) {
      infoDialog(errorMessage(error, 'Could not save your profile.'));
    } finally {
      dispatch(setRecruiterProfileUi({ saving: false }));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1F2937' }}>Recruiter Profile</h2>
        <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
          Manage your personal information, company profile, and communication channels.
        </p>
      </div>

      <button className="btn-secondary-action" style={{marginBottom:16}} onClick={() => dispatch(setRecruiterProfileUi({ passwordOpen: true }))}>Change Password</button>
      <ChangePasswordModal isOpen={passwordOpen} onClose={() => dispatch(setRecruiterProfileUi({ passwordOpen: false }))} userId={userId} accentColor="#0f8f63" />
      <div className="profile-card-full">
        <div className="profile-top-wrap">
          <div className="profile-avatar-large">
            {recruiter.avatar || 'PK'}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1F2937' }}>
              {recruiter.name}
            </h3>
            <p style={{ fontSize: '14px', color: '#0F8F63', fontWeight: 600 }}>
              {recruiter.role} at {recruiter.company}
            </p>
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
              Member since {recruiter.joinedDate || 'January 2024'}
            </p>
          </div>

          <button 
            type="button"
            className="btn-secondary-action"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={handleToggleEdit}
          >
            <Edit3 size={15} />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className={`form-input${errors.name ? ' input-error' : ''}`}
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                {errors.name && (
                  <span className="field-error" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={12} /> {errors.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Company Name</label>
                <input 
                  type="text" 
                  className={`form-input${errors.company ? ' input-error' : ''}`}
                  value={formData.company || ''}
                  onChange={(e) => handleChange('company', e.target.value)}
                />
                {errors.company && (
                  <span className="field-error" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={12} /> {errors.company}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Designation / Role</label>
                <input 
                  type="text" 
                  className={`form-input${errors.role ? ' input-error' : ''}`}
                  value={formData.role || ''}
                  onChange={(e) => handleChange('role', e.target.value)}
                />
                {errors.role && (
                  <span className="field-error" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={12} /> {errors.role}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Department</label>
                <input 
                  type="text" 
                  className={`form-input${errors.department ? ' input-error' : ''}`}
                  value={formData.department || ''}
                  onChange={(e) => handleChange('department', e.target.value)}
                />
                {errors.department && (
                  <span className="field-error" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={12} /> {errors.department}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className={`form-input${errors.email ? ' input-error' : ''}`}
                  value={formData.email || ''}
                  readOnly aria-readonly="true"
                />
                {errors.email && (
                  <span className="field-error" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={12} /> {errors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  className={`form-input${errors.phone ? ' input-error' : ''}`}
                  {...phoneInputProps} value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                {errors.phone && (
                  <span className="field-error" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={12} /> {errors.phone}
                  </span>
                )}
              </div>

              <div className="form-group full-width">
                <label>Office Location</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.location || ''}
                  onChange={(e) => dispatch(setRecruiterProfileFormField({ field: 'location', value: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn-secondary-action"
                onClick={() => {
                  dispatch(setRecruiterProfileUi({ isEditing: false, errors: {} }));
                }}
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary-action">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details-grid">
            <div className="profile-field-item">
              <label>Designation</label>
              <p>{recruiter.role}</p>
            </div>

            <div className="profile-field-item">
              <label>Organization</label>
              <p>{recruiter.company}</p>
            </div>

            <div className="profile-field-item">
              <label>Department</label>
              <p>{recruiter.department}</p>
            </div>

            <div className="profile-field-item">
              <label>Official Email</label>
              <p>{recruiter.email}</p>
            </div>

            <div className="profile-field-item">
              <label>Contact Phone</label>
              <p>{recruiter.phone}</p>
            </div>

            <div className="profile-field-item">
              <label>Location</label>
              <p>{recruiter.location}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
