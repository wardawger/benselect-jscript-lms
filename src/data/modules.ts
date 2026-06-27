export interface Module {
  id: number
  title: string
  track: string
  tc: string
  time: string
  topics: string[]
}

export interface TrackGroup {
  label: string
  desc: string
  ids: number[]
}

export const MODULES: Module[] = [
  {id:1,title:"Intro to JScript.NET & the .NET Platform",track:"Track 1",tc:"b-blue",time:"90 min",topics:["CLR, CTS, JIT basics","JScript.NET vs JavaScript","How JScript fits BenSelect","The Event object","Event.Debug() and first scripts"]},
  {id:2,title:"Language Fundamentals & Type System",track:"Track 1",tc:"b-blue",time:"120 min",topics:["var, const, scope","Data types in BenSelect","if/else and switch","for and for...in loops","Null checks and == 1 gotcha"]},
  {id:3,title:"Functions & Code Organization",track:"Track 1",tc:"b-blue",time:"90 min",topics:["Function syntax & return values","Getter vs setter functions","Returning arrays","Function architecture","Reusability patterns"]},
  {id:4,title:"OOP Concepts in JScript.NET",track:"Track 1",tc:"b-blue",time:"90 min",topics:["Classes, fields, constructors","Methods and property accessors","Inheritance & polymorphism","Function overloading","Packages & namespaces"]},
  {id:5,title:".NET Framework Class Library",track:"Track 1",tc:"b-blue",time:"60 min",topics:["System.DateTime in depth","String operations","Type conversions","Collections & arrays","String.Format pattern"]},
  {id:6,title:"Error Handling & Debugging",track:"Track 1",tc:"b-blue",time:"60 min",topics:["try/catch/finally","Event.Debug()","The DEBUG flag pattern","Common null reference errors","Testing in BenSelect"]},
  {id:7,title:"BenSelect Architecture & Core Concepts",track:"Track 2",tc:"b-warn",time:"90 min",topics:["Case, Plan, Product","Application to Coverage lifecycle","Key terminology","Plan Year structure","DAL and JScript access"]},
  {id:8,title:"The Event Object & BenSelect Object Model",track:"Track 2",tc:"b-warn",time:"120 min",topics:["OnEligible vs OnLifeEvent","Employee subtree","Engine & Config subtrees","Application & Action subtrees","Report Event object"]},
  {id:9,title:"Rate Group & Eligibility Scripting",track:"Track 3",tc:"b-green",time:"90 min",topics:["Event.Engine.RateGroup","Event.Eligible = false","Custom field driven logic","Event.Applications[] and ProductTag","Multi-product eligibility control"]},
  {id:10,title:"Date Calculations & Effective Date Scripting",track:"Track 3",tc:"b-green",time:"120 min",topics:["Effective date calculation chain","Grace period end date","Cutoff date logic","Month-end date construction","Overriding effective & term dates"]},
  {id:11,title:"Benefit Amount & GI Scripting",track:"Track 3",tc:"b-green",time:"120 min",topics:["Benefit levels & age bands","SetMaxBenefitAmount()","SetGILimit()","Rule Set 1 late entrant logic","Age band step-down calculations"]},
  {id:12,title:"Life Event & Termination Scripting",track:"Track 3",tc:"b-green",time:"90 min",topics:["Event.EventType.toString()","ReasonTypeID & death events","Range validation pattern","Termination date override","Deduct-before two-script pattern"]},
  {id:13,title:"Report Scripting",track:"Track 3",tc:"b-green",time:"90 min",topics:["Report engine processing model","Event.Value read & write","Event.SkipRecord","Event.Globals across rows","Position flags"]},
  {id:14,title:"Final Certification Exam",track:"Exam",tc:"b-red",time:"180 min",topics:["Part A: Multiple choice 30pts","Part B: Code reading 30pts","Part C: Code writing 40pts","70% required to certify","Certificate awarded on pass"]}
]

export const TRACK_GROUPS: TrackGroup[] = [
  {label:"Track 1 — Language Foundation",desc:"Core JScript.NET concepts applied to BenSelect",ids:[1,2,3,4,5,6]},
  {label:"Track 2 — BenSelect Architecture",desc:"The BenSelect data model and Event object",ids:[7,8]},
  {label:"Track 3 — Applied JScript",desc:"Production scripting patterns for real BenSelect use cases",ids:[9,10,11,12,13]},
  {label:"Certification",desc:"Final exam — 70% required",ids:[14]}
]
