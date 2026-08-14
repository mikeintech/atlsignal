export type ReportedArticle = {
  kind?: "reported-analysis" | "source-backed-brief";
  title: string;
  description: string;
  label: string;
  lede: string;
  keyFacts: string[];
  sections: Array<{ heading: string; paragraphs: string[] }>;
  keywords: string[];
  entities: string[];
  sources: Array<{ name: string; detail: string; url: string }>;
};

export const reportedArticles: Record<string, ReportedArticle> = {
  "6fbe1c73b53c39b71105": {
    title: "MARTA makes Jonathan Hunt permanent CEO after a year of high-stakes tests",
    description: "Jonathan Hunt moves from interim to permanent MARTA CEO after leading the agency through World Cup demand. Here is the record behind the decision and the scorecard ahead.",
    label: "Transit leadership",
    lede: "MARTA chose continuity for one of Atlanta’s least forgiving public jobs. Jonathan Hunt, the lawyer-turned-transit executive who spent the last year running the agency on an interim basis, now owns the title—and the expectations that come with it.",
    keyFacts: ["Hunt became interim CEO in August 2025.", "The board selected him after a national search and a three-finalist process.", "His permanent tenure begins after MARTA carried 4.7 million rail trips during the 2026 World Cup period."],
    sections: [
      { heading: "An inside candidate wins the national search", paragraphs: ["SaportaReport reported that MARTA’s board selected Hunt over two outside finalists: Cleveland Ferguson III of the Jacksonville Transportation Authority and Leroy Jones of the Washington Metropolitan Area Transit Authority. The result turns what began as a bridge appointment into a long-term mandate.", "Hunt was not a conventional operations pick when he stepped into the interim job. MARTA’s own records show that he came through the agency’s legal and executive ranks, with responsibility touching contracts, procurement, risk and regulatory matters. That background now meets a role judged in missed trains, delayed projects and public confidence—not legal memos."] },
      { heading: "The World Cup became an unusually public audition", paragraphs: ["MARTA says it provided 4.7 million rail trips over 35 days of World Cup matches and related events. The busiest day reached about 240,000 trips, roughly 2.6 times a typical weekday. Those figures do not settle the agency’s everyday reliability questions, but they gave Hunt a high-pressure operating test in full public view.", "The more revealing test starts after the crowds leave. MARTA’s September 2025 leadership reorganization put safety, reliability and project delivery at the center of Hunt’s agenda. Those are now the durable measures of his tenure."] },
      { heading: "The scorecard changes now", paragraphs: ["An interim leader can stabilize. A permanent CEO has to choose, sequence and deliver. Hunt inherits expansion promises, aging infrastructure, customer-service pressure and a regional governance structure that can turn every major decision into a negotiation.", "ATLSignal will track the measurable layer: service reliability, capital milestones, procurement movement, board decisions and whether major projects move from announcement to operation. The appointment is the headline; execution is the story that follows."] },
    ],
    keywords: ["Jonathan Hunt", "MARTA CEO", "MARTA board", "Atlanta transit", "World Cup MARTA ridership"],
    entities: ["Metropolitan Atlanta Rapid Transit Authority", "Jonathan Hunt", "Atlanta"],
    sources: [
      { name: "SaportaReport", detail: "Reported the board’s permanent selection and finalist process.", url: "https://saportareport.com/marta-sticks-with-jonathan-hunt-as-permanent-ceo/columnists/delaney-tarr/delaneytarr/" },
      { name: "MARTA", detail: "Official August 2025 record appointing Hunt interim CEO.", url: "https://itsmarta.com/marta-board-appoints-interim-gm.aspx" },
      { name: "MARTA", detail: "Official World Cup operating and ridership results.", url: "https://itsmarta.com/marta-safely-moves-millions.aspx" },
      { name: "MARTA", detail: "Official leadership restructuring focused on safety, reliability and delivery.", url: "https://itsmarta.com/marta-leadership-restructuring.aspx" },
    ],
  },
  "985c2707a769c601eeaf": {
    title: "Metro Atlanta added 53,690 people, but the growth curve is cooling",
    description: "ARC estimates put metro Atlanta at 5.34 million residents in 2026. ATLSignal calculates what the slower one-year gain means for housing, transit and local planning.",
    label: "Growth decoded",
    lede: "Metro Atlanta is still growing. It is simply doing so with less of the old boomtown velocity. The region added 53,690 residents in the year ending April 2026—enough people to fill a small city, but fewer than the recent pace planners had been watching.",
    keyFacts: ["The 11-county region reached an estimated 5,339,164 residents.", "The one-year increase was 53,690 people, about 1.0%.", "The gain was roughly 17% below the 64,610 annual average ARC reported for 2022–2025."],
    sections: [
      { heading: "Growth did not stop; the slope changed", paragraphs: ["The Atlanta Regional Commission’s new estimate places the 11-county population at 5,339,164. Against ARC’s 2025 estimate of 5,285,474, that works out to growth of about 1.0% in a year.", "ATLSignal compared the new one-year gain with ARC’s previously reported 2022–2025 annual average of 64,610. The latest increase is about 10,920 residents lower, a decline of roughly 17% from that recent pace. That is a slowdown, not a reversal."] },
      { heading: "A slower region can still feel crowded", paragraphs: ["Population change is experienced unevenly. A regional cooling can coexist with acute pressure in a fast-growing county, a school cluster or a transit corridor. Housing supply, road capacity and public services respond to where people land, not only to the regional total.", "That is why the next useful question is geographic. County and city estimates can show whether the slowdown is broad or whether growth is concentrating in fewer places."] },
      { heading: "The planning consequences arrive with a lag", paragraphs: ["Population estimates feed decisions about transportation, infrastructure, housing and local budgets. A durable slowdown could alter revenue assumptions and project timing; a one-year dip could be noise. The honest reading is to watch the series rather than declare a new era from one release.", "ATLSignal will compare the next ARC estimate with permits, housing delivery and employment signals. Population is the demand side of Atlanta’s growth story; the built environment reveals how the region is responding."] },
    ],
    keywords: ["Metro Atlanta population 2026", "Atlanta Regional Commission population", "Atlanta growth rate", "Atlanta housing demand"],
    entities: ["Atlanta Regional Commission", "Metro Atlanta", "City of Atlanta"],
    sources: [
      { name: "Atlanta Regional Commission", detail: "Official 2026 population estimate for the 11-county region.", url: "https://atlantaregional.org/news/research-innovation/atlanta-region-adds-53690-residents-in-past-year-arc-population-estimates-show/" },
      { name: "ARC 2025 population estimates", detail: "Prior-year total and recent annual-growth benchmark used for ATLSignal’s comparison.", url: "https://cdn.atlantaregional.org/wp-content/uploads/pop-estimates-final-edits-072825-002.pdf" },
      { name: "SaportaReport", detail: "Local reporting that surfaced the slowdown framing.", url: "https://saportareport.com/new-population-data-shows-metro-atlanta-growth-is-slowing-down/columnists/delaney-tarr/delaneytarr/" },
    ],
  },
  "c33955ffa01fcd736353": {
    title: "MARTA’s World Cup stress test produced 4.7 million rail trips",
    description: "MARTA moved 4.7 million rail passengers during Atlanta’s 2026 World Cup period. The peak-day numbers reveal both the system’s capacity and its next challenge.",
    label: "By the numbers",
    lede: "For 35 days, Atlanta asked its transit system to behave like big-event infrastructure. MARTA’s answer was 4.7 million rail trips, two quarter-million-rider days and a rare demonstration of what the network can do when preparation, staffing and public urgency line up.",
    keyFacts: ["MARTA counted 4.7 million rail trips over 35 days.", "The busiest day reached about 240,000 trips—2.6 times a typical weekday.", "Six hundred transit ambassadors worked 6,400 assignments."],
    sections: [
      { heading: "The peak was far above an ordinary weekday", paragraphs: ["MARTA’s official post-event report says the Morocco–Haiti match produced approximately 240,000 rail trips. A second match day reached 230,000. Those peaks were about 2.6 and 2.5 times ordinary weekday ridership, respectively.", "The headline is not merely that visitors used trains. It is that Atlanta concentrated unusually heavy demand onto a network often discussed through the language of constraints."] },
      { heading: "Preparation showed up in the labor numbers", paragraphs: ["The agency deployed 600 transit ambassadors across 6,400 assignments. That visible staffing layer matters: capacity is not only trains and track. It is crowd movement, information, security and the ability to absorb schedule changes without turning a platform into confusion.", "MARTA attributes the result to more than 18 months of planning. That makes the performance useful as an operating case study, not a promise that everyday service will automatically match event-week intensity."] },
      { heading: "The useful legacy is a repeatable playbook", paragraphs: ["Atlanta will host more large events, but the larger public question is whether the temporary operating discipline can improve routine service. Some event tactics are expensive or labor-intensive; others—clear information, coordinated schedules and visible staff—can become habits.", "ATLSignal will watch board reports and operating data for evidence that the World Cup playbook survives beyond the tournament. A successful stress test matters most when the lessons travel."] },
    ],
    keywords: ["MARTA World Cup ridership", "Atlanta World Cup transit", "MARTA 4.7 million trips", "Atlanta rail ridership 2026"],
    entities: ["MARTA", "FIFA World Cup 2026", "Atlanta"],
    sources: [
      { name: "MARTA", detail: "Official post-event rail ridership and staffing figures.", url: "https://itsmarta.com/marta-safely-moves-millions.aspx" },
      { name: "SaportaReport", detail: "Local reporting on MARTA’s board-level assessment of the event period.", url: "https://saportareport.com/marta-tackles-world-cup-demand-with-ease-successfully-handling-over-1-million-additional-rail-trips/sections/reports/ammiel-forbes/" },
    ],
  },
  "f67453ba8c2bdce075f7": {
    title: "Children’s Healthcare says its Georgia economic footprint reached $6.12 billion",
    description: "Children’s Healthcare of Atlanta reports $6.12 billion in statewide economic output. ATLSignal separates the study’s headline number from what it actually measures.",
    label: "Economic impact",
    lede: "Children’s Healthcare of Atlanta is a hospital system, an employer and—by its latest accounting—a $6.12 billion piece of Georgia’s economy. The number is large enough to travel quickly. Understanding what sits underneath it is more useful than repeating it.",
    keyFacts: ["Children’s reports $6.12 billion in economic output.", "The system says its impact grew 65% over 10 years.", "A Georgia Tech economic-development research group conducted the underlying study."],
    sections: [
      { heading: "The figure measures more than hospital revenue", paragraphs: ["Economic-impact studies generally count direct activity and the additional spending connected to jobs, suppliers and household income. Children’s says the resulting statewide output is $6.12 billion, with a 65% increase over a decade.", "That makes the number a measure of modeled economic reach—not cash sitting in one account and not a direct estimate of public benefit. The distinction is essential whenever a single figure is used to describe a large institution."] },
      { heading: "The Blank hospital changed the system’s scale", paragraphs: ["The Arthur M. Blank Hospital opened in 2024 as a major expansion of pediatric capacity. That physical growth helps explain why the system now describes itself as economic infrastructure as well as healthcare infrastructure.", "Children’s also says it serves patients from all 159 Georgia counties. The geographic reach gives the Atlanta-based system a statewide labor, purchasing and family-travel footprint."] },
      { heading: "Impact claims deserve a visible methodology", paragraphs: ["The strongest next step is a fully inspectable study: assumptions, geography, time period and the treatment of indirect and induced effects. Those details determine how the $6.12 billion should be compared with other institutions or prior years.", "ATLSignal will keep the reported output figure attached to its source and methodology. Big numbers are most credible when readers can see how they were built."] },
    ],
    keywords: ["Children's Healthcare of Atlanta economic impact", "Arthur M Blank Hospital", "Georgia healthcare economy", "$6.12 billion"],
    entities: ["Children’s Healthcare of Atlanta", "Georgia Tech", "Arthur M. Blank Hospital"],
    sources: [
      { name: "Children’s Healthcare of Atlanta", detail: "First-party economic-output figure, growth claim and statewide reach.", url: "https://www.choa.org/about-us/community/social-and-environmental-responsibility" },
      { name: "SaportaReport", detail: "Local reporting identifying the study and its Georgia Tech research partner.", url: "https://saportareport.com/childrens-healthcare-of-atlanta-generated-6-12-billion-in-economic-impact-across-georgia-in-2024/columnists/gabi-hart/gabriella-hart/" },
    ],
  },
  "6b249e7c034af59fd58e": {
    title: "Midtown’s long-empty 14th Street site is becoming a park—first temporarily, then for good",
    description: "Work at 98 14th Street is turning a prominent Midtown Atlanta site into public space. The interim lawn is only the first phase of a four-acre civic project.",
    label: "Place in progress",
    lede: "Midtown’s famous hole in the ground is finally becoming somewhere people can stand. Crews are reshaping the four-acre site at 98 14th Street into an interim lawn and walking space while a far more ambitious permanent park moves through design and fundraising.",
    keyFacts: ["The Midtown Improvement District bought the four-acre site for $46 million in 2025.", "Reeves Young received notice to proceed on interim improvements in March 2026.", "Field Operations leads the permanent park design team."],
    sections: [
      { heading: "The interim park solves an immediate urban problem", paragraphs: ["Midtown Alliance says the first phase includes grading, drainage, lawn, perimeter paths, fencing, lighting and a protected mid-block crossing. It is a practical answer to a site that spent years as an unfinished development scar in one of Atlanta’s busiest districts.", "The work does not complete the permanent vision. It creates usable public ground while design and capital planning continue—a modest move with an outsized effect on how the block feels."] },
      { heading: "The permanent plan is a different scale", paragraphs: ["The Midtown Improvement District paid $46 million for the property and selected Field Operations to lead the long-term design. Early concepts include tree canopy, performance space, art, food and beverage uses, water features and active lawns.", "That ambition places the project closer to a civic destination than a neighborhood pocket park. Its location between Peachtree and West Peachtree also gives it a potential role linking offices, residences, hotels and cultural institutions."] },
      { heading: "The real test is publicness", paragraphs: ["Atlanta has no shortage of attractive privately managed spaces. The defining question here is whether the finished park feels genuinely public: easy to enter, comfortable without a purchase and programmed for more than a narrow audience.", "ATLSignal will follow the capital campaign, permanent design, construction contracts and opening milestones. The interim lawn is visible progress; the permanent park is still a promise being assembled."] },
    ],
    keywords: ["Midtown Green Atlanta", "98 14th Street park", "Midtown Atlanta park", "Field Operations Atlanta"],
    entities: ["Midtown Alliance", "Midtown Improvement District", "Field Operations", "Reeves Young"],
    sources: [
      { name: "Midtown Alliance", detail: "Official interim-improvement scope, contractor and notice-to-proceed date.", url: "https://www.midtownatl.com/project/interim-improvements-98-14th-street-public-space" },
      { name: "Midtown Alliance", detail: "Official acquisition, financing and property facts.", url: "https://www.midtownatl.com/midtown-alliance/98-14th-street/98-14th-street-key-facts" },
      { name: "Rough Draft Atlanta", detail: "Current local reporting on construction progress and timing.", url: "https://roughdraftatlanta.com/2026/08/13/new-midtown-atlanta-greenspace/" },
    ],
  },
  "50b8c14cc69a9832b524": {
    title: "Hal’s is bringing old-school steakhouse energy to Midtown’s Spring Quarter",
    description: "Hal’s plans a second Atlanta steakhouse inside Spring Quarter’s restored Patterson building, pairing its Buckhead formula with a café and gallery.",
    label: "Opening watch",
    lede: "Hal’s is crossing Peachtree with a familiar promise and a very different room. The Buckhead steakhouse plans to open in Midtown’s historic H.M. Patterson building, where Spring Quarter is turning a former funeral home into the centerpiece of a new dining district.",
    keyFacts: ["The new Hal’s location is planned for the Patterson building at Spring Quarter.", "The concept adds a European-inspired café and fine-art gallery.", "Spring Quarter markets more than 50,000 square feet of dining and retail across the development."],
    sections: [
      { heading: "A second location without pretending to be a copy", paragraphs: ["Atlanta Magazine reports that the core food and drinks will follow the original Hal’s, while the Midtown version adds a café and art gallery. That mix gives the expansion a reason to exist beyond geographic convenience.", "The risk is the same one every institution faces when it multiplies: preserving the mood people love without turning it into a theme. Hal’s has survived on intimacy, ritual and a little bit of swagger. Spring Quarter offers more space—and more scrutiny."] },
      { heading: "The building is part of the pitch", paragraphs: ["The Philip T. Shutze-designed Patterson building dates to 1928 and sits at the center of Spring Quarter. The developer describes 24,000 square feet of dining and retail in the restored building and more than 50,000 square feet across the wider project.", "That makes the restaurant a tenant story and an adaptive-reuse story. The dining room will help determine whether a preserved landmark becomes a living Midtown place or merely a handsome backdrop for a new development."] },
      { heading: "Opening watch starts with the practical markers", paragraphs: ["A restaurant announcement is not an opening. Construction, inspections, hiring, reservations and a first-party launch date remain the useful markers.", "ATLSignal will follow those signals along with Spring Quarter’s wider tenant mix. The project is trying to manufacture a district-scale destination; Hal’s gives it a deeply Atlanta anchor."] },
    ],
    keywords: ["Hal's Steakhouse Midtown", "Spring Quarter restaurants", "Patterson building Atlanta", "new Atlanta restaurants"],
    entities: ["Hal’s The Steakhouse", "Spring Quarter", "H.M. Patterson Home and Gardens"],
    sources: [
      { name: "Atlanta Magazine", detail: "Reported the Hal’s lease, concept and planned additions.", url: "https://www.atlantamagazine.com/dining-news/hals-the-steakhouse-to-open-in-historic-former-funeral-home-in-midtown/" },
      { name: "Spring Quarter", detail: "First-party building, retail and historic-property details.", url: "https://springquarter.com/the-campus/" },
      { name: "Spring Quarter", detail: "First-party retail directory and Patterson building positioning.", url: "https://springquarter.com/retail/" },
    ],
  },
  "8b5f7c37bc216143b7a9": {
    title: "At Decatur’s new trade school, more women are choosing the welding booth",
    description: "Women account for 16% of students at Tulsa Welding School’s new Decatur campus. The number is small, meaningful and connected to Atlanta’s skilled-labor demand.",
    label: "Workforce shift",
    lede: "The sparks at Decatur’s newest trade school are flying from a less predictable set of hands. Women make up 16% of the student body at Tulsa Welding School’s Atlanta-area campus—a minority in the building, but a visible break from welding’s old image.",
    keyFacts: ["The Atlanta Metro campus is at 1287 Columbia Drive in Decatur.", "Women make up 16% of its student body, according to Atlanta Magazine.", "The campus offers welding, HVAC/refrigeration and electrical programs."],
    sections: [
      { heading: "A new campus meets an old labor shortage", paragraphs: ["Tulsa Welding School opened the Decatur campus with programs designed for entry-level work in welding, HVAC/refrigeration and electrical trades. The school says its hands-on programs are structured around field environments and flexible schedules.", "That expansion lands in a region building apartments, data centers, transit projects, hospitals and industrial facilities—all of which depend on skilled labor that is difficult to replace with software or remote work."] },
      { heading: "Sixteen percent is both progress and perspective", paragraphs: ["Atlanta Magazine reports that women account for 16% of the local student body and that female enrollment across the school’s campuses rose nearly 20% from 2024 to 2025. Those figures show movement, not parity.", "The more consequential measure will be persistence: completion, placement, pay and whether worksites retain the women who enter training. Enrollment opens the door; job quality determines whether the shift lasts."] },
      { heading: "The workforce story is bigger than welding", paragraphs: ["The Decatur campus also teaches electrical and HVAC skills, putting it inside a broader contest for technical workers. Atlanta’s growth requires people who can install, inspect, repair and maintain the physical city.", "ATLSignal will watch employer partnerships, graduation outcomes and expansion. The cultural story is women entering a male-dominated trade. The economic story is whether Atlanta can build a deeper labor pipeline at all."] },
    ],
    keywords: ["Tulsa Welding School Atlanta", "Decatur trade school", "women in welding", "Atlanta skilled trades jobs"],
    entities: ["Tulsa Welding School", "Decatur", "StrataTech Education Group"],
    sources: [
      { name: "Atlanta Magazine", detail: "Reported local female enrollment and interviewed campus leadership.", url: "https://www.atlantamagazine.com/news-culture-articles/at-atlantas-new-welding-school-women-wield-the-torch/" },
      { name: "Tulsa Welding School", detail: "First-party campus address, programs and operating details.", url: "https://www.tws.edu/campus/atlanta/" },
      { name: "Tulsa Welding School", detail: "First-party opening announcement and program descriptions.", url: "https://www.tws.edu/blog/skilled-trades/explore-new-atlanta-campus-tulsa-welding-school/" },
    ],
  },
  "58557e3aa94b4f70b591": {
    title: "NABJ brings its 2026 convention to Atlanta with Black journalism under pressure",
    description: "The National Association of Black Journalists convenes in Atlanta Aug. 12–16. The gathering pairs career infrastructure with a city central to Black media history.",
    label: "Atlanta convenes",
    lede: "The National Association of Black Journalists is returning to Atlanta at a moment when the profession needs both a reunion and a war room. Thousands of journalists, students, recruiters and newsroom leaders are gathering Aug. 12–16 around a theme that does not bother with understatement: truth, power and Black journalism.",
    keyFacts: ["The 2026 convention runs Aug. 12–16 in Atlanta.", "NABJ selected the city years in advance using cost, capacity, access and historical factors.", "The program includes training, a career fair, networking and cultural events."],
    sections: [
      { heading: "Atlanta is more than a host city", paragraphs: ["NABJ’s own convention material points to Atlanta’s civil-rights history, HBCUs, airport access and role in film, television, politics and culture. Those are practical and symbolic advantages for an organization built around access to power and the ability to tell Black stories with authority.", "The city also has a living Black media ecosystem—from legacy institutions to independent digital publishers. A national convention here inevitably becomes a mirror for how that ecosystem is changing."] },
      { heading: "The career fair may be the most concrete room", paragraphs: ["Conventions produce speeches, but NABJ’s durable value has always included professional infrastructure: training, mentorship, hiring and the informal networks that move careers. In an unstable media economy, those functions become less ceremonial and more essential.", "Atlanta’s concentration of corporate headquarters, universities, production companies and newsrooms gives the gathering a local labor-market dimension as well as a national one."] },
      { heading: "The anniversary points forward", paragraphs: ["The Atlanta gathering follows NABJ’s 50th-anniversary year. The useful question is not whether the institution can celebrate its history; it is how that history equips journalists for shrinking newsrooms, platform dependence, attacks on credibility and new forms of independent publishing.", "ATLSignal will watch the convention for announcements, local partnerships and ideas that outlive the closing session. A city can host an event. The better outcome is when the event leaves capacity behind."] },
    ],
    keywords: ["NABJ 2026 Atlanta", "National Association of Black Journalists convention", "Atlanta journalism conference", "Black journalists"],
    entities: ["National Association of Black Journalists", "Atlanta", "Errin Haines"],
    sources: [
      { name: "NABJ", detail: "Official convention dates, program framing and Atlanta rationale.", url: "https://nabjonline.org/blog/nabj26-convention-registration-open/?amp=1" },
      { name: "NABJ", detail: "Official co-chair announcement and 2026 convention theme.", url: "https://nabjonline.org/blog/2026-convention-co-chairs/?amp=1" },
      { name: "Atlanta Magazine", detail: "Local interview and convention reporting.", url: "https://www.atlantamagazine.com/news-culture-articles/led-by-atlanta-native-errin-haines-the-national-association-of-black-journalists-convention-returns-to-atlanta/" },
    ],
  },
};
