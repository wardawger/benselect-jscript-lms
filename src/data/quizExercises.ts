export interface ExerciseKeyword {
  pattern: RegExp
  points: number
  label: string
}

export interface QuizExercise {
  title: string
  intro: string
  task: string
  starter: string
  hints: string[]
  keywords: ExerciseKeyword[]
  solution: string
  solutionExplain: string
}

export const QUIZ_EXERCISES: Record<number, QuizExercise> = {
  1: {
    title: 'Your First BenSelect Script',
    intro: 'Every BenSelect JScript begins with a comment that declares its event type. This tells BenSelect when to run your script — OnEligible, OnLifeEvent, or OnReport.',
    task: 'Write a script that: (1) declares itself as an OnEligible script, (2) creates a constant DEBUG set to false, (3) uses an if(DEBUG) block to print "Script loaded" to the debug window.',
    starter: '// Write your script below\n',
    hints: [
      'The event type comment looks like: // EventType: OnEligible',
      'Use const DEBUG = false; to create a boolean constant',
      'Event.Debug() sends output to the admin debug window',
      'An if block looks like: if(DEBUG){ Event.Debug("message"); }',
    ],
    keywords: [
      { pattern: /\/\/\s*EventType:\s*OnEligible/i,   points: 1, label: '// EventType: OnEligible comment' },
      { pattern: /const\s+DEBUG\s*=\s*false/,          points: 1, label: 'const DEBUG = false' },
      { pattern: /if\s*\(\s*DEBUG\s*\)/,               points: 1, label: 'if(DEBUG) block' },
      { pattern: /Event\.Debug\s*\(/,                  points: 1, label: 'Event.Debug() call' },
    ],
    solution: `// EventType: OnEligible
const DEBUG = false;

if(DEBUG){
    Event.Debug("Script loaded");
}`,
    solutionExplain: 'The EventType comment is required — BenSelect uses it to route the script to the correct enrollment event. const DEBUG = false is the professional pattern: flip it to true only while troubleshooting, ensuring debug output never reaches employees in production.',
  },

  2: {
    title: 'Reading the Hire Date',
    intro: 'Event.Employee.DateOfHire gives you a System.DateTime value representing when the employee was hired. You can read properties like .Month, .Day, and .Year from it.',
    task: 'Write an OnEligible script that: (1) stores the hire date in a variable called hireDate, (2) stores the hire year in a variable called hireYear, (3) if DEBUG is true, prints the hire year.',
    starter: '// EventType: OnEligible\nconst DEBUG = false;\n\n// Your code here\n',
    hints: [
      'var hireDate = Event.Employee.DateOfHire;',
      'DateTime has a .Year property that returns a 4-digit integer',
      'String concatenation: Event.Debug("Year: " + hireYear)',
    ],
    keywords: [
      { pattern: /var\s+hireDate\s*=\s*Event\.Employee\.DateOfHire/,       points: 1, label: 'hireDate variable' },
      { pattern: /\.\s*Year\b/,                                              points: 1, label: '.Year property' },
      { pattern: /Event\.Debug\s*\(/,                                        points: 1, label: 'Event.Debug() call' },
    ],
    solution: `// EventType: OnEligible
const DEBUG = false;

var hireDate = Event.Employee.DateOfHire;
var hireYear = hireDate.Year;

if(DEBUG){
    Event.Debug("Hire year: " + hireYear);
}`,
    solutionExplain: 'Storing Event.Employee.DateOfHire in a local variable first is best practice — it reads the value once and makes the code easier to follow. .Year is a .NET DateTime property that returns the integer year.',
  },

  3: {
    title: 'Null-Safe EligibilityDate',
    intro: 'Event.Employee.EligibilityDate is a nullable DateTime — it can be null if no eligibility date was entered. Always check for null before using it or you risk a runtime error that halts enrollment.',
    task: 'Write a script that stores EligibilityDate in a variable, then uses an if/else: if it is null, debug "No eligibility date set"; otherwise debug the eligibility year.',
    starter: '// EventType: OnEligible\nconst DEBUG = true;\n\n',
    hints: [
      'var eligDate = Event.Employee.EligibilityDate;',
      'Check: if(eligDate == null){ ... } else { ... }',
      'Access the year with eligDate.Year inside the else block',
    ],
    keywords: [
      { pattern: /Event\.Employee\.EligibilityDate/,  points: 1, label: 'EligibilityDate read' },
      { pattern: /==\s*null|!=\s*null/,               points: 1, label: 'null check' },
      { pattern: /else\s*\{/,                          points: 1, label: 'else branch' },
      { pattern: /\.Year\b/,                           points: 1, label: '.Year property' },
    ],
    solution: `// EventType: OnEligible
const DEBUG = true;

var eligDate = Event.Employee.EligibilityDate;

if(eligDate == null){
    if(DEBUG){ Event.Debug("No eligibility date set"); }
} else {
    if(DEBUG){ Event.Debug("Elig year: " + eligDate.Year); }
}`,
    solutionExplain: 'Null-checking EligibilityDate is one of the most common patterns in BenSelect scripting. Skipping this check causes a NullReferenceException that aborts the entire enrollment session for that employee.',
  },

  4: {
    title: 'Waiting Period Calculation',
    intro: 'The enrollment engine exposes Event.Engine.Config.WaitingPeriod (integer) and WaitingPeriodType (0=Days, 1=Months, 2=Years). You add the waiting period to the eligibility date to get an effective date.',
    task: 'Write a script that reads the waiting period and its type, then uses a switch statement to calculate effectiveDate by adding the waiting period to eligDate using .AddDays(), .AddMonths(), or .AddYears().',
    starter: '// EventType: OnEligible\nconst DEBUG = false;\n\nvar eligDate = Event.Employee.EligibilityDate;\nvar waitingPeriod = Event.Engine.Config.WaitingPeriod;\nvar waitingPeriodType = Event.Engine.Config.WaitingPeriodType;\nvar effectiveDate;\n\n// Your switch statement here\n',
    hints: [
      'switch(waitingPeriodType){ case 0: ... break; case 1: ... break; case 2: ... break; }',
      'case 0 = Days: effectiveDate = eligDate.AddDays(waitingPeriod);',
      'case 1 = Months: effectiveDate = eligDate.AddMonths(waitingPeriod);',
      'case 2 = Years: effectiveDate = eligDate.AddYears(waitingPeriod);',
    ],
    keywords: [
      { pattern: /Event\.Engine\.Config\.WaitingPeriod\b/,     points: 1, label: 'WaitingPeriod read' },
      { pattern: /Event\.Engine\.Config\.WaitingPeriodType/,   points: 1, label: 'WaitingPeriodType read' },
      { pattern: /switch\s*\(/,                                  points: 1, label: 'switch statement' },
      { pattern: /\.AddDays\s*\(/,                              points: 1, label: '.AddDays()' },
      { pattern: /\.AddMonths\s*\(/,                            points: 1, label: '.AddMonths()' },
    ],
    solution: `// EventType: OnEligible
const DEBUG = false;

var eligDate = Event.Employee.EligibilityDate;
var waitingPeriod = Event.Engine.Config.WaitingPeriod;
var waitingPeriodType = Event.Engine.Config.WaitingPeriodType;
var effectiveDate;

switch(waitingPeriodType){
    case 0: effectiveDate = eligDate.AddDays(waitingPeriod); break;
    case 1: effectiveDate = eligDate.AddMonths(waitingPeriod); break;
    case 2: effectiveDate = eligDate.AddYears(waitingPeriod); break;
}`,
    solutionExplain: 'The switch on WaitingPeriodType mirrors how the engine documents the three waiting-period modes. Using .AddDays/.AddMonths/.AddYears returns a NEW DateTime — the original eligDate is unchanged, which is correct since you may need it again.',
  },

  5: {
    title: 'First-of-Month Effective Date',
    intro: 'A common plan rule is "effective the first of the month following the waiting period." You achieve this by taking any date and computing the first of its NEXT month: new DateTime(date.Year, date.Month, 1).AddMonths(1)',
    task: 'Given a variable effectiveDate (already declared), compute firstOfNextMonth using new DateTime and .AddMonths(1), then assign it back to Event.Application.EffectiveDate.',
    starter: '// EventType: OnEligible\nconst DEBUG = false;\n\nvar effectiveDate = Event.Employee.EligibilityDate.AddDays(30);\nvar firstOfNextMonth;\n\n// Your code here\n',
    hints: [
      'new DateTime(year, month, 1) creates the first of a month',
      'Then .AddMonths(1) moves it to the first of the NEXT month',
      'effectiveDate.Year and effectiveDate.Month give the components',
      'Assign back: Event.Application.EffectiveDate = firstOfNextMonth;',
    ],
    keywords: [
      { pattern: /new\s+DateTime\s*\(/,                       points: 1, label: 'new DateTime()' },
      { pattern: /\.AddMonths\s*\(\s*1\s*\)/,                 points: 1, label: '.AddMonths(1)' },
      { pattern: /Event\.Application\.EffectiveDate\s*=/,     points: 1, label: 'Event.Application.EffectiveDate assignment' },
    ],
    solution: `// EventType: OnEligible
const DEBUG = false;

var effectiveDate = Event.Employee.EligibilityDate.AddDays(30);
var firstOfNextMonth;

firstOfNextMonth = new DateTime(effectiveDate.Year, effectiveDate.Month, 1).AddMonths(1);

Event.Application.EffectiveDate = firstOfNextMonth;`,
    solutionExplain: 'The new DateTime(y, m, 1).AddMonths(1) idiom reliably produces the first of the next month regardless of how many days are in the current month. Assigning to Event.Application.EffectiveDate overrides whatever the engine calculated.',
  },

  6: {
    title: 'Setting Event.Eligible',
    intro: 'Event.Eligible defaults to true. Setting it to false removes the current product from the employee\'s available elections. This is how you enforce eligibility rules in OnEligible scripts.',
    task: 'Write a script that reads the employee salary. If the salary is less than 20000, set Event.Eligible to false and debug "Ineligible: salary below minimum".',
    starter: '// EventType: OnEligible\nconst DEBUG = false;\n\n',
    hints: [
      'var salary = Event.Employee.Salary;',
      'if(salary < 20000){ Event.Eligible = false; }',
      'Event.Debug() inside the if block for the message',
    ],
    keywords: [
      { pattern: /Event\.Employee\.Salary/,   points: 1, label: 'Salary read' },
      { pattern: /Event\.Eligible\s*=\s*false/, points: 1, label: 'Event.Eligible = false' },
      { pattern: /if\s*\(/,                   points: 1, label: 'if condition' },
    ],
    solution: `// EventType: OnEligible
const DEBUG = false;

var salary = Event.Employee.Salary;

if(salary < 20000){
    Event.Eligible = false;
    if(DEBUG){ Event.Debug("Ineligible: salary below minimum"); }
}`,
    solutionExplain: 'Setting Event.Eligible = false is the primary mechanism for eligibility gating. The engine checks this value after every OnEligible script runs and hides the product if false. You never need to set it to true — that\'s the default.',
  },

  7: {
    title: 'PlanYear Null Guard',
    intro: 'Event.PlanYear is null in the very first plan year because there is no "current" plan year until one has been defined. Scripts that access Event.PlanYear without guarding crash on first-year enrollments.',
    task: 'Write a script that null-checks Event.PlanYear. If it exists, store the plan year start date in planYearStart and debug it. If it\'s null, fall back to Event.Case.EnabledPlanYears[0].PlanYearStartDate.',
    starter: '// EventType: OnEligible\nconst DEBUG = true;\n\nvar planYearStart;\n\n',
    hints: [
      'if(Event.PlanYear){ ... } else { ... }',
      'Event.PlanYear.PlanYearStartDate is the start date',
      'Fallback: Event.Case.EnabledPlanYears[0].PlanYearStartDate',
    ],
    keywords: [
      { pattern: /if\s*\(\s*Event\.PlanYear\s*\)/,               points: 1, label: 'Event.PlanYear null guard' },
      { pattern: /Event\.PlanYear\.PlanYearStartDate/,            points: 1, label: 'PlanYearStartDate read' },
      { pattern: /Event\.Case\.EnabledPlanYears/,                 points: 1, label: 'Fallback to EnabledPlanYears' },
      { pattern: /else\s*\{/,                                     points: 1, label: 'else branch for fallback' },
    ],
    solution: `// EventType: OnEligible
const DEBUG = true;

var planYearStart;

if(Event.PlanYear){
    planYearStart = Event.PlanYear.PlanYearStartDate;
} else {
    planYearStart = Event.Case.EnabledPlanYears[0].PlanYearStartDate;
}

if(DEBUG){ Event.Debug("Plan year start: " + planYearStart); }`,
    solutionExplain: 'The if(Event.PlanYear) guard is JavaScript truthy checking — null is falsy, so the else branch runs when there is no current plan year. Event.Case.EnabledPlanYears[0] is the oldest plan year on the case, a reliable fallback for first-year enrollments.',
  },

  8: {
    title: 'Rate Group Override',
    intro: 'Event.Engine.RateGroup is a string that controls which rate table the engine uses to price coverage. Setting it in an OnEligible script overrides the default rate group for this employee.',
    task: 'Write a script that reads the employee\'s salary. If salary >= 100000, set the rate group to "Executive". Otherwise set it to "Standard". Debug which group was assigned.',
    starter: '// EventType: OnEligible\nconst DEBUG = false;\n\n',
    hints: [
      'var salary = Event.Employee.Salary;',
      'Event.Engine.RateGroup = "Executive";',
      'Use if/else to choose the rate group string',
    ],
    keywords: [
      { pattern: /Event\.Employee\.Salary/,                                points: 1, label: 'Salary read' },
      { pattern: /Event\.Engine\.RateGroup\s*=/,                           points: 1, label: 'RateGroup assignment' },
      { pattern: /"Executive"|'Executive'/,                                 points: 1, label: '"Executive" rate group' },
      { pattern: /"Standard"|'Standard'/,                                   points: 1, label: '"Standard" rate group' },
    ],
    solution: `// EventType: OnEligible
const DEBUG = false;

var salary = Event.Employee.Salary;
var rateGroup;

if(salary >= 100000){
    rateGroup = "Executive";
} else {
    rateGroup = "Standard";
}

Event.Engine.RateGroup = rateGroup;

if(DEBUG){ Event.Debug("Rate group: " + rateGroup); }`,
    solutionExplain: 'Event.Engine.RateGroup must be set BEFORE the engine calculates rates — it is read-and-applied during OnEligible execution. String values must exactly match a rate group name configured in the plan setup.',
  },

  9: {
    title: 'Last Coverage Check',
    intro: 'Event.LastCoverage holds the employee\'s prior-year coverage. It is null for new enrollments. A common pattern is to pre-populate elections based on last year\'s benefit amount.',
    task: 'Write a script that checks if Event.LastCoverage is not null. If it exists, store the benefit amount in lastAmount and set Event.Application.IncreaseBenefitAmount to lastAmount. Debug the amount.',
    starter: '// EventType: OnEligible\nconst DEBUG = false;\n\n',
    hints: [
      'if(Event.LastCoverage != null){ ... }',
      'var lastAmount = Event.LastCoverage.BenefitAmount;',
      'Event.Application.IncreaseBenefitAmount = lastAmount;',
    ],
    keywords: [
      { pattern: /Event\.LastCoverage\s*!=\s*null/,              points: 1, label: 'LastCoverage null check' },
      { pattern: /Event\.LastCoverage\.BenefitAmount/,            points: 1, label: 'BenefitAmount read' },
      { pattern: /Event\.Application\.IncreaseBenefitAmount\s*=/, points: 1, label: 'IncreaseBenefitAmount set' },
    ],
    solution: `// EventType: OnEligible
const DEBUG = false;

if(Event.LastCoverage != null){
    var lastAmount = Event.LastCoverage.BenefitAmount;
    Event.Application.IncreaseBenefitAmount = lastAmount;
    if(DEBUG){ Event.Debug("Carried forward: " + lastAmount); }
}`,
    solutionExplain: 'Checking Event.LastCoverage != null before reading BenefitAmount is essential — for new hires there is no prior coverage, and the null check prevents a runtime crash. IncreaseBenefitAmount pre-fills the election amount in the enrollment wizard.',
  },

  10: {
    title: 'GI Limit Configuration',
    intro: 'Event.Config.SetGILimit(levelIdx, bandIdx, amount) sets a Guaranteed Issue limit for a specific benefit level and age band combination. You loop over all levels and bands to apply limits uniformly.',
    task: 'Write a script that loops over 3 benefit levels (0–2) and 4 age bands (0–3) and calls Event.Config.SetGILimit with a trueMax of 50000 for each combination.',
    starter: '// EventType: OnEligible\nconst DEBUG = false;\n\nvar numberOfBenefitLevels = 3;\nvar numberOfAgeBands = 4;\nvar trueMax = 50000;\n\n// Your nested for loop here\n',
    hints: [
      'for(var i = 0; i < numberOfBenefitLevels; i++){',
      '  for(var n = 0; n < numberOfAgeBands; n++){',
      '    Event.Config.SetGILimit(i, n, trueMax);',
      '  }',
      '}',
    ],
    keywords: [
      { pattern: /for\s*\(\s*var\s+i/,                   points: 1, label: 'outer for loop' },
      { pattern: /for\s*\(\s*var\s+n/,                   points: 1, label: 'inner for loop' },
      { pattern: /Event\.Config\.SetGILimit\s*\(/,        points: 1, label: 'SetGILimit call' },
    ],
    solution: `// EventType: OnEligible
const DEBUG = false;

var numberOfBenefitLevels = 3;
var numberOfAgeBands = 4;
var trueMax = 50000;

for(var i = 0; i < numberOfBenefitLevels; i++){
    for(var n = 0; n < numberOfAgeBands; n++){
        Event.Config.SetGILimit(i, n, trueMax);
    }
}`,
    solutionExplain: 'The nested loop ensures every level/band combination gets the GI limit. Level index 0 is the first benefit level in the plan UI (e.g., $10,000), and band index 0 is the youngest age band. SetGILimit must be called once per combination — there is no "set all" shortcut.',
  },

  11: {
    title: 'Custom Field Read',
    intro: 'Custom fields on the employee are stored in Event.Employee.CustomFields as a Hashtable. Boolean fields are stored as "1" (true) or "0" (false) — always convert them.',
    task: 'Write a script that reads the custom field "IsUnion" and checks if its string value equals "1". If so, set the rate group to "Union". Debug the field value.',
    starter: '// EventType: OnEligible\nconst DEBUG = false;\n\n',
    hints: [
      'var isUnion = Event.Employee.CustomFields["IsUnion"];',
      'Compare strings: if(isUnion == "1"){ ... }',
      'Event.Engine.RateGroup = "Union";',
    ],
    keywords: [
      { pattern: /Event\.Employee\.CustomFields\s*\[/,   points: 1, label: 'CustomFields access' },
      { pattern: /IsUnion/,                               points: 1, label: '"IsUnion" field' },
      { pattern: /==\s*["']1["']/,                        points: 1, label: 'string "1" comparison' },
      { pattern: /Event\.Engine\.RateGroup\s*=/,          points: 1, label: 'RateGroup set' },
    ],
    solution: `// EventType: OnEligible
const DEBUG = false;

var isUnion = Event.Employee.CustomFields["IsUnion"];

if(DEBUG){ Event.Debug("IsUnion value: " + isUnion); }

if(isUnion == "1"){
    Event.Engine.RateGroup = "Union";
}`,
    solutionExplain: 'CustomFields values are always strings. Boolean-type custom fields return "1" for true and "0" for false — comparing to the number 1 (without quotes) will always fail. The GetCustom() helper method is a null-safe alternative that returns empty string instead of null for missing fields.',
  },

  12: {
    title: 'Termination Date via OnLifeEvent',
    intro: 'OnLifeEvent scripts fire when a qualifying life event (QLE) occurs. You can override when coverage terminates by setting Event.Action.TerminationDate.',
    task: 'Write an OnLifeEvent script that reads Event.Employee.TerminationDate, calculates the last day of that month (first of next month minus 1 day using .AddDays(-1)), and assigns it to Event.Action.TerminationDate.',
    starter: '// EventType: OnLifeEvent\nconst DEBUG = false;\n\n',
    hints: [
      'var termDate = Event.Employee.TerminationDate;',
      'End of month: new DateTime(termDate.Year, termDate.Month, 1).AddMonths(1).AddDays(-1)',
      'Event.Action.TerminationDate = endOfMonth;',
    ],
    keywords: [
      { pattern: /\/\/\s*EventType:\s*OnLifeEvent/i,          points: 1, label: '// EventType: OnLifeEvent' },
      { pattern: /Event\.Employee\.TerminationDate/,           points: 1, label: 'TerminationDate read' },
      { pattern: /new\s+DateTime\s*\(/,                        points: 1, label: 'new DateTime()' },
      { pattern: /\.AddDays\s*\(\s*-1\s*\)/,                  points: 1, label: '.AddDays(-1)' },
      { pattern: /Event\.Action\.TerminationDate\s*=/,         points: 1, label: 'Event.Action.TerminationDate set' },
    ],
    solution: `// EventType: OnLifeEvent
const DEBUG = false;

var termDate = Event.Employee.TerminationDate;
var endOfMonth = new DateTime(termDate.Year, termDate.Month, 1).AddMonths(1).AddDays(-1);

Event.Action.TerminationDate = endOfMonth;

if(DEBUG){ Event.Debug("Coverage ends: " + endOfMonth); }`,
    solutionExplain: 'The month-end formula chains: first of termination month → first of next month → back one day = last day of termination month. This is the standard way to compute month-end in .NET because DateTime doesn\'t have a LastDayOfMonth method.',
  },

  13: {
    title: 'Cross-Plan Application Lookup',
    intro: 'Event.Applications["TAG"] lets you inspect another product\'s enrollment status from within a script. This enables plan coordination — for example, requiring Medical enrollment before allowing Dental.',
    task: 'Write an OnEligible script that looks up the "Medical" application. If it exists AND its EffectiveDate is not null, allow this product (leave Event.Eligible = true). Otherwise set Event.Eligible to false.',
    starter: '// EventType: OnEligible\nconst DEBUG = false;\n\n',
    hints: [
      'var medApp = Event.Applications["Medical"];',
      'Check if(medApp != null && medApp.EffectiveDate != null)',
      'Event.Eligible = false; in the else branch',
    ],
    keywords: [
      { pattern: /Event\.Applications\s*\[/,                          points: 1, label: 'Event.Applications lookup' },
      { pattern: /Medical/,                                             points: 1, label: '"Medical" product tag' },
      { pattern: /!=\s*null/,                                          points: 1, label: 'null check' },
      { pattern: /Event\.Eligible\s*=\s*false/,                       points: 1, label: 'Event.Eligible = false' },
    ],
    solution: `// EventType: OnEligible
const DEBUG = false;

var medApp = Event.Applications["Medical"];

if(medApp != null && medApp.EffectiveDate != null){
    // Medical is enrolled — allow this product
    if(DEBUG){ Event.Debug("Medical enrolled, product is eligible"); }
} else {
    Event.Eligible = false;
    if(DEBUG){ Event.Debug("Medical not enrolled, blocking product"); }
}`,
    solutionExplain: 'Event.Applications["TAG"] returns null if the employee hasn\'t elected that product, and may return an object with a null EffectiveDate if they\'re in the process of enrolling. Both checks are needed for a reliable cross-plan dependency.',
  },

  14: {
    title: 'Report Script with SkipRecord',
    intro: 'OnReport scripts run once per row in a report export. Event.Value is the current column value. Event.SkipRecord = true suppresses the entire row. Event.Globals persists values across rows.',
    task: 'Write an OnReport script that: (1) skips the row if Event.Employee.Salary is 0, (2) otherwise formats the salary with String.Format and sets it as Event.Value, (3) uses Event.FirstRecord to initialize a running total in Event.Globals.',
    starter: '// EventType: OnReport\nconst DEBUG = false;\n\n',
    hints: [
      'if(Event.Employee.Salary == 0){ Event.SkipRecord = true; return; }',
      "Event.Value = String.Format('{0:C}', Event.Employee.Salary);",
      'if(Event.FirstRecord){ Event.Globals["total"] = 0; }',
      'Event.Globals["total"] += Event.Employee.Salary;',
    ],
    keywords: [
      { pattern: /\/\/\s*EventType:\s*OnReport/i,            points: 1, label: '// EventType: OnReport' },
      { pattern: /Event\.SkipRecord\s*=\s*true/,             points: 1, label: 'Event.SkipRecord = true' },
      { pattern: /Event\.Value\s*=/,                          points: 1, label: 'Event.Value assignment' },
      { pattern: /String\.Format\s*\(/,                       points: 1, label: 'String.Format() call' },
      { pattern: /Event\.FirstRecord/,                        points: 1, label: 'Event.FirstRecord check' },
      { pattern: /Event\.Globals\s*\[/,                       points: 1, label: 'Event.Globals usage' },
    ],
    solution: `// EventType: OnReport
const DEBUG = false;

if(Event.FirstRecord){
    Event.Globals["total"] = 0;
}

if(Event.Employee.Salary == 0){
    Event.SkipRecord = true;
    return;
}

Event.Globals["total"] += Event.Employee.Salary;
Event.Value = String.Format('{0:C}', Event.Employee.Salary);

if(DEBUG){ Event.Debug("Running total: " + Event.Globals["total"]); }`,
    solutionExplain: 'Event.FirstRecord initialization must come BEFORE the SkipRecord return — otherwise rows after a skipped first record would have an uninitialized Globals["total"]. String.Format("{0:C}", ...) applies currency formatting using the .NET composite formatting syntax.',
  },
}
