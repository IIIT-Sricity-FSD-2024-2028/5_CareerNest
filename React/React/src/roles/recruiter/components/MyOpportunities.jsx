// Data Flow (roles/recruiter/components/MyOpportunities.jsx):
// Backend API -> Redux Thunks/Slices (opportunitiesSlice, recruiterSlice) -> useSelector(selectMyOpportunitiesUi, selectOpportunitiesWithCount) -> UI render
// User Actions -> dispatch(deleteOpportunity, updateOpportunity, loadRecruiterWorkspace) -> Slice reducers/thunks -> Redux state update

import { useDispatch, useSelector } from 'react-redux';
import { errorMessage } from '../../../services/api.js';
import { confirmDialog, infoDialog } from "../../../shared/components/AppDialog.jsx";
import { deleteOpportunity, updateOpportunity } from '../../../store/slices/opportunitiesSlice.js';
import {
  
  loadRecruiterWorkspace,
  selectMyOpportunitiesUi,
  selectOpportunitiesWithCount,
  setMyOpportunitiesEditingId,
  setRecruiterRoleFilter,
  setRecruiterTab,
} from '../store/recruiterSlice.js';
import { fromOpportunity } from '../data/api.js';
import OpportunityEditor from "./OpportunityEditor.jsx";

export default function MyOpportunities() {
  const dispatch = useDispatch();
  const opportunities = useSelector(selectOpportunitiesWithCount);
  const { editingId } = useSelector(selectMyOpportunitiesUi);
  const editing = opportunities.find((opportunity) => opportunity.id === editingId);
  const published = (o) =>
    ["published", "closed"].includes(o.status.toLowerCase());

  const onUpdateOpportunity = async (updatedOpp) => {
    try {
      await dispatch(updateOpportunity({
        id: updatedOpp.id,
        data: ['published', 'closed'].includes(updatedOpp.status.toLowerCase())
          ? { cgpa: Number(updatedOpp.cgpa) }
          : fromOpportunity(updatedOpp),
      })).unwrap();
      const refreshed = await dispatch(loadRecruiterWorkspace()).unwrap().then(() => true, () => false);
      infoDialog(refreshed ? `Opportunity "${updatedOpp.title}" updated successfully!` : 'Changes were saved, but some workspace data could not be refreshed.');
      return true;
    } catch (error) {
      infoDialog(errorMessage(error, 'Could not update the opportunity.'));
      return false;
    }
  };

  return (
    <div>
      <div className="section-header-wrap">
        <h2>My Opportunities</h2>
        <p>
          Edit all details until publication. CGPA can increase or decrease
          before approval; after approval it can only decrease.
        </p>
        <button
          className="btn-primary-action"
          onClick={() => {
            dispatch(setRecruiterTab("post"));
          }}
        >
          Post New Opportunity
        </button>
      </div>
      <div className="opportunities-grid">
        {opportunities.map((o) => (
          <article className="opp-card-custom" key={o.id}>
            <div className="opp-card-top">
              <h3>{o.title}</h3>
              <span className={`badge-status ${o.status.toLowerCase()}`}>
                {o.status}
              </span>
            </div>
            <p>
              <strong>Job ID: {o.jobId}</strong> Â· {o.type}
            </p>
            <p>{o.location}</p>
            <p>
              {o.ctc} Â· Minimum CGPA: {o.cgpa}
            </p>
            <p>Deadline: {o.deadline}</p>
            <p>{o.branches.join(", ")}</p>
            <div className="opp-actions-row">
              <button
                className="btn-view-apps"
                onClick={() => {
                  dispatch(setRecruiterRoleFilter(String(o.id)));
                  dispatch(setRecruiterTab("applications"));
                }}
              >
                View Applications ({o.applications})
              </button>
              <button
                className="btn-secondary-action"
                onClick={() => {
                  dispatch(setMyOpportunitiesEditingId(o.id));
                }}
              >
                {published(o) ? "Lower CGPA" : "Edit"}
              </button>
              {!published(o) && (
                <button
                  className="btn-delete-opp"
                  onClick={async () => {
                    if (!await confirmDialog(`Remove "${o.title}"?`)) return;
                    try {
                      await dispatch(deleteOpportunity(o.id)).unwrap();
                      const refreshed = await dispatch(loadRecruiterWorkspace()).unwrap().then(() => true, () => false);
                      infoDialog(refreshed ? 'Opportunity removed successfully.' : 'Changes were saved, but some workspace data could not be refreshed.');
                    } catch (error) {
                      infoDialog(errorMessage(error, 'Could not remove the opportunity.'));
                    }
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      {!opportunities.length && <p>No opportunities posted yet.</p>}
      {editing && (
        <OpportunityEditor
          key={editing.id}
          opportunity={editing}
          opportunities={opportunities}
          onSave={onUpdateOpportunity}
          onClose={() => dispatch(setMyOpportunitiesEditingId(null))}
        />
      )}
    </div>
  );
}
