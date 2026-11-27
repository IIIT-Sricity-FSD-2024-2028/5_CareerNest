// Data Flow (shared/components/AccountDirectory.jsx):
// Backend API -> Redux Thunks/Slices (resourcesSlice, usersSlice) -> useSelector(selectResource, selectDirectoryUi, selectOversightUsers, selectUsersDirectory) -> UI render
// User Actions -> dispatch(fetchOversightPolicy, createUser, deleteUser, fetchOversightUsers, fetchUsers, loadError, saveUser) -> Slice reducers/thunks -> Redux state update
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StudentCsvImport from "./AccountCsvImport.jsx";
import { confirmDialog, infoDialog } from "./AppDialog.jsx";
import { errorMessage } from '../../services/api.js';
import { fetchOversightPolicy, selectResource } from '../../store/slices/resourcesSlice.js';
import {
  closeAddUserModal,
  closeCsvImportModal,
  createUser,
  deleteUser,
  fetchOversightUsers,
  fetchUsers,
  initDirectoryTab,
  openAddUserModal,
  openCsvImportModal,
  selectDirectoryUi,
  selectOversightUsers,
  selectUsersDirectory,
  setDirectoryBranch,
  setDirectoryFieldErrors,
  setDirectoryFormError,
  setDirectoryFormField,
  setDirectoryLoadError,
  setDirectoryLoading,
  setDirectoryRemovingId,
  setDirectorySaving,
  setDirectorySearch,
  setDirectorySubmitted,
  setDirectoryTab,
} from '../../store/slices/usersSlice.js';
import {
  toOversightUser,
  filterOversightUsers,
  validateUserForm,
} from "../utils/accountDirectory.js";

const buttonStyle = {
  padding: "9px 16px",
  borderRadius: 8,
  border: "1px solid #7c3aed",
  background: "#7c3aed",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};
const cellStyle = {
  padding: "14px 16px",
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
  fontSize: 14,
};
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  boxSizing: "border-box",
};
const emptyForm = {
  name: "",
  email: "",
  rollNumber: "",
  department: "",
  cgpa: "",
  backlogs: "0",
  company: "",
  batch: "",
  referrals: "0",
  headline: "",
  location: "",
};

export default function AccountDirectory({
  canCreate = false,
  initialTab = "candidates",
  showTabs = true,
  onChanged,
}) {
  const dispatch = useDispatch();
  // Redux data source: usersSlice (students/alumni list + directory modal/filter UI) and resourcesSlice (oversight policy).
  // Loaded via fetchUsers / fetchOversightUsers + fetchOversightPolicy thunks in refresh().
  const records = useSelector(canCreate ? selectUsersDirectory : selectOversightUsers);
  const users = records.map(toOversightUser);
  const policy = useSelector((state) => selectResource(state, 'oversightPolicy'));
  const {
    loadError,
    loading,
    activeTab,
    search,
    branch,
    addOpen,
    csvOpen,
    form,
    saving,
    removingId,
    formError,
    fieldErrors,
    submitted,
  } = useSelector(selectDirectoryUi);

  useEffect(() => {
    dispatch(initDirectoryTab(initialTab));
  }, [dispatch, initialTab]);

  const refresh = useCallback(async () => {
    dispatch(setDirectoryLoading(true));
    try {
      await Promise.all([
        dispatch(canCreate ? fetchUsers() : fetchOversightUsers()).unwrap(),
        dispatch(fetchOversightPolicy()).unwrap(),
      ]);
      dispatch(setDirectoryLoadError(""));
    } catch (error) {
      dispatch(setDirectoryLoadError(errorMessage(error, "Could not load User Oversight.")));
    } finally {
      dispatch(setDirectoryLoading(false));
    }
  }, [canCreate, dispatch]);
  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);
  const setNotice = (message) => infoDialog(message);
  const role = activeTab === "candidates" ? "candidate" : "alumni";
  const matching = filterOversightUsers(users, role, search, branch);
  const branches = [
    ...new Set(
      users
        .filter((u) => u.role === "candidate" && u.branch)
        .map((u) => u.branch),
    ),
  ].sort((a, b) => a.localeCompare(b));
  const counts = {
    candidates: users.filter((u) => u.role === "candidate").length,
    alumni: users.filter((u) => u.role === "alumni").length,
  };
  const columns =
    role === "candidate"
      ? ["Name", "Email", "Roll No", "Branch", "CGPA", "Backlogs", "Status", ...(canCreate ? ["Actions"] : [])]
      : ["Name", "Email", "Company", "Batch", "Referrals", "Status", ...(canCreate ? ["Actions"] : [])];

  const removeUser = async (user) => {
    const label = role === "candidate" ? "student" : "alumni";
    if (!await confirmDialog(`Remove ${label} ${user.name} (${user.email})? This will remove their account and cannot be undone.`)) return;
    dispatch(setDirectoryRemovingId(user.id));
    try {
      await dispatch(deleteUser(user.id)).unwrap();
      await refresh();
      await onChanged?.();
      setNotice(`${user.name} was removed.`);
    } catch (error) {
      setNotice(errorMessage(error, `Could not remove this ${label} account.`));
    } finally {
      dispatch(setDirectoryRemovingId(null));
    }
  };

  const saveUser = async (event) => {
    event.preventDefault();
    if (saving || !canCreate) return;
    if (!policy) {
      dispatch(setDirectoryFormError(
        "College validation rules could not be loaded. Refresh and try again.",
      ));
      return;
    }
    dispatch(setDirectorySubmitted(true));
    dispatch(setDirectoryFormError(""));
    const email = form.email.trim().toLowerCase();
    const roll = form.rollNumber.trim().toUpperCase();
    const errors = validateUserForm(form, role, users, policy);
    dispatch(setDirectoryFieldErrors(errors));
    if (Object.keys(errors).length) {
      event.currentTarget
        .querySelector(`[name="${Object.keys(errors)[0]}"]`)
        ?.focus();
      return;
    }
    dispatch(setDirectorySaving(true));
    try {
      await dispatch(createUser({
        name: form.name.trim(),
        email,
        role,
        status: "active",
        password: "12345678",
        ...(role === "candidate"
          ? {
              rollNumber: roll,
              department: form.department.trim(),
              cgpa: Number(form.cgpa),
              backlogs: Number(form.backlogs),
            }
          : {
              company: form.company.trim(),
              batch: form.batch,
              referrals: Number(form.referrals),
              headline: form.headline.trim(),
              location: form.location.trim(),
            }),
      })).unwrap();
      await refresh();
      await onChanged?.();
      dispatch(closeAddUserModal());
      setNotice(`Account created for ${email}. Initial password: 12345678`);
    } catch (error) {
      dispatch(setDirectoryFormError(errorMessage(error, "Could not add the user.")));
    } finally {
      dispatch(setDirectorySaving(false));
    }
  };

  const field = (key, label, attributes = {}) => (
    <label style={{ display: "grid", gap: 6 }} key={key}>
      {label}
      <input
        name={key}
        style={{
          ...inputStyle,
          ...(fieldErrors[key] ? { borderColor: "#b91c1c" } : {}),
        }}
        aria-invalid={Boolean(fieldErrors[key])}
        aria-describedby={fieldErrors[key] ? `error-${key}` : undefined}
        value={form[key]}
        onBlur={() => {
          const errors = validateUserForm(form, role, users, policy);
          dispatch(setDirectoryFieldErrors({
            ...fieldErrors,
            [key]: errors[key] || "",
          }));
        }}
        onChange={(e) => {
          const next = { ...form, [key]: e.target.value };
          dispatch(setDirectoryFormField({ field: key, value: e.target.value }));
          if (submitted || fieldErrors[key]) {
            const errors = validateUserForm(next, role, users, policy);
            dispatch(setDirectoryFieldErrors({
              ...fieldErrors,
              [key]: errors[key] || "",
            }));
          }
        }}
        required
        {...attributes}
      />
      {fieldErrors[key] && (
        <span
          id={`error-${key}`}
          role="alert"
          style={{ color: "#b91c1c", fontSize: 12 }}
        >
          {fieldErrors[key]}
        </span>
      )}
    </label>
  );

  return (
    <section className="account-directory">
      <div>
        <section className="oversight-intro">
          <div>
            <h2>
              {showTabs
                ? "User Oversight"
                : role === "candidate"
                  ? "Students"
                  : "Alumni"}
            </h2>
            <p>
              {canCreate
                ? "Manage accounts individually or import them from CSV."
                : "View student and alumni records. Accounts are added by your college administrator."}
            </p>
          </div>
          <div className="oversight-summary">
            <span>
              <strong>{counts.candidates}</strong> Candidates
            </span>
            <span>
              <strong>{counts.alumni}</strong> Alumni
            </span>
          </div>
        </section>
        {loadError && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {loadError}
          </p>
        )}
        {loading && <p role="status">Loading users…</p>}
        {showTabs && (
          <div className="filter-tabs oversight-tabs">
            {[
              ["candidates", "Candidates"],
              ["alumni", "Alumni & Referrals"],
            ].map(([tab, label]) => (
              <button
                type="button"
                key={tab}
                className={`tab${activeTab === tab ? " active" : ""}`}
                onClick={() => dispatch(setDirectoryTab(tab))}
              >
                {label} <span>{counts[tab]}</span>
              </button>
            ))}
          </div>
        )}
        <section
          className="panel"
          style={{ padding: 20, borderRadius: 14, marginTop: 20 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <h3>{role === "candidate" ? "Students" : "Alumni & Referrals"}</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                aria-label="Search users"
                placeholder={
                  role === "alumni"
                    ? "Search name, email, company or batch…"
                    : "Search name, email, roll or branch…"
                }
                value={search}
                onChange={(event) => dispatch(setDirectorySearch(event.target.value))}
                style={{ ...inputStyle, width: 270 }}
              />
              {role === "candidate" && (
                <select
                  aria-label="Filter by branch"
                  value={branch}
                  onChange={(e) => dispatch(setDirectoryBranch(e.target.value))}
                  style={{ ...inputStyle, width: 200 }}
                >
                  <option value="">All branches</option>
                  {branches.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              )}
              {canCreate && (
                <>
                  <button
                    type="button"
                    disabled={!policy}
                    style={{
                      ...buttonStyle,
                      background: "#fff",
                      color: "#7c3aed",
                    }}
                    onClick={() => dispatch(openCsvImportModal())}
                  >
                    Import {role === "candidate" ? "Students" : "Alumni"} CSV
                  </button>
                  <button
                    type="button"
                    disabled={!policy}
                    style={buttonStyle}
                    onClick={() => dispatch(openAddUserModal())}
                  >
                    + Add {role === "candidate" ? "Student" : "Alumni"}
                  </button>
                </>
              )}
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {columns.map((label) => (
                    <th
                      key={label}
                      style={{
                        ...cellStyle,
                        background: "#f8fafc",
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matching.map((user) => (
                  <tr key={user.id}>
                    <td style={cellStyle}>{user.name}</td>
                    <td style={cellStyle}>{user.email}</td>
                    {role === "candidate" ? (
                      <>
                        <td style={cellStyle}>{user.roll || "—"}</td>
                        <td style={cellStyle}>{user.branch || "—"}</td>
                        <td style={cellStyle}>{user.cgpa ?? "—"}</td>
                        <td style={cellStyle}>{user.backlogs ?? 0}</td>
                      </>
                    ) : (
                      <>
                        <td style={cellStyle}>{user.company || "—"}</td>
                        <td style={cellStyle}>{user.batch || "—"}</td>
                        <td style={cellStyle}>{user.referrals ?? 0}</td>
                      </>
                    )}
                    <td style={cellStyle}>{user.status}</td>
                    {canCreate && <td style={cellStyle}>
                      <button type="button" className="btn btn-danger btn-sm" disabled={removingId === user.id} onClick={() => removeUser(user)}>
                        {removingId === user.id ? "Removing…" : "Remove"}
                      </button>
                    </td>}
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && !loadError && matching.length === 0 && (
              <p style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                No users match this search or branch filter.
              </p>
            )}
          </div>
        </section>
      </div>
      {canCreate && addOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,.5)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <form
            noValidate
            onSubmit={saveUser}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-user-title"
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 16,
              width: "100%",
              maxWidth: 480,
              maxHeight: "85vh",
              overflowY: "auto",
              display: "grid",
              gap: 14,
            }}
          >
            <h3 id="add-user-title">
              Add {role === "candidate" ? "Student" : "Alumni"}
            </h3>
            {field("name", "Full name", { minLength: 2, maxLength: 100 })}
            {field(
              "email",
              role === "candidate"
                ? `Email (@${policy.studentEmailDomain})`
                : "Email",
              {
                type: "email",
                maxLength: 254,
                placeholder:
                  role === "candidate"
                    ? `name@${policy.studentEmailDomain}`
                    : "name@yahoo.com",
              },
            )}
            {role === "candidate" ? (
              <>
                <label style={{ display: "grid", gap: 6 }}>
                  Branch
                  <select
                    name="department"
                    required
                    value={form.department}
                    aria-invalid={Boolean(fieldErrors.department)}
                    aria-describedby={
                      fieldErrors.department ? "error-department" : undefined
                    }
                    style={{
                      ...inputStyle,
                      ...(fieldErrors.department
                        ? { borderColor: "#b91c1c" }
                        : {}),
                    }}
                    onChange={(e) => {
                      const next = { ...form, department: e.target.value };
                      dispatch(setDirectoryFormField({ field: "department", value: e.target.value }));
                      const errors = validateUserForm(
                        next,
                        role,
                        users,
                        policy,
                      );
                      dispatch(setDirectoryFieldErrors({
                        ...fieldErrors,
                        department: errors.department || "",
                        ...(submitted || fieldErrors.rollNumber
                          ? { rollNumber: errors.rollNumber || "" }
                          : {}),
                      }));
                    }}
                  >
                    <option value="">Select branch</option>
                    {policy.branches.map((b) => (
                      <option key={b.code} value={b.name}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                  {fieldErrors.department && (
                    <span
                      id="error-department"
                      role="alert"
                      style={{ color: "#b91c1c", fontSize: 12 }}
                    >
                      {fieldErrors.department}
                    </span>
                  )}
                </label>
                {field("rollNumber", "Roll number", {
                  maxLength: 8,
                  placeholder: `B${String(new Date().getFullYear()).slice(-2)}${policy.branches.find((b) => b.name === form.department)?.code || "CS"}001`,
                })}
                <small style={{ color: "#64748b" }}>
                  {policy.rollFormat}. Example: {policy.rollExample}; use the
                  selected branch code.
                </small>
                {field("cgpa", "CGPA", {
                  type: "number",
                  min: 0,
                  max: 10,
                  step: "0.01",
                })}
                {field("backlogs", "Backlogs", {
                  type: "number",
                  min: 0,
                  max: 50,
                  step: 1,
                })}
              </>
            ) : (
              <>
                {field("company", "Company", { maxLength: 100 })}
                {field("batch", "Graduation year", {
                  type: "number",
                  min: 1990,
                  max: new Date().getFullYear(),
                  step: 1,
                })}
                {field("referrals", "Referrals (0–10)", {
                  type: "number",
                  min: 0,
                  max: 10,
                  step: 1,
                })}
                {field("headline", "Designation (optional)", {
                  required: false,
                  maxLength: 100,
                })}
                {field("location", "Location (optional)", {
                  required: false,
                  maxLength: 100,
                })}
              </>
            )}
            <p style={{ color: "#64748b", fontSize: 13 }}>
              Initial password: <strong>12345678</strong>
            </p>
            {formError && (
              <p role="alert" style={{ color: "#b91c1c" }}>
                {formError}
              </p>
            )}
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
            >
              <button
                type="button"
                disabled={saving}
                style={{ ...buttonStyle, background: "#fff", color: "#7c3aed" }}
                onClick={() => dispatch(closeAddUserModal())}
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} style={buttonStyle}>
                {saving ? "Adding…" : "Add User"}
              </button>
            </div>
          </form>
        </div>
      )}
      {canCreate && csvOpen && (
        <StudentCsvImport
          role={role}
          policy={policy}
          onClose={() => dispatch(closeCsvImportModal())}
          onImported={async (count) => {
            await refresh();
            await onChanged?.();
            setNotice(
              `${count} ${role === "candidate" ? "student" : "alumni"} accounts imported. Initial password: 12345678`,
            );
          }}
        />
      )}
    </section>
  );
}
