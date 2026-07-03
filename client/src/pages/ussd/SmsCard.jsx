export default function SmsCard({ card }) {
  const toneClass = { Red: 'sms-red', Yellow: 'sms-yellow', Green: 'sms-green', info: 'sms-info' }[card.tone] || 'sms-info';
  return (
    <div className={`sms-card ${toneClass}`}>
      <div className="sms-card-title">{card.title}</div>
      <div className="sms-card-body">{card.body}</div>
      <div className="sms-card-time">{card.receivedAt.toLocaleTimeString()}</div>
    </div>
  );
}
