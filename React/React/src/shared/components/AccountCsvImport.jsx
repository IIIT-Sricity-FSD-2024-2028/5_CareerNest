// Data Flow (shared/components/AccountCsvImport.jsx):
// Backend API -> Redux Thunks/Slices (usersSlice) -> useSelector(selectCsvImportUi, selectFile) -> UI render
// User Actions -> dispatch(createObjectURL, createElement) -> Slice reducers/thunks -> Redux state update
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { errorMessage } from '../../services/api.js';
import {
  importUsers,
  resetCsvImport,
  selectCsvImportUi,
  setCsvImportBusy,
  setCsvImportError,
  setCsvImportPreview,
  setCsvImportResult,
  startCsvImportFile,
} from '../../store/slices/usersSlice.js';

const button = {
  padding: "9px 16px",
  borderRadius: 8,
  border: "1px solid #7c3aed",
  background: "#fff",
  color: "#7c3aed",
  cursor: "pointer",
  fontWeight: 600,
};

function downloadFile(filename, contents, type) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function StudentCsvImport({
  role = "candidate",
  policy,
  onClose,
  onImported,
}) {
  const dispatch = useDispatch();
  const { csv, result, error, busy, filename } = useSelector(selectCsvImportUi);

  useEffect(() => {
    dispatch(resetCsvImport());
    return () => {
      dispatch(resetCsvImport());
    };
  }, [dispatch]);

  const downloadTemplate = () => {
    const text = isAlumni
      ? "name,email,company,batch,referrals,department,headline,location,phone\r\nMeera Rao,meera.rao@gmail.com,Microsoft,2022,0,Computer Science,Software Engineer,Hyderabad,9876543210\r\n"
      : `name,email,rollNumber,department,cgpa,backlogs,phone\r\nAditi Rao,aditi.rao@${policy.studentEmailDomain},${policy.rollExample},Computer Science,8.5,0,9876543210\r\n`;
    downloadFile(`${isAlumni ? "alumni" : "students"}-template.csv`, text, "text/csv;charset=utf-8");
  };
  const isAlumni = role === "alumni";
  const label = isAlumni ? "Alumni" : "Students";
  const endpoint = isAlumni ? "/users/import-alumni" : "/users/import-students";
  const columns = isAlumni
    ? [
        ["name", "Name"],
        ["email", "Email"],
        ["company", "Company"],
        ["batch", "Batch"],
        ["referrals", "Referrals"],
        ["headline", "Designation"],
        ["location", "Location"],
      ]
    : [
        ["name", "Name"],
        ["email", "Email"],
        ["rollNumber", "Roll number"],
        ["department", "Department"],
        ["cgpa", "CGPA"],
        ["backlogs", "Backlogs"],
      ];
  const selectFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    dispatch(startCsvImportFile(file?.name || ""));
    if (!file) return;
    if (!/\.csv$/i.test(file.name) || file.size > 1048576) {
      dispatch(setCsvImportError("Choose a CSV file up to 1 MB."));
      return;
    }
    dispatch(setCsvImportBusy(true));
    try {
      const content = await file.text();
      const data = await dispatch(importUsers({ endpoint, data: { csv: content, dryRun: true } })).unwrap();
      dispatch(setCsvImportPreview({ csv: content, result: data }));
    } catch (failure) {
      dispatch(setCsvImportError(errorMessage(failure, "Could not validate this CSV.")));
    } finally {
      dispatch(setCsvImportBusy(false));
    }
  };

  const importStudents = async () => {
    dispatch(setCsvImportBusy(true));
    dispatch(setCsvImportError(""));
    try {
      const data = await dispatch(importUsers({ endpoint, data: { csv, dryRun: false } })).unwrap();
      dispatch(setCsvImportResult(data));
      if (data.imported) {
        await onImported(data.imported);
      }
    } catch (failure) {
      dispatch(setCsvImportError(errorMessage(failure, "Account import failed.")));
    } finally {
      dispatch(setCsvImportBusy(false));
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.5)",
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="csv-title"
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 820,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <h3 id="csv-title">Import {label} CSV</h3>
        <p style={{ marginTop: 12 }}>
          {isAlumni
            ? "Any valid email domain is accepted, including Gmail, Yahoo and Outlook. Referrals must be between 0 and 10."
            : `Use @${policy.studentEmailDomain} email addresses. Roll format: ${policy.rollFormat}. Example: ${policy.rollExample}. Branches: ${policy.branches.map((b) => b.name).join(", ")}.`}
        </p>
        <p style={{ margin: "12px 0", color: "#475569", lineHeight: 1.6 }}>
          Download the template, enter {isAlumni ? "alumni" : "student"}{" "}
          details, and upload the CSV. Up to 1,000 accounts per import. All rows
          must pass validation before accounts are created.
        </p>
        <p style={{ marginBottom: 16, color: "#475569" }}>
          Accounts are added to your college with initial password{" "}
          <strong>12345678</strong>.
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button type="button" style={button} onClick={downloadTemplate}>
            Download CSV Template
          </button>
          <label>
            Choose CSV{" "}
            <input
              type="file"
              accept=".csv,text/csv"
              disabled={busy}
              onChange={selectFile}
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
        {busy && (
          <p role="status" style={{ marginTop: 16 }}>
            Processing accounts…
          </p>
        )}
        {error && (
          <p role="alert" style={{ marginTop: 16, color: "#b91c1c" }}>
            {error}
          </p>
        )}
        {result && (
          <div style={{ marginTop: 20 }}>
            {result.imported > 0 ? (
              <p role="status" style={{ color: "#166534" }}>
                Successfully imported {result.imported}{" "}
                {isAlumni ? "alumni" : "students"}.
              </p>
            ) : result.valid ? (
              <p role="status" style={{ color: "#166534" }}>
                {filename}: all {result.total} rows passed. Preview of the first{" "}
                {result.preview.length} accounts:
              </p>
            ) : (
              <p role="alert" style={{ color: "#b91c1c" }}>
                No accounts imported. Fix the errors below and upload the
                corrected file.
              </p>
            )}
            {result.errors?.length > 0 && (
              <ul
                style={{
                  paddingLeft: 24,
                  marginTop: 12,
                  color: "#b91c1c",
                  maxHeight: 240,
                  overflowY: "auto",
                }}
              >
                {result.errors.map((entry) => (
                  <li key={entry.row} style={{ marginBottom: 8 }}>
                    Row {entry.row}: {entry.messages.join("; ")}
                  </li>
                ))}
              </ul>
            )}
            {result.valid && (
              <div style={{ overflowX: "auto", marginTop: 12 }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      {columns.map(([key, heading]) => (
                        <th
                          key={key}
                          style={{
                            padding: 8,
                            textAlign: "left",
                            background: "#f8fafc",
                          }}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.preview.map((account) => (
                      <tr key={account.email}>
                        {columns.map(([key]) => (
                          <td
                            key={key}
                            style={{
                              padding: 8,
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            {account[key] ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button
            type="button"
            style={button}
            disabled={busy}
            onClick={onClose}
          >
            {result?.imported ? "Done" : "Cancel"}
          </button>
          {result?.valid && !result.imported && (
            <button
              type="button"
              style={{ ...button, background: "#7c3aed", color: "#fff" }}
              disabled={busy}
              onClick={importStudents}
            >
              Import {result.total} {label}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
