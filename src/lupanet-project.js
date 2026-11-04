export const lupaNetProject={
 title:'Lupa.NET',shortTitle:'Lupa.NET',date:'Open-source project',
 category:'DEVELOPER TOOLS / STATIC ANALYSIS',screen:'lupanet',headline:'Lupa.NET',
 brief:'From compiled assemblies to a clearer understanding of code.',
 stackLabel:'C# · NODE.JS · POWERSHELL · ILSPY',
 text:'A local .NET assembly explorer that makes compiled code easier to investigate. A browser interface connects to a loopback-only Node.js server and a separate PowerShell-hosted C# analyzer, using the ILSpy engine to reconstruct C# and inspect IL without invoking the target assembly’s methods.',
 tags:'C# · Node.js · PowerShell · ILSpy · JavaScript · PE/CLI metadata · Static analysis',
 sections:[
  {title:'Why I built it',paragraphs:[
   'I built Lupa.NET during a defensive investigation into malware received by the company I work for. I needed to navigate a recovered .NET payload, inspect its structure and compare reconstructed C# with IL to understand the capabilities present in the file.',
   'That experience became a personal developer tool for moving between binary structure, readable code and recorded findings. The public repository includes the tool and a harmless demonstration assembly; it excludes malware samples, recovered malware source and company incident data. Static inspection identifies code present in a file; it does not establish that the code ran on an affected machine.'
  ]},
  {title:'From a binary to readable findings',steps:[
   'Open or drop a managed .dll, .exe or .bin PE/CLI assembly into the browser interface. The local server checks the input size and file header, computes SHA-256 and stores a temporary copy for the session.',
   'A separate PowerShell worker checks the pinned ILSpy engine’s integrity and uses the C# analyzer to inventory namespaces, types, methods, signatures, references and string literals.',
   'Search the assembly tree and select a method. Switch between reconstructed C#, disassembled IL, metadata and strings to examine the same file from different perspectives.',
   'Review the file identity, declared dependencies and warnings. Filter strings or compare C# and IL when reconstructed output needs closer examination.',
   'Record findings in browser-local notes keyed by the assembly’s SHA-256, then export the displayed text or a JSON report. Subsequent requests can reuse the local session cache.'
  ]},
  {title:'What I built',bullets:[
   'An English browser interface with drag-and-drop import, a searchable type and method tree, and C#, IL, Metadata and Strings views.',
   'A loopback HTTP service for file imports, assembly sessions, code requests, caching and analysis-worker lifecycle management.',
   'A C# analysis layer that connects PE and metadata inspection to ILSpy’s CSharpDecompiler and ReflectionDisassembler. The UI navigates methods; the API also accepts type tokens.',
   'File-identity details including SHA-256, MVID, assembly version and architecture, alongside declared references, warnings and user strings.',
   'Browser-local investigation notes, text exports and JSON reports, plus a harmless calculator assembly for demonstrating the workflow.',
   'An offline workflow after obtaining the prerequisites, with no CDN, npm dependencies, telemetry or automatic dependency downloads.'
  ]},
  {title:'Architecture and boundaries',paragraphs:[
   'The browser sends selected bytes to a Node.js server bound to 127.0.0.1. The server manages temporary files, session state and cached outputs, while a separate PowerShell process hosts the C# analyzer and the pinned ICSharpCode.Decompiler library from ILSpy. Results return as JSON and text; the UI displays file content through text nodes.',
   'The analyzer reads the target through PE and metadata APIs rather than loading it as executable code into the CLR. Dependency lookup is restricted to the trusted PowerShell runtime directory. The tool focuses on managed .NET assemblies: reconstructed C# can be incomplete when code is obfuscated or dependencies are missing.',
   'This is a single-user local tool, not a public upload service or an operating-system sandbox. The implementation checks hosts and origins, limits imports to 32 MiB, retains up to eight assemblies per session and limits concurrent workers. Workers still run with the user’s permissions, so suspicious files require an isolated analysis environment.'
  ]},
  {title:'Verification and a practical example',paragraphs:[
   'The repository documents seven passing integration tests on Windows with Node.js 24, PowerShell 7.6.5, .NET 10 runtime libraries and ILSpy 11.1.0.9782. The suite uses a harmless fixture and deliberately malformed bytes to check metadata, C#/IL output, import identity, upload limits, token validation, host/origin restrictions and private-file access.',
   'For example, the included calculator contains an Add method. Lupa.NET reconstructs its addition in C# and exposes the corresponding add and ret instructions in IL. This demonstrates how to compare high-level output with instructions without calling the method. Other platforms and runtime combinations still require validation.'
  ]}
 ],url:'https://github.com/Inwtn/lupa-net'
};
