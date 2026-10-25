export const aboutParagraphs=[
 "I'm Isaac Reis, a Software Engineer based in Brazil and open to remote work. I build full-stack features for internal ERP systems and backend services with Java and Spring Boot. My work connects APIs, databases and business workflows so information can move between systems with less manual effort.",
 "My background includes five years in financial operations, from January 2020 to January 2025: cash-flow management, bank reconciliation, accounts payable and receivable, management reporting and monthly closing. That experience shaped how I approach software: understand the business process, check the details, preserve the integrity of the data and build something useful for the people doing the work.",
 "Today I develop ERP features at 3D LAB with JavaScript, PHP, Laravel and Python, alongside databases and API integrations. I use Generative AI, LLMs, AI agents and prompt engineering to help create scripts, automate workflows and refine features. I also work with Java, Spring Boot, REST APIs, MySQL and PostgreSQL, and I am expanding my knowledge of cybersecurity to build more secure and resilient systems. I enjoy learning, automating repetitive work and turning practical problems into working tools."
];
export const projects=[
 {
  title:'Finance Sync API',shortTitle:'Finance Sync API',date:'Jan 2026 — present',
  text:'A Java and Spring Boot integration service that turns incoming financial transactions into rows in Google Sheets. Instead of retyping cash-flow movements into a management spreadsheet, a connected system sends the transaction to a REST endpoint and the API records it in the configured sheet.',
  tags:'Java 17 · Spring Boot Web · Lombok · Google Sheets API v4 · Google Auth Library · Maven',
  sections:[
   {title:'The problem',paragraphs:['Cash-flow controls often rely on spreadsheets that someone has to update by hand. Repeated data entry creates an operational bottleneck and increases the chance of inconsistent records. I built this project as an integration middleware: keep the spreadsheet used by the business, but automate how transaction data reaches it.']},
   {title:'How a transaction travels through the system',steps:[
    'A client sends an HTTP POST request to /api/v1/transactions with the date, transaction type, category, description and amount in a JSON payload.',
    'The REST controller receives the request and maps it to a TransactionRequestDTO, keeping the incoming data contract separate from the integration code.',
    'GoogleSheetsService obtains service-account credentials with the Google Sheets scope and creates an authenticated Sheets API client.',
    'The service assembles the five transaction fields in a consistent column order and appends the row to the configured spreadsheet using the Sheets API.',
    'The controller returns an HTTP success response when the write completes, or an error response if the integration fails.'
   ]},
   {title:'Architecture and implementation',paragraphs:['The project separates responsibilities into Controller, Service and DTO layers. The controller handles the HTTP boundary; the service owns Google authentication and the external API call; the DTO represents the transaction received from the client. The spreadsheet ID is supplied through application configuration. The current implementation appends rows to the Página1 worksheet with the USER_ENTERED value option, so Sheets interprets values as it would during manual entry.']},
   {title:'Key capabilities',bullets:[
    'Receive financial transactions over HTTP without requiring a person to open and edit the spreadsheet.',
    'Record date, type, category, description and amount in a predictable structure for managerial cash-flow control.',
    'Authenticate the integration through a Google service account with access to the destination spreadsheet.',
    'Write each submitted transaction as its request is processed, connecting operational systems directly to a familiar reporting tool.'
   ]},
   {title:'A practical example',paragraphs:['A business system registers a software-license expense and submits its date, category, description and value. Finance Sync writes the corresponding row into Google Sheets. The finance team can then continue using that sheet for its controls without re-entering the same transaction.']}
  ],url:'https://github.com/Inwtn/API-Finance-Sync'
 },
 {
  title:'Bank Reconciliation Engine',shortTitle:'Bank Reconciliation',date:'Open-source project',
  text:'A reconciliation application that compares bank-statement transactions against financial entries already recorded in a system. It imports OFX or CSV statements, runs a matching process and separates reconciled transactions, statement discrepancies and internal entries that remain pending.',
  tags:'Java 17 · Spring Boot 3.2 · PostgreSQL · Spring Data JPA · Hibernate · REST API · Swagger UI · Docker',
  sections:[
   {title:'The problem',paragraphs:['A bank statement and an internal cash-flow record describe the same financial activity from different sides. Comparing them manually is repetitive: someone must check amounts, debit or credit types, dates and missing entries. This project automates that comparison and makes the results available through a web dashboard and a documented REST API.']},
   {title:'From statement upload to reconciliation report',steps:[
    'Upload an OFX or CSV statement. A parser reads its transactions, and an import record tracks the file and its processing status.',
    'For each bank transaction, the engine first looks for a pending internal entry with exactly the same amount, transaction type and date.',
    'If no exact-date match is found, it searches within a date tolerance. The current service uses ±1 day, defined in code, and chooses the candidate with the nearest date.',
    'A successful match links the bank transaction and the internal financial entry, marking both as reconciled.',
    'A statement transaction without a match is marked as divergent. Internal entries that have not been matched remain pending.',
    'The result includes categorized records, counts, monetary totals and the reconciled percentage, while the import history keeps the processing record available for review.'
   ]},
   {title:'What the application includes',bullets:[
    'OFX and CSV statement ingestion, with dedicated parsers and an import-processing service.',
    'Matching by amount, debit/credit type and date, with a fallback for nearby dates.',
    'A dashboard for reviewing reconciliation results and a history of statement imports.',
    'REST endpoints to create and list financial entries, filter pending entries, import statements and retrieve reconciliation history.',
    'Interactive API documentation through Swagger UI and a PostgreSQL-backed persistence layer.'
   ]},
   {title:'Architecture and data',paragraphs:['Controllers expose the API; services coordinate statement processing and reconciliation; repositories persist financial entries, imported statement rows and import history. The model keeps both sides of a match linked, allowing a reconciled statement row to be traced to its internal entry. Spring Data JPA and Hibernate provide the database access layer. Docker Compose is included for running the application environment.']},
   {title:'A practical example',paragraphs:['An internal payable is recorded as a debit, but the bank posts the payment on the following day. If its amount and type match and the date is within the configured tolerance, the engine can reconcile the two records. A bank movement with no corresponding internal entry is surfaced as divergent; an internal bill absent from the statement stays pending for follow-up.']}
  ],url:'https://github.com/Inwtn/bank-reconciliation'
 }
];
export const experience=[
 {
  title:'Software Engineer · 3D LAB',shortTitle:'3D LAB',date:'Sep 2026 — present',location:'Brazil',
  text:'Developing internal ERP modules and full-stack features for web systems, combining application development, integrations and AI-assisted automation. The work includes understanding requirements, planning implementation and maintaining features that support internal business processes.',
  responsibilities:[
   'Architect, plan and implement internal ERP modules and full-stack features, connecting the interface, application logic and the data used by the business.',
   'Develop and maintain solutions with JavaScript, PHP, Laravel and Python, working with databases and external or internal API integrations.',
   'Apply Generative AI, LLMs, AI agents, prompt engineering and AI-assisted development to create scripts and automations, refine features and improve day-to-day productivity.',
   'Participate in agile delivery cycles, including sprints, planning and review, to organize implementation work and follow feature progress.',
   'Test features, report bugs in a structured way and maintain technical documentation to make changes easier to understand, reproduce and support.'
  ],tags:'JavaScript · PHP · Laravel · Python · Generative AI · LLMs · API integrations · Agile'
 },
 {
  title:'Software Developer · Backend Automation',shortTitle:'Backend Automation',date:'Dec 2025 — Jun 2026',location:'Brazil',
  text:'Built and maintained backend software focused on automating administrative and financial workflows. This work connected Java services, relational data and management spreadsheets, replacing repetitive manual steps with integrations and scripts.',
  responsibilities:[
   'Developed and deployed a Java backend system to automate repetitive tasks, reduce manual processing and support team productivity.',
   'Implemented automated cash-flow integrations supporting up to R$100,000 per month through automatic data feeds into management spreadsheets.',
   'Modeled data, refactored code and structured event-driven architectures to capture and organize business-critical information systematically.',
   'Maintained and evolved Java and Spring Boot microservices, focusing on continuous automation of administrative workflows.',
   'Created REST APIs and improved external integrations to consolidate financial information as it moved between systems.',
   'Built scripts and algorithms to manipulate, validate and automatically enter data into relational databases and dynamic spreadsheets.'
  ],tags:'Java 17 · Spring Boot · REST APIs · Event-driven architecture · Data modeling · Automation'
 },
 {
  title:'Financial Analyst · Benericks Cocktail Co',shortTitle:'Benericks Cocktail Co',date:'Jan 2020 — Jan 2025',location:'Brazil',
  text:'Worked across financial operations and administrative support, managing the records and routines behind cash-flow control, reconciliation and reporting. This experience established the practical business background that I now bring to financial integrations and software development.',
  responsibilities:[
   'Controlled and monitored company cash flow, accounts payable and accounts receivable, keeping track of financial deadlines and payment obligations.',
   'Performed bank reconciliation and verified financial transactions. Issued and controlled invoices, payment slips and other financial documents.',
   'Prepared management reports and KPIs, supported monthly financial closing and organized the accounting information used in reporting.',
   'Controlled expenses, budgets and operating costs, and coordinated with financial institutions on payments, receipts and banking services.',
   'Automated financial processes with advanced spreadsheets and digital tools, reducing repetitive manual activities and improving the efficiency of everyday routines.',
   'Supported administrative, accounting and tax activities, helping preserve the integrity of financial information and improve processes over time.'
  ],tags:'Cash flow · Bank reconciliation · Accounts payable/receivable · Reporting · KPIs · Spreadsheets · Process automation'
 }
];
