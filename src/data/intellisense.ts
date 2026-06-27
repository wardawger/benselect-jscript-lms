export interface ISCompletion {
  label: string
  type: string
  icon: string
  detail: string
  insert: string
}

export const IS_COMPLETIONS: ISCompletion[] = [
  // ── Event root ──
  { label:'Event.Employee',          type:'prop',  icon:'prop',  detail:'EmployeeView — employee being enrolled',    insert:'Event.Employee' },
  { label:'Event.Engine',            type:'prop',  icon:'prop',  detail:'Enrollment engine state',                   insert:'Event.Engine' },
  { label:'Event.Config',            type:'prop',  icon:'prop',  detail:'Plan-level configuration object',           insert:'Event.Config' },
  { label:'Event.Application',       type:'prop',  icon:'prop',  detail:'In-progress enrollment (OnEligible)',        insert:'Event.Application' },
  { label:'Event.Action',            type:'prop',  icon:'prop',  detail:'Coverage action (OnLifeEvent)',              insert:'Event.Action' },
  { label:'Event.PlanYear',          type:'prop',  icon:'prop',  detail:'Current plan year — null in first year!',   insert:'Event.PlanYear' },
  { label:'Event.Case',              type:'prop',  icon:'prop',  detail:'The top-level enrollment group (Case)',      insert:'Event.Case' },
  { label:'Event.LastCoverage',      type:'prop',  icon:'prop',  detail:'Prior year coverage — null if no history',  insert:'Event.LastCoverage' },
  { label:'Event.ProductTag',        type:'prop',  icon:'prop',  detail:'XML tag name of product being evaluated',   insert:'Event.ProductTag' },
  { label:'Event.Product',           type:'prop',  icon:'prop',  detail:'Current payer product object',              insert:'Event.Product' },
  { label:'Event.Eligible',          type:'prop',  icon:'prop',  detail:'Set false to remove product from options',  insert:'Event.Eligible' },
  { label:'Event.Value',             type:'prop',  icon:'prop',  detail:'Current column value in report script',     insert:'Event.Value' },
  { label:'Event.SkipRecord',        type:'prop',  icon:'prop',  detail:'Set true to suppress row in report',        insert:'Event.SkipRecord' },
  { label:'Event.Globals',           type:'prop',  icon:'prop',  detail:'Persist values across rows in report',      insert:'Event.Globals' },
  { label:'Event.FirstRecord',       type:'prop',  icon:'prop',  detail:'True on the first row of a report',         insert:'Event.FirstRecord' },
  { label:'Event.LastRecord',        type:'prop',  icon:'prop',  detail:'True on the last row of a report',          insert:'Event.LastRecord' },
  { label:'Event.FirstKeyRecord',    type:'prop',  icon:'prop',  detail:'True on first row within key group',        insert:'Event.FirstKeyRecord' },
  { label:'Event.LastKeyRecord',     type:'prop',  icon:'prop',  detail:'True on last row within key group',         insert:'Event.LastKeyRecord' },
  { label:'Event.EventType',         type:'prop',  icon:'prop',  detail:'Life event type enum — call .toString()',   insert:'Event.EventType' },
  { label:'Event.Record',            type:'prop',  icon:'prop',  detail:'All fields in current report row',          insert:'Event.Record' },
  { label:'Event.StartOver',         type:'prop',  icon:'prop',  detail:'Set true to reprocess current key group',  insert:'Event.StartOver' },
  // ── Event.Debug ──
  { label:'Event.Debug()',           type:'fn',    icon:'fn',    detail:'Print to admin debug window — never shown to employees', insert:'Event.Debug()' },
  // ── Event.Employee ──
  { label:'Event.Employee.DateOfHire',      type:'prop', icon:'prop', detail:'DateTime — employee hire date',           insert:'Event.Employee.DateOfHire' },
  { label:'Event.Employee.EligibilityDate', type:'prop', icon:'prop', detail:'nullable DateTime — check != null first', insert:'Event.Employee.EligibilityDate' },
  { label:'Event.Employee.TerminationDate', type:'prop', icon:'prop', detail:'DateTime — employment termination date',  insert:'Event.Employee.TerminationDate' },
  { label:'Event.Employee.Salary',          type:'prop', icon:'prop', detail:'number — annual salary',                  insert:'Event.Employee.Salary' },
  { label:'Event.Employee.ReasonTypeID',    type:'prop', icon:'prop', detail:'int — termination reason (304=Death)',    insert:'Event.Employee.ReasonTypeID' },
  { label:'Event.Employee.CustomFields',    type:'prop', icon:'prop', detail:'Hashtable — raw field values (bool=1 or 0)', insert:'Event.Employee.CustomFields[""]' },
  { label:'Event.Employee.GetCustom()',     type:'fn',   icon:'fn',   detail:'Null-safe custom field accessor',         insert:'Event.Employee.GetCustom("")' },
  { label:'Event.Employee.EmployeePerson', type:'prop', icon:'prop', detail:'Person sub-object (Name, Age)',            insert:'Event.Employee.EmployeePerson' },
  { label:'Event.Employee.EmployeePerson.Age()', type:'fn', icon:'fn', detail:'Age as of a specific date',             insert:'Event.Employee.EmployeePerson.Age()' },
  { label:'Event.Employee.EmployeePerson.FirstName', type:'prop', icon:'prop', detail:'string — first name',           insert:'Event.Employee.EmployeePerson.FirstName' },
  // ── Event.Engine ──
  { label:'Event.Engine.RateGroup',            type:'prop', icon:'prop', detail:'string — SET to change rate table',         insert:'Event.Engine.RateGroup' },
  { label:'Event.Engine.EffectiveDate',        type:'prop', icon:'prop', detail:'DateTime — calculated coverage start date', insert:'Event.Engine.EffectiveDate' },
  { label:'Event.Engine.Config',               type:'prop', icon:'prop', detail:'Enrollment engine configuration',           insert:'Event.Engine.Config' },
  { label:'Event.Engine.Config.WaitingPeriod', type:'prop', icon:'prop', detail:'int — waiting period length',              insert:'Event.Engine.Config.WaitingPeriod' },
  { label:'Event.Engine.Config.WaitingPeriodType', type:'prop', icon:'prop', detail:'0=Days, 1=Months, 2=Years',            insert:'Event.Engine.Config.WaitingPeriodType' },
  { label:'Event.Engine.Config.EffectiveDateCalc', type:'prop', icon:'prop', detail:'0=1st of month, 1=Immediately after', insert:'Event.Engine.Config.EffectiveDateCalc' },
  // ── Event.Config ──
  { label:'Event.Config.GracePeriod',           type:'prop', icon:'prop', detail:'int — grace period length',           insert:'Event.Config.GracePeriod' },
  { label:'Event.Config.GracePeriodType',       type:'prop', icon:'prop', detail:'0=Days, 1=Months',                    insert:'Event.Config.GracePeriodType' },
  { label:'Event.Config.RoundFactor',           type:'prop', icon:'prop', detail:'SET rounding increment (e.g. 100)',   insert:'Event.Config.RoundFactor' },
  { label:'Event.Config.SetGILimit()',          type:'fn',   icon:'fn',   detail:'SetGILimit(levelIdx, bandIdx, amount)', insert:'Event.Config.SetGILimit(i, n, amount)' },
  { label:'Event.Config.SetMaxBenefitAmount()', type:'fn',   icon:'fn',   detail:'SetMaxBenefitAmount(levelIdx, bandIdx, amount)', insert:'Event.Config.SetMaxBenefitAmount(i, n, amount)' },
  { label:'Event.Config.GetPayerProductInfo()', type:'fn',   icon:'fn',   detail:'Returns product config (BenefitLevels, AgeBand, GetStepDown)', insert:'Event.Config.GetPayerProductInfo(payerProductID)' },
  { label:'Event.Config.DeductionDateBeforeEffectiveDate', type:'prop', icon:'prop', detail:'SET to 0 to disable deduct-before', insert:'Event.Config.DeductionDateBeforeEffectiveDate' },
  // ── Event.Application / Action ──
  { label:'Event.Application.EffectiveDate',        type:'prop', icon:'prop', detail:'Override coverage start date (OnEligible)',   insert:'Event.Application.EffectiveDate' },
  { label:'Event.Application.IncreaseBenefitAmount',type:'prop', icon:'prop', detail:'Increase amount being elected',               insert:'Event.Application.IncreaseBenefitAmount' },
  { label:'Event.Action.TerminationDate',           type:'prop', icon:'prop', detail:'Override coverage end date (OnLifeEvent)',    insert:'Event.Action.TerminationDate' },
  // ── Event.Case / PlanYear ──
  { label:'Event.Case.EnabledPlanYears',      type:'prop', icon:'prop', detail:'Array of all plan years on the case',     insert:'Event.Case.EnabledPlanYears' },
  { label:'Event.PlanYear.PlanYearStartDate', type:'prop', icon:'prop', detail:'DateTime — plan year start',              insert:'Event.PlanYear.PlanYearStartDate' },
  { label:'Event.Applications[""]',          type:'prop', icon:'prop', detail:'Cross-plan application lookup by XML tag', insert:'Event.Applications[""]' },
  // ── Event.Product ──
  { label:'Event.Product.PayerProductID',     type:'prop', icon:'prop', detail:'int — payer product ID',               insert:'Event.Product.PayerProductID' },
  { label:'Event.LastCoverage.BenefitAmount', type:'prop', icon:'prop', detail:'number — prior year coverage amount',  insert:'Event.LastCoverage.BenefitAmount' },
  // ── System.DateTime ──
  { label:'System.DateTime.Today',  type:'prop', icon:'const', detail:'.NET — today at midnight (not new Date())', insert:'System.DateTime.Today' },
  { label:'DateTime.Parse()',       type:'fn',   icon:'fn',    detail:'Convert string to DateTime',                insert:"DateTime.Parse(String.Format('{0:MM/dd/yyyy}', ))" },
  { label:'new DateTime()',         type:'fn',   icon:'fn',    detail:'new DateTime(year, month, day)',            insert:'new DateTime(, , 1)' },
  { label:'String.Format()',        type:'fn',   icon:'fn',    detail:"Format a date: String.Format('{0:MM/dd/yyyy}', date)", insert:"String.Format('{0:MM/dd/yyyy}', )" },
  // ── DateTime methods ──
  { label:'.AddDays()',   type:'fn',   icon:'fn',   detail:'Returns new DateTime + n days',   insert:'.AddDays()' },
  { label:'.AddMonths()', type:'fn',   icon:'fn',   detail:'Returns new DateTime + n months', insert:'.AddMonths()' },
  { label:'.AddYears()',  type:'fn',   icon:'fn',   detail:'Returns new DateTime + n years',  insert:'.AddYears()' },
  { label:'.Day',         type:'prop', icon:'prop', detail:'int — day of month (1-31)',        insert:'.Day' },
  { label:'.Month',       type:'prop', icon:'prop', detail:'int — month (1-12)',               insert:'.Month' },
  { label:'.Year',        type:'prop', icon:'prop', detail:'int — four-digit year',            insert:'.Year' },
  { label:'.toString()',  type:'fn',   icon:'fn',   detail:'Convert to string — used for EventType', insert:'.toString()' },
  { label:'.ToUpper()',   type:'fn',   icon:'fn',   detail:'Convert string to uppercase',      insert:'.ToUpper()' },
  { label:'.IndexOf()',   type:'fn',   icon:'fn',   detail:'Find substring position, -1 if not found', insert:'.IndexOf()' },
  { label:'.Length',      type:'prop', icon:'prop', detail:'Count of elements (BenefitLevels, AgeBand)', insert:'.Length' },
  // ── JScript keywords ──
  { label:'var',      type:'kw', icon:'kw', detail:'Declare a mutable variable',     insert:'var ' },
  { label:'const',    type:'kw', icon:'kw', detail:'Declare an immutable constant',  insert:'const ' },
  { label:'function', type:'kw', icon:'kw', detail:'Declare a function',             insert:'function ' },
  { label:'return',   type:'kw', icon:'kw', detail:'Return a value from a function', insert:'return ' },
  { label:'if',       type:'kw', icon:'kw', detail:'Conditional branch',             insert:'if(){\n    \n}' },
  { label:'else',     type:'kw', icon:'kw', detail:'Else branch',                    insert:' else {\n    \n}' },
  { label:'switch',   type:'kw', icon:'kw', detail:'Switch statement',               insert:'switch(){\n    case 0:\n        break;\n}' },
  { label:'for',      type:'kw', icon:'kw', detail:'For loop',                       insert:'for(var i = 0; i < ; i++){\n    \n}' },
  { label:'null',     type:'kw', icon:'kw', detail:'Null value',                     insert:'null' },
  { label:'true',     type:'kw', icon:'kw', detail:'Boolean true',                   insert:'true' },
  { label:'false',    type:'kw', icon:'kw', detail:'Boolean false',                  insert:'false' },
  { label:'break',    type:'kw', icon:'kw', detail:'Exit switch case',               insert:'break;' },
  { label:'new',      type:'kw', icon:'kw', detail:'Create a new object',            insert:'new ' },
  // ── Snippets ──
  { label:'// EventType: OnEligible',  type:'snip', icon:'snip', detail:'Mark script event type as OnEligible',  insert:'// EventType: OnEligible' },
  { label:'// EventType: OnLifeEvent', type:'snip', icon:'snip', detail:'Mark script event type as OnLifeEvent', insert:'// EventType: OnLifeEvent' },
  { label:'// EventType: OnReport',    type:'snip', icon:'snip', detail:'Mark script event type as OnReport',    insert:'// EventType: OnReport' },
  { label:'const DEBUG = false',       type:'snip', icon:'snip', detail:'Professional debug flag pattern',       insert:'const DEBUG = false;' },
  { label:'if(DEBUG){',                type:'snip', icon:'snip', detail:'Debug output block',                    insert:'if(DEBUG){\n    Event.Debug("");\n}' },
  { label:'if(Event.PlanYear){',       type:'snip', icon:'snip', detail:'Null-safe plan year check',            insert:'if(Event.PlanYear){\n    \n} else {\n    // fallback: Event.Case.EnabledPlanYears[0]\n}' },
  { label:'if(Event.LastCoverage != null){', type:'snip', icon:'snip', detail:'Null check for prior coverage', insert:'if(Event.LastCoverage != null){\n    \n}' },
  { label:'for(benefit levels){',      type:'snip', icon:'snip', detail:'Nested benefit level + age band loop', insert:'for(var i = 0; i < numberOfBenefitLevels; i++){\n    for(var n = 0; n < numberOfAgeBands; n++){\n        Event.Config.SetMaxBenefitAmount(i, n, trueMax);\n    }\n}' },
  { label:'month-end formula',         type:'snip', icon:'snip', detail:'End of current month date',            insert:'new DateTime(termDate.Year, termDate.Month, 1).AddMonths(1).AddDays(-1)' },
  { label:'safe date parse',           type:'snip', icon:'snip', detail:'Null-safe EligibilityDate parse',      insert:"DateTime.Parse(String.Format('{0:MM/dd/yyyy}', Event.Employee.EligibilityDate))" },
  { label:'switch(waitingPeriodType)', type:'snip', icon:'snip', detail:'Waiting period switch (0=Days,1=Months,2=Years)', insert:'switch(waitingPeriodType){\n    case 0: effectiveDate = eligibilityDate.AddDays(waitingPeriod); break;\n    case 1: effectiveDate = eligibilityDate.AddMonths(waitingPeriod); break;\n    case 2: effectiveDate = eligibilityDate.AddYears(waitingPeriod); break;\n}' },
]
