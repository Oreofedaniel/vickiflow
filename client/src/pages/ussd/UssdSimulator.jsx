import { useUssdSession } from './useUssdSession';
import UssdPhoneFrame from './UssdPhoneFrame';
import SmsCard from './SmsCard';
import MainMenu from './screens/MainMenu';
import Registration from './screens/Registration';
import VitalsRouter from './screens/VitalsRouter';
import HypertensionFlow from './screens/HypertensionFlow';
import DiabetesFlow from './screens/DiabetesFlow';
import AsthmaFlow from './screens/AsthmaFlow';
import PepticUlcerFlow from './screens/PepticUlcerFlow';
import CheckLastResult from './screens/CheckLastResult';
import FindHospital from './screens/FindHospital';
import MedicationReminder from './screens/MedicationReminder';
import EmergencyScreen from './screens/EmergencyScreen';
import MedicationCheck from './shared/MedicationCheck';
import ReadingConfirm from './shared/ReadingConfirm';
import Processing from './shared/Processing';
import './ussd.css';

const MAIN_MENU_STAGES = ['DIAL', 'MAIN_MENU', 'NOT_REGISTERED', 'INFO_VISIT_WEB', 'EXIT'];
const REG_STAGES = ['REG_R1', 'REG_R2', 'REG_R3', 'REG_R3B', 'REG_R4', 'REG_R5', 'REG_R6', 'REG_R7'];
const HYP_STAGES = ['HYP_1_2', 'HYP_1_3', 'HYP_1_4'];
const DIA_STAGES = ['DIA_1_2B', 'DIA_1_3B', 'DIA_1_4B'];
const ASTHMA_STAGES = ['ASTHMA_1_2C', 'ASTHMA_1_3C'];
const HOSPITAL_STAGES = ['HOSPITAL_3_1', 'HOSPITAL_3_2', 'HOSPITAL_3_3', 'HOSPITAL_3_4', 'HOSPITAL_3_5'];
const REMINDER_STAGES = ['REMINDER_4_1', 'REMINDER_4_2', 'REMINDER_4_3', 'REMINDER_4_4', 'REMINDER_4_5', 'REMINDER_4_6'];

export default function UssdSimulator() {
  const {
    stage, session, smsInbox, canGoBack,
    goTo, goBack, updateSession, updateVitalsDraft, resetVitalsDraft, pushSms, startNewSession,
    lookupPhone, registerPatient, logVitals, getVitalsHistory, setReminderTime,
  } = useUssdSession();

  const actions = {
    goTo, goBack, updateSession, updateVitalsDraft, resetVitalsDraft, pushSms, startNewSession,
    lookupPhone, registerPatient, logVitals, getVitalsHistory, setReminderTime,
  };

  const renderScreen = () => {
    if (MAIN_MENU_STAGES.includes(stage)) return <MainMenu stage={stage} session={session} actions={actions} />;
    if (REG_STAGES.includes(stage)) return <Registration stage={stage} session={session} actions={actions} />;
    if (stage === 'VITALS_1_1') return <VitalsRouter session={session} actions={actions} />;
    if (HYP_STAGES.includes(stage)) return <HypertensionFlow stage={stage} session={session} actions={actions} />;
    if (DIA_STAGES.includes(stage)) return <DiabetesFlow stage={stage} session={session} actions={actions} />;
    if (ASTHMA_STAGES.includes(stage)) return <AsthmaFlow stage={stage} session={session} actions={actions} />;
    if (stage === 'PEPTIC_1') return <PepticUlcerFlow session={session} actions={actions} />;
    if (stage === 'MED_CHECK') return <MedicationCheck session={session} actions={actions} />;
    if (stage === 'CONFIRM_1_6') return <ReadingConfirm session={session} actions={actions} />;
    if (stage === 'PROCESSING_1_7') return <Processing session={session} actions={actions} />;
    if (stage === 'CHECK_2_1') return <CheckLastResult session={session} actions={actions} />;
    if (HOSPITAL_STAGES.includes(stage)) return <FindHospital stage={stage} session={session} actions={actions} />;
    if (REMINDER_STAGES.includes(stage)) return <MedicationReminder stage={stage} session={session} actions={actions} />;
    if (stage === 'EMERGENCY') return <EmergencyScreen session={session} actions={actions} />;
    return <div>Unknown stage: {stage}</div>;
  };

  return (
    <div className="card">
      <h2>VickiFlow USSD Demo</h2>
      <p className="subtitle">Simulates the *384*8425# feature-phone flow — no internet or smartphone needed on the patient's side.</p>
      <div className="ussd-page">
        <UssdPhoneFrame onEmergency={() => goTo('EMERGENCY')} onBack={goBack} canGoBack={canGoBack}>
          {renderScreen()}
        </UssdPhoneFrame>
        <div className="ussd-sms-panel">
          <h3>📩 SMS Inbox (simulated)</h3>
          {smsInbox.length === 0 ? (
            <p className="ussd-empty-inbox">No messages yet — SMS results will appear here as the session progresses.</p>
          ) : (
            smsInbox.map((card) => <SmsCard key={card.id} card={card} />)
          )}
        </div>
      </div>
    </div>
  );
}
