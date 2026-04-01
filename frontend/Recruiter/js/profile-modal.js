document.addEventListener("DOMContentLoaded", () => {
  const modalHTML = `
    <div id="profileOverlay" class="overlay">
      <div class="modal" style="text-align: left; max-width: 500px; padding: 30px; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div class="avatar" style="width: 64px; height: 64px; font-size: 24px; display: flex; align-items: center; justify-content: center; background: #E6FFFA; color: #0F8A5F; border-radius: 50%; font-weight: 600;">PK</div>
            <div>
              <h2 style="font-size: 20px; color: #111827; margin: 0;">Priya Kapo <span style="font-size: 11px; background: #ECFDF5; color: #059669; padding: 2px 8px; border-radius: 12px; vertical-align: middle; margin-left: 8px;">Verified</span></h2>
              <p style="color: #6B7280; font-weight: 400; font-size: 14px; margin: 4px 0 0 0;">Senior Technical Recruiter</p>
            </div>
          </div>
          <button onclick="closeMyProfile()" style="background: none; border: none; font-size: 28px; line-height: 1; cursor: pointer; color: #9CA3AF;">&times;</button>
        </div>
        
        <div style="background: #F8FAFC; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #E5E7EB;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; margin: 0 0 4px 0; font-weight: 600;">Company</p>
              <p style="font-size: 15px; color: #111827; font-weight: 500; margin: 0;">TechCorp Solutions</p>
            </div>
            <div>
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; margin: 0 0 4px 0; font-weight: 600;">Location</p>
              <p style="font-size: 15px; color: #111827; font-weight: 500; margin: 0;">Bangalore, India</p>
            </div>
            <div>
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; margin: 0 0 4px 0; font-weight: 600;">Email Details</p>
              <p style="font-size: 15px; color: #2563EB; font-weight: 500; margin: 0;">priya12@gmail.com</p>
            </div>
            <div>
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; margin: 0 0 4px 0; font-weight: 600;">Contact</p>
              <p style="font-size: 15px; color: #111827; font-weight: 500; margin: 0;">+91 98765 43210</p>
            </div>
            <div>
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; margin: 0 0 4px 0; font-weight: 600;">Experience</p>
              <p style="font-size: 15px; color: #111827; font-weight: 500; margin: 0;">5+ Years</p>
            </div>
            <div>
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; margin: 0 0 4px 0; font-weight: 600;">Joined Date</p>
              <p style="font-size: 15px; color: #111827; font-weight: 500; margin: 0;">March 2021</p>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; margin: 0 0 12px 0;">Performance Metrics <span style="font-size: 11px; text-transform: none; color: #9CA3AF; margin-left: 8px;">(Last 12 Months)</span></h4>
          <div style="display: flex; gap: 12px;">
            <div style="flex: 1; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; text-align: center; background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
              <p style="font-size: 28px; font-weight: 700; color: #0F8A5F; margin: 0;">142</p>
              <p style="font-size: 12px; color: #6B7280; margin: 4px 0 0 0; font-weight: 500;">Opportunities<br>Posted</p>
            </div>
            <div style="flex: 1; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; text-align: center; background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
              <p style="font-size: 28px; font-weight: 700; color: #0F8A5F; margin: 0;">85%</p>
              <p style="font-size: 12px; color: #6B7280; margin: 4px 0 0 0; font-weight: 500;">Offer<br>Acceptance</p>
            </div>
            <div style="flex: 1; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; text-align: center; background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
              <p style="font-size: 28px; font-weight: 700; color: #0F8A5F; margin: 0;">4.9</p>
              <p style="font-size: 12px; color: #6B7280; margin: 4px 0 0 0; font-weight: 500;">Candidate<br>Rating</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
});

window.showMyProfile = function() {
  const overlay = document.getElementById("profileOverlay");
  if (overlay) overlay.classList.add("show");
  const menu = document.getElementById('profileMenu');
  if (menu) menu.classList.remove('show');
}

window.closeMyProfile = function() {
  const overlay = document.getElementById("profileOverlay");
  if (overlay) overlay.classList.remove("show");
}
