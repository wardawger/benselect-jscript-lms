export const LESSONS: Record<number, string> = {
1: `<div class="lesson-video-wrap">
  <div class="lesson-video-header">
    <div class="lesson-video-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><polygon points="6.5,5.5 11.5,8 6.5,10.5" fill="currentColor" stroke="none"/></svg></div>
    <div>
      <div class="lesson-video-title">Module 1 — Intro to JScript.NET &amp; the .NET Platform</div>
      <div class="lesson-video-sub">Watch before reading · Use captions if needed</div>
    </div>
  </div>
  <iframe src="https://www.youtube.com/embed/4MIX06Dibbs" title="Module 1 — Intro to JScript.NET &amp; the .NET Platform" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<h2>What Is JScript.NET?</h2>
<p>JScript.NET is a scripting language that runs <strong>inside BenSelect on the server</strong>. The word "server-side" simply means the code runs on Selerix's computers — not inside the employee's web browser. The employee never sees your code; they only see the result of it (for example, a different set of rates, or a product that's been hidden).</p>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Analogy:</strong> Think of BenSelect as a kitchen and JScript as the recipe instructions the chef follows. The employee is the dinner guest — they see the meal, not the recipe.</div>
<p>JScript.NET looks similar to JavaScript (the language used on websites), but it is <strong>not</strong> the same thing. It runs on Microsoft's <span class="ic">.NET</span> platform, which gives it access to powerful built-in tools like date calculators and type converters that regular browser JavaScript does not have.</p>
<div class="warn-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L14.5 13.5H1.5L8 2Z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="11.75" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Critical distinction:</strong> When Selerix says "JScript" they mean JScript.NET running server-side — not browser JavaScript. Code that works in a browser will often fail here.</div>
<h2>The .NET Platform — Three Concepts You Need</h2>
<p>You do not need to become a .NET expert, but knowing these three terms will help you understand error messages and documentation.</p>
<ul>
<li><strong>CLR (Common Language Runtime)</strong> — the engine that actually runs the code. Think of it as the electricity that powers the machine. It also means your script is fully compiled before it runs, so a typo anywhere in the file will crash the entire script — not just one line.</li>
<li><strong>CTS (Common Type System)</strong> — a shared rulebook for what data types look like. A date in JScript.NET is the same kind of date object as in any other .NET language. This is why you can use <span class="ic">DateTime.Parse()</span> — it is a built-in .NET tool available to your script.</li>
<li><strong>JIT (Just-In-Time) compilation</strong> — the script is converted to machine code the moment it runs. This makes it fast, but means syntax errors crash the whole script, not just the broken line.</li>
</ul>
<h2>The Event Object — Your Gateway to Everything</h2>
<p>Every BenSelect script has access to one special variable called <span class="ic">Event</span>. You never create it yourself — BenSelect hands it to your script automatically when the script runs.</p>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Analogy:</strong> The Event object is like a folder that BenSelect fills with everything it knows about the current enrollment session — who the employee is, what plan they are enrolling in, what their hire date is, and much more. Your script opens that folder, reads what it needs, and writes instructions back into it.</div>
<p>You navigate the Event object using <strong>dot notation</strong> — a series of words connected by dots. Each dot means "go inside this and look at." So <span class="ic">Event.Employee.EmployeePerson.FirstName</span> means: start at Event, open the Employee section, open the EmployeePerson section, then read the FirstName value.</p>
<h2>Event.Debug() — Your Only Output Tool</h2>
<p>When writing scripts, you often need to check what a value actually is. In a browser you might use <span class="ic">console.log()</span>. In BenSelect, your only equivalent is <span class="ic">Event.Debug()</span>. It writes a message to the BenSelect administrator debug window — the employee never sees it.</p>
<div class="code-block"><span class="kw">var</span> empName = Event.Employee.EmployeePerson.FirstName;
Event.Debug("Hello, " + empName + "!");</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">Line 1</span><span class="breakdown-text"><strong>var empName = ...</strong> — <span class="ic">var</span> creates a new variable (a named storage box). The name <span class="ic">empName</span> is chosen by you. The right side reads: Event (the main folder) → Employee (the employee section) → EmployeePerson (the person's personal info) → FirstName (the text value of their first name). The result — something like "Sarah" — is stored in <span class="ic">empName</span>.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Line 2</span><span class="breakdown-text"><strong>Event.Debug(...)</strong> — The <span class="ic">+</span> signs connect three text pieces into one string: "Hello, " + the name + "!". The result "Hello, Sarah!" is sent to the debug window.</span></div>
</div>
<div class="outcome-box">
  <div class="outcome-label">Expected outcome</div>
  <div class="outcome-text">The string "Hello, Sarah!" (using the actual employee's name) appears in the BenSelect debug window when this script runs. Nothing is shown to the employee.</div>
</div>
<h2>Your First Real BenSelect Script — Prior Decline Rate Routing</h2>
<p>One of the most common scripting tasks is reading a custom field and routing the employee to a different rate group based on it. Let's break down what that means before looking at the code.</p>
<p><strong>Custom Fields</strong> are extra data fields that BenSelect administrators configure on the employee record — they do not exist in the standard employee data model. Examples: "Prior Decline", "Smoker Status", "Union Member". Your script can read these fields to make decisions.</p>
<p><strong>Rate Groups</strong> are named sets of insurance rates configured inside BenSelect by an administrator. For example, there might be a "Standard" rate group and a "Prior Decline" rate group, each with different premium tables. By setting <span class="ic">Event.Engine.RateGroup</span> in your script, you tell BenSelect which rate table to show this employee.</p>
<div class="code-block"><span class="cm">// EventType: OnEligible</span>
<span class="kw">var</span> priorDecline = Event.Employee.CustomFields["Prior Decline"];
<span class="kw">if</span>(priorDecline == 1){
    Event.Engine.RateGroup = "Prior Decline";
} <span class="kw">else</span> {
    Event.Engine.RateGroup = "default";
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">Line 1</span><span class="breakdown-text"><strong>// EventType: OnEligible</strong> — A comment (ignored by the computer, written for humans). It documents that this script is intended to run on the OnEligible event — meaning BenSelect will call it once for each product the employee is eligible for.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Line 2</span><span class="breakdown-text"><strong>var priorDecline = Event.Employee.CustomFields["Prior Decline"];</strong> — Reads the custom field named "Prior Decline" from the employee's record. The brackets with a name in quotes are how you look up a named item in a collection. The value will be either 1 (yes) or 0 (no) — not true/false like you might expect.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Line 3</span><span class="breakdown-text"><strong>if(priorDecline == 1)</strong> — An <span class="ic">if</span> statement checks a condition and only runs the indented code inside the curly braces if the condition is true. Here: "if the prior decline flag equals 1, do the following." We use <span class="ic">== 1</span> (number comparison) rather than just <span class="ic">if(priorDecline)</span> because BenSelect custom fields return numbers, not true/false booleans.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Line 4</span><span class="breakdown-text"><strong>Event.Engine.RateGroup = "Prior Decline";</strong> — Sets the rate group. The <span class="ic">=</span> sign here means "assign this value." The string "Prior Decline" must exactly match the rate group name configured in BenSelect admin — spelling and capitalization matter.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Lines 5–7</span><span class="breakdown-text"><strong>else { ... }</strong> — The <span class="ic">else</span> block runs when the <span class="ic">if</span> condition is false (priorDecline is 0 or empty). Here we route to "default" rates.</span></div>
</div>
<div class="outcome-box">
  <div class="outcome-label">Expected outcome</div>
  <div class="outcome-text">Employees with Prior Decline = 1 see the "Prior Decline" rate table. Employees with Prior Decline = 0 or empty see "default" rates. No error occurs if the custom field does not exist on the record.</div>
</div>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Key takeaway:</strong> The Event object is your gateway to all BenSelect data. Everything flows through it — reading employee information, checking benefit configurations, and writing back decisions like rate groups or effective dates. <span class="ic">Event.Debug()</span> is your only window into what is happening during testing.</div>`,

2: `<div class="lesson-video-wrap">
  <div class="lesson-video-header">
    <div class="lesson-video-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><polygon points="6.5,5.5 11.5,8 6.5,10.5" fill="currentColor" stroke="none"/></svg></div>
    <div>
      <div class="lesson-video-title">Module 2 — Language Fundamentals &amp; Type System</div>
      <div class="lesson-video-sub">Watch before reading · Use captions if needed</div>
    </div>
  </div>
  <iframe src="https://www.youtube.com/embed/yxlDpvrBsB4" title="Module 2 — Language Fundamentals &amp; Type System" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<h2>Variables: var vs const</h2>
<p>A <strong>variable</strong> is a named storage box that holds a value your script can use and change. You create a variable with the keyword <span class="ic">var</span>. A <strong>constant</strong> is the same idea, but its value is locked — it cannot be changed after it is set. Use <span class="ic">const</span> for any value that represents a business rule number, so that if the rule changes you only have to update one line.</p>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Convention:</strong> Constants are named in UPPER_SNAKE_CASE (all capitals with underscores). This is a widely used programming convention that signals to anyone reading the code: "this value is fixed — do not change it in the middle of the script."</div>
<div class="code-block"><span class="kw">const</span> CUTOFF_DAY = 15;
<span class="kw">const</span> DEATH_REASON_ID = 304;
<span class="kw">var</span> termDate = null;
<span class="kw">var</span> termDayOfMonth = null;</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">Line 1</span><span class="breakdown-text"><strong>const CUTOFF_DAY = 15;</strong> — The number 15 represents a business rule: if an employee's termination date is on or before the 15th of the month, coverage ends differently than if it falls after. Writing it as a named constant means if the client later asks to change the cutoff to the 20th, you edit one line — not hunt through the entire script.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Line 2</span><span class="breakdown-text"><strong>const DEATH_REASON_ID = 304;</strong> — BenSelect assigns every termination reason a numeric ID. 304 means "Death." Using the named constant is far more readable than a bare 304 appearing deep in an if-statement.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Lines 3–4</span><span class="breakdown-text"><strong>var termDate = null;</strong> — Creates a variable and sets its initial value to <span class="ic">null</span>. Null means "nothing is here yet — no value has been assigned." We set it to null explicitly so that later we can safely check: "did this variable ever get a value?" If it is still null, we know the relevant condition never occurred.</span></div>
</div>
<h2>What Is null?</h2>
<p><span class="ic">null</span> is a special value that means <em>intentionally empty</em> — "this box exists, but nothing has been put in it yet." It is different from zero (which is a number) and different from an empty string like <span class="ic">""</span> (which is still a string, just with no characters). Many BenSelect fields can be null — for example, <span class="ic">Event.Employee.EligibilityDate</span> is null for employees who do not have a custom eligibility date set.</p>
<div class="warn-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L14.5 13.5H1.5L8 2Z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="11.75" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Common beginner mistake:</strong> Trying to use a null value as if it has a real value. For example, calling <span class="ic">.AddDays()</span> on a date that is null will crash your script. Always check if something might be null before using it.</div>
<h2>The Boolean Gotcha — The Most Important Rule in BenSelect Scripting</h2>
<p>A <strong>boolean</strong> is a programming term for a value that is either true or false — like a light switch that is either on or off. In most programming languages, boolean variables hold the literal values <span class="ic">true</span> or <span class="ic">false</span>. In BenSelect, boolean custom fields return <strong>the numbers 1 and 0</strong> — not true and false. This is one of the most common sources of subtle bugs.</p>
<div class="code-block"><span class="cm">// WRONG — silent bug risk</span>
<span class="kw">var</span> flag = Event.Employee.CustomFields["My Flag"];
<span class="kw">if</span>(flag){ ... }

<span class="cm">// CORRECT — explicit numeric comparison</span>
<span class="kw">if</span>(flag == 1){ ... }</div>
<div class="code-breakdown">
  <div class="breakdown-title">Why the wrong way fails</div>
  <div class="breakdown-row"><span class="breakdown-line">if(flag)</span><span class="breakdown-text">In JScript.NET, the number 0 is treated as "falsy" (behaves like false) and any non-zero number is "truthy." So <span class="ic">if(flag)</span> technically works for 1 vs 0 — but it also silently returns true for any unexpected non-zero value (like 2 or -1). Explicit comparison to 1 is safer and clearer about your intent.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">if(flag == 1)</span><span class="breakdown-text">Explicitly checks that the value is exactly 1. This is the required pattern for all BenSelect boolean custom fields. Never assume a custom field returns true/false.</span></div>
</div>
<h2>switch Statements — Choosing Between Many Options</h2>
<p>An <span class="ic">if/else</span> statement is great when you have two choices. When you have three or more choices based on the same value, a <span class="ic">switch</span> statement is cleaner and easier to read. Think of it like a railroad switch — based on the value, the train of execution is routed to exactly one track.</p>
<div class="code-block"><span class="kw">var</span> waitingPeriod = Event.Engine.Config.WaitingPeriod;
<span class="kw">var</span> waitingPeriodType = Event.Engine.Config.WaitingPeriodType;

<span class="kw">switch</span>(waitingPeriodType){
    <span class="kw">case</span> 0: effectiveDate = eligibilityDate.AddDays(waitingPeriod);   <span class="kw">break</span>;
    <span class="kw">case</span> 1: effectiveDate = eligibilityDate.AddMonths(waitingPeriod); <span class="kw">break</span>;
    <span class="kw">case</span> 2: effectiveDate = eligibilityDate.AddYears(waitingPeriod);  <span class="kw">break</span>;
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">Lines 1–2</span><span class="breakdown-text"><strong>Reading from Event.Engine.Config</strong> — BenSelect stores the waiting period as two separate values: the <em>number</em> (WaitingPeriod, e.g. 30) and the <em>unit</em> (WaitingPeriodType, which is 0, 1, or 2). The unit is stored as a number because BenSelect enumerates its options starting from 0.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">switch(waitingPeriodType)</span><span class="breakdown-text">The switch examines <span class="ic">waitingPeriodType</span> and jumps to whichever <span class="ic">case</span> label matches.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">case 0</span><span class="breakdown-text"><strong>0 = Days.</strong> <span class="ic">AddDays(n)</span> adds n calendar days to the eligibility date and returns a new date. For example, 30 days after March 1 = March 31.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">case 1</span><span class="breakdown-text"><strong>1 = Months.</strong> <span class="ic">AddMonths(n)</span> correctly handles different month lengths — adding 1 month to January 31 gives February 28 (or 29), not an error.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">case 2</span><span class="breakdown-text"><strong>2 = Years.</strong> All three AddX methods return a <em>brand new</em> DateTime value — they do not modify the original date variable. You must assign the result: <span class="ic">effectiveDate = eligibilityDate.AddDays(30)</span>.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">break</span><span class="breakdown-text">The <span class="ic">break</span> keyword exits the switch after the matching case runs. Without it, the code would "fall through" and run the next case too — usually a bug.</span></div>
</div>
<div class="outcome-box">
  <div class="outcome-label">Expected outcome</div>
  <div class="outcome-text">effectiveDate is calculated by adding the correct unit (days, months, or years) to the eligibility date. The switch cleanly maps BenSelect's numeric enum (0/1/2) to the right date arithmetic call.</div>
</div>
<h2>The Event.PlanYear Null Check — Non-Negotiable</h2>
<p>In the very first plan year of a new BenSelect case, the <span class="ic">Event.PlanYear</span> object does not exist yet — it is null. If your script tries to read a property from null, BenSelect throws an error and the entire enrollment can fail. This null check is required in almost every script that touches plan year dates.</p>
<div class="code-block"><span class="kw">if</span>(Event.PlanYear){
    currentPlanYearStartDate = Event.PlanYear.PlanYearStartDate;
} <span class="kw">else</span> {
    currentPlanYearStartDate = Event.Case.EnabledPlanYears[0].PlanYearStartDate;
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Why this pattern exists</div>
  <div class="breakdown-row"><span class="breakdown-line">if(Event.PlanYear)</span><span class="breakdown-text">This checks whether Event.PlanYear has a value. A null value is treated as false, so if Event.PlanYear is null the condition fails and we skip to the else block — safely avoiding a crash.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">else branch</span><span class="breakdown-text"><span class="ic">Event.Case.EnabledPlanYears</span> is a list (array) of all plan years on the case. <span class="ic">[0]</span> retrieves the first item from that list — the earliest plan year, which always exists. This is the safe fallback for first-year cases.</span></div>
</div>
<div class="outcome-box">
  <div class="outcome-label">Expected outcome</div>
  <div class="outcome-text">currentPlanYearStartDate is always populated, regardless of whether this is the first plan year or a later one. Skip this null check and new hires enrolled in the first plan year of a brand-new case will see a script crash during enrollment.</div>
</div>`,

3: `<div class="lesson-video-wrap">
  <div class="lesson-video-header">
    <div class="lesson-video-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><polygon points="6.5,5.5 11.5,8 6.5,10.5" fill="currentColor" stroke="none"/></svg></div>
    <div>
      <div class="lesson-video-title">Module 3 — Functions &amp; Code Organization</div>
      <div class="lesson-video-sub">Watch before reading · Use captions if needed</div>
    </div>
  </div>
  <iframe src="https://www.youtube.com/embed/YaYvAW97jUs" title="Module 3 — Functions &amp; Code Organization" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<h2>What Is a Function?</h2>
<p>A <strong>function</strong> is a named block of code that you write once and can run (call) as many times as you need. Instead of repeating the same 10 lines of code in three different places, you write them inside a function and call that function three times.</p>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Analogy:</strong> A function is like a recipe card. You write the recipe once (the function definition). Every time you want to make that dish, you follow the card (call the function) rather than re-writing all the steps from scratch.</div>
<p>Functions can also <strong>return</strong> a value — meaning they calculate something and hand the result back to whoever called them. For example, a function named <span class="ic">getCurrentPlanYearStartDate()</span> calculates the plan year start date and returns it so the rest of the script can use it.</p>
<h2>Why Functions Matter in BenSelect</h2>
<p>BenSelect scripts are single files with no way to import other files. As scripts grow complex (some production scripts exceed 250 lines), functions are the only organizational tool available. Without them, complex scripts become impossible to read and debug. Well-named functions also act as documentation — a function called <span class="ic">setMaximum()</span> tells you exactly what it does before you even read the code inside it.</p>
<h2>Getter Functions — Calculate and Return a Value</h2>
<p>A <strong>getter function</strong> computes something and hands the result back to the caller using the <span class="ic">return</span> keyword. The caller receives whatever value was returned and can store it in a variable.</p>
<div class="code-block"><span class="kw">function</span> getCurrentPlanYearStartDate(){
    <span class="kw">var</span> currentPlanYearStartDate = null;
    <span class="kw">if</span>(Event.PlanYear){
        currentPlanYearStartDate = Event.PlanYear.PlanYearStartDate;
    } <span class="kw">else</span> {
        currentPlanYearStartDate = Event.Case.EnabledPlanYears[0].PlanYearStartDate;
    }
    <span class="kw">return</span> currentPlanYearStartDate;
}
<span class="cm">// Calling the function and storing its returned value:</span>
<span class="kw">var</span> planStart = getCurrentPlanYearStartDate();</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">function keyword</span><span class="breakdown-text"><strong>function getCurrentPlanYearStartDate()</strong> — The keyword <span class="ic">function</span> declares that we are defining a function. The name follows. The empty parentheses <span class="ic">()</span> mean this function does not need any input from the caller — it reads the global <span class="ic">Event</span> object directly.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">var ... = null</span><span class="breakdown-text">We initialize the local variable to null before the if/else. This is a safety net — if somehow neither branch of the if/else runs (rare, but defensive), the function returns null rather than an undefined value that could cause a confusing error later.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">if/else logic</span><span class="breakdown-text">This is the same null check from Module 2 — handles both the first plan year (Event.PlanYear is null) and all subsequent years. Wrapping it in a function means you write this logic once and call it wherever you need the plan year start date.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">return</span><span class="breakdown-text"><strong>return currentPlanYearStartDate;</strong> — Sends the calculated date value back to whoever called the function. Execution exits the function at this point.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Call site</span><span class="breakdown-text"><strong>var planStart = getCurrentPlanYearStartDate();</strong> — The parentheses after the name are what actually <em>run</em> the function. The returned DateTime value is stored in <span class="ic">planStart</span> for use throughout the rest of the script.</span></div>
</div>
<div class="outcome-box">
  <div class="outcome-label">Expected outcome</div>
  <div class="outcome-text">planStart holds the DateTime for the first day of the current plan year. The main script never needs to know which path (first year vs. later year) the function took to get there.</div>
</div>
<h2>Setter Functions — Perform an Action</h2>
<p>A <strong>setter function</strong> does not return a value — it performs an action, like updating multiple BenSelect configuration settings. The function takes one or more <strong>parameters</strong> (inputs) and uses them to do its work.</p>
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
  <div class="breakdown-row"><span class="breakdown-line">Parameter</span><span class="breakdown-text"><strong>function setMaximum(inputMax)</strong> — <span class="ic">inputMax</span> is a parameter: a variable that receives whatever value the caller passes in. When you call <span class="ic">setMaximum(50000)</span>, inside the function <span class="ic">inputMax</span> equals 50000.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Ternary cap</span><span class="breakdown-text"><strong>(inputMax &gt; MAX_BEN_AMT) ? MAX_BEN_AMT : inputMax</strong> — This is a ternary expression: a compact if/else. It reads: "if inputMax is greater than the allowed maximum, use the allowed maximum; otherwise use inputMax as-is." This guards against any caller accidentally passing a number that exceeds the plan's cap.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Product info</span><span class="breakdown-text"><strong>GetPayerProductInfo(payerProductID)</strong> returns the full product configuration object, which contains how many benefit levels and age bands this product has.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Nested loops</span><span class="breakdown-text">The two <span class="ic">for</span> loops iterate over every combination of benefit level (<span class="ic">i</span>) and age band (<span class="ic">n</span>). <span class="ic">SetMaxBenefitAmount</span> must be called for every combination — otherwise some combinations still show the old maximum.</span></div>
</div>
<h2>Returning Multiple Values with Arrays</h2>
<p>A function can only <span class="ic">return</span> one thing. To return two or more related values, wrap them in an Array and return that. The caller then reads the values by index (position number, starting at 0).</p>
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
<div class="code-breakdown">
  <div class="breakdown-title">Key concepts</div>
  <div class="breakdown-row"><span class="breakdown-line">new Array(...)</span><span class="breakdown-text">Creates an array (an ordered list) containing two items. The first item (index 0) is the eligibility date; the second (index 1) is the end of the enrollment window.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">range[0]</span><span class="breakdown-text">Accesses the first item in the array. Arrays are zero-indexed — counting starts at 0, not 1. So the first item is [0], the second is [1].</span></div>
</div>
<div class="outcome-box">
  <div class="outcome-label">Expected outcome</div>
  <div class="outcome-text">range[0] = DateTime when the employee became eligible. range[1] = the last day to enroll. With a March 1 eligibility date and a 30-day grace period, range[1] is March 31.</div>
</div>`,

4: `<h2>Why Object-Oriented Concepts Matter</h2>
<p>You will not build classes from scratch in BenSelect scripting, but understanding object-oriented programming (OOP) concepts is essential because the entire BenSelect data model is a class library. Every time you write <span class="ic">Event.Employee.EmployeePerson.Age(date)</span> you are traversing an object hierarchy built from .NET classes. Understanding the vocabulary helps you read documentation and error messages.</p>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Analogy:</strong> A <strong>class</strong> is like a blueprint for a house. An <strong>object</strong> is an actual house built from that blueprint. Every employee in BenSelect is an <em>object</em> built from the <em>EmployeeView class</em> blueprint — it has all the same fields (name, hire date, salary), just with different values for each individual.</div>
<h2>Properties vs Methods</h2>
<p><strong>Properties</strong> are values you read or write — like fields on a form. <strong>Methods</strong> are actions you can perform — they may take inputs and produce a result. You can tell the difference in your code: properties have no parentheses; methods have parentheses (even if empty) because they can accept arguments.</p>
<div class="code-block"><span class="cm">// Properties — read or write a value (no parentheses):</span>
Event.Employee.DateOfHire
Event.Engine.RateGroup

<span class="cm">// Methods — perform an action, may take parameters (parentheses required):</span>
Event.Employee.EmployeePerson.Age(Event.Engine.EffectiveDate)
Event.Config.SetMaxBenefitAmount(i, n, trueMax)
Event.Config.GetPayerProductInfo(payerProductID)
Event.Employee.GetCustom("Coverage Termination Date")
DateTime.Parse(String.Format('{0:MM/dd/yyyy}', someDate))</div>
<div class="code-breakdown">
  <div class="breakdown-title">Examples explained</div>
  <div class="breakdown-row"><span class="breakdown-line">DateOfHire</span><span class="breakdown-text">A property — you just read it. No parentheses. BenSelect returns the stored date value directly.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">RateGroup</span><span class="breakdown-text">A property you can both read and write. Writing to it (<span class="ic">= "Prior Decline"</span>) tells BenSelect which rate table to apply.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Age(date)</span><span class="breakdown-text">A method — it calculates the employee's age as of the date you pass in. You must pass a date argument because the answer depends on what date you are asking about.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">GetCustom("Name")</span><span class="breakdown-text">A method that retrieves a custom field value. Safer than <span class="ic">CustomFields["Name"]</span> because it returns null instead of throwing an error if the field does not exist.</span></div>
</div>
<h2>The EmployeeView Class</h2>
<p>The BenSelect documentation shows inheritance chains like: <span class="ic">System.Object → AbstractModelView → AbstractView → EmployeeView</span>. You only need to focus on the last class in the chain (EmployeeView) — it has all the properties you will use. The chain simply shows that EmployeeView inherits capabilities from the parent classes above it, like a manager who inherits company policies from the corporate level but adds department-specific rules on top.</p>
<p>Key EmployeeView properties you will use in scripts: <span class="ic">DateOfHire</span>, <span class="ic">EligibilityDate</span>, <span class="ic">TerminationDate</span>, <span class="ic">Salary</span>, <span class="ic">ReasonTypeID</span>, <span class="ic">CustomFields</span>, <span class="ic">EmployeePerson</span>.</p>
<h2>Namespaces in BenSelect Context</h2>
<p>A <strong>namespace</strong> is a way of organizing classes so their names do not collide. Think of it like a filing system — "Employee" in the HR department is different from "Employee" in the Payroll department. In BenSelect you do not need to import namespaces — they are available automatically through the runtime.</p>
<ul>
<li><span class="ic">Selerix.BenSelect.View</span> — contains EmployeeView, CoverageView, and similar BenSelect-specific objects</li>
<li><span class="ic">ETI.Report</span> — contains the ReportEvent object used in report scripting</li>
<li><span class="ic">System</span> — contains .NET built-ins like DateTime and String</li>
</ul>
<h2>System.DateTime — The Most Important .NET Class</h2>
<p><span class="ic">DateTime</span> is a .NET class that represents a specific point in time. Nearly every BenSelect script works with dates, so you will use DateTime constantly. There are two types of DateTime members: <em>static</em> ones that you call on the class itself (like <span class="ic">DateTime.Today</span>) and <em>instance</em> ones that you call on a specific date variable (like <span class="ic">someDate.AddDays(30)</span>).</p>
<div class="code-block">System.DateTime.Today          <span class="cm">// static — today's date on the server</span>
DateTime.Parse(string)         <span class="cm">// static — converts a date string to a DateTime object</span>
someDate.AddDays(n)            <span class="cm">// instance — returns a NEW DateTime (n days later)</span>
someDate.AddMonths(n)          <span class="cm">// instance — returns a NEW DateTime (n months later)</span>
someDate.Day                   <span class="cm">// property — the day of the month (1–31)</span>
someDate.Month                 <span class="cm">// property — the month number (1–12)</span>
someDate.Year                  <span class="cm">// property — the four-digit year</span>
<span class="kw">new</span> DateTime(year, month, day) <span class="cm">// constructor — build a specific date from numbers</span></div>
<div class="warn-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L14.5 13.5H1.5L8 2Z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="11.75" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Critical:</strong> AddDays(), AddMonths(), and AddYears() do NOT change the original date. They return a brand-new DateTime. Always assign the result: <span class="ic">effectiveDate = eligibilityDate.AddMonths(1);</span> — not just <span class="ic">eligibilityDate.AddMonths(1);</span> (which would do nothing useful).</div>`,

5: `<h2>System.DateTime — Dates Are Everywhere</h2>
<p>Nearly every BenSelect script works with dates — eligibility dates, effective dates, termination dates, plan year dates. One of the most critical skills is safely converting a BenSelect date value into a DateTime object you can do math with.</p>
<h2>What Is a Nullable Date?</h2>
<p>Some BenSelect fields may or may not have a value, depending on the employee record. <span class="ic">Event.Employee.EligibilityDate</span> is a good example — not every employee has a custom eligibility date set. When the field has no value, it is <strong>null</strong> (empty). Trying to call <span class="ic">.AddDays()</span> on a null value causes a crash.</p>
<p>The safe pattern is to always check for null first, then parse the date into a reliable DateTime. The two-step parse below (<span class="ic">String.Format</span> then <span class="ic">DateTime.Parse</span>) normalizes the date into a clean format that JScript.NET can safely perform math on.</p>
<div class="code-block"><span class="cm">// Safe date parsing pattern — appears in almost every production script</span>
<span class="kw">if</span>(Event.Employee.EligibilityDate != null){
    eligibilityDate = DateTime.Parse(
        String.Format('{0:MM/dd/yyyy}', Event.Employee.EligibilityDate)
    );
} <span class="kw">else</span> {
    eligibilityDate = Event.Employee.DateOfHire;
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">!= null check</span><span class="breakdown-text"><strong>if(Event.Employee.EligibilityDate != null)</strong> — <span class="ic">!=</span> means "is not equal to." This guard clause asks: "does this employee have an eligibility date?" Before accessing any nullable field, check this first.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">String.Format</span><span class="breakdown-text"><strong>String.Format('{0:MM/dd/yyyy}', someDate)</strong> — Converts the BenSelect date object into a clean text string like "03/15/2025." The <span class="ic">{0:MM/dd/yyyy}</span> part is a format template: MM=two-digit month, dd=two-digit day, yyyy=four-digit year. <span class="ic">{0}</span> means "use the first argument" (someDate).</span></div>
  <div class="breakdown-row"><span class="breakdown-line">DateTime.Parse</span><span class="breakdown-text"><strong>DateTime.Parse("03/15/2025")</strong> — Converts the text string back into a proper DateTime object. This round-trip (date → string → DateTime) ensures you have a clean .NET DateTime that supports all the date math methods.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">else fallback</span><span class="breakdown-text">If no custom eligibility date exists, use DateOfHire instead. This is the standard fallback — if no explicit eligibility date is set, the employee becomes eligible on their hire date.</span></div>
</div>
<h2>String Operations in BenSelect Context</h2>
<p>Strings (text values) in JScript.NET are .NET String objects, which means they have built-in methods for searching, comparing, and transforming text. These come up frequently when reading custom fields that store text data.</p>
<div class="code-block"><span class="cm">// .ToUpper() normalizes case, .IndexOf() searches for a substring</span>
<span class="kw">if</span>(customFieldP.ToUpper().IndexOf("2025:Y") &gt; -1){ PayrollWellness = <span class="kw">true</span>; }

<span class="cm">// .toString() converts an EventType enum value to a readable string</span>
<span class="kw">var</span> theEvent = Event.EventType.toString();
<span class="kw">if</span>(theEvent == "Terminated"){ ... }</div>
<div class="code-breakdown">
  <div class="breakdown-title">String method explanations</div>
  <div class="breakdown-row"><span class="breakdown-line">.ToUpper()</span><span class="breakdown-text">Converts all characters to uppercase. This makes string comparisons case-insensitive — "2025:Y", "2025:y", and "2025:Y" all become "2025:Y" so the search finds them all.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">.IndexOf("...")</span><span class="breakdown-text">Searches the string for the given text and returns the position where it was found, starting at 0. If the text is NOT found, it returns -1. So <span class="ic">&gt; -1</span> means "was found anywhere in the string."</span></div>
  <div class="breakdown-row"><span class="breakdown-line">.toString()</span><span class="breakdown-text">Converts a non-string value (like an enum or number) to its text representation. <span class="ic">Event.EventType</span> is a numeric enum internally — .toString() turns it into a human-readable string like "Terminated" or "NewHire".</span></div>
</div>
<h2>The Year-Based Custom Field Pattern</h2>
<p>Some BenSelect implementations store multi-year boolean history in a single custom field as pipe-delimited text like <span class="ic">"2023:N|2024:N|2025:Y"</span> — meaning the employee declined in 2023 and 2024 but participated in 2025. Your script searches this string for the current year's entry.</p>
<div class="code-block"><span class="kw">var</span> sValue = Event.PlanYear ?
    Event.PlanYear.PlanYearStartDate.Year + ":Y" : "2025:Y";
<span class="kw">var</span> customFieldP = Event.Employee.GetCustom("Payroll Wellness") || "";
<span class="kw">if</span>(customFieldP != "" &amp;&amp; customFieldP.ToUpper().IndexOf(sValue) &gt; -1){
    PayrollWellness = <span class="kw">true</span>;
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Key concepts</div>
  <div class="breakdown-row"><span class="breakdown-line">Ternary (? :)</span><span class="breakdown-text"><strong>Event.PlanYear ? ... : "2025:Y"</strong> — A compact if/else. If Event.PlanYear exists (not null), build the search string from the actual plan year. Otherwise, hardcode "2025:Y" as a safe default. The <span class="ic">?</span> separates the condition from the two options; the <span class="ic">:</span> separates the two options.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">|| ""</span><span class="breakdown-text"><strong>GetCustom(...) || ""</strong> — The <span class="ic">||</span> operator means "or." If GetCustom returns null, use an empty string instead. This prevents a crash when the custom field does not exist on the record at all.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">&amp;&amp; condition</span><span class="breakdown-text"><strong>&amp;&amp;</strong> means "and" — both conditions must be true for the block to run. First check the field is not empty, then search it for the current year's participation flag.</span></div>
</div>
<h2>Collections — Arrays and Lists</h2>
<p>A <strong>collection</strong> is an ordered group of items. BenSelect uses several: <span class="ic">EnabledPlanYears</span> is a list of plan year objects; you can access items by their position number (index) or loop through all of them.</p>
<div class="code-block">Event.Case.EnabledPlanYears[0]   <span class="cm">// first plan year in the list (index 0)</span>
<span class="kw">return</span> <span class="kw">new</span> Array(date1, date2);  <span class="cm">// pack two values into an array to return both</span>
<span class="kw">for</span>(<span class="kw">var</span> py <span class="kw">in</span> Event.Case.EnabledPlanYears){ ... } <span class="cm">// iterate all plan years</span></div>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> Arrays are zero-indexed — the first item is always at position [0], not [1]. <span class="ic">EnabledPlanYears[0]</span> is the first (earliest) plan year, not the second.</div>`,

6: `<h2>The DEBUG Flag Pattern</h2>
<p>During development you often add <span class="ic">Event.Debug()</span> calls to print values and trace what your script is doing. But debug output should never reach production — it clutters the administrator view and can expose sensitive information. The professional pattern uses a single constant flag to control all debug output at once.</p>
<div class="code-block"><span class="kw">const</span> DEBUG = <span class="kw">false</span>; <span class="cm">// set true for testing, false for production</span>

<span class="kw">if</span>(DEBUG){
    Event.Debug("----- Script Debug -----");
    Event.Debug("theEvent: " + theEvent);
    Event.Debug("termDate: " + termDate);
    Event.Debug("------------------------");
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">How the DEBUG flag works</div>
  <div class="breakdown-row"><span class="breakdown-line">const DEBUG</span><span class="breakdown-text">A constant at the top of the script set to <span class="ic">false</span> (off). When you need to debug, change it to <span class="ic">true</span>. When you deploy to production, change it back to <span class="ic">false</span>. One line controls all your debug output.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">if(DEBUG)</span><span class="breakdown-text">Since DEBUG is a boolean (true/false), this if-statement is simply: "if debugging is on, print these values." When DEBUG is false, the entire block is skipped — zero performance cost.</span></div>
</div>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> This pattern comes directly from production BenSelect scripts. Using it shows professionalism — it tells the next developer that you thought about deployment, not just getting the code to run once.</div>
<h2>try/catch/finally — Handling Errors Gracefully</h2>
<p>Sometimes code can fail at runtime for reasons you cannot fully predict — a network hiccup, a missing data record, an unexpected null value. A <span class="ic">try/catch</span> block lets you attempt a risky operation and handle the failure gracefully instead of crashing the entire script.</p>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Analogy:</strong> A try/catch is like a safety net under a trapeze artist. The artist <em>tries</em> to perform the move; if they fall, the net <em>catches</em> them so they are not injured. The show can continue.</div>
<div class="code-block"><span class="kw">try</span> {
    <span class="kw">var</span> result = riskyOperation();
} <span class="kw">catch</span>(e) {
    Event.Debug("Error: " + e.message);
} <span class="kw">finally</span> {
    <span class="cm">// this block always runs, error or not — good for cleanup</span>
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Block-by-block breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">try { }</span><span class="breakdown-text">The code you want to run goes here. If it succeeds, the catch block is skipped. If it throws an error, execution immediately jumps to the catch block.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">catch(e) { }</span><span class="breakdown-text"><span class="ic">e</span> is the error object that was thrown. <span class="ic">e.message</span> contains the human-readable description of what went wrong. You can log it with Event.Debug() or take a recovery action.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">finally { }</span><span class="breakdown-text">Runs no matter what — whether the try succeeded or the catch handled an error. Useful for cleanup actions that must always happen.</span></div>
</div>
<h2>Common BenSelect Runtime Errors</h2>
<p>These are the errors you will encounter most often as you write BenSelect scripts. Understanding their causes makes them much faster to fix.</p>
<ul>
<li><strong>Null reference exception</strong> — You tried to access a property or call a method on a null value. Example: <span class="ic">Event.PlanYear.PlanYearStartDate</span> when Event.PlanYear is null. The fix is always a null check before accessing the property.</li>
<li><strong>Type mismatch</strong> — Comparing or combining values of incompatible types. Example: comparing a number to a string without converting one of them first.</li>
<li><strong>Index out of bounds</strong> — Accessing an array position that does not exist. Example: <span class="ic">EnabledPlanYears[0]</span> when the case has no plan years configured yet.</li>
</ul>
<h2>The Defensive Null-Check Pattern</h2>
<p>The rule for BenSelect scripting: if a property <em>might</em> be null, check it before using it. The objects most likely to be null are: <span class="ic">Event.PlanYear</span>, <span class="ic">Event.LastCoverage</span>, <span class="ic">Event.Employee.EligibilityDate</span>, and any application lookup like <span class="ic">Event.Applications["MEDICAL"]</span>.</p>
<div class="code-block"><span class="cm">// Check before accessing nested application properties</span>
<span class="kw">if</span>(Event.Applications["MEDICAL"] != null){
    <span class="kw">var</span> tier = Event.Applications["MEDICAL"].CoverageTypeID;
}

<span class="cm">// Check before using prior coverage amount</span>
<span class="kw">if</span>(Event.LastCoverage != null){
    setMaximum(Event.LastCoverage.BenefitAmount + INC_AMT);
} <span class="kw">else</span> {
    setMaximum(MAX_BEN_AMT);
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Why each check matters</div>
  <div class="breakdown-row"><span class="breakdown-line">Applications["MEDICAL"]</span><span class="breakdown-text">Returns null if the employee has not yet visited the Medical plan during this enrollment session. Accessing <span class="ic">.CoverageTypeID</span> on null would immediately crash the script.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Event.LastCoverage</span><span class="breakdown-text">Is null for a brand-new employee who has never had coverage before. If you are calculating a benefit increase from their prior coverage amount, you need the fallback — use the maximum benefit amount for first-time enrollees.</span></div>
</div>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Rule of thumb:</strong> If a BenSelect object might not exist for every employee in every scenario, null-check it. If you are unsure — null-check it anyway. The cost of an unnecessary check is zero; the cost of a missing one is a crashed enrollment session.</div>`,

7: `<h2>The Four BenSelect Subsystems</h2>
<p>Before diving deeper into scripting, it helps to understand what BenSelect is at a high level. BenSelect has four major subsystems, and JScript can customize all four:</p>
<ul>
<li><strong>Enrollment site setup</strong> — configuring products, rates, eligibility rules, and benefit designs</li>
<li><strong>The end-user enrollment site</strong> — what employees see and interact with</li>
<li><strong>Enrollment data management</strong> — processing, reporting, and managing enrollment records</li>
<li><strong>Reporting</strong> — generating carrier files, census data, and custom reports</li>
</ul>
<h2>Case, Plan, and Product — The Three-Level Hierarchy</h2>
<p>These three terms appear constantly in BenSelect documentation and script references. Understanding how they nest is essential to reading the Event object correctly.</p>
<ul>
<li><strong>Case</strong> — the entire enrollment group for one employer. One employer = one Case. Also called "Group" in some contexts. <span class="ic">Event.Case</span> gives you access to everything about the employer.</li>
<li><strong>Plan</strong> — a benefit category umbrella. Examples: "Voluntary Life", "Medical", "Short-Term Disability." Plans are organizational — employees waive a plan, they do not enroll directly in it.</li>
<li><strong>Product</strong> — the specific insurance policy within a plan. Examples: "Colonial Life Term Life", "Cigna PPO High". Employees enroll in Products. Products have rates, age bands, benefit levels, GI limits, and eligibility rules. Your scripts run in the context of a specific product.</li>
</ul>
<div class="warn-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L14.5 13.5H1.5L8 2Z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="11.75" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Critical:</strong> Employees enroll in PRODUCTS, not Plans. Plans are organizational umbrellas. This distinction matters when reading script references — <span class="ic">Event.Product</span> is the product being evaluated; there is no "Event.Plan."</div>
<h2>The Application-to-Coverage Lifecycle</h2>
<p>When an employee makes benefit elections, those elections go through a lifecycle. Understanding this helps you know what data is available at different script execution points.</p>
<div class="code-block">Enrollment begins  → Application (election in progress, not yet confirmed)
All forms signed   → Coverage (election confirmed and recorded)
Coverage within GI → Active (starts immediately, no carrier approval needed)
Coverage over GI   → Pending (awaiting carrier approval — Evidence of Insurability)</div>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>GI (Guaranteed Issue)</strong> is the maximum benefit amount a carrier will approve without requiring the employee to answer health questions. If an employee elects more than the GI limit, the excess goes into Pending status and requires medical underwriting.</div>
<h2>Key BenSelect Terminology Glossary</h2>
<ul>
<li><strong>Eligibility Date</strong> — the date when the employee first becomes eligible to enroll. Often the hire date, but may be overridden by a custom field or business rule.</li>
<li><strong>Waiting Period</strong> — the number of days, months, or years that must pass after the eligibility date before coverage can start. Configured per product in BenSelect admin.</li>
<li><strong>Grace Period</strong> — how long the employee has to complete their enrollment after becoming eligible. After the grace period expires, late entrant restrictions may apply.</li>
<li><strong>GI (Guaranteed Issue)</strong> — maximum coverage auto-approved without medical underwriting. Set per benefit level and age band. Your script can override it with <span class="ic">Event.Config.SetGILimit()</span>.</li>
<li><strong>Late Entrant</strong> — an employee who missed their initial enrollment window and is enrolling outside of Open Enrollment. Often subject to reduced benefit maximums.</li>
<li><strong>Rate Group</strong> — a named set of rates in BenSelect. Setting <span class="ic">Event.Engine.RateGroup</span> in your script routes the employee to the appropriate rate table.</li>
<li><strong>CoverageTypeID 4</strong> — the Employee Only coverage tier. Used when checking whether a Medical election is employee-only vs. family, which often drives rate group routing on dependent products.</li>
</ul>
<h2>The First Plan Year Problem — Revisited</h2>
<p>This concept is important enough to revisit in the BenSelect domain context. When a brand-new case is set up in Selerix, there is no "current plan year" object yet. The first plan year has not started, so <span class="ic">Event.PlanYear</span> is null. Any script that accesses it directly — without the null check — will crash for every employee enrolled during that first plan year setup phase.</p>
<div class="code-block"><span class="cm">// This crashes during first plan year setup:</span>
currentPlanYearStartDate = Event.PlanYear.PlanYearStartDate; <span class="cm">// WRONG</span>

<span class="cm">// This is always safe:</span>
<span class="kw">if</span>(Event.PlanYear){
    currentPlanYearStartDate = Event.PlanYear.PlanYearStartDate;
} <span class="kw">else</span> {
    currentPlanYearStartDate = Event.Case.EnabledPlanYears[0].PlanYearStartDate;
}</div>
<div class="outcome-box">
  <div class="outcome-label">Real-world impact</div>
  <div class="outcome-text">Missing this null check on a new case build means every new hire enrolled during the first plan year will hit a script crash. The enrollment may fail silently or display an error to the employee. This is one of the most common preventable bugs in BenSelect JScript.</div>
</div>`,

8: `<h2>The Two Most Important Event Types</h2>
<p>Every BenSelect script is attached to a specific event — a moment in the enrollment lifecycle when BenSelect calls your script. The two you will use most are <strong>OnEligible</strong> and <strong>OnLifeEvent</strong>. Understanding which event your script is attached to determines what data is available and what you are allowed to do.</p>
<ul>
<li><strong>OnEligible</strong> — fires every time BenSelect evaluates a product for eligibility. It runs once per eligible product per employee. Use it for: changing rate groups, adjusting GI limits, setting maximum benefit amounts, and controlling product visibility.</li>
<li><strong>OnLifeEvent</strong> — fires when a qualifying life event occurs (new hire, termination, marriage, birth, etc.). Use it for: overriding effective dates, overriding termination dates, and disabling deduct-before logic.</li>
</ul>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> The comment at the top of every script should document its event type: <span class="ic">// EventType: OnEligible</span> or <span class="ic">// EventType: OnLifeEvent</span>. This is essential — the same code behavior means completely different things depending on when it runs.</div>
<h2>The Employee Subtree — Reading Employee Data</h2>
<p>The most commonly accessed section of the Event object is the Employee subtree. These are the properties you will read in almost every script. Note that some properties are only available on specific event types.</p>
<div class="code-block">Event.Employee.DateOfHire                 <span class="cm">// DateTime — the employee's start date</span>
Event.Employee.EligibilityDate            <span class="cm">// nullable DateTime — may be null if not set</span>
Event.Employee.TerminationDate            <span class="cm">// DateTime — only populated on OnLifeEvent</span>
Event.Employee.ReasonTypeID               <span class="cm">// int — termination reason (304 = Death)</span>
Event.Employee.Salary                     <span class="cm">// numeric — annual salary</span>
Event.Employee.CustomFields["FieldName"]  <span class="cm">// raw value (1/0 for boolean fields)</span>
Event.Employee.GetCustom("FieldName")     <span class="cm">// null-safe accessor — returns null if field missing</span>
Event.Employee.EmployeePerson.Age(date)   <span class="cm">// calculates age as of the given date</span></div>
<div class="code-breakdown">
  <div class="breakdown-title">Key differences to know</div>
  <div class="breakdown-row"><span class="breakdown-line">CustomFields vs GetCustom</span><span class="breakdown-text"><span class="ic">CustomFields["Name"]</span> retrieves the raw value but may throw an error if the field does not exist on this case. <span class="ic">GetCustom("Name")</span> is the safer version — it returns null instead of crashing if the field is not configured.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Age(date)</span><span class="breakdown-text">You must pass a date to Age() because age depends on what point in time you are asking about. Use <span class="ic">Event.Engine.EffectiveDate</span> to get the employee's age as of their coverage effective date — which is what carriers use for rating.</span></div>
</div>
<h2>Engine, Config, Application, and Action</h2>
<p>These four sections of the Event object let you both read configuration and write back decisions. They are the output side of your script — where you tell BenSelect what to do.</p>
<div class="code-block">Event.Engine.RateGroup                    <span class="cm">// WRITE — route to a named rate table</span>
Event.Engine.Config.WaitingPeriod         <span class="cm">// READ — the waiting period length (number)</span>
Event.Engine.Config.WaitingPeriodType     <span class="cm">// READ — 0=Days, 1=Months, 2=Years</span>
Event.Engine.Config.EffectiveDateCalc     <span class="cm">// READ — 0=1st of month, 1=Immediately after</span>
Event.Config.GracePeriod                  <span class="cm">// READ — the grace period length (number)</span>
Event.Config.GracePeriodType              <span class="cm">// READ — 0=Days, 1=Months</span>
Event.Config.SetGILimit(amt)              <span class="cm">// WRITE — override GI limit for all benefit levels</span>
Event.Config.SetMaxBenefitAmount(i,n,amt) <span class="cm">// WRITE — override max per level (i) and band (n)</span>
Event.Config.RoundFactor                  <span class="cm">// WRITE — set rounding increment (e.g. 100 = round to $100)</span>
Event.Config.DeductionDateBeforeEffectiveDate  <span class="cm">// WRITE — set 0 to disable deduct-before</span>
Event.Application.EffectiveDate           <span class="cm">// WRITE — override coverage start date (OnEligible only)</span>
Event.Action.TerminationDate              <span class="cm">// WRITE — override coverage end date (OnLifeEvent only)</span></div>
<h2>Product, Eligibility, and Cross-Plan Lookups</h2>
<div class="code-block">Event.ProductTag                          <span class="cm">// READ — the XML tag name of the current product</span>
Event.Product.PayerProductID              <span class="cm">// READ — numeric ID used with GetPayerProductInfo()</span>
Event.Eligible                            <span class="cm">// WRITE false — removes this product from the employee view</span>
Event.LastCoverage                        <span class="cm">// READ — null if no prior coverage exists</span>
Event.LastCoverage.BenefitAmount          <span class="cm">// READ — the prior coverage dollar amount</span>
Event.Applications["MEDICAL"]            <span class="cm">// READ — the employee's medical application (null if not visited)</span>
Event.Applications["MEDICAL"].CoverageTypeID  <span class="cm">// READ — coverage tier: 4 = Employee Only</span></div>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <span class="ic">Event.Applications["TAG"]</span> is how you look up what the employee chose on a different plan. The "TAG" must match the XML tag name of the target product exactly — spelling and capitalization matter.</div>
<h2>Report Event Subtree</h2>
<p>When your script runs in report context (Module 13), the Event object has a different set of properties. These let you read, modify, filter, and aggregate report data row by row.</p>
<div class="code-block">Event.Value                               <span class="cm">// READ/WRITE — the current column's value</span>
Event.SkipRecord = true                   <span class="cm">// WRITE — suppress this row from the output</span>
Event.Record["FieldName"]                 <span class="cm">// READ — any field in the current row</span>
Event.Globals["key"]                      <span class="cm">// READ/WRITE — persists a value across all rows</span>
Event.FirstRecord / Event.LastRecord      <span class="cm">// READ — true on the absolute first/last row</span>
Event.FirstKeyRecord / Event.LastKeyRecord<span class="cm">// READ — true at start/end of a key group</span></div>`,

9: `<h2>Rate Group Scripting</h2>
<p>Rate group scripting is the most common task in BenSelect JScript. The concept is simple: read a condition about the employee, then set <span class="ic">Event.Engine.RateGroup</span> to the name of the appropriate rate table. The rate table itself is configured by an administrator in BenSelect — your script just selects which one to use.</p>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Real-world example:</strong> A hospital group has doctors and non-clinical staff. Doctors get different life insurance rates. The administrator creates two rate groups — "Physician" and "Standard" — in BenSelect admin. Your script reads a custom field called "Job Class" and routes each employee to the right group.</div>
<div class="code-block"><span class="cm">// Prior Decline — the simplest rate group pattern</span>
<span class="kw">var</span> priorDecline = Event.Employee.CustomFields["Prior Decline"];
<span class="kw">if</span>(priorDecline == 1){
    Event.Engine.RateGroup = "Prior Decline";
} <span class="kw">else</span> {
    Event.Engine.RateGroup = "default";
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Pattern explained</div>
  <div class="breakdown-row"><span class="breakdown-line">CustomFields</span><span class="breakdown-text">Reads the "Prior Decline" custom field. This was set by HR when loading the employee census file — your script reads what was already stored on the employee record.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">== 1 check</span><span class="breakdown-text">Boolean custom fields return 1 (yes) or 0 (no). Always compare explicitly with <span class="ic">== 1</span> rather than testing <span class="ic">if(priorDecline)</span> alone.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">RateGroup = "..."</span><span class="breakdown-text">The string must exactly match the rate group name configured in BenSelect admin. Spelling and capitalization must match — "Prior Decline" is different from "prior decline."</span></div>
</div>
<h2>Tier-Based Rate Group Routing</h2>
<p>A common pattern for life insurance products: if the employee enrolled in Medical as Employee Only, they get different life rates than an employee with family coverage. This script reads the employee's Medical election and routes life insurance accordingly.</p>
<div class="code-block"><span class="kw">const</span> MEDICAL_XML_TAG_NAME = "MEDICAL";
<span class="kw">const</span> EO_RATE_GROUP_NAME = "Employee";
<span class="kw">const</span> FA_RATE_GROUP_NAME = "Family";
<span class="kw">const</span> EMPLOYEE_ONLY_COVERAGE_TYPE_ID = 4;

<span class="kw">if</span>(Event.Applications[MEDICAL_XML_TAG_NAME] != null
   &amp;&amp; Event.Applications[MEDICAL_XML_TAG_NAME].CoverageTypeID == EMPLOYEE_ONLY_COVERAGE_TYPE_ID){
    Event.Engine.RateGroup = EO_RATE_GROUP_NAME;
} <span class="kw">else</span> {
    Event.Engine.RateGroup = FA_RATE_GROUP_NAME;
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Why constants are used</div>
  <div class="breakdown-row"><span class="breakdown-line">Constants</span><span class="breakdown-text">All the string names and the magic number 4 are declared as named constants at the top. This makes the if-statement readable — you can see what it checks at a glance — and makes future changes easy: update the constant, not every occurrence.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Null check first</span><span class="breakdown-text"><span class="ic">Event.Applications["MEDICAL"] != null</span> must come before <span class="ic">.CoverageTypeID</span>. If the employee has not visited the Medical section yet, the application object is null. The <span class="ic">&amp;&amp;</span> (and) operator short-circuits — if the left side is false, the right side never runs, preventing a crash.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">CoverageTypeID == 4</span><span class="breakdown-text">4 is BenSelect's internal code for "Employee Only" coverage tier. Anything else means the employee chose a family-tier election.</span></div>
</div>
<div class="warn-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L14.5 13.5H1.5L8 2Z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="11.75" r="0.75" fill="currentColor" stroke="none"/></svg> Always null-check <span class="ic">Event.Applications["TAG"]</span> before accessing its properties. If the employee has not yet navigated to that plan during this enrollment session, the application does not exist.</div>
<h2>Controlling Product Eligibility</h2>
<p>Setting <span class="ic">Event.Eligible = false</span> removes the current product from the employee's enrollment view entirely. Since OnEligible fires once per eligible product, your script can compare each product's tag name to the correct one and hide all the others.</p>
<div class="code-block"><span class="cm">// Show only the correct wellness product variant for this employee's situation</span>
<span class="kw">if</span>(PayrollWellness == true &amp;&amp; DiabeticWellness == false &amp;&amp; WeightManagement == false){
    <span class="kw">if</span>(Event.ProductTag != prod1_P_ND_NW &amp;&amp; Event.ProductTag != prod2_P_ND_NW){
        Event.Eligible = false;
    }
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">How OnEligible makes this work</div>
  <div class="breakdown-row"><span class="breakdown-line">Fires per product</span><span class="breakdown-text">OnEligible fires once for each eligible product. If there are 6 wellness product variants, this script runs 6 times. Each time it checks whether the current product (<span class="ic">Event.ProductTag</span>) is the right one for this employee's wellness situation.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Event.Eligible = false</span><span class="breakdown-text">Hides the current product from the enrollment screen for this employee. The product is not deleted — just hidden for this employee's session. Other employees may still see it.</span></div>
</div>
<h2>Custom Field Access Patterns</h2>
<div class="code-block"><span class="cm">// Pattern 1 — boolean custom field (returns 1 or 0, never true/false)</span>
<span class="kw">var</span> priorDecline = Event.Employee.CustomFields["Prior Decline"];
<span class="kw">if</span>(priorDecline == 1){ ... }

<span class="cm">// Pattern 2 — GetCustom() — null-safe, use for text and date fields</span>
<span class="kw">if</span>(Event.Employee.GetCustom("Coverage Termination Date") != null){ ... }</div>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> Use <span class="ic">CustomFields["Name"]</span> for boolean (yes/no) fields where you know the field always exists on this case. Use <span class="ic">GetCustom("Name")</span> for text and date fields, or when the field may not be configured on every case.</div>`,

10: `<h2>The Effective Date Calculation Chain</h2>
<p>Calculating a coverage effective date is one of the most common tasks in BenSelect scripting. The full chain is: <strong>Eligibility Date → add Waiting Period → apply Effective Date Calc Type → final Effective Date</strong>. Each step reads a different piece of configuration from the Event object.</p>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Real-world example:</strong> Employee hired March 10. The product has a 30-day waiting period with a "1st of month" calc type. Your script calculates: March 10 + 30 days = April 9 → roll to the 1st of the next month → May 1 effective date.</div>
<div class="code-block"><span class="cm">// Step 1: Get the eligibility date (null-safe)</span>
<span class="kw">if</span>(Event.Employee.EligibilityDate != null){
    eligibilityDate = DateTime.Parse(String.Format('{0:MM/dd/yyyy}',Event.Employee.EligibilityDate));
} <span class="kw">else</span> { eligibilityDate = Event.Employee.DateOfHire; }

<span class="cm">// Step 2: Add the waiting period</span>
<span class="kw">switch</span>(waitingPeriodType){
    <span class="kw">case</span> 0: effectiveDate = eligibilityDate.AddDays(waitingPeriod); <span class="kw">break</span>;
    <span class="kw">case</span> 1: effectiveDate = eligibilityDate.AddMonths(waitingPeriod); <span class="kw">break</span>;
    <span class="kw">case</span> 2: effectiveDate = eligibilityDate.AddYears(waitingPeriod); <span class="kw">break</span>;
}

<span class="cm">// Step 3: Apply the effective date calculation type</span>
<span class="kw">switch</span>(effectiveDateCalcType){
    <span class="kw">case</span> 0: <span class="cm">// 1st of month on or after the waiting-period date</span>
        <span class="kw">if</span>(effectiveDate.Day != 1){
            effectiveDate = effectiveDate.AddMonths(1);
            effectiveDate = new DateTime(effectiveDate.Year, effectiveDate.Month, 1);
        }
        <span class="kw">break</span>;
    <span class="kw">case</span> 1: effectiveDate = effectiveDate.AddDays(1); <span class="kw">break</span>; <span class="cm">// Immediately (next day)</span>
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Step-by-step breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">Step 1</span><span class="breakdown-text">Always start with the null-safe eligibility date pattern. <span class="ic">EligibilityDate</span> may be null for employees without a custom eligibility date — use <span class="ic">DateOfHire</span> as the fallback.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Step 2</span><span class="breakdown-text">Add the waiting period using the correct unit. <span class="ic">waitingPeriodType</span> (0=Days, 1=Months, 2=Years) determines which AddX method to call. <span class="ic">waitingPeriod</span> is the numeric length from BenSelect product settings.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Step 3 case 0</span><span class="breakdown-text"><strong>1st of month:</strong> If the calculated date is not already the 1st, roll it forward to the 1st of the following month. <span class="ic">new DateTime(year, month, 1)</span> constructs the 1st of a given month precisely — safer than adding days since months have different lengths.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Step 3 case 1</span><span class="breakdown-text"><strong>Immediately after:</strong> Some products take effect the day after the waiting period ends. Adding 1 day achieves this.</span></div>
</div>
<h2>Month-End Date Construction</h2>
<p>Building the last day of a month is a common need in termination scripts. You cannot hardcode "day 31" because months have different lengths. The trick: go to the 1st of the next month and subtract one day — .NET handles the month-length math correctly.</p>
<div class="code-block"><span class="cm">// Last day of the current month — works for all months including February</span>
new DateTime(termDate.Year, termDate.Month, 1).AddMonths(1).AddDays(-1)

<span class="cm">// Last day of the following month</span>
new DateTime(termDate.Year, termDate.Month, 1).AddMonths(2).AddDays(-1)</div>
<div class="code-breakdown">
  <div class="breakdown-title">How this works</div>
  <div class="breakdown-row"><span class="breakdown-line">new DateTime(..., 1)</span><span class="breakdown-text">Construct the 1st of the current month — a safe, known starting point that exists in every month.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">.AddMonths(1)</span><span class="breakdown-text">Move to the 1st of the next month. .NET correctly handles December to January and February in leap years.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">.AddDays(-1)</span><span class="breakdown-text">Step back one day. Since we are on the 1st of the next month, subtracting one day always lands on the last day of the original month.</span></div>
</div>
<h2>The Cutoff Date</h2>
<p>During Open Enrollment, the cutoff date is the last possible hire date for which an employee could have enrolled in the prior plan year. Employees hired before the cutoff who did not enroll are treated as late entrants.</p>
<div class="code-block"><span class="kw">switch</span>(effectiveDateCalcType){
    <span class="kw">case</span> 0: cutOffDate = currentPlanYearStartDate.AddMonths(-1).AddDays(1); <span class="kw">break</span>;
    <span class="kw">case</span> 1: cutOffDate = currentPlanYearStartDate.AddDays(-1); <span class="kw">break</span>;
}</div>
<h2>Overriding Effective and Termination Dates</h2>
<div class="code-block">Event.Application.EffectiveDate = effectiveDate; <span class="cm">// OnEligible — override when coverage starts</span>
Event.Action.TerminationDate = covTermDate;       <span class="cm">// OnLifeEvent — override when coverage ends</span></div>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> Use <span class="ic">Event.Application.EffectiveDate</span> in OnEligible scripts to control when coverage begins. Use <span class="ic">Event.Action.TerminationDate</span> in OnLifeEvent scripts to control when coverage ends. These are two different properties on two different event types — do not confuse them.</div>`,

11: `<h2>Benefit Levels and Age Bands</h2>
<p>Many BenSelect products have multiple benefit levels (coverage tiers like $25k / $50k / $75k) and age bands (different rates by age group like 18–29, 30–39, 40–49). When setting a maximum benefit amount or GI limit, you must set it for <strong>every combination</strong> of benefit level and age band — otherwise some combinations are left at the wrong default values.</p>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Analogy:</strong> Think of benefit levels as rows and age bands as columns in a grid. To cap every cell at the same value, you must visit every row and every column — that is what the nested for loop does.</div>
<div class="code-block"><span class="kw">var</span> payerProduct = Event.Config.GetPayerProductInfo(Event.Product.PayerProductID);
<span class="kw">var</span> numberOfBenefitLevels = payerProduct.BenefitLevels.Length;
<span class="kw">var</span> numberOfAgeBands = payerProduct.AgeBand[0].Length;

<span class="kw">for</span>(<span class="kw">var</span> i = 0; i &lt; numberOfBenefitLevels; i++){
    <span class="kw">for</span>(<span class="kw">var</span> n = 0; n &lt; numberOfAgeBands; n++){
        Event.Config.SetMaxBenefitAmount(i, n, trueMax);
    }
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">GetPayerProductInfo</span><span class="breakdown-text">Retrieves the full product configuration object. You need it to find out how many benefit levels and age bands this product has — those numbers vary per product and cannot be hardcoded.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">.Length</span><span class="breakdown-text">The Length property of an array tells you how many items it contains. <span class="ic">BenefitLevels.Length</span> might be 3 if the product has three tiers. <span class="ic">AgeBand[0].Length</span> gives the number of age band columns.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">for loop</span><span class="breakdown-text">A for loop runs a block of code repeatedly. <span class="ic">var i = 0</span> starts the counter at index 0. <span class="ic">i &lt; numberOfBenefitLevels</span> keeps looping while i is less than the total count. <span class="ic">i++</span> increments i by 1 each pass. This visits every index from 0 to (count minus 1).</span></div>
  <div class="breakdown-row"><span class="breakdown-line">SetMaxBenefitAmount</span><span class="breakdown-text">Sets the maximum benefit amount for benefit level <span class="ic">i</span> and age band <span class="ic">n</span>. Must be called for every combination — skipping any age band leaves employees in that band with the wrong maximum.</span></div>
</div>
<h2>SetMaxBenefitAmount vs SetGILimit</h2>
<ul>
<li><span class="ic">SetMaxBenefitAmount(i, n, amount)</span> — caps the maximum amount an employee can elect. The enrollment screen will not show any options above this cap.</li>
<li><span class="ic">SetGILimit(i, n, amount)</span> — sets the Guaranteed Issue threshold. Elections at or below this amount are auto-approved; anything above goes to Pending status requiring medical underwriting.</li>
<li><span class="ic">Event.Config.RoundFactor = 100</span> — rounds benefit elections to the nearest increment. Setting it to 100 means coverage amounts will always be a multiple of $100.</li>
</ul>
<h2>Late Entrant Eligibility Logic</h2>
<p>Late entrant logic protects carriers from adverse selection — employees waiting until they are sick before enrolling. The script evaluates three scenarios based on the enrollment window and prior coverage.</p>
<div class="code-block"><span class="kw">var</span> Now = System.DateTime.Today;

<span class="kw">if</span>(Now &lt;= eligibilityEndDate &amp;&amp; Event.LastCoverage == null){
    setMaximum(MAX_BEN_AMT);                        <span class="cm">// fresh enrollment, full access</span>
    <span class="kw">if</span>(eligibilityDate &lt; cutOffDate){
        setMaximum(LATE_ENTRANT_MAX_BEN_AMT);       <span class="cm">// hired before cutoff — was late last year</span>
    }
} <span class="kw">else if</span>(Now &gt; eligibilityEndDate &amp;&amp; Event.LastCoverage == null){
    setMaximum(LATE_ENTRANT_MAX_BEN_AMT);           <span class="cm">// past window with no prior coverage</span>
} <span class="kw">else</span> {
    setMaximum(Event.LastCoverage.BenefitAmount + INC_AMT); <span class="cm">// increasing existing coverage</span>
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Three-scenario breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">Scenario 1</span><span class="breakdown-text">Employee is still within the enrollment window and has never had this coverage. Give full access — but check if their hire date was before the cutoff, which would make them a late entrant from last year.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Scenario 2</span><span class="breakdown-text">Enrollment window has closed and they have no coverage. Classic late entrant — reduce their maximum to the late entrant cap.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Scenario 3</span><span class="breakdown-text">Employee already has coverage (Event.LastCoverage is not null). This is an OE increase — allow them to add the standard increment (INC_AMT) to their existing benefit amount.</span></div>
</div>
<h2>Age Band Step-Down Calculation</h2>
<div class="code-block"><span class="kw">var</span> age = Event.Employee.EmployeePerson.Age(Event.Engine.EffectiveDate);
<span class="kw">var</span> ageBand2dArray = payerProdInfo.AgeBand;
<span class="kw">var</span> stepDown = 0;

<span class="kw">for</span>(<span class="kw">var</span> idx = 0; idx &lt; ageBand2dArray[0].length; idx++){
    <span class="kw">if</span>(age &gt;= ageBand2dArray[0][idx]){
        stepDown = payerProdInfo.GetStepDown(0, idx);
    }
}
<span class="kw">if</span>(stepDown == 0){ stepDown = 100; } <span class="cm">// 0 means no step-down configured — use 100%</span>
<span class="kw">var</span> adjustedIncrement = BASE_INCREMENT * (stepDown / 100);</div>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> Some carrier products reduce the maximum benefit as employees age — this is called a step-down. The loop finds which age band the employee falls into and retrieves the step-down percentage for that band. A stepDown of 0 from GetStepDown means "no reduction configured" — the script defaults to 100% (no change) so the math still works.</div>`,

12: `<h2>Life Event Scripts Overview</h2>
<p>OnLifeEvent scripts fire when something significant changes in an employee's life: a new hire, a termination, a marriage, a newborn, and so on. Unlike OnEligible (which fires per product), OnLifeEvent fires once per event. The first thing every OnLifeEvent script should do is check <em>which</em> life event is happening — a script that handles terminations should not accidentally run its termination logic when a marriage event fires.</p>
<div class="code-block"><span class="kw">var</span> theEvent = Event.EventType.toString();
<span class="kw">var</span> reasonID = Event.Employee.ReasonTypeID; <span class="cm">// 304 = Death</span>

<span class="kw">if</span>(theEvent == "Terminated" &amp;&amp; reasonID != 304){
    <span class="cm">// handle non-death termination only</span>
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Why this pattern is required</div>
  <div class="breakdown-row"><span class="breakdown-line">EventType.toString()</span><span class="breakdown-text"><span class="ic">Event.EventType</span> is an internal numeric enum. Calling <span class="ic">.toString()</span> converts it to a readable string like "Terminated," "NewHire," or "MarriageEvent." Always convert to string before comparing — comparing enum values directly is unreliable in JScript.NET.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">reasonID != 304</span><span class="breakdown-text">Death terminations (ReasonTypeID 304) are handled differently — coverage may continue for dependents, or a different termination date applies. Excluding reason 304 ensures death cases fall through to separate handling.</span></div>
</div>
<h2>The 15th Cutoff Pattern — Month-End Termination Logic</h2>
<p>A very common client requirement: if an employee terminates on or before the 15th of the month, coverage ends at the end of that same month. If they terminate after the 15th, coverage runs through the end of the following month. This ensures employees who paid a full month's premium receive a full month of coverage.</p>
<div class="code-block"><span class="kw">const</span> CUTOFF_DAY = 15;
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
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Line-by-line breakdown</div>
  <div class="breakdown-row"><span class="breakdown-line">Constants</span><span class="breakdown-text">Declared at the top — the cutoff day (15) and death reason ID (304) are named. If the client later changes to the 20th cutoff, you update one line. The if-statement in the middle stays clean and readable.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Triple condition</span><span class="breakdown-text">The outer if checks three things with <span class="ic">&amp;&amp;</span> (all must be true): 1) this is a termination event, 2) a termination date exists (not null), and 3) it is not a death. All three must pass before any date calculation runs.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">termDate.Day</span><span class="breakdown-text"><span class="ic">.Day</span> is a DateTime property returning the day of the month (1–31). Comparing it to CUTOFF_DAY (15) determines which month-end formula to use.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Month-end formula</span><span class="breakdown-text"><span class="ic">new DateTime(year, month, 1).AddMonths(1).AddDays(-1)</span> — builds the 1st of the month, jumps one month forward, then steps back one day. Always lands on the last day of the original month, regardless of month length.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Event.Action.TerminationDate</span><span class="breakdown-text">Writing to this property overrides when BenSelect ends the employee's coverage. It sets the end date on the coverage record and affects what appears in carrier export files.</span></div>
</div>
<h2>Custom Termination Date with Range Validation</h2>
<p>Some clients allow HR to enter a custom coverage termination date on the employee record. Your script reads that date but first validates it is within an acceptable range — catching data entry errors before they create wildly incorrect termination dates in carrier files.</p>
<div class="code-block"><span class="kw">const</span> dayRange = 100;
<span class="kw">var</span> covTermDate = DateTime.Parse(String.Format('{0:MM/dd/yyyy}',
    Event.Employee.GetCustom("Coverage Termination Date")));
<span class="kw">var</span> maxCovTermDate = Event.Employee.TerminationDate.AddDays(dayRange);
<span class="kw">var</span> minCovTermDate = Event.Employee.TerminationDate.AddDays(-1 * dayRange);

<span class="kw">if</span>(covTermDate &gt; currentPlanYearEndDate){ covTermDate = currentPlanYearEndDate; }
<span class="kw">else if</span>(covTermDate &gt; maxCovTermDate){ covTermDate = maxCovTermDate; }
<span class="kw">else if</span>(covTermDate &lt; minCovTermDate){ covTermDate = minCovTermDate; }
Event.Action.TerminationDate = covTermDate;</div>
<div class="code-breakdown">
  <div class="breakdown-title">Validation logic explained</div>
  <div class="breakdown-row"><span class="breakdown-line">dayRange = 100</span><span class="breakdown-text">The maximum days before or after the actual termination date considered acceptable. 100 days gives flexibility while catching obvious errors (like a wrong year typed in the custom field).</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Range clamps</span><span class="breakdown-text">Three if/else-if checks ensure the custom date stays within bounds. If the entered date is beyond the plan year end, too far in the future, or too far in the past — it is automatically clamped to the nearest acceptable value rather than crashing or using the bad date.</span></div>
</div>
<h2>The Deduct-Before Two-Script Pattern</h2>
<p>Some products use "deduct-before" — payroll deductions begin before the coverage effective date to collect premiums for an already-covered period. When a life event fires, deduct-before logic should often be disabled. This requires two separate scripts because they run at different event types.</p>
<ul>
<li><strong>Part 1 (OnEligible)</strong> — recalculates and overrides the coverage effective date: <span class="ic">Event.Application.EffectiveDate = effectiveDate;</span></li>
<li><strong>Part 2 (OnLifeEvent)</strong> — disables deduct-before for this life event: <span class="ic">Event.Config.DeductionDateBeforeEffectiveDate = 0;</span></li>
</ul>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> These two scripts fire at different points in the enrollment lifecycle and must be separate. Trying to combine them into one script will not work because the event types are different.</div>`,

13: `<h2>How the Report Engine Works</h2>
<p>BenSelect's report engine processes enrollment data row by row. For every column in every row, BenSelect calls your JScript and gives you the chance to read or modify the value before it appears in the output. This is different from enrollment scripting — instead of the Event object representing a product eligibility check, here it represents a single data cell in a report row.</p>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Analogy:</strong> Imagine a spreadsheet with thousands of rows. The report engine walks through each cell, one at a time, and for each one asks: "Do you want to change this value before I output it?" Your script says yes or no, and can replace the value with something else.</div>
<div class="code-block"><span class="cm">// Simple transformation: convert 1/0 gender code to M/F string</span>
<span class="kw">if</span>(Event.Value){ Event.Value = 'M'; } <span class="kw">else</span> { Event.Value = 'F'; }</div>
<div class="code-breakdown">
  <div class="breakdown-title">What this does</div>
  <div class="breakdown-row"><span class="breakdown-line">Event.Value (read)</span><span class="breakdown-text">Contains what the database returned for this column. In this example, a 1 or 0 representing male or female.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Event.Value (write)</span><span class="breakdown-text">Assigning a new value here replaces what the report outputs. The original database value is unchanged — only the report output changes.</span></div>
</div>
<h2>Core Report Event Properties</h2>
<div class="code-block">Event.Value             <span class="cm">// READ/WRITE — the current column's value</span>
Event.Record["field"]   <span class="cm">// READ — any field in the current row (by field name)</span>
Event.SkipRecord = true <span class="cm">// WRITE — remove this entire row from the output</span>
Event.Globals["key"]    <span class="cm">// READ/WRITE — persist a value that survives across rows</span>
Event.FirstRecord       <span class="cm">// READ — true only on the very first row</span>
Event.LastRecord        <span class="cm">// READ — true only on the very last row</span>
Event.FirstKeyRecord    <span class="cm">// READ — true on first row within the current key group</span>
Event.LastKeyRecord     <span class="cm">// READ — true on last row within the current key group</span>
Event.StartOver = true  <span class="cm">// WRITE — reprocess the current key group from the beginning</span></div>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Key group:</strong> A group of consecutive rows sharing the same key value — for example, all rows for the same employee. FirstKeyRecord and LastKeyRecord let your script detect when it enters or exits a group, useful for per-employee calculations.</div>
<h2>Row Suppression — Filtering Output</h2>
<p>Setting <span class="ic">Event.SkipRecord = true</span> removes the entire current row from the report. The row is not deleted from the database — it simply does not appear in this output.</p>
<div class="code-block"><span class="cm">// Skip dependent rows — only output the primary employee (relationship 0)</span>
Event.SkipRecord = Event.Record["DependentRelationshipID"] != 0;

<span class="cm">// Skip rows where no benefit was elected</span>
<span class="kw">if</span>(Event.Record["BenefitAmount"] == 0){ Event.SkipRecord = true; }</div>
<div class="code-breakdown">
  <div class="breakdown-title">Pattern notes</div>
  <div class="breakdown-row"><span class="breakdown-line">Direct assignment</span><span class="breakdown-text">The first example assigns the result of a comparison directly to Event.SkipRecord. <span class="ic">DependentRelationshipID != 0</span> evaluates to true for dependents and false for the employee — so dependents are automatically skipped without an explicit if/else.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Zero-amount rows</span><span class="breakdown-text">Rows with no elected coverage often appear as zero-amount records in the raw data. Suppressing them keeps the carrier file clean — carriers typically do not want zero-benefit rows in their files.</span></div>
</div>
<h2>Persisting Values Across Rows with Globals</h2>
<p>Normally each row's script execution is independent — local variables reset each time. If you need to carry a value from one row to the next (like a running total), use <span class="ic">Event.Globals</span>. Values stored there survive across all rows for the duration of the report run.</p>
<div class="code-block"><span class="kw">if</span>(Event.FirstRecord){ Event.Globals["total"] = 0; }      <span class="cm">// initialize on first row</span>
Event.Globals["total"] = Event.Globals["total"] + Event.Value; <span class="cm">// accumulate each row</span>
<span class="kw">if</span>(Event.LastRecord){ Event.Value = Event.Globals["total"]; } <span class="cm">// output total on last row</span></div>
<div class="code-breakdown">
  <div class="breakdown-title">Running total pattern</div>
  <div class="breakdown-row"><span class="breakdown-line">FirstRecord init</span><span class="breakdown-text">Set the accumulator to 0 on the very first row. Without this, Globals["total"] would start as undefined and the addition would fail.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Accumulate</span><span class="breakdown-text">Each row adds its Event.Value to the running total stored in Globals. This runs on every row including the last.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">LastRecord output</span><span class="breakdown-text">On the final row, overwrite Event.Value with the accumulated total. This makes the last row's column display the sum instead of just the individual row's value.</span></div>
</div>
<h2>Event.Value in Forms and Questions</h2>
<p>In a form or question context (not a data report), <span class="ic">Event.Value</span> controls whether the form or question is displayed to the employee. Set it to true to show, false to hide.</p>
<div class="code-block"><span class="cm">// Show this form only when the employee is increasing their benefit amount</span>
Event.Value = Event.Application.IncreaseBenefitAmount &gt; 0;</div>
<div class="info-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none"/></svg> <strong>Useful built-in report methods:</strong> <span class="ic">Event.FormatSSN()</span>, <span class="ic">Event.FormatPhone()</span>, <span class="ic">Event.FormatEIN()</span>, <span class="ic">Event.StripNonNumeric()</span>, <span class="ic">Event.LeftStr()</span>. These handle common carrier file formatting needs without custom string manipulation.</div>`,

14: `<h2>Final Certification Exam Overview</h2>
<p>This exam tests your ability to apply everything from Modules 1 through 13. There are three parts, totaling 100 points. You need 70 points (70%) to receive your BenSelect JScript certification.</p>
<ul>
<li><strong>Part A — Multiple choice (30 points):</strong> 6 questions covering concepts from all modules — event types, null handling, custom fields, date arithmetic, and report scripting.</li>
<li><strong>Part B — Code reading (30 points):</strong> Read an unfamiliar script and answer questions about what it does and why. You will not run it — just read and interpret.</li>
<li><strong>Part C — Code writing (40 points):</strong> Write a complete BenSelect script from a written specification. You are given the requirements; you write the code from scratch.</li>
</ul>
<h2>The Six Patterns to Know Cold</h2>
<p>These six patterns appear repeatedly in production BenSelect scripts. If you can write each one from memory, you are prepared for the exam — and for real scripting work.</p>
<div class="code-block"><span class="cm">// 1. Null-safe date parse — use whenever reading a nullable BenSelect date</span>
DateTime.Parse(String.Format('{0:MM/dd/yyyy}', Event.Employee.EligibilityDate))

<span class="cm">// 2. Plan year null check — required in any script touching plan year dates</span>
<span class="kw">if</span>(Event.PlanYear){ ... } <span class="kw">else</span> { Event.Case.EnabledPlanYears[0] }

<span class="cm">// 3. Boolean custom field — always compare with == 1, never just if(field)</span>
<span class="kw">if</span>(Event.Employee.CustomFields["Flag"] == 1){ ... }

<span class="cm">// 4. Month-end date construction — handles all month lengths including February</span>
<span class="kw">new</span> DateTime(d.Year, d.Month, 1).AddMonths(1).AddDays(-1)

<span class="cm">// 5. Termination event check — always exclude death (304) from standard term logic</span>
<span class="kw">var</span> theEvent = Event.EventType.toString();
<span class="kw">if</span>(theEvent == "Terminated" &amp;&amp; Event.Employee.ReasonTypeID != 304){ ... }

<span class="cm">// 6. Benefit max nested loop — covers every level and band combination</span>
<span class="kw">for</span>(<span class="kw">var</span> i = 0; i &lt; numLevels; i++){
    <span class="kw">for</span>(<span class="kw">var</span> n = 0; n &lt; numBands; n++){
        Event.Config.SetMaxBenefitAmount(i, n, trueMax);
    }
}</div>
<div class="code-breakdown">
  <div class="breakdown-title">Why each pattern matters</div>
  <div class="breakdown-row"><span class="breakdown-line">Pattern 1</span><span class="breakdown-text">EligibilityDate is nullable. The two-step parse (String.Format then DateTime.Parse) normalizes it into a reliable .NET DateTime ready for date arithmetic.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Pattern 2</span><span class="breakdown-text">Event.PlanYear is null during the first plan year of any new case build. Accessing its properties without this check crashes every enrollment in that first year.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Pattern 3</span><span class="breakdown-text">BenSelect boolean custom fields return numbers (1/0), not true/false. Explicit == 1 comparison is required.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Pattern 4</span><span class="breakdown-text">Go to the 1st of the next month then subtract one day — works for every month including February in leap years.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Pattern 5</span><span class="breakdown-text">Death terminations (reason 304) have special handling — do not apply standard month-end termination date logic to them.</span></div>
  <div class="breakdown-row"><span class="breakdown-line">Pattern 6</span><span class="breakdown-text">Benefit limits and GI amounts must be set per benefit level and per age band. Skipping any combination leaves it at the wrong default.</span></div>
</div>
<h2>Code Writing Tips for Part C</h2>
<p>When the exam gives you a written specification and asks you to write the script, follow this approach:</p>
<ul>
<li><strong>Start with constants.</strong> Identify every hardcoded number or string in the spec and declare them as named constants at the top using UPPER_SNAKE_CASE.</li>
<li><strong>Identify the event type.</strong> Is this OnEligible or OnLifeEvent? Add a comment: <span class="ic">// EventType: OnEligible</span>. The rest of your structure depends on this.</li>
<li><strong>Add the DEBUG flag.</strong> Always include <span class="ic">const DEBUG = false;</span> at the top and wrap any test output in <span class="ic">if(DEBUG){ ... }</span>.</li>
<li><strong>Null-check before every property access.</strong> Before using Event.PlanYear, Event.LastCoverage, any application lookup, or any nullable date — add a null check.</li>
<li><strong>For OnLifeEvent:</strong> Check <span class="ic">Event.EventType.toString()</span> first. Logic should only run for the specific event type the spec describes.</li>
<li><strong>For OnEligible:</strong> Remember the script runs once per eligible product. If filtering by product tag, that logic must cover every execution.</li>
</ul>
<div class="outcome-box">
  <div class="outcome-label">You are ready</div>
  <div class="outcome-text">You have completed all 13 training modules. You understand the Event object hierarchy, date arithmetic, null safety, rate group routing, benefit limit scripting, life event handling, and report scripting. The six patterns above are the foundation of every production BenSelect JScript script. Good luck on the exam.</div>
</div>`,
}
