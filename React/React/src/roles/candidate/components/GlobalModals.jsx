// Data Flow (roles/candidate/components/GlobalModals.jsx):
// Backend API -> Redux Thunks/Slices (candidateSlice) -> useSelector(selectCandidateUI) -> UI render
// User Actions -> dispatch(submitCandidateQuery) -> Slice reducers/thunks -> Redux state update
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeQueryModal,
    closeSuccessModal,
    selectCandidateUI,
    setQueryMessage,
    submitCandidateQuery,
} from '../store/candidateSlice.js';

export default function GlobalModals() {
    const dispatch = useDispatch();
    const { successModal, askQueryOpen, queryMessage } = useSelector(selectCandidateUI);
    const successRef = useRef(null);
    const queryRef = useRef(null);

    useEffect(() => {
        const el = successRef.current;
        if (!el) return;
        if (successModal.open && !el.open) el.showModal();
        if (!successModal.open && el.open) el.close();
    }, [successModal.open]);

    useEffect(() => {
        const el = queryRef.current;
        if (!el) return;
        if (askQueryOpen && !el.open) el.showModal();
        if (!askQueryOpen && el.open) el.close();
    }, [askQueryOpen]);

    return (
        <>
            <dialog
                ref={successRef}
                className="profile-modal"
                style={{ width: 400, textAlign: 'center', padding: 0, border: 'none', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                onClose={() => dispatch(closeSuccessModal())}
            >
                <div style={{ padding: '40px 24px' }}>
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: '#dcfce7',
                            color: '#16a34a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 48,
                            margin: '0 auto 24px auto',
                        }}
                    >
                        <i className="bx bx-check" />
                    </div>
                    <h2 style={{ fontSize: 24, color: '#0f172a', marginBottom: 12 }}>{successModal.title}</h2>
                    <p style={{ color: '#64748b', marginBottom: 32, fontSize: 15 }}>{successModal.message}</p>
                    <button className="btn-primary" style={{ width: '100%', padding: 12 }} onClick={() => dispatch(closeSuccessModal())}>
                        Close
                    </button>
                </div>
            </dialog>

            <dialog
                ref={queryRef}
                className="profile-modal"
                style={{ width: 450, padding: 0, border: 'none', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                onClose={() => dispatch(closeQueryModal())}
            >
                <div
                    className="modal-header"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}
                >
                    <h3 style={{ margin: 0 }}>Ask a Query</h3>
                    <button className="modal-close" style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }} onClick={() => dispatch(closeQueryModal())}>
                        <i className="bx bx-x" />
                    </button>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        dispatch(submitCandidateQuery());
                    }}
                    style={{ padding: 24 }}
                >
                    <p style={{ color: '#64748b', marginBottom: 20, fontSize: 14 }}>
                        If you have any questions regarding this opportunity, send a message to the placement cell.
                    </p>
                    <div className="modal-form-group" style={{ marginBottom: 20, textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Your Message</label>
                        <textarea
                            required
                            rows={5}
                            value={queryMessage}
                            onChange={(e) => dispatch(setQueryMessage(e.target.value))}
                            style={{
                                width: '100%',
                                padding: 10,
                                border: '1px solid #cbd5e1',
                                borderRadius: 6,
                                boxSizing: 'border-box',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                            }}
                        />
                    </div>
                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <button type="button" className="btn-secondary" onClick={() => dispatch(closeQueryModal())}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px 24px' }}>
                            <i className="bx bx-send" style={{ marginRight: 6 }} /> Send Message
                        </button>
                    </div>
                </form>
            </dialog>
        </>
    );
}
