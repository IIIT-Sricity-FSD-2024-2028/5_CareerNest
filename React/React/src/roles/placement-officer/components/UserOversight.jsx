// Data Flow (roles/placement-officer/components/UserOversight.jsx):
// Presentational component receiving Redux-backed data and dispatch callbacks as props from its parent container.
import Sidebar from "./Sidebar";
import Header from "./Header";
import AccountDirectory from "../../../shared/components/AccountDirectory.jsx";
import "./styles/p1.css";
import "./styles/p5.css";
import "./styles/user-oversight.css";

export default function UserOversight({ activePage = "p5" }) {
  return (
    <div className="frame user-oversight-page">
      <Sidebar activePage={activePage} />
      <Header title="User Oversight" />
      <main className="main-content" id="mainContent">
        <AccountDirectory />
      </main>
    </div>
  );
}
