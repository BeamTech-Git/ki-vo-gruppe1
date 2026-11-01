/* ══════════════════════════════════════════════════════════════════════
   Martins KI-Check: Daten
   Thema: Die KI-VO und ihre „Lücken“. Welche Bauanleitungen gibt es schon?
   Story: „Martin und die Bewerber-KI“
   Bauplan = KI-VO (WAS) · Bauanleitungen = Leitlinien, Normen, Vorlagen (WIE)
   Jeder Eintrag: großer Text für alle · ref = genaue Fundstelle (klein)
══════════════════════════════════════════════════════════════════════ */

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
        wortlaut: 'anh3',
        beispiel: 'yes',
        yes: { text: 'Ja. KI, die Bewerbungen sichtet, filtert oder bewertet, ist ausdrücklich genannt.', ref: 'Art. 6 Abs. 2 i. V. m. Anhang III Nr. 4 lit. a KI-VO', wortlaut: 'anh3', next: 'q2' },
        no:  { text: 'Nein. Dann keine Hochrisiko-KI, sofern sie auch nicht Teil eines regulierten Produkts ist (z. B. Medizinprodukt).', ref: 'Art. 6 Abs. 1, 2 KI-VO i. V. m. Anhang I, III', next: 'safe' }
    },
    q2: {
        nr: 2,
        frage: 'Greift eine Ausnahme?',
        hilfe: 'Eine Ausnahme gibt es nur, wenn die KI die Entscheidung nicht wesentlich beeinflusst.',
        ref: 'Art. 6 Abs. 3 KI-VO',
        wortlaut: 'art6_3',
        beispiel: 'no',
        yes: { text: 'Ja. Dann keine Hochrisiko-KI. Martin muss das aber dokumentieren.', ref: 'Art. 6 Abs. 3, 4 KI-VO', next: 'safe' },
        no:  { text: 'Nein. TalentMatch bewertet Menschen. Das ist Profiling, und dann ist die KI immer Hochrisiko.', ref: 'Art. 6 Abs. 3 UAbs. 3 KI-VO i. V. m. Art. 4 Nr. 4 DSGVO', wortlaut: 'art6_3', next: 'hr' }
    }
};

const ERGEBNIS = {
    hr: {
        titel: 'Hochrisiko-KI',
        satz: 'TalentMatch darf eingesetzt werden, aber nur mit strengen Pflichten.',
        ref: 'Art. 6 Abs. 2 KI-VO · Anforderungen ab Art. 8 KI-VO',
        anleitung: {
            status: 'wip',
            text: 'Wie man das genau prüft, soll eine Leitlinie der Kommission erklären. Fällig war sie bis 2.2.2026. Bisher gibt es nur einen Entwurf (19.5.2026).',
            begriff: 'Leitlinie = Erklärhilfe der Kommission, nicht verbindlich.',
            ref: 'Art. 6 Abs. 5 KI-VO',
            wortlaut: 'art6_5',
            karte: 3
        },
        kern: 'Grenzfälle?'
    },
    safe: {
        titel: 'Keine Hochrisiko-KI',
        satz: 'Die strengen Pflichten gelten nicht. Bei TalentMatch ist das nicht der Fall.',
        ref: 'ggf. Transparenzpflichten nach Art. 50 KI-VO'
    }
};

/* ── Kapitel 2: Fünf Pflichten des Anbieters ─────────────────────────── */
const ANBIETER = {
    satz: 'Weil BeamTech die KI selbst entwickelt und selbst in Betrieb nimmt, ist es Anbieter und trägt die Hauptpflichten.',
    ref: 'Art. 3 Nr. 3, Art. 16 KI-VO'
};

const PFLICHTEN = [
    { id: 'p1', icon: 'fa-scale-balanced', titel: 'Risiken erkennen und senken', beispiel: 'Benachteiligt die KI Frauen?',
      status: 'wip', anleitung: 'In Arbeit', ref: 'Art. 9 KI-VO', wortlaut: 'art9', karte: 4,
      text: ['Martin muss die Risiken von TalentMatch über die gesamte Nutzungsdauer ermitteln, bewerten und senken.', 'Eine passende Norm (prEN 18228) liegt erst als Entwurf vor.'] },
    { id: 'p2', icon: 'fa-database', titel: 'Faire, gute Daten', beispiel: 'Trainingsdaten nicht nur von Männern',
      status: 'wip', anleitung: 'In Arbeit', ref: 'Art. 10 KI-VO', wortlaut: 'art10', karte: 4,
      text: ['Die Trainingsdaten müssen relevant, repräsentativ und möglichst fehlerfrei und vollständig sein.', 'Sie müssen auf mögliche Verzerrungen geprüft werden.'] },
    { id: 'p3', icon: 'fa-file-lines', titel: 'Dokumentieren und protokollieren', beispiel: 'Später nachvollziehen, wie die KI gearbeitet hat',
      status: 'wip', anleitung: 'In Arbeit', ref: 'Art. 11, 12 KI-VO', wortlaut: 'art11_12', karte: 4,
      text: ['Vor dem Start braucht TalentMatch eine technische Dokumentation.', 'Außerdem muss die KI ihre Vorgänge automatisch protokollieren.'] },
    { id: 'p4', icon: 'fa-user-check', titel: 'Ein Mensch hat das letzte Wort', beispiel: 'HR kann jede Einstufung überstimmen',
      status: 'wip', anleitung: 'In Arbeit', ref: 'Art. 14 KI-VO', wortlaut: 'art14', karte: 4,
      text: ['TalentMatch muss so gebaut sein, dass Menschen es wirksam beaufsichtigen können.', 'Sie müssen das Ergebnis übergehen und die KI anhalten können.'] },
    { id: 'p5', icon: 'fa-list-check', titel: 'Qualitäts­management', beispiel: 'Feste Abläufe und Verantwortliche',
      status: 'ok', anleitung: 'Fertig: EN 18286', ref: 'Art. 17 KI-VO', wortlaut: 'art17', karte: 1,
      text: ['BeamTech braucht ein dokumentiertes System mit festen Abläufen und Zuständigkeiten.', 'Dafür gibt es seit 14.10.2026 die erste fertige Norm: EN 18286.'] }
];

const FACHBEGRIFF = {
    wort: 'Harmonisierte Norm',
    satz: 'Wer sie einhält, bei dem wird vermutet, dass er die Pflicht erfüllt.',
    ref: 'Art. 40 Abs. 1 KI-VO',
    wortlaut: 'art40_1'
};

const KERN_PFLICHTEN = 'Martin weiß, WAS er tun muss. Ein fertiges WIE gibt es bisher nur für 1 von 5 Pflichten.';

/* ── Kapitel 3: Martins Werkzeugkiste (5 Bauanleitungen) ───────────────── */
const KARTEN = [
    { nr: 1, status: 'ok', icon: 'fa-list-check',
      titel: 'Norm Qualitätsmanagement',
      satz: 'Die einzige fertige Norm: Aufbau eines Qualitätssystems.',
      ref: 'EN 18286:2026 · Art. 40, 17 KI-VO',
      refModal: 'EN 18286:2026 · Art. 40 Abs. 1, Art. 17 KI-VO · Durchführungsbeschluss (EU) 2026/2274',
      modal: ['Ihre Fundstelle steht seit 14.10.2026 im Amtsblatt der EU. Die Anwendung ist freiwillig.',
              'Wer sie einhält, bei dem wird vermutet, dass sein Qualitätssystem Art. 17 erfüllt.',
              'Sie baut auf bekannten Standards auf (ISO/IEC 42001, ISO 9001).'],
      quelle: { label: 'EUR-Lex: Durchführungsbeschluss (EU) 2026/2274', url: 'https://eur-lex.europa.eu/eli/dec_impl/2026/2274/oj' } },
    { nr: 3, status: 'wip', icon: 'fa-compass',
      titel: 'Leitlinie Einstufung',
      satz: 'Entwurf mit Beispielen: Wann ist KI Hochrisiko?',
      ref: 'Art. 6 Abs. 5 KI-VO · Entwurf 19.5.2026', wortlaut: 'art6_5',
      modal: ['Fällig war sie bis 2.2.2026. Die Frist ist verpasst.',
              'Der Entwurf stellt klar: Die Ausnahme ist eng auszulegen und greift bei Profiling nie.',
              'Die Endfassung wird etwa zum Jahresende erwartet.'],
      quelle: { label: 'Osborne Clarke: Entwurf der Leitlinien zur Hochrisiko-Einstufung', url: 'https://www.osborneclarke.com/insights/european-commission-publishes-draft-ai-act-guidelines-high-risk-classification-and' } },
    { nr: 4, status: 'wip', icon: 'fa-gears',
      titel: 'Weitere Normen',
      satz: 'Für Risiken, Daten, Protokolle und Genauigkeit.',
      ref: 'Art. 40 KI-VO · u. a. prEN 18228',
      modal: ['Europäische Normungsgremien arbeiten an Normen zu den übrigen Pflichten.',
              'Laut Fachquellen wurden einzelne Entwürfe in der Abstimmung abgelehnt.',
              'Bis dahin muss Martin selbst begründen, dass er die Pflichten erfüllt.'],
      quelle: { label: 'kla.digital: JTC 21 Standards Tracker', url: 'https://kla.digital/blog/jtc-21-standards-tracker' } },
    { nr: 5, status: 'off', icon: 'fa-book-open',
      titel: 'Erklärung der Pflichten',
      satz: 'Offizielle Erklärung, wie man die Pflichten konkret erfüllt.',
      ref: 'Art. 96 Abs. 1 lit. a KI-VO',
      modal: ['Die Kommission soll in Leitlinien erklären, wie die Anforderungen anzuwenden sind.',
              'Die KI-VO verpflichtet die Kommission dazu, setzt aber keine Frist.',
              'Nach unserem Recherchestand noch nicht veröffentlicht.'],
      quelle: { label: 'regulation-ai.eu: Art. 96', url: 'https://www.regulation-ai.eu/en/articles/article-96/' } },
    { nr: 6, status: 'off', icon: 'fa-binoculars',
      titel: 'Vorlage Überwachung',
      satz: 'Kommt nur noch als Leitlinie, geplant bis 2.9.2027.',
      ref: 'Art. 72 Abs. 3 KI-VO',
      modal: ['Ursprünglich sollte bis 2.2.2026 eine verbindliche Vorlage kommen. Das ist nie passiert.',
              'Der Digital Omnibus macht daraus eine unverbindliche Leitlinie (Frist 2.9.2027 laut Fachquelle).',
              'Für Martin heißt das: weniger Rechtssicherheit.'],
      quelle: { label: 'Modulos Docs: Post-market monitoring', url: 'https://docs.modulos.ai/frameworks/eu-ai-act/post-market-monitoring' } }
];

/* Keine Bauanleitung, sondern eine Änderung des Gesetzes selbst */
const GESETZ = {
    label: 'Gesetz geändert', icon: 'fa-hourglass-half',
    titel: 'Mehr Zeit',
    satz: 'Martins Pflichten gelten erst ab 2.12.2027 statt 2.8.2026.',
    ref: 'Digital Omnibus · VO (EU) 2026/1744',
    modal: ['In Kraft seit 27.7.2026.',
            'Die strengen Pflichten gelten für Anhang III ab 2.12.2027, für Anhang I ab 2.8.2028.',
            'Keine Bauanleitung, sondern eine Änderung des Gesetzes selbst.'],
    quelle: { label: 'EUR-Lex: Verordnung (EU) 2026/1744', url: 'https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng' }
};

/* ── Gesetzestext zum Aufklappen ─────────────────────────────────────
   Wörtlich aus VO (EU) 2024/1689, ABl. L vom 12.7.2024 (praesentation/KI-VO.pdf).
   ⟦…⟧ = gelb markierte Stelle */
const WORTLAUT = {
    anh3: {
        titel: 'Art. 6 Abs. 2 i. V. m. Anhang III Nr. 4 lit. a KI-VO',
        bloecke: [
            { label: 'Art. 6 Abs. 2',
              text: 'Zusätzlich zu den in Absatz 1 genannten Hochrisiko-KI-Systemen ⟦gelten die in Anhang III genannten KI-Systeme als hochriskant⟧.' },
            { label: 'Anhang III Nr. 4 · Beschäftigung, Personalmanagement und Zugang zur Selbstständigkeit',
              text: 'a) KI-Systeme, die bestimmungsgemäß für die Einstellung oder Auswahl natürlicher Personen verwendet werden sollen, insbesondere um gezielte Stellenanzeigen zu schalten, ⟦Bewerbungen zu sichten oder zu filtern und Bewerber zu bewerten⟧;' }
        ]
    },
    art6_3: {
        titel: 'Art. 6 Abs. 3 KI-VO: Ausnahme und Profiling',
        bloecke: [
            { label: 'Art. 6 Abs. 3 UAbs. 1',
              text: 'Abweichend von Absatz 2 gilt ein in Anhang III genanntes KI-System nicht als hochriskant, wenn es kein erhebliches Risiko der Beeinträchtigung in Bezug auf die Gesundheit, Sicherheit oder Grundrechte natürlicher Personen birgt, indem es unter anderem nicht das Ergebnis der Entscheidungsfindung wesentlich beeinflusst.' },
            { label: 'Art. 6 Abs. 3 UAbs. 3',
              text: 'Ungeachtet des Unterabsatzes 1 gilt ein in Anhang III aufgeführtes KI-System ⟦immer dann als hochriskant, wenn es ein Profiling natürlicher Personen vornimmt⟧.' },
            { label: 'Art. 3 Nr. 52 · Verordnung (EU) 2016/679 = DSGVO',
              text: '„Profiling“ das Profiling im Sinne von Artikel 4 Nummer 4 der Verordnung (EU) 2016/679;' }
        ]
    },
    art6_5: {
        titel: 'Art. 6 Abs. 5 KI-VO: Leitlinien zur Einstufung',
        bloecke: [
            { label: 'Art. 6 Abs. 5',
              text: 'Die Kommission stellt nach Konsultation des Europäischen Gremiums für Künstliche Intelligenz (im Folgenden „KI-Gremium“) ⟦spätestens bis zum 2. Februar 2026 Leitlinien zur praktischen Umsetzung dieses Artikels⟧ gemäß Artikel 96 und ⟦eine umfassende Liste praktischer Beispiele⟧ für Anwendungsfälle für KI-Systeme, die hochriskant oder nicht hochriskant sind, bereit.' }
        ]
    },
    art9: {
        titel: 'Art. 9 KI-VO: Risikomanagementsystem',
        bloecke: [
            { label: 'Art. 9 Abs. 1',
              text: 'Für Hochrisiko-KI-Systeme ⟦wird ein Risikomanagementsystem eingerichtet, angewandt, dokumentiert und aufrechterhalten⟧.' },
            { label: 'Art. 9 Abs. 2',
              text: 'Das Risikomanagementsystem versteht sich als ein ⟦kontinuierlicher iterativer Prozess⟧, der ⟦während des gesamten Lebenszyklus⟧ eines Hochrisiko-KI-Systems geplant und durchgeführt wird und eine regelmäßige systematische Überprüfung und Aktualisierung erfordert. Es umfasst folgende Schritte: […]' }
        ]
    },
    art10: {
        titel: 'Art. 10 KI-VO: Daten und Daten-Governance',
        bloecke: [
            { label: 'Art. 10 Abs. 2 lit. f, g',
              text: 'Diese Verfahren betreffen insbesondere […] f) eine Untersuchung im Hinblick auf ⟦mögliche Verzerrungen (Bias)⟧, die die Gesundheit und Sicherheit von Personen beeinträchtigen, sich negativ auf die Grundrechte auswirken oder ⟦zu einer nach den Rechtsvorschriften der Union verbotenen Diskriminierung führen könnten⟧, insbesondere wenn die Datenausgaben die Eingaben für künftige Operationen beeinflussen, g) geeignete Maßnahmen zur Erkennung, Verhinderung und Abschwächung möglicher gemäß Buchstabe f ermittelter Verzerrungen, […]' },
            { label: 'Art. 10 Abs. 3',
              text: 'Die Trainings-, Validierungs- und Testdatensätze müssen im Hinblick auf die Zweckbestimmung ⟦relevant, hinreichend repräsentativ und so weit wie möglich fehlerfrei und vollständig⟧ sein. […]' }
        ]
    },
    art11_12: {
        titel: 'Art. 11 und 12 KI-VO: Dokumentation und Protokollierung',
        bloecke: [
            { label: 'Art. 11 Abs. 1 UAbs. 1',
              text: 'Die technische Dokumentation eines Hochrisiko-KI-Systems ⟦wird erstellt, bevor dieses System in Verkehr gebracht oder in Betrieb genommen wird⟧, und ist auf dem neuesten Stand zu halten.' },
            { label: 'Art. 12 Abs. 1',
              text: 'Die Technik der Hochrisiko-KI-Systeme muss ⟦die automatische Aufzeichnung von Ereignissen⟧ (im Folgenden „Protokollierung“) ⟦während des Lebenszyklus⟧ des Systems ermöglichen.' }
        ]
    },
    art14: {
        titel: 'Art. 14 KI-VO: Menschliche Aufsicht',
        bloecke: [
            { label: 'Art. 14 Abs. 1',
              text: 'Hochrisiko-KI-Systeme werden so konzipiert und entwickelt, dass sie während der Dauer ihrer Verwendung […] ⟦von natürlichen Personen wirksam beaufsichtigt werden können⟧.' },
            { label: 'Art. 14 Abs. 4 lit. d, e',
              text: '[…] d) in einer bestimmten Situation zu beschließen, das Hochrisiko-KI-System nicht zu verwenden oder ⟦die Ausgabe des Hochrisiko-KI-Systems außer Acht zu lassen, außer Kraft zu setzen oder rückgängig zu machen⟧; e) ⟦in den Betrieb des Hochrisiko-KI-Systems einzugreifen⟧ oder den Systembetrieb mit einer ⟦„Stopptaste“⟧ oder einem ähnlichen Verfahren zu unterbrechen, was dem System ermöglicht, in einem sicheren Zustand zum Stillstand zu kommen.' }
        ]
    },
    art17: {
        titel: 'Art. 17 Abs. 1 KI-VO: Qualitätsmanagementsystem',
        bloecke: [
            { label: 'Art. 17 Abs. 1',
              text: 'Anbieter von Hochrisiko-KI-Systemen ⟦richten ein Qualitätsmanagementsystem ein, das die Einhaltung dieser Verordnung gewährleistet⟧. Dieses System wird ⟦systematisch und ordnungsgemäß in Form schriftlicher Regeln, Verfahren und Anweisungen dokumentiert⟧ und umfasst mindestens folgende Aspekte: […]' }
        ]
    },
    art40_1: {
        titel: 'Art. 40 Abs. 1 KI-VO: Harmonisierte Normen',
        bloecke: [
            { label: 'Art. 40 Abs. 1',
              text: 'Bei Hochrisiko-KI-Systemen oder KI-Modellen mit allgemeinem Verwendungszweck, die mit harmonisierten Normen oder Teilen davon, deren ⟦Fundstellen⟧ gemäß der Verordnung (EU) Nr. 1025/2012 ⟦im Amtsblatt der Europäischen Union veröffentlicht⟧ wurden, übereinstimmen, ⟦wird eine Konformität mit den Anforderungen⟧ gemäß Abschnitt 2 des vorliegenden Kapitels oder gegebenenfalls mit den Pflichten gemäß Kapitel V Abschnitte 2 und 3 der vorliegenden Verordnung ⟦vermutet⟧, soweit diese Anforderungen oder Verpflichtungen von den Normen abgedeckt sind.' }
        ]
    }
};

const SCHLUSS = {
    kern: 'Martin hat den Bauplan, aber nur wenige fertige Bauanleitungen. Dafür hat er mehr Zeit bekommen.',
    merksaetze: [
        { status: 'ok',  text: 'Fertig: erst 1 harmonisierte Norm (Qualitätsmanagement).' },
        { status: 'wip', text: 'In Arbeit: Leitlinie zur Einstufung und weitere Normen.' },
        { status: 'off', text: 'Fehlt: offizielle Erklärung der Pflichten und Vorlage zur Überwachung.' }
    ],
    frage: 'Reicht „mehr Zeit“, wenn die Bauanleitungen fehlen?'
};