export const LESSONS: Record<number, string> = {
1: `<div class="lesson-video-wrap">
  <div class="lesson-video-header">
    <div class="lesson-video-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><polygon points="6.5,5.5 11.5,8 6.5,10.5" fill="currentColor" stroke="none"/></svg></div>
    <div>
      <div class="lesson-video-title">Module 1 — Intro to JScript.NET &amp; the .NET Platform</div>
      <div class="lesson-video-sub">Watch before reading · Use captions if needed</div>
    </div>
  </div>
  <video controls preload="metadata" poster="">
    <source src="/videos/module1_intro.mp4" type="video/mp4">
    <p style="color:#fff;padding:20px;text-align:center">Your browser does not support HTML5 video. <a href="/videos/module1_intro.mp4" style="color:#4A9FD4">Download the video</a>.</p>
  </video>
  <div class="lesson-video-footer">module1_intro.mp4 · Place in a /videos/ folder · <a href="/videos/module1_intro.mp4" download style="color:#4A9FD4">Download</a></div>
</div>
<h2>What Is JScript.NET?</h2>
<p>JScript.NET is Microsoft's server-side scripting language built on the <span class="ic">.NET Common Language Runtime (CLR)</span>. It is <strong>not</strong> the same as JavaScript you write in a browser — there is no DOM, no <span class="ic">window</span>, no <span class="ic">document</span>. It runs entirely on the server inside BenSelect.</p>
<div class="warn-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L14.5 13.5H1.5L8 2Z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="11.75" r="0.75" fill="currentColor" stroke="none"/></svg> Critical distinction: When Selerix says "JScript" they mean JScript.NET running server-side on .NET — not browser JavaScript. Code that works in a browser will often fail here.</div>
<h2>The .NET Platform — Three Concepts You Need</h2>
<ul>
<li><strong>CLR (Common Language Runtime)</strong> — the engine that runs .NET code. All .NET languages compile to the same intermediate language and run on the CLR. This gives you access to .NET libraries like System.DateTime.</li>
<li><strong>CTS (Common Type System)</strong> — all .NET languages share type definitions. A <span class="ic">DateTime</span> in JScript.NET is the same object as a <span class="ic">DateTime</span> in C#.</li>
<li><strong>JIT (Just-In-Time) compilation</strong> — your script is compiled at runtime, not interpreted line by line. Syntax errors crash the whole script, not just one line.</li>
</ul>
<h2>Event.Debug() — Your Only Output Tool</h2>
<p>Since there is no console or browser DevTools, <span class="ic">Event.Debug()</span> is your only way to print values during development. It writes to the BenSelect administrator debug window — never shown to employees.</p>
<div class="code-block"><span class="kw">var</span> empName = Event.Employee.EmployeePerson.FirstName;
Event.Debug("Hello, " + empName + "!");</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">Line 1</span><span class="breakdown-text"><strong>var empName = Event.Employee.EmployeePerson.FirstName;</strong> — Traverses the Event object tree: Event (root) → Employee (the enrolled person) → EmployeePerson (person sub-object) → FirstName (string property).</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Line 2</span><span class="breakdown-text"><strong>Event.Debug(...)</strong> — Calls Debug on the Event object passing a concatenated string. Output appears only in the BenSelect admin debug window.</span></div>
</div>
<div class="outcome-box">
  <div class="outcome-label">Expected outcome</div>
  <div class="outcome-text">The string "Hello, Sam!" appears in the BenSelect debug window when this script runs during an enrollment event. Nothing is shown to the employee.</div>
</div>
<h2>Your First Real BenSelect Script — Prior Decline</h2>
<p>This is one of the simplest production scripts: read a custom field and route the employee to a different rate group based on it.</p>
<div class="code-block"><span class="cm">// EventType: OnEligible</span>
<span class="kw">var</span> priorDecline = Event.Employee.CustomFields["Prior Decline"];
<span class="kw">if</span>(priorDecline == 1){
    Event.Engine.RateGroup = "Prior Decline";
} <span class="kw">else</span> {
    Event.Engine.RateGroup = "default";
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">Line 1</span><span class="breakdown-text"><strong>// EventType: OnEligible</strong> — Comment documenting when this script fires.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Line 2</span><span class="breakdown-text"><strong>var priorDecline = Event.Employee.CustomFields["Prior Decline"];</strong> — Reads the custom field. Boolean custom fields return 1 or 0, not true/false.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Line 3</span><span class="breakdown-text"><strong>if(priorDecline == 1)</strong> — Always use == 1 for boolean custom fields — never if(priorDecline).</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Line 4</span><span class="breakdown-text"><strong>Event.Engine.RateGroup = "Prior Decline";</strong> — Sets the rate group to the "Prior Decline" name configured in BenSelect.</span></div>
</div>
<div class="outcome-box">
  <div class="outcome-label">Expected outcome</div>
  <div class="outcome-text">Employees with Prior Decline = 1 see the "Prior Decline" rate table. Employees with Prior Decline = 0 or empty see "default" rates. No error occurs if the custom field does not exist.</div>
</div>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> Key takeaway: The Event object is your gateway to everything. All BenSelect data flows through it. Event.Debug() is your only visibility tool during testing.</div>`,

2: `<div class="lesson-video-wrap">
  <div class="lesson-video-header">
    <div class="lesson-video-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><polygon points="6.5,5.5 11.5,8 6.5,10.5" fill="currentColor" stroke="none"/></svg></div>
    <div>
      <div class="lesson-video-title">Module 2 — Language Fundamentals &amp; Type System</div>
      <div class="lesson-video-sub">Watch before reading · Use captions if needed</div>
    </div>
  </div>
  <video controls preload="metadata">
    <source src="/videos/module2_fundamentals.mp4" type="video/mp4">
    <p style="color:#fff;padding:20px;text-align:center">Your browser does not support HTML5 video. <a href="/videos/module2_fundamentals.mp4" style="color:#4A9FD4">Download the video</a>.</p>
  </video>
  <div class="lesson-video-footer">module2_fundamentals.mp4 · Place in /videos/ folder alongside index.html</div>
</div>
<h2>Variables: var vs const</h2>
<p>JScript.NET uses <span class="ic">var</span> for mutable variables and <span class="ic">const</span> for immutable configuration values. Constants should be named UPPER_SNAKE_CASE and placed at the top of the script for easy editing.</p>
<div class="code-block"><span class="kw">const</span> CUTOFF_DAY = 15;
<span class="kw">const</span> DEATH_REASON_ID = 304;
<span class="kw">var</span> termDate = null;
<span class="kw">var</span> termDayOfMonth = null;</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">Lines 1–2</span><span class="breakdown-text"><strong>const CUTOFF_DAY = 15;</strong> — Immutable. UPPER_SNAKE_CASE convention. If the business changes the cutoff to the 20th, you change one line at the top.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Lines 3–4</span><span class="breakdown-text"><strong>var termDate = null;</strong> — Mutable, initialized to null. Explicit null initialization makes null checks predictable.</span></div>
</div>
<div class="outcome-box">
  <div class="outcome-label">Expected outcome</div>
  <div class="outcome-text">CUTOFF_DAY is a named, immutable 15. termDate starts as null until assigned later in the script. Null checks work reliably.</div>
</div>
<h2>The Boolean Gotcha — The Most Important Rule in BenSelect Scripting</h2>
<div class="warn-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L14.5 13.5H1.5L8 2Z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="11.75" r="0.75" fill="currentColor" stroke="none"/></svg> Boolean custom fields in BenSelect return the NUMBERS 1 and 0 — NOT true and false. Always compare explicitly: if(var == 1) not if(var).</div>
<div class="code-block"><span class="cm">// WRONG — silent bug risk</span>
<span class="kw">var</span> flag = Event.Employee.CustomFields["My Flag"];
<span class="kw">if</span>(flag){ ... }

<span class="cm">// CORRECT — explicit numeric comparison</span>
<span class="kw">if</span>(flag == 1){ ... }</div>
<h2>switch Statements for BenSelect Enum Values</h2>
<div class="code-block"><span class="kw">var</span> waitingPeriod = Event.Engine.Config.WaitingPeriod;
<span class="kw">var</span> waitingPeriodType = Event.Engine.Config.WaitingPeriodType;

<span class="kw">switch</span>(waitingPeriodType){
    <span class="kw">case</span> 0: effectiveDate = eligibilityDate.AddDays(waitingPeriod);   <span class="kw">break</span>;
    <span class="kw">case</span> 1: effectiveDate = eligibilityDate.AddMonths(waitingPeriod); <span class="kw">break</span>;
    <span class="kw">case</span> 2: effectiveDate = eligibilityDate.AddYears(waitingPeriod);  <span class="kw">break</span>;
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">Lines 1–2</span><span class="breakdown-text"><strong>Reading from Event.Engine.Config</strong> — WaitingPeriod is the numeric length; WaitingPeriodType is the unit (0=Days, 1=Months, 2=Years).</span></div>
  <div class="breakdown-row"><span class="breakdown-line">case 0</span><span class="breakdown-text"><strong>0 = Days.</strong> AddDays(n) adds n calendar days.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">case 1</span><span class="breakdown-text"><strong>1 = Months.</strong> AddMonths(n) correctly handles month-length differences.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">case 2</span><span class="breakdown-text"><strong>2 = Years.</strong> All AddX methods return a NEW DateTime — original is unchanged.</span></div>
</div>
<h2>The Event.PlanYear Null Check — Non-Negotiable</h2>
<div class="code-block"><span class="kw">if</span>(Event.PlanYear){
    currentPlanYearStartDate = Event.PlanYear.PlanYearStartDate;
} <span class="kw">else</span> {
    currentPlanYearStartDate = Event.Case.EnabledPlanYears[0].PlanYearStartDate;
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Why this pattern exists</div>
  <div class="breakdown-row"><span class="breakdown-line">if(Event.PlanYear)</span><span class="breakdown-text">Event.PlanYear is null during the first plan year of any Selerix case build. A truthy check on null evaluates to false — correctly skips the property access.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">else branch</span><span class="breakdown-text">Falls back to EnabledPlanYears[0] — the first element. This always exists.</span></div>
</div>
<div class="outcome-box">
  <div class="outcome-label">Expected outcome</div>
  <div class="outcome-text">currentPlanYearStartDate is always populated. Skip this null check in the first plan year and BenSelect throws a null reference exception — the enrollment may crash for every new hire enrolled that first year.</div>
</div>`,

3: `<div class="lesson-video-wrap">
  <div class="lesson-video-header">
    <div class="lesson-video-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><polygon points="6.5,5.5 11.5,8 6.5,10.5" fill="currentColor" stroke="none"/></svg></div>
    <div>
      <div class="lesson-video-title">Module 3 — Functions &amp; Code Organization</div>
      <div class="lesson-video-sub">Watch before reading · Use captions if needed</div>
    </div>
  </div>
  <video controls preload="metadata">
    <source src="/videos/module3_functions.mp4" type="video/mp4">
    <p style="color:#fff;padding:20px;text-align:center">Your browser does not support HTML5 video. <a href="/videos/module3_functions.mp4" style="color:#4A9FD4">Download the video</a>.</p>
  </video>
  <div class="lesson-video-footer">module3_functions.mp4 · Place in /videos/ folder alongside index.html</div>
</div>
<h2>Why Functions Matter in BenSelect</h2>
<p>BenSelect scripts are single files with no imports. As scripts grow complex (the AUL STD/LTD script is 250+ lines), functions are the only organizational tool. The Term Life GI Script has 5 distinct helper functions — study it as the gold standard for BenSelect function architecture.</p>
<h2>Getter Functions — Calculate and Return</h2>
<div class="code-block"><span class="kw">function</span> getCurrentPlanYearStartDate(){
    <span class="kw">var</span> currentPlanYearStartDate = null;
    <span class="kw">if</span>(Event.PlanYear){
        currentPlanYearStartDate = Event.PlanYear.PlanYearStartDate;
    } <span class="kw">else</span> {
        currentPlanYearStartDate = Event.Case.EnabledPlanYears[0].PlanYearStartDate;
    }
    <span class="kw">return</span> currentPlanYearStartDate;
}
<span class="cm">// Called at the top of the main script:</span>
<span class="kw">var</span> currentPlanYearStartDate = getCurrentPlanYearStartDate();</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">function declaration</span><span class="breakdown-text"><strong>function getCurrentPlanYearStartDate()</strong> — No parameters needed; reads directly from the globally available Event object. No return type declaration needed in JScript.NET.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">null initialization</span><span class="breakdown-text"><strong>var currentPlanYearStartDate = null;</strong> — Initialize to null before the conditional. If both branches fail, returns null rather than undefined.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">return</span><span class="breakdown-text"><strong>return currentPlanYearStartDate;</strong> — Returns the DateTime to the caller for use in date arithmetic and comparisons.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">call site</span><span class="breakdown-text"><strong>var currentPlanYearStartDate = getCurrentPlanYearStartDate();</strong> — One clean call at the top. The rest of the script uses the variable without knowing which path the function took.</span></div>
</div>
<div class="outcome-box">
  <div class="outcome-label">Expected outcome</div>
  <div class="outcome-text">currentPlanYearStartDate holds a System.DateTime for the first day of the current plan year. The main script never needs to know which path was taken.</div>
</div>
<h2>Setter Functions — Perform an Action</h2>
<div class="code-block"><span class="kw">function</span> setMaximum(inputMax){
    <span class="kw">var</span> trueMax = (inputMax &gt; MAX_BEN_AMT) ? MAX_BEN_AMT : inputMax;
    <span class="kw">var</span> payerProductID = Event.Product ? Event.Product.PayerProductID : 0;
    <span class="kw">var</span> payerProduct = Event.Config.GetPayerProductInfo(payerProductID);
    <span class="kw">var</span> numberOfBenefitLevels = payerProduct.BenefitLevels ? payerProduct.BenefitLevels.Length : 0;
    <span class="kw">var</span> numberOfAgeBands = payerProduct.AgeBand[0].Length;
    <span class="kw">for</span>(<span class="kw">var</span> i = 0; i &lt; numberOfBenefitLevels; i++){
        <span class="kw">for</span>(<span class="kw">var</span> n = 0; n &lt; numberOfAgeBands; n++){
            Event.Config.SetMaxBenefitAmount(i, n, trueMax);
        }
    }
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Section-by-section breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">Guard clause</span><span class="breakdown-text"><strong>ternary cap:</strong> if inputMax exceeds MAX_BEN_AMT, use MAX_BEN_AMT. Makes the function safe to call with any value.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Product info</span><span class="breakdown-text"><strong>GetPayerProductInfo(id)</strong> returns the product config object. BenefitLevels.Length gives coverage tier count. AgeBand[0].Length gives age band count.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Nested loop</span><span class="breakdown-text"><strong>SetMaxBenefitAmount(i, n, trueMax)</strong> — Must be called for EVERY combination of benefit level i and age band n.</span></div>
</div>
<h2>Returning Multiple Values with Arrays</h2>
<div class="code-block"><span class="kw">function</span> GetEmployeeEligibilityRange(){
    <span class="kw">var</span> eligibilityDate;
    <span class="kw">var</span> eligibilityEndDate;
    <span class="kw">if</span>(Event.Employee.EligibilityDate != null){
        eligibilityDate = DateTime.Parse(
            String.Format('{0:MM/dd/yyyy}', Event.Employee.EligibilityDate));
    } <span class="kw">else</span> {
        eligibilityDate = Event.Employee.DateOfHire;
    }
    <span class="kw">switch</span>(Event.Config.GracePeriodType){
        <span class="kw">case</span> 0: eligibilityEndDate = eligibilityDate.AddDays(Event.Config.GracePeriod);   <span class="kw">break</span>;
        <span class="kw">case</span> 1: eligibilityEndDate = eligibilityDate.AddMonths(Event.Config.GracePeriod); <span class="kw">break</span>;
    }
    <span class="kw">return</span> <span class="kw">new</span> Array(eligibilityDate, eligibilityEndDate);
}
<span class="cm">// Consuming the returned array:</span>
<span class="kw">var</span> range = GetEmployeeEligibilityRange();
<span class="kw">var</span> eligibilityDate    = range[0];
<span class="kw">var</span> eligibilityEndDate = range[1];</div>
<div class="outcome-box">
  <div class="outcome-label">Expected outcome</div>
  <div class="outcome-text">range[0] = DateTime when employee became eligible. range[1] = DateTime of last day to enroll. With a March 1st EligibilityDate and 30-day grace period, range[1] is March 31st.</div>
</div>`,

4: `<h2>Why OOP Concepts Matter</h2><p>You won't build classes from scratch in most BenSelect scripts, but understanding OOP is essential because the entire BenSelect data model IS a class library. Every time you write <span class="ic">Event.Employee.EmployeePerson.Age(date)</span> you're traversing an object hierarchy built from .NET classes.</p><h2>Properties vs Methods</h2><div class="code-block"><span class="cm">// Properties — read or write a value:</span>
Event.Employee.DateOfHire
Event.Engine.RateGroup

<span class="cm">// Methods — perform an action, may take parameters:</span>
Event.Employee.EmployeePerson.Age(Event.Engine.EffectiveDate)
Event.Config.SetMaxBenefitAmount(i, n, trueMax)
Event.Config.GetPayerProductInfo(payerProductID)
Event.Employee.GetCustom("Coverage Termination Date")
DateTime.Parse(String.Format('{0:MM/dd/yyyy}', someDate))</div><h2>The EmployeeView Class</h2><p>The BenSelect docs show inheritance chains like: System.Object → AbstractModelView → AbstractModelObjectView → AbstractView → EmployeeView. Focus on the leaf class (EmployeeView) — it has all properties you need. Key properties: DateOfHire, EligibilityDate, TerminationDate, Salary, ReasonTypeID, CustomFields, EmployeePerson, and more.</p><h2>Namespaces in BenSelect Context</h2><ul><li><span class="ic">Selerix.BenSelect.View</span> — EmployeeView, CoverageView</li><li><span class="ic">ETI.Report</span> — ReportEvent</li><li><span class="ic">System</span> — DateTime, String.Format</li></ul><p>You don't import namespaces — they're available automatically through the BenSelect runtime.</p><h2>System.DateTime — The Most Important .NET Class</h2><div class="code-block">System.DateTime.Today          <span class="cm">// static — today's date</span>
DateTime.Parse(string)         <span class="cm">// static — string to DateTime</span>
someDate.AddDays(n)            <span class="cm">// instance — returns NEW DateTime</span>
someDate.AddMonths(n)          <span class="cm">// instance — returns NEW DateTime</span>
someDate.Day                   <span class="cm">// property — day of month 1-31</span>
someDate.Month                 <span class="cm">// property — month 1-12</span>
someDate.Year                  <span class="cm">// property — year</span>
<span class="kw">new</span> DateTime(year, month, day) <span class="cm">// constructor — build specific date</span></div><div class="warn-box">AddDays/AddMonths/AddYears return a NEW DateTime — they do NOT modify the original. Always assign: <span class="ic">effectiveDate = eligibilityDate.AddMonths(1);</span></div>`,

5: `<h2>System.DateTime — The Most Used .NET Class</h2><p>Nearly every BenSelect script works with dates. The most important pattern: converting a nullable BenSelect date to a usable DateTime:</p><div class="code-block"><span class="cm">// Safe date parsing pattern — in almost every script</span>
<span class="kw">if</span>(Event.Employee.EligibilityDate != null){
    eligibilityDate = DateTime.Parse(
        String.Format('{0:MM/dd/yyyy}', Event.Employee.EligibilityDate)
    );
} <span class="kw">else</span> {
    eligibilityDate = Event.Employee.DateOfHire;
}</div><p>Why the dance? EligibilityDate is a nullable .NET object that may not directly support date arithmetic in JScript.NET. Parsing normalizes it into a reliable DateTime.</p><h2>String Operations</h2><div class="code-block"><span class="cm">// .ToUpper() + .IndexOf() — search a custom field string</span>
<span class="kw">if</span>(customFieldP.ToUpper().IndexOf("2025:Y") &gt; -1){ PayrollWellness = <span class="kw">true</span>; }

<span class="cm">// .toString() — convert EventType enum to string</span>
<span class="kw">var</span> theEvent = Event.EventType.toString();
<span class="kw">if</span>(theEvent == "Terminated"){ ... }</div><h2>The Year-Based Custom Field Pattern</h2><p>The Medical Wellness script stores multi-year history as pipe-delimited strings like <span class="ic">"2024:N|2025:Y"</span>:</p><div class="code-block"><span class="kw">var</span> sValue = Event.PlanYear ?
    Event.PlanYear.PlanYearStartDate.Year + ":Y" : "2025:Y";
<span class="kw">var</span> customFieldP = Event.Employee.GetCustom("Payroll Wellness") || "";
<span class="kw">if</span>(customFieldP != "" &amp;&amp; customFieldP.ToUpper().IndexOf(sValue) &gt; -1){
    PayrollWellness = <span class="kw">true</span>;
}</div><h2>Collections</h2><div class="code-block">Event.Case.EnabledPlanYears[0]   <span class="cm">// first plan year</span>
<span class="kw">return</span> <span class="kw">new</span> Array(date1, date2);  <span class="cm">// return multiple values</span>
<span class="kw">for</span>(<span class="kw">var</span> py <span class="kw">in</span> Event.Case.EnabledPlanYears){ ... } <span class="cm">// iterate collection</span></div>`,

6: `<h2>The DEBUG Flag Pattern</h2><p>Never leave debug output in production scripts. The professional pattern uses a <span class="ic">const DEBUG</span> flag at the top:</p><div class="code-block"><span class="kw">const</span> DEBUG = <span class="kw">false</span>; <span class="cm">// set true for testing, false for production</span>

<span class="kw">if</span>(DEBUG){
    Event.Debug("----- Script Debug -----");
    Event.Debug("theEvent: " + theEvent);
    Event.Debug("termDate: " + termDate);
    Event.Debug("------------------------");
}</div><p>To activate all debug output: change one line. To deactivate: change one line back. From the 15th Termination script — this is the industry standard pattern for BenSelect.</p><h2>try/catch/finally</h2><div class="code-block"><span class="kw">try</span> {
    <span class="kw">var</span> result = riskyOperation();
} <span class="kw">catch</span>(e) {
    Event.Debug("Error: " + e.message);
} <span class="kw">finally</span> {
    <span class="cm">// runs always</span>
}</div><h2>Common BenSelect Runtime Errors</h2><ul><li><strong>Null reference</strong> — accessing a property on null. Always null-check Event.PlanYear, Event.LastCoverage, Event.Employee.EligibilityDate, and Event.Applications["TAG"]</li><li><strong>Type mismatch</strong> — comparing a number to a string without conversion</li><li><strong>Index out of bounds</strong> — EnabledPlanYears[0] when no plan years exist</li></ul><h2>Defensive Pattern</h2><div class="code-block"><span class="cm">// Check before accessing nested properties</span>
<span class="kw">if</span>(Event.Applications["MEDICAL"] != null){
    <span class="kw">var</span> tier = Event.Applications["MEDICAL"].CoverageTypeID;
}
<span class="cm">// Check before coverage amount access</span>
<span class="kw">if</span>(Event.LastCoverage != null){
    setMaximum(Event.LastCoverage.BenefitAmount + INC_AMT);
} <span class="kw">else</span> { setMaximum(MAX_BEN_AMT); }</div><div class="info-box">Rule: if a BenSelect object might not exist, null-check it. If unsure — null-check it anyway.</div>`,

7: `<h2>The Four BenSelect Subsystems</h2><p>BenSelect has four subsystems: enrollment site setup, the end user enrollment site, enrollment data management, and reporting. JScript customizes all four.</p><h2>Case, Plan, and Product</h2><ul><li><strong>Case</strong> — the entire enrollment group (one employer). Also called Group.</li><li><strong>Plan</strong> — a benefit category umbrella: "Voluntary Life", "Medical", "STD". Plans are waived, not enrolled in.</li><li><strong>Product</strong> — the specific carrier policy within a plan: "Colonial Life Term", "Cigna PPO High". Employees enroll in Products.</li></ul><div class="warn-box">Critical: Employees enroll in PRODUCTS, not plans. Plans are organizational umbrellas. Products have rates, eligibility rules, and riders.</div><h2>The Application to Coverage Lifecycle</h2><div class="code-block">Enrollment begins  → Application (in progress)
All forms signed   → Coverage (confirmed)
Coverage + GI      → Active (immediate)
Coverage over GI   → Pending (awaiting carrier approval)</div><h2>Key Terminology</h2><ul><li><strong>Eligibility Date</strong> — when eligible to begin enrollment</li><li><strong>Waiting Period</strong> — time after eligibility before coverage starts</li><li><strong>Grace Period</strong> — how long the employee has to complete enrollment</li><li><strong>GI (Guaranteed Issue)</strong> — max coverage auto-approved without underwriting</li><li><strong>Late Entrant</strong> — missed initial new hire enrollment window</li><li><strong>Rate Group</strong> — named set of rates (e.g. "Prior Decline", "Employee")</li><li><strong>CoverageTypeID 4</strong> — Employee Only tier</li></ul><h2>The First Plan Year Problem</h2><div class="code-block"><span class="cm">// Crashes in first plan year:</span>
currentPlanYearStartDate = Event.PlanYear.PlanYearStartDate; <span class="cm">// WRONG</span>

<span class="cm">// Always safe:</span>
<span class="kw">if</span>(Event.PlanYear){
    currentPlanYearStartDate = Event.PlanYear.PlanYearStartDate;
} <span class="kw">else</span> {
    currentPlanYearStartDate = Event.Case.EnabledPlanYears[0].PlanYearStartDate;
}</div>`,

8: `<h2>OnEligible vs OnLifeEvent</h2><ul><li><strong>OnEligible</strong> — fires every time BenSelect evaluates a product for eligibility. Runs once per eligible product. Use for: rate groups, GI limits, max benefit amounts, eligibility control.</li><li><strong>OnLifeEvent</strong> — fires when a qualifying life event occurs (hire, termination, marriage). Use for: effective date overrides, termination date overrides, disabling deduct-before.</li></ul><h2>Employee Subtree</h2><div class="code-block">Event.Employee.DateOfHire                 <span class="cm">// DateTime</span>
Event.Employee.EligibilityDate            <span class="cm">// nullable DateTime</span>
Event.Employee.TerminationDate            <span class="cm">// DateTime (OnLifeEvent)</span>
Event.Employee.ReasonTypeID               <span class="cm">// int (304=Death)</span>
Event.Employee.Salary                     <span class="cm">// numeric</span>
Event.Employee.CustomFields["FieldName"]  <span class="cm">// raw value (1/0 for bool)</span>
Event.Employee.GetCustom("FieldName")     <span class="cm">// null-safe accessor</span>
Event.Employee.EmployeePerson.Age(date)   <span class="cm">// age as of date</span></div><h2>Engine, Config, Application, Action</h2><div class="code-block">Event.Engine.RateGroup                    <span class="cm">// SET to change rate group</span>
Event.Engine.Config.WaitingPeriod         <span class="cm">// int</span>
Event.Engine.Config.WaitingPeriodType     <span class="cm">// 0=Days 1=Months 2=Years</span>
Event.Engine.Config.EffectiveDateCalc     <span class="cm">// 0=1st of month 1=Immediately</span>
Event.Config.GracePeriod                  <span class="cm">// int</span>
Event.Config.GracePeriodType              <span class="cm">// 0=Days 1=Months</span>
Event.Config.SetGILimit(amt)              <span class="cm">// set GI for all levels</span>
Event.Config.SetMaxBenefitAmount(i,n,amt) <span class="cm">// set max per level/band</span>
Event.Config.RoundFactor                  <span class="cm">// rounding increment</span>
Event.Config.DeductionDateBeforeEffectiveDate  <span class="cm">// set 0 to disable</span>
Event.Application.EffectiveDate           <span class="cm">// OVERRIDE coverage start (OnEligible)</span>
Event.Action.TerminationDate              <span class="cm">// OVERRIDE coverage end (OnLifeEvent)</span></div><h2>Product and Eligibility</h2><div class="code-block">Event.ProductTag                          <span class="cm">// XML tag name of current product</span>
Event.Product.PayerProductID              <span class="cm">// ID for GetPayerProductInfo()</span>
Event.Eligible                            <span class="cm">// SET false to remove product</span>
Event.LastCoverage                        <span class="cm">// null if no prior coverage</span>
Event.LastCoverage.BenefitAmount          <span class="cm">// prior coverage amount</span>
Event.Applications["MEDICAL"]            <span class="cm">// cross-plan application lookup</span>
Event.Applications["MEDICAL"].CoverageTypeID  <span class="cm">// tier ID (4=EO)</span></div><h2>Report Event Subtree</h2><div class="code-block">Event.Value                               <span class="cm">// current column value — read/write</span>
Event.SkipRecord = true                   <span class="cm">// suppress row</span>
Event.Record["FieldName"]                 <span class="cm">// any field in current record</span>
Event.Globals["key"]                      <span class="cm">// persist across rows</span>
Event.FirstRecord / Event.LastRecord      <span class="cm">// absolute position flags</span>
Event.FirstKeyRecord / Event.LastKeyRecord<span class="cm">// position within key group</span></div>`,

9: `<h2>Rate Group Scripting</h2><p>Rate groups are named sets of rates configured in BenSelect. Assign an employee to a rate group by setting <span class="ic">Event.Engine.RateGroup</span>. Read a condition, set the rate group — the simplest and most common BenSelect scripting pattern.</p><div class="code-block"><span class="cm">// Prior Decline — simplest rate group swap</span>
<span class="kw">var</span> priorDecline = Event.Employee.CustomFields["Prior Decline"];
<span class="kw">if</span>(priorDecline == 1){
    Event.Engine.RateGroup = "Prior Decline";
} <span class="kw">else</span> {
    Event.Engine.RateGroup = "default";
}</div><h2>Tier-Based Rate Group Swaps</h2><div class="code-block"><span class="kw">const</span> MEDICAL_XML_TAG_NAME = "MEDICAL";
<span class="kw">const</span> EO_RATE_GROUP_NAME = "Employee";
<span class="kw">const</span> FA_RATE_GROUP_NAME = "Family";
<span class="kw">const</span> EMPLOYEE_ONLY_COVERAGE_TYPE_ID = 4;

<span class="kw">if</span>(Event.Applications[MEDICAL_XML_TAG_NAME] != null
   &amp;&amp; Event.Applications[MEDICAL_XML_TAG_NAME].CoverageTypeID == EMPLOYEE_ONLY_COVERAGE_TYPE_ID){
    Event.Engine.RateGroup = EO_RATE_GROUP_NAME;
} <span class="kw">else</span> {
    Event.Engine.RateGroup = FA_RATE_GROUP_NAME;
}</div><div class="warn-box">Always null-check Event.Applications["TAG"] before accessing its properties. If the employee hasn't visited that plan yet, the application may not exist.</div><h2>Product Eligibility Control</h2><div class="code-block"><span class="cm">// OnEligible runs once per eligible product</span>
<span class="kw">if</span>(PayrollWellness == true &amp;&amp; DiabeticWellness == false &amp;&amp; WeightManagement == false){
    <span class="kw">if</span>(Event.ProductTag != prod1_P_ND_NW &amp;&amp; Event.ProductTag != prod2_P_ND_NW){
        Event.Eligible = false;
    }
}</div><div class="info-box">OnEligible fires once per eligible product. The Wellness script relies on this — it checks each product's tag name and eliminates all but the correct one.</div><h2>Custom Field Patterns</h2><div class="code-block"><span class="cm">// Pattern 1 — boolean (1/0)</span>
<span class="kw">var</span> priorDecline = Event.Employee.CustomFields["Prior Decline"];
<span class="kw">if</span>(priorDecline == 1){ ... }

<span class="cm">// Pattern 2 — GetCustom() — null-safe, use for text/DateTime fields</span>
<span class="kw">if</span>(Event.Employee.GetCustom("Coverage Termination Date") != null){ ... }</div>`,

10: `<h2>The Effective Date Calculation Chain</h2><p>The chain: Eligibility Date → add Waiting Period → apply Effective Date Calc Type → Effective Date.</p><div class="code-block"><span class="cm">// Step 1: Get eligibility date</span>
<span class="kw">if</span>(Event.Employee.EligibilityDate != null){
    eligibilityDate = DateTime.Parse(String.Format('{0:MM/dd/yyyy}',Event.Employee.EligibilityDate));
} <span class="kw">else</span> { eligibilityDate = Event.Employee.DateOfHire; }

<span class="cm">// Step 2: Add waiting period</span>
<span class="kw">switch</span>(waitingPeriodType){
    <span class="kw">case</span> 0: effectiveDate = eligibilityDate.AddDays(waitingPeriod); <span class="kw">break</span>;
    <span class="kw">case</span> 1: effectiveDate = eligibilityDate.AddMonths(waitingPeriod); <span class="kw">break</span>;
    <span class="kw">case</span> 2: effectiveDate = eligibilityDate.AddYears(waitingPeriod); <span class="kw">break</span>;
}

<span class="cm">// Step 3: Apply effective date calc type</span>
<span class="kw">switch</span>(effectiveDateCalcType){
    <span class="kw">case</span> 0: <span class="cm">// 1st of month on or after</span>
        <span class="kw">if</span>(effectiveDate.Day != 1){
            effectiveDate = effectiveDate.AddMonths(1);
            effectiveDate = new DateTime(effectiveDate.Year, effectiveDate.Month, 1);
        }
        <span class="kw">break</span>;
    <span class="kw">case</span> 1: effectiveDate = effectiveDate.AddDays(1); <span class="kw">break</span>; <span class="cm">// Immediately after</span>
}</div><h2>Month-End Date Construction</h2><div class="code-block"><span class="cm">// End of current month — handles all month lengths including February</span>
new DateTime(termDate.Year, termDate.Month, 1).AddMonths(1).AddDays(-1)

<span class="cm">// End of following month</span>
new DateTime(termDate.Year, termDate.Month, 1).AddMonths(2).AddDays(-1)</div><h2>Cutoff Date</h2><p>The cutoff date prevents late entrant abuse during OE — it's the last possible hire date for a current plan year enrollment:</p><div class="code-block"><span class="kw">switch</span>(effectiveDateCalcType){
    <span class="kw">case</span> 0: cutOffDate = currentPlanYearStartDate.AddMonths(-1).AddDays(1); <span class="kw">break</span>;
    <span class="kw">case</span> 1: cutOffDate = currentPlanYearStartDate.AddDays(-1); <span class="kw">break</span>;
}</div><h2>Overriding Dates</h2><div class="code-block">Event.Application.EffectiveDate = effectiveDate; <span class="cm">// OnEligible — coverage start</span>
Event.Action.TerminationDate = covTermDate;       <span class="cm">// OnLifeEvent — coverage end</span></div>`,

11: `<h2>Benefit Levels and Age Bands</h2><p>BenSelect products can have multiple benefit levels and age bands. When setting maximums or GI limits, you must set them for EVERY combination — otherwise some combinations use the wrong maximum.</p><div class="code-block"><span class="kw">var</span> payerProduct = Event.Config.GetPayerProductInfo(Event.Product.PayerProductID);
<span class="kw">var</span> numberOfBenefitLevels = payerProduct.BenefitLevels.Length;
<span class="kw">var</span> numberOfAgeBands = payerProduct.AgeBand[0].Length;

<span class="kw">for</span>(<span class="kw">var</span> i = 0; i &lt; numberOfBenefitLevels; i++){
    <span class="kw">for</span>(<span class="kw">var</span> n = 0; n &lt; numberOfAgeBands; n++){
        Event.Config.SetMaxBenefitAmount(i, n, trueMax);
    }
}</div><h2>SetMaxBenefitAmount vs SetGILimit</h2><ul><li><span class="ic">SetMaxBenefitAmount(i, n, amount)</span> — caps the maximum amount an employee can elect</li><li><span class="ic">SetGILimit(i, n, amount)</span> — sets the GI threshold for auto-approval</li><li><span class="ic">Event.Config.RoundFactor = 100</span> — rounds benefit amounts to nearest $100</li></ul><h2>Rule Set 1: Standard Late Entrant Logic</h2><div class="code-block"><span class="kw">var</span> Now = System.DateTime.Today;

<span class="kw">if</span>(Now &lt;= eligibilityEndDate &amp;&amp; Event.LastCoverage == null){
    setMaximum(MAX_BEN_AMT);
    <span class="kw">if</span>(eligibilityDate &lt; cutOffDate){
        setMaximum(LATE_ENTRANT_MAX_BEN_AMT); <span class="cm">// should have enrolled last year</span>
    }
} <span class="kw">else if</span>(Now &gt; eligibilityEndDate &amp;&amp; Event.LastCoverage == null){
    setMaximum(LATE_ENTRANT_MAX_BEN_AMT);     <span class="cm">// past window — late entrant</span>
} <span class="kw">else</span> {
    setMaximum(Event.LastCoverage.BenefitAmount + INC_AMT); <span class="cm">// has prior coverage</span>
}</div><h2>Age Band Step-Down</h2><div class="code-block"><span class="kw">var</span> age = Event.Employee.EmployeePerson.Age(Event.Engine.EffectiveDate);
<span class="kw">var</span> ageBand2dArray = payerProdInfo.AgeBand;
<span class="kw">var</span> stepDown = 0;

<span class="kw">for</span>(<span class="kw">var</span> idx = 0; idx &lt; ageBand2dArray[0].length; idx++){
    <span class="kw">if</span>(age &gt;= ageBand2dArray[0][idx]){
        stepDown = payerProdInfo.GetStepDown(0, idx);
    }
}
<span class="kw">if</span>(stepDown == 0){ stepDown = 100; } <span class="cm">// 0 means no step-down</span>
<span class="kw">var</span> adjustedIncrement = BASE_INCREMENT * (stepDown / 100);</div>`,

12: `<h2>Life Event Script Overview</h2><p>OnLifeEvent scripts run when a qualifying life event occurs. Always start by identifying which event is happening:</p><div class="code-block"><span class="kw">var</span> theEvent = Event.EventType.toString();
<span class="kw">var</span> reasonID = Event.Employee.ReasonTypeID; <span class="cm">// 304 = Death</span>

<span class="kw">if</span>(theEvent == "Terminated" &amp;&amp; reasonID != 304){
    <span class="cm">// handle non-death termination</span>
}</div><h2>The 15th Cutoff Pattern</h2><div class="code-block"><span class="kw">const</span> CUTOFF_DAY = 15;
<span class="kw">const</span> DEATH_REASON_ID = 304;
<span class="kw">const</span> DEBUG = false;

<span class="kw">var</span> theEvent = Event.EventType.toString();

<span class="kw">if</span>(theEvent == "Terminated" &amp;&amp; Event.Employee.TerminationDate
   &amp;&amp; Event.Employee.ReasonTypeID != DEATH_REASON_ID){
    <span class="kw">var</span> termDate = Event.Employee.TerminationDate;
    <span class="kw">if</span>(termDate.Day &lt;= CUTOFF_DAY){
        Event.Action.TerminationDate =
            <span class="kw">new</span> DateTime(termDate.Year, termDate.Month, 1).AddMonths(1).AddDays(-1);
    } <span class="kw">else</span> {
        Event.Action.TerminationDate =
            <span class="kw">new</span> DateTime(termDate.Year, termDate.Month, 1).AddMonths(2).AddDays(-1);
    }
}</div><h2>Custom Term Date with Range Validation</h2><div class="code-block"><span class="kw">const</span> dayRange = 100;
<span class="kw">var</span> covTermDate = DateTime.Parse(String.Format('{0:MM/dd/yyyy}',
    Event.Employee.GetCustom("Coverage Termination Date")));
<span class="kw">var</span> maxCovTermDate = Event.Employee.TerminationDate.AddDays(dayRange);
<span class="kw">var</span> minCovTermDate = Event.Employee.TerminationDate.AddDays(-1 * dayRange);

<span class="kw">if</span>(covTermDate &gt; currentPlanYearEndDate){ covTermDate = currentPlanYearEndDate; }
<span class="kw">else if</span>(covTermDate &gt; maxCovTermDate){ covTermDate = maxCovTermDate; }
<span class="kw">else if</span>(covTermDate &lt; minCovTermDate){ covTermDate = minCovTermDate; }
Event.Action.TerminationDate = covTermDate;</div><h2>Deduct-Before Two-Script Pattern</h2><ul><li><strong>Part 1 (OnEligible)</strong> — recalculates effective date: <span class="ic">Event.Application.EffectiveDate = effectiveDate;</span></li><li><strong>Part 2 (OnLifeEvent)</strong> — disables deduct-before for life events: <span class="ic">Event.Config.DeductionDateBeforeEffectiveDate = 0;</span></li></ul><p>They fire at different times so must be separate scripts.</p>`,

13: `<h2>How the Report Engine Works</h2><p>The engine executes a DB query, then processes each row left to right, top to bottom. For every column in every row, your JScript runs and can read or modify that column's value.</p><div class="code-block"><span class="cm">// Convert 1/0 gender flag to M/F</span>
<span class="kw">if</span>(Event.Value){ Event.Value = 'M'; } <span class="kw">else</span> { Event.Value = 'F'; }</div><h2>Core Report Event Properties</h2><div class="code-block">Event.Value             <span class="cm">// current column — READ or WRITE</span>
Event.Record["field"]   <span class="cm">// any field in the current row</span>
Event.SkipRecord = true <span class="cm">// suppress entire row</span>
Event.Globals["key"]    <span class="cm">// persist values across rows</span>
Event.FirstRecord       <span class="cm">// true on absolute first row</span>
Event.LastRecord        <span class="cm">// true on absolute last row</span>
Event.FirstKeyRecord    <span class="cm">// true on first row within key group</span>
Event.LastKeyRecord     <span class="cm">// true on last row within key group</span>
Event.StartOver = true  <span class="cm">// reprocess current key group</span></div><h2>Row Suppression</h2><div class="code-block"><span class="cm">// Skip dependent rows</span>
Event.SkipRecord = Event.Record["DependentRelationshipID"] != 0;
<span class="cm">// Skip zero-amount rows</span>
<span class="kw">if</span>(Event.Record["BenefitAmount"] == 0){ Event.SkipRecord = true; }</div><h2>Persisting Values with Globals</h2><div class="code-block"><span class="kw">if</span>(Event.FirstRecord){ Event.Globals["total"] = 0; }
Event.Globals["total"] = Event.Globals["total"] + Event.Value;
<span class="kw">if</span>(Event.LastRecord){ Event.Value = Event.Globals["total"]; }</div><h2>Event.Value in Forms and Questions</h2><p>In forms/questions context, <span class="ic">Event.Value</span> controls visibility.</p><div class="code-block"><span class="cm">// Show form only when employee is increasing their benefit</span>
Event.Value = Event.Application.IncreaseBenefitAmount &gt; 0;
<span class="cm">// true = show, false = hide</span></div><div class="info-box">Useful report methods: Event.FormatSSN(), Event.FormatPhone(), Event.FormatEIN(), Event.StripNonNumeric(), Event.LeftStr().</div>`,

14: `<h2>Final Certification Exam Overview</h2><p>This exam tests your ability to apply everything from all 13 modules. Three parts, 100 points total. You need 70% (70 points) to receive your certification.</p><ul><li><strong>Part A — Multiple choice (30 points)</strong>: 6 questions covering all modules</li><li><strong>Part B — Code reading (30 points)</strong>: Read an unfamiliar script and answer questions about it</li><li><strong>Part C — Code writing (40 points)</strong>: Write a complete BenSelect script from specification</li></ul><h2>Key Patterns to Review</h2><div class="code-block"><span class="cm">// 1. Null-safe date parse</span>
DateTime.Parse(String.Format('{0:MM/dd/yyyy}', Event.Employee.EligibilityDate))

<span class="cm">// 2. Plan year null check</span>
<span class="kw">if</span>(Event.PlanYear){ ... } <span class="kw">else</span> { Event.Case.EnabledPlanYears[0] }

<span class="cm">// 3. Boolean custom field</span>
<span class="kw">if</span>(Event.Employee.CustomFields["Flag"] == 1){ ... }

<span class="cm">// 4. Month-end construction</span>
<span class="kw">new</span> DateTime(d.Year, d.Month, 1).AddMonths(1).AddDays(-1)

<span class="cm">// 5. Termination check (excluding death)</span>
<span class="kw">var</span> theEvent = Event.EventType.toString();
<span class="kw">if</span>(theEvent == "Terminated" &amp;&amp; Event.Employee.ReasonTypeID != 304){ ... }

<span class="cm">// 6. Benefit max loop</span>
<span class="kw">for</span>(<span class="kw">var</span> i = 0; i &lt; numLevels; i++){
    <span class="kw">for</span>(<span class="kw">var</span> n = 0; n &lt; numBands; n++){
        Event.Config.SetMaxBenefitAmount(i, n, trueMax);
    }
}</div><h2>Code Writing Tips for Part C</h2><ul><li>Start with <span class="ic">const</span> declarations for all configuration values</li><li>Always null-check objects before accessing properties</li><li>For OnLifeEvent: always check <span class="ic">Event.EventType.toString()</span> first</li><li>For OnEligible: remember the script runs once per eligible product</li><li>Use the DEBUG flag pattern for any debug code</li></ul><div class="info-box">You have covered 13 modules of JScript in Selerix BenSelect. Good luck on the exam.</div>`,
}
