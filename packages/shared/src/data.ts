import type { Course, DiaryEntry, DiaryFlags, Kid, MenuDay, Notice, PayStatus, Payer, SchoolBilling, SectionId } from './types';

/** Tutti i dati di questo file sono inventati: nessun DB, nessuna persona reale. */
export const SCHOOL = {
  name: 'Asilo infantile G.B. Vadone',
  short: 'Asilo G.B. Vadone',
  city: 'Quiliano (SV)'
};

export const DEMO_DATE = 'Venerdì 2 ottobre 2026';
export const DEMO_DATE_SHORT = '2 ott';

export const SECTIONS: Record<SectionId, { name: string; tag: string; desc: string; capacity: number; educatrici: number; retta: number }> = {
  farm: { name: 'Farm', tag: 'Sezione primavera', desc: 'Bambini sotto i 3 anni', capacity: 6, educatrici: 2, retta: 420 },
  jungle: { name: 'Jungle', tag: '3 anni', desc: "Scuola dell'infanzia", capacity: 7, educatrici: 1, retta: 380 },
  ocean: { name: 'Ocean', tag: '4-6 anni', desc: "Scuola dell'infanzia", capacity: 6, educatrici: 1, retta: 380 }
};
export const SECTION_IDS: SectionId[] = ['farm', 'jungle', 'ocean'];

export const INITIAL_KIDS: Kid[] = [
  { id: 1, sec: 'farm', name: 'Sofia Ricci', eta: '2 anni', nota: 'Nessuna nota', contatto: 'Mamma · 340 000 0001', delega: 'Nonna Maria', present: true, ingresso: '07:50' },
  { id: 2, sec: 'farm', name: 'Leonardo Bianchi', eta: '2 anni', nota: 'Allergia: latticini', contatto: 'Papà · 340 000 0002', delega: 'Zia Elena', present: true, ingresso: '08:25' },
  { id: 3, sec: 'farm', name: 'Giulia Conti', eta: '2 anni', nota: 'Nessuna nota', contatto: 'Mamma · 340 000 0003', delega: 'Nonno Piero', present: true, ingresso: '08:40' },
  { id: 4, sec: 'farm', name: 'Aurora Greco', eta: '2 anni', nota: 'Nessuna nota', contatto: 'Papà · 340 000 0004', delega: 'Nonna Rosa', present: false, ingresso: '—' },
  { id: 5, sec: 'farm', name: 'Tommaso Russo', eta: '2 anni', nota: 'Nessuna nota', contatto: 'Mamma · 340 000 0005', delega: 'Zio Marco', present: true, ingresso: '09:00' },
  { id: 6, sec: 'jungle', name: 'Mattia Ferrari', eta: '3 anni', nota: 'Menù senza glutine', contatto: 'Mamma · 340 000 0006', delega: 'Nonna Lidia', present: false, ingresso: '—' },
  { id: 7, sec: 'jungle', name: 'Emma Marino', eta: '3 anni', nota: 'Allergia: uova', contatto: 'Papà · 340 000 0007', delega: 'Nonno Carlo', present: true, ingresso: '08:10' },
  { id: 8, sec: 'jungle', name: 'Lorenzo Gallo', eta: '3 anni', nota: 'Nessuna nota', contatto: 'Mamma · 340 000 0008', delega: 'Zia Paola', present: true, ingresso: '08:30' },
  { id: 9, sec: 'jungle', name: 'Ginevra Costa', eta: '3 anni', nota: 'Nessuna nota', contatto: 'Mamma · 340 000 0009', delega: 'Nonna Anna', present: true, ingresso: '07:45' },
  { id: 10, sec: 'jungle', name: 'Edoardo Fontana', eta: '3 anni', nota: 'Nessuna nota', contatto: 'Papà · 340 000 0010', delega: 'Nonno Livio', present: true, ingresso: '08:50' },
  { id: 11, sec: 'ocean', name: 'Matilde Villa', eta: '5 anni', nota: 'Nessuna nota', contatto: 'Mamma · 340 000 0011', delega: 'Zio Franco', present: true, ingresso: '08:05' },
  { id: 12, sec: 'ocean', name: 'Pietro Serra', eta: '4 anni', nota: 'Nessuna nota', contatto: 'Papà · 340 000 0012', delega: 'Nonna Gina', present: true, ingresso: '08:20' },
  { id: 13, sec: 'ocean', name: 'Alice Barbieri', eta: '6 anni', nota: 'Allergia: frutta secca', contatto: 'Mamma · 340 000 0013', delega: 'Nonno Aldo', present: true, ingresso: '07:35' },
  { id: 14, sec: 'ocean', name: 'Diego Lombardi', eta: '5 anni', nota: 'Nessuna nota', contatto: 'Papà · 340 000 0014', delega: 'Zia Silvia', present: false, ingresso: '—' },
  { id: 15, sec: 'ocean', name: 'Chiara Moretti', eta: '4 anni', nota: 'Nessuna nota', contatto: 'Mamma · 340 000 0015', delega: 'Nonna Carla', present: true, ingresso: '08:35' }
];

/** Stato retta di ottobre per bambino (id → stato). */
export const INITIAL_PAY: Record<number, PayStatus> = {
  1: 'wait', 2: 'wait', 3: 'paid', 4: 'wait', 5: 'paid', 6: 'late', 7: 'paid', 8: 'paid', 9: 'wait', 10: 'paid', 11: 'paid', 12: 'wait', 13: 'paid', 14: 'late', 15: 'paid'
};

/** Assenze già segnalate per lunedì 5 ottobre (id → true). */
export const INITIAL_ABSENCES_MON: Record<number, boolean> = { 4: true, 9: true };

export const INITIAL_NOTICES: Notice[] = [
  { id: 1, title: 'Colloqui di ottobre', target: 'Tutti', date: '1 ott', body: "Sono aperte le prenotazioni per i colloqui con le insegnanti. Scegli lo slot dall'app: ti arriverà una conferma.", action: 'Prenota uno slot', doneLabel: 'Slot prenotato', fresh: true },
  { id: 2, title: 'Giornata al maneggio', target: 'Tutti', date: '29 set', body: 'I bambini passeranno una giornata al maneggio a conoscere i cavalli. Serve il modulo di autorizzazione firmato entro il 9 ottobre.', action: 'Autorizzo la partecipazione', doneLabel: 'Autorizzazione inviata' },
  { id: 3, title: 'Laboratorio di cucina', target: 'Ocean', date: '25 set', body: 'Mercoledì prepariamo i biscotti: portate un grembiulino da casa.' },
  { id: 4, title: 'Retta di ottobre', target: 'Tutti', date: '24 set', body: 'La retta di ottobre scade il 10 ottobre. Trovi importo e avviso di pagamento nella sezione Rette.' }
];

export const MENU_WEEK: MenuDay[] = [
  { name: 'Lunedì', primo: 'Pasta al ragù', secondo: 'Frittata al forno', contorno: 'Insalata' },
  { name: 'Martedì', primo: 'Pasta al pesto', secondo: 'Cosce di pollo', contorno: 'Fagiolini' },
  { name: 'Mercoledì', primo: 'Risotto allo zafferano', secondo: 'Polpette di carne', contorno: 'Zucchine' },
  { name: 'Giovedì', primo: 'Minestrina', secondo: 'Merluzzo al forno', contorno: 'Patate' },
  { name: 'Venerdì', primo: 'Pasta al pomodoro', secondo: 'Polpette di carne', contorno: 'Zucchine' }
];

export const SCHEDULE = [
  { when: '7:30 – 9:00', what: 'Ingresso e accoglienza' },
  { when: 'Mattina', what: 'Inglese, laboratori e orto didattico' },
  { when: 'Pranzo', what: 'Cucina interna, pasti cucinati al momento' },
  { when: 'Pomeriggio', what: 'Riposo e giochi in giardino' },
  { when: '15:45 – 16:30', what: 'Uscita' }
];

/** Diario della giornata di Sofia (visto dai genitori, scritto dalle maestre). */
export const INITIAL_DIARY: Record<number, DiaryEntry[]> = {
  1: [
    { time: '07:50', text: 'Accoglienza e gioco libero' },
    { time: '10:00', text: 'Gioco lezione in inglese e laboratorio di colori' },
    { time: '11:45', text: 'Pranzo: pasta al pomodoro, ha mangiato tutto' },
    { time: '13:00', text: 'Riposo fino alle 15:00' }
  ]
};

/** Spunte Cacca / Nanna di oggi (i bambini non presenti qui partono senza spunte). */
export const INITIAL_DIARY_FLAGS: Record<number, DiaryFlags> = {
  1: { cacca: true, nanna: true }
};

export const NO_DIARY_FLAGS: DiaryFlags = { cacca: false, nanna: false };

export const TEACHER_NOTE_SOFIA = 'Oggi Sofia ha disegnato il mare con i colori a dita ed è stata molto contenta in giardino.';

/** Famiglia usata come "utente" nella demo dell'app genitori. */
export const DEMO_CHILD_ID = 1;

export const MEAL_COST_DEFAULT = '4,50';
export const COSTI_DEFAULT = { personale: '3600', cucina: '900', altri: '800' };

/** Listino corsi di esempio: prezzo = canone mensile, hours = ore a settimana. */
export const INITIAL_COURSES: Course[] = [
  { id: 1, name: 'Corso di Inglese', price: 40, hours: 2, desc: 'Martedì e giovedì, 10:00–11:00' },
  { id: 2, name: 'Musica', price: 30, hours: 1, desc: 'Mercoledì, 10:30–11:30' },
  { id: 3, name: 'Piscina', price: 45, hours: 1, desc: 'Venerdì mattina, con accompagnamento' },
  { id: 4, name: 'Maneggio', price: 50, hours: 1.5, desc: 'Lunedì pomeriggio, dai 4 anni' }
];

/** Corsi assegnati a ogni bambino (id bambino → id corsi). */
export const INITIAL_ENROLLMENTS: Record<number, number[]> = {
  1: [2], 2: [1, 2], 3: [], 4: [1], 5: [2],
  6: [1], 7: [1, 2], 8: [], 9: [3], 10: [1, 3],
  11: [1, 3, 4], 12: [4], 13: [1, 2, 4], 14: [], 15: [1, 3]
};

const PAYER_NAMES: Record<number, string> = {
  1: 'Laura Ricci', 2: 'Marco Bianchi', 3: 'Francesca Conti', 4: 'Andrea Greco', 5: 'Silvia Russo',
  6: 'Elena Ferrari', 7: 'Davide Marino', 8: 'Chiara Gallo', 9: 'Valentina Costa', 10: 'Stefano Fontana',
  11: 'Martina Villa', 12: 'Luca Serra', 13: 'Giorgia Barbieri', 14: 'Paolo Lombardi', 15: 'Sara Moretti'
};
const STREETS = ['Via Roma', 'Via Aurelia', 'Via Valletta', 'Corso Italia', 'Via Garibaldi'];

/** Intestatari di esempio (codici fiscali inventati, non validi). */
export const INITIAL_PAYERS: Record<number, Payer> = Object.fromEntries(
  Object.entries(PAYER_NAMES).map(([id, name]) => {
    const n = Number(id);
    const [first, last] = name.toUpperCase().split(' ');
    const cf = (last.slice(0, 3) + first.slice(0, 3) + '85A01Z' + String(100 + n).slice(-3) + 'X').padEnd(16, 'X').slice(0, 16);
    return [n, {
      name, cf,
      address: `${STREETS[n % STREETS.length]} ${n * 3 + 1}`,
      cap: n % 3 === 0 ? '17100' : '17047',
      city: n % 3 === 0 ? 'Savona' : 'Quiliano',
      prov: 'SV',
      email: `famiglia${n}@esempio.it`
    }];
  })
);

/** Dati fiscali di esempio dell'asilo (da sostituire con quelli veri). */
export const SCHOOL_BILLING_DEFAULT: SchoolBilling = {
  ragioneSociale: 'Asilo infantile G.B. Vadone',
  piva: '01234567890',
  cf: '01234567890',
  address: 'Via Esempio 1',
  cap: '17047',
  city: 'Quiliano',
  prov: 'SV',
  iban: 'IT60X0542811101000000123456',
  dueDay: 10,
  bolloToFamily: true
};
