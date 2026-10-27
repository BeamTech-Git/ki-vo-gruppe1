/* ══════════════════════════════════════════════════════════════════════
   Martins KI-Check – Daten (Quellenstand 27.10.2026)
   Thema: Die KI-VO und ihre „Lücken“ – welche Bauanleitungen gibt es schon?
   Story: „Martin und die Bewerber-KI“
   Bauplan = KI-VO (WAS) · Bauanleitungen = Leitlinien, Normen, Vorlagen (WIE)
   Jeder Eintrag: großer Text für alle · ref = genaue Fundstelle (klein)
══════════════════════════════════════════════════════════════════════ */

const QUELLENSTAND = '27.10.2026';
const KIVO_URL = 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj';

/* ── Ampel ───────────────────────────────────────────────────────────── */
const STATUS = {
    ok:  { emoji: '🟢', label: 'Fertig' },
    wip: { emoji: '🟡', label: 'In Arbeit' },
    off: { emoji: '🔴', label: 'Fehlt' }
};

/* ── Kapitel 1: Entscheidungsbaum (2 Fragen) ─────────────────────────── */
const BAUM = {
    q1: {
        nr: 1,
        frage: 'Steht der Einsatz auf der Hochrisiko-Liste des Gesetzes?',
        hilfe: 'Das Gesetz zählt in einer Liste auf, welche Einsätze besonders riskant sind.',
        ref: 'Art. 6 Abs. 2 i. V. m. Anhang III KI-VO',
        beispiel: 'yes',
        yes: { text: 'Ja. Wer Bewerber auswählt, ist ausdrücklich genannt.', ref: 'Art. 6 Abs. 2 i. V. m. Anhang III Nr. 4 lit. a KI-VO', next: 'q2' },
        no:  { text: 'Nein. Dann keine Hochrisiko-KI – sofern sie auch nicht Teil eines regulierten Produkts ist (z. B. Medizinprodukt).', ref: 'Art. 6 Abs. 1, 2 KI-VO i. V. m. Anhang I, III', next: 'safe' }
    },
    q2: {
        nr: 2,
        frage: 'Greift eine Ausnahme?',
        hilfe: 'Eine Ausnahme gibt es nur, wenn die KI die Entscheidung nicht wesentlich beeinflusst.',
        ref: 'Art. 6 Abs. 3 KI-VO',
        beispiel: 'no',
        yes: { text: 'Ja. Dann keine Hochrisiko-KI – Martin muss das aber dokumentieren.', ref: 'Art. 6 Abs. 3, 4 KI-VO', next: 'safe' },
        no:  { text: 'Nein. TalentMatch bewertet Menschen – das ist Profiling. Dafür gibt es nie eine Ausnahme.', ref: 'Art. 6 Abs. 3 UAbs. 3 KI-VO', next: 'hr' }
    }
};

const ERGEBNIS = {
    hr: {
        titel: 'Hochrisiko-KI',
        satz: 'TalentMatch darf eingesetzt werden – aber nur mit strengen Pflichten.',
        ref: 'Art. 6 Abs. 2 KI-VO · Anforderungen ab Art. 8 KI-VO',
        anleitung: {
            status: 'wip',
            text: 'Wie man das genau prüft, soll eine Leitlinie der Kommission erklären. Fällig war sie bis 2.2.2026 – bisher gibt es nur einen Entwurf (19.5.2026).',
            begriff: 'Leitlinie = Erklärhilfe der Kommission, nicht verbindlich.',
            ref: 'Art. 6 Abs. 5 KI-VO',
            karte: 3
        },
        kern: 'Bei Martin ist der Fall eindeutig – für Grenzfälle fehlt die offizielle Anleitung noch.'
    },
    safe: {
        titel: 'Keine Hochrisiko-KI',
        satz: 'Die strengen Pflichten gelten nicht. Bei TalentMatch ist das nicht der Fall.',
        ref: 'ggf. Transparenzpflichten nach Art. 50 KI-VO'
    }
};

/* ── Kapitel 2: Fünf Pflichten des Anbieters ─────────────────────────── */
const ANBIETER = {
    satz: 'Weil BeamTech die KI selbst baut, ist es Anbieter – mit den strengsten Pflichten.',
    ref: 'Art. 3 Nr. 3, Art. 16 KI-VO'
};

const PFLICHTEN = [
    { id: 'p1', icon: 'fa-scale-balanced', titel: 'Risiken erkennen und senken', beispiel: 'Benachteiligt die KI Frauen?',
      status: 'wip', anleitung: 'Entwurf', ref: 'Art. 9 KI-VO', karte: 4,
      text: ['Martin muss die Risiken von TalentMatch über die gesamte Nutzungsdauer ermitteln, bewerten und senken.', 'Eine passende Norm (prEN 18228) liegt erst als Entwurf vor.'] },
    { id: 'p2', icon: 'fa-database', titel: 'Faire, gute Daten', beispiel: 'Trainingsdaten nicht nur von Männern',
      status: 'wip', anleitung: 'In Arbeit', ref: 'Art. 10 KI-VO', karte: 4,
      text: ['Die Trainingsdaten müssen zum Zweck passen, möglichst vollständig und fehlerfrei sein.', 'Sie müssen auf mögliche Verzerrungen geprüft werden.'] },
    { id: 'p3', icon: 'fa-file-lines', titel: 'Alles dokumentieren und aufzeichnen', beispiel: 'Jede Absage ist nachvollziehbar',
      status: 'wip', anleitung: 'In Arbeit', ref: 'Art. 11, 12 KI-VO', karte: 4,
      text: ['Vor dem Start braucht TalentMatch eine technische Dokumentation.', 'Außerdem muss die KI ihre Vorgänge automatisch protokollieren.'] },
    { id: 'p4', icon: 'fa-user-check', titel: 'Ein Mensch hat das letzte Wort', beispiel: 'HR kann jede Einstufung überstimmen',
      status: 'wip', anleitung: 'In Arbeit', ref: 'Art. 14 KI-VO', karte: 4,
      text: ['TalentMatch muss so gebaut sein, dass Menschen es wirksam beaufsichtigen können.', 'Sie müssen das Ergebnis übergehen und die KI anhalten können.'] },
    { id: 'p5', icon: 'fa-list-check', titel: 'Qualitäts­management', beispiel: 'Feste Abläufe und Verantwortliche',
      status: 'ok', anleitung: 'Fertig: EN 18286', ref: 'Art. 17 KI-VO', karte: 1,
      text: ['BeamTech braucht ein dokumentiertes System mit festen Abläufen und Zuständigkeiten.', 'Dafür gibt es seit 14.10.2026 die erste fertige Norm: EN 18286.'] }
];

const FACHBEGRIFF = {
    wort: 'Harmonisierte Norm',
    satz: 'Wer sie einhält, bei dem wird vermutet, dass er die Pflicht erfüllt.',
    ref: 'Art. 40 Abs. 1 KI-VO · für Art. 17 seit Fundstelle im Amtsblatt am 14.10.2026'
};

const KERN_PFLICHTEN = 'Martin weiß, WAS er tun muss – ein fertiges WIE gibt es bisher nur für 1 von 5 Pflichten.';

/* ── Kapitel 3: Martins Werkzeugkiste (5 Bauanleitungen) ───────────────── */
const KARTEN = [
    { nr: 1, status: 'ok', icon: 'fa-list-check',
      titel: 'Norm Qualitätsmanagement',
      satz: 'Die einzige fertige Norm: Aufbau eines Qualitätssystems.',
      ref: 'EN 18286:2026 · Art. 40, 17 KI-VO',
      refModal: 'EN 18286:2026 · Art. 40 Abs. 1, Art. 17 KI-VO · Durchführungsbeschluss (EU) 2026/2274',
      modal: ['Seit 14.10.2026 im Amtsblatt der EU veröffentlicht.',
              'Wer sie einhält, bei dem wird vermutet, dass sein Qualitätssystem Art. 17 erfüllt.',
              'Sie baut auf bekannten Standards auf (ISO/IEC 42001, ISO 9001).'],
      quelle: { label: 'EUR-Lex – Durchführungsbeschluss (EU) 2026/2274', url: 'https://eur-lex.europa.eu/eli/dec_impl/2026/2274/oj' } },
    { nr: 3, status: 'wip', icon: 'fa-compass',
      titel: 'Leitlinie Einstufung',
      satz: 'Entwurf mit Beispielen: Wann ist KI Hochrisiko?',
      ref: 'Art. 6 Abs. 5 KI-VO · Entwurf 19.5.2026',
      modal: ['Fällig war sie bis 2.2.2026 – die Frist ist verpasst.',
              'Der Entwurf stellt klar: Die Ausnahme ist eng auszulegen und greift bei Profiling nie.',
              'Die Endfassung wird etwa zum Jahresende erwartet.'],
      quelle: { label: 'Osborne Clarke – Entwurf der Leitlinien zur Hochrisiko-Einstufung', url: 'https://www.osborneclarke.com/insights/european-commission-publishes-draft-ai-act-guidelines-high-risk-classification-and' } },
    { nr: 4, status: 'wip', icon: 'fa-gears',
      titel: 'Weitere Normen',
      satz: 'Für Risiken, Daten, Protokolle und Genauigkeit.',
      ref: 'Art. 40 KI-VO · u. a. prEN 18228',
      modal: ['Europäische Normungsgremien arbeiten an Normen zu den übrigen Pflichten.',
              'Laut Fachquellen wurden einzelne Entwürfe in der Abstimmung abgelehnt.',
              'Bis dahin muss Martin selbst begründen, dass er die Pflichten erfüllt.'],
      quelle: { label: 'kla.digital – JTC 21 Standards Tracker', url: 'https://kla.digital/blog/jtc-21-standards-tracker' } },
    { nr: 5, status: 'off', icon: 'fa-book-open',
      titel: 'Erklärung der Pflichten',
      satz: 'Offizielle Erklärung, wie man die Pflichten konkret erfüllt.',
      ref: 'Art. 96 Abs. 1 lit. a KI-VO',
      modal: ['Die Kommission soll in Leitlinien erklären, wie die Anforderungen anzuwenden sind.',
              'Angekündigt, aber bis 27.10.2026 nicht veröffentlicht.',
              'Das Gesetz setzt dafür keine Frist.'],
      quelle: { label: 'regulation-ai.eu – Art. 96', url: 'https://www.regulation-ai.eu/en/articles/article-96/' } },
    { nr: 6, status: 'off', icon: 'fa-binoculars',
      titel: 'Vorlage Überwachung',
      satz: 'Kommt nur noch als Leitlinie, geplant bis 2.9.2027.',
      ref: 'Art. 72 Abs. 3 KI-VO n. F.',
      modal: ['Ursprünglich sollte bis 2.2.2026 eine verbindliche Vorlage kommen – das ist nie passiert.',
              'Der Digital Omnibus macht daraus eine unverbindliche Leitlinie (Frist 2.9.2027 laut Fachquelle).',
              'Für Martin heißt das: weniger Rechtssicherheit.'],
      quelle: { label: 'Modulos Docs – Post-market monitoring', url: 'https://docs.modulos.ai/frameworks/eu-ai-act/post-market-monitoring' } }
];

/* Keine Bauanleitung, sondern eine Änderung des Gesetzes selbst */
const GESETZ = {
    label: 'Gesetz geändert', icon: 'fa-hourglass-half',
    titel: 'Mehr Zeit',
    satz: 'Martins Pflichten gelten erst ab 2.12.2027 statt 2.8.2026.',
    ref: 'Digital Omnibus · VO (EU) 2026/1744',
    modal: ['In Kraft seit 27.7.2026.',
            'Hochrisiko-Pflichten gelten für Anhang III ab 2.12.2027, für Anhang I ab 2.8.2028.',
            'Keine Bauanleitung, sondern eine Änderung des Gesetzes selbst.'],
    quelle: { label: 'EUR-Lex – Verordnung (EU) 2026/1744', url: 'https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng' }
};

const SCHLUSS = {
    kern: 'Martin hat den Bauplan – aber nur wenige fertige Bauanleitungen. Dafür hat er mehr Zeit bekommen.',
    merksaetze: [
        { status: 'ok',  text: 'Fertig: erst 1 harmonisierte Norm (Qualitätsmanagement).' },
        { status: 'wip', text: 'In Arbeit: Leitlinie zur Einstufung und weitere Normen.' },
        { status: 'off', text: 'Fehlt: offizielle Erklärung der Pflichten und Vorlage zur Überwachung.' }
    ],
    frage: 'Reicht „mehr Zeit“, wenn die Bauanleitungen fehlen?'
};