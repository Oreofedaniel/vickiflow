export default function UssdPhoneFrame({ onEmergency, onBack, canGoBack, children }) {
  return (
    <div className="ussd-phone">
      <div className="ussd-phone-header">
        <span className="ussd-dial">*384*8425#</span>
        <button className="ussd-emergency-btn" onClick={onEmergency} title="Emergency shortcut — works from any screen">
          🚨 999
        </button>
      </div>
      <div className="ussd-phone-screen">{children}</div>
      <div className="ussd-phone-footer">
        {canGoBack && (
          <button className="ussd-back-btn" onClick={onBack}>
            🔙 Back
          </button>
        )}
      </div>
    </div>
  );
}
