export const mnemeProject={
 title:'MNEME',shortTitle:'MNEME',date:'Collaborative project · In development',
 category:'FINANCIAL INTELLIGENCE / APPLIED AI',screen:'mneme',headline:'MNEME',
 brief:'Market data, measured experiments and decisions you can trace.',
 stackLabel:'PYTHON · TYPESCRIPT · MACHINE LEARNING · LOCAL AI',
 text:'A hybrid financial-intelligence platform connecting market-data engineering, quantitative research, machine learning and local AI. I contribute across its data pipelines, models, backend, interface and infrastructure. The current operational engine runs in paper-trading mode, with deterministic risk checks and a journal for reviewing decisions and outcomes.',
 tags:'Python · TypeScript · pandas · scikit-learn · Parquet · Docker · Cloudflare · Local LLMs',
 sections:[
  {title:'The engineering problem',paragraphs:[
   'Market information arrives through different sources, at different times and with different levels of reliability. A chart or a promising backtest is only one part of the problem: the system also needs a consistent history, repeatable experiments, explicit controls and a way to explain each decision.',
   'MNEME brings those pieces into a shared platform for crypto, Forex, gold and fixed-expiry research. Each market has its own assumptions, costs and validation requirements. The goal is an operational financial-intelligence system whose research and decisions remain measurable and traceable as it evolves.'
  ]},
  {title:'My contribution across the stack',bullets:[
   'Data engineering: working on market-data ingestion, historical recovery, validation and point-in-time storage, so an experiment can reconstruct what information was available at each moment.',
   'Models and research: working on indicators, technical features, model evaluation and repeatable experiments, with chronological validation and explicit handling of costs and overlapping targets.',
   'Backend: contributing to the services that connect market inputs, decision logic, risk checks, paper execution, operational records and API responses.',
   'Interface: contributing to the dashboard for market charts, activity feeds, portfolio views, paper-trading history and operational settings.',
   'Infrastructure: working across the Python/Docker services and the TypeScript application on Cloudflare Pages, Workers and D1, with deployment and resource constraints in mind.'
  ]},
  {title:'From market data to a paper trade',steps:[
   'Collect market candles and other available inputs, validate the records and retain timestamps and provenance. Historical storage and gap recovery support repeatable analysis.',
   'Build indicators and features from information available at that point in time. Train and compare candidates using chronological splits, purging and embargo rather than mixing future observations into training.',
   'Evaluate the strategy for its specific market and execution mode, including costs, the amount of measured evidence and the expected outcome under those assumptions.',
   'Pass the candidate through a deterministic Risk Engine. Missing limits, stale data, duplicate decisions, excessive drawdown or a kill switch can block a new operation.',
   'Only a risk-approved decision reaches the paper executor. The executor records the simulated operation in the journal; it does not submit a real-money order.',
   'Review outcomes against the original decision and evidence. Local-LLM context currently feeds the journal asynchronously, while the repository tracks the work needed before that context can influence operational decisions.'
  ]},
  {title:'Architecture and implementation',paragraphs:[
   'The platform combines a Python research and execution codebase with a TypeScript web and Worker layer. pandas, NumPy, PyArrow, Parquet and DuckDB support data handling and research; the model laboratory includes scikit-learn workflows, with LightGBM and XGBoost also present in the Python dependencies.',
   'A fast deterministic path handles decision, risk and paper execution without waiting for an LLM or a network call inside the decision and risk modules. The analytical path uses local AI and a knowledge library for research and contextual information. RAG search and asynchronous LLM context exist, but their integration into operational decisions remains incomplete.',
   'The web side provides charts, feeds, settings and paper-trading views through Cloudflare Pages, Workers and D1. Python services are containerized with Docker and designed around constrained ARM64 infrastructure. Versioned experiments, records and deployment boundaries help keep the research workflow understandable as the project grows.'
  ]},
  {title:'Validation, current scope and next steps',paragraphs:[
   'The repository contains Python and TypeScript automated tests and documents checks for the research and operational workflows. The laboratory includes walk-forward splits, purging and embargo, statistical corrections for multiple experiments, and controls for assessing backtest overfitting. The code also rejects unsupported real-execution modes and requires an approval created by the Risk Engine before recording a paper trade.',
   'For example, a candidate based on incoming market data can be rejected because its evidence is too short, its expectation is not positive under the selected assumptions, or the configured risk limits are incomplete. Recording why an operation was accepted or blocked makes the system useful for engineering review even when a candidate does not perform well.',
   'The current charter explicitly separates implemented features from the product roadmap. Paper execution and the research laboratory work; parts of RAG, local-AI context and Forex/gold integration are still partial. LangGraph orchestration, deep learning and an autonomous research-and-improvement loop remain future work. This is an evolving engineering project, with no claim of proven trading profitability.'
  ]}
 ],url:'https://github.com/Inwtn/MNEME',liveUrl:'https://mneme-1b8.pages.dev/'
};
