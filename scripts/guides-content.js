/* ============================================================
   HowMuchNIL: guide articles (un-gated SEO content)
   Each: { slug, title, desc, date, body(HTML) }
   Links use root-relative paths (the site is served at the domain root).
   No em or en dashes in copy.
   ============================================================ */
'use strict';

const SOURCES = (items) =>
  `<h2>Sources</h2><ul class="sources">` +
  items.map(s => `<li><a href="${s[1]}" rel="nofollow noopener" target="_blank">${s[0]}</a></li>`).join('') +
  `</ul>`;

module.exports = [
  {
    slug: 'highest-paid-college-athletes-2026',
    title: 'Highest-Paid College Athletes by NIL in 2026',
    desc: "The top college NIL valuations in 2026, from Arch Manning to AJ Dybantsa, ranked, plus how the money breaks down by sport and position.",
    date: '2026-06-06',
    body: `
      <p>College athletes can now earn real money from their <strong>name, image, and likeness (NIL)</strong>, and the biggest stars pull in seven figures a year. Below are the highest NIL valuations in college sports for 2026, based on publicly reported figures from On3's NIL valuations, which estimate each athlete's projected 12 month earning potential. These are estimates, not salaries, and they change often.</p>
      <p>Want a specific player? <a href="/#calculator">Look anyone up in our calculator</a>, or <a href="/athletes/">browse the full database</a>.</p>

      <h2>Top NIL valuations in 2026</h2>
      <ol>
        <li><a href="/athlete/arch-manning/">Arch Manning</a>, Texas quarterback, about $5.4M. The single highest valuation in college sports, backed by deals reported with Red Bull, Panini, EA Sports, Raising Cane's, and more.</li>
        <li><a href="/athlete/jeremiah-smith/">Jeremiah Smith</a>, Ohio State wide receiver, about $4.2M. The most valuable non quarterback in the country.</li>
        <li><a href="/athlete/aj-dybantsa/">AJ Dybantsa</a>, BYU freshman, about $4.2M. The top men's basketball valuation.</li>
        <li><a href="/athlete/sam-leavitt/">Sam Leavitt</a>, LSU quarterback, about $4.0M.</li>
        <li><a href="/athlete/bryce-underwood/">Bryce Underwood</a>, Michigan quarterback, about $3.1M, tied to a reported four year package worth roughly $10.5M, among the largest in college football history.</li>
        <li><a href="/athlete/dante-moore/">Dante Moore</a>, Oregon quarterback, about $3.0M.</li>
        <li><a href="/athlete/jt-toppin/">JT Toppin</a>, Texas Tech, about $2.8M.</li>
        <li><a href="/athlete/pj-haggerty/">PJ Haggerty</a>, about $2.6M.</li>
        <li><a href="/athlete/cameron-boozer/">Cameron Boozer</a>, Duke, about $2.2M.</li>
        <li><a href="/athlete/flaujae-johnson/">Flau'jae Johnson</a>, LSU, about $1.5M. The top women's basketball valuation.</li>
      </ol>

      <h2>Football leads, and quarterbacks rule</h2>
      <p>Football produces the most NIL value, and quarterbacks sit at the very top. They touch every offensive snap, carry the heaviest media load, and are the face of the program, so brands pay a premium. The 2026 leaderboard is stacked with passers: Arch Manning, Sam Leavitt, Bryce Underwood, and Dante Moore all clear $3M. The clearest exception is Ohio State receiver Jeremiah Smith, whose roughly $4.2M valuation is the highest for any non quarterback.</p>

      <h2>Men's basketball</h2>
      <p>Men's basketball produces the highest non football figure in the country. BYU freshman AJ Dybantsa leads at about $4.2M, followed by Texas Tech's JT Toppin near $2.8M, PJ Haggerty around $2.6M, and Duke's Cameron Boozer at roughly $2.2M.</p>

      <h2>Women's basketball</h2>
      <p>Women's basketball is the top NIL sport for female athletes. LSU's Flau'jae Johnson leads at about $1.5M, with USC's <a href="/athlete/juju-watkins/">JuJu Watkins</a> close behind near three quarters of a million dollars and a Nike signature shoe on the way. The top women's figures trail the leading football and men's basketball numbers, but they are growing fast.</p>

      <h2>How these numbers are set</h2>
      <p>An NIL valuation blends a few things brands actually pay for: social reach and engagement, on field performance and role, the size of the school and market, the sport, the position, and pro potential. We explain the full method in <a href="/guide/how-nil-valuations-work/">how NIL valuations actually work</a>. You can also <a href="/#calculator">estimate any athlete yourself</a>, including high schoolers not yet in the database.</p>

      <p class="muted">Figures are estimated NIL valuations drawn from public reporting (primarily On3) and update frequently. They are projections of 12 month earning potential, not confirmed salaries or amounts paid.</p>
      ${SOURCES([
        ['On3 NIL Valuations', 'https://www.on3.com/nil/rankings/player/nil-valuations/'],
        ['Bleacher Report: top NIL valuations entering 2026', 'https://bleacherreport.com/articles/25226673-arch-manning-carson-beck-jeremiah-smith-and-top-nil-valuations-amid-cfb-media-days'],
        ['Yahoo Sports: college basketball NIL leaders', 'https://sports.yahoo.com/articles/college-basketballs-10-highest-paid-191412522.html']
      ])}
    `
  },

  {
    slug: 'how-nil-valuations-work',
    title: 'How NIL Valuations Actually Work',
    desc: 'What an NIL valuation really means, the factors behind it (social reach, performance, market, sport, position), and how to estimate any athlete.',
    date: '2026-06-06',
    body: `
      <p>You see the headlines: this quarterback is "worth" $5M, that freshman is "worth" $4M. But what does an <strong>NIL valuation</strong> actually mean, and how is it calculated? Here is the plain English version.</p>

      <h2>What a valuation is (and is not)</h2>
      <p>An NIL valuation is an <strong>estimate of how much an athlete could earn from name, image, and likeness over the next 12 months</strong>. It is a projection of earning potential, not a salary, not a signing bonus, and not a guarantee. Two athletes with the same valuation can earn very different amounts depending on the deals they actually sign.</p>
      <p>It is also separate from the new school revenue sharing payments created by the House settlement. We cover that in <a href="/guide/nil-revenue-sharing-house-settlement-2026/">NIL in 2026: revenue sharing explained</a>.</p>

      <h2>The factors that drive a valuation</h2>
      <ul>
        <li><strong>Audience.</strong> Followers across Instagram, TikTok, X, and YouTube, and just as important, how engaged that audience is. A smaller, highly engaged following can be worth more than a big, quiet one.</li>
        <li><strong>Performance and role.</strong> Stars and starters earn more than reserves. A national award winner or projected pro draft pick commands a premium.</li>
        <li><strong>Position.</strong> Some positions are simply more marketable. In football a quarterback is the face of the team and earns far more than most linemen, even with similar stats.</li>
        <li><strong>Stage.</strong> The school, conference, and market. A power conference program with a national TV footprint creates more brand exposure than a smaller school.</li>
        <li><strong>Sport.</strong> Football and men's basketball drive the most value, with women's basketball the leading sport for female athletes.</li>
      </ul>

      <h2>How our calculator does it</h2>
      <p>Our <a href="/#calculator">NIL calculator</a> weighs those same levers. You can either look up a player already in our database, or estimate any athlete (college or high school) by entering their sport, position, level, role, and social following. We turn engaged reach into a baseline, then adjust for the program, the position, the role, and the sport, and present the result as a likely range rather than a single false precise number. Where a public figure exists, we sense check against it.</p>

      <h2>Common questions</h2>
      <p><strong>Do athletes pay tax on NIL money?</strong> Yes. NIL income is taxable and the IRS generally treats it as self employment income, which means federal and state income tax plus the 15.3% self employment tax. Many athletes make quarterly estimated payments.</p>
      <p><strong>Can high schoolers earn NIL?</strong> In most states, yes. More than 40 states allow some form of high school NIL, though the rules vary by state association.</p>
      <p><strong>Why do two sites show different valuations?</strong> Because they are estimates built on different models and assumptions. Treat any single number as a ballpark, which is why we show a range.</p>

      <p><a href="/#calculator">Try the calculator</a> on any player you are curious about, or see the <a href="/guide/highest-paid-college-athletes-2026/">highest-paid college athletes in 2026</a>.</p>
      ${SOURCES([
        ['ESPN: what is NIL and how do deals work', 'https://www.espn.com/college-sports/story/_/id/41040485/what-nil-college-sports-how-do-athlete-deals-work'],
        ['IRS Taxpayer Advocate: NIL and taxes', 'https://www.taxpayeradvocate.irs.gov/news/nta-blog/march-madness-nil-and-tax-brackets/2026/03/']
      ])}
    `
  },

  {
    slug: 'nil-revenue-sharing-house-settlement-2026',
    title: 'NIL in 2026: Revenue Sharing, the House Settlement, and the NIL Clearinghouse',
    desc: 'How the House v. NCAA settlement, the ~$20.5M revenue-sharing cap, and the NIL Go clearinghouse reshaped college sports money in 2026.',
    date: '2026-06-06',
    body: `
      <p>College sports money changed more in the last year than in the previous decade. If you are trying to make sense of revenue sharing, the House settlement, and the new NIL clearinghouse, here is what actually happened and where things stand in 2026.</p>

      <h2>The House settlement</h2>
      <p>In June 2025 a federal judge granted final approval to the <strong>House v. NCAA settlement</strong>. It did two big things. First, it created roughly <strong>$2.8B in back pay</strong> for athletes who competed between 2016 and 2024. Second, and bigger going forward, it cleared the way for schools to <strong>pay athletes directly</strong> starting July 1, 2025.</p>

      <h2>Revenue sharing, explained</h2>
      <p>Each school can now share revenue with its athletes up to an annual cap of about <strong>$20.5M</strong> for the 2025 to 2026 year, a figure set to rise over the life of the 10 year deal. This is brand new and separate from NIL. Think of it this way:</p>
      <ul>
        <li><strong>Revenue sharing</strong> is money paid by the <em>school</em> to its athletes, under the cap.</li>
        <li><strong>NIL</strong> is money paid by <em>third parties</em> (brands, collectives, local businesses) for the use of an athlete's name, image, and likeness.</li>
      </ul>
      <p>An athlete can receive both. Our valuations and calculator focus on the NIL side, the third party brand value.</p>

      <h2>The NIL clearinghouse: NIL Go</h2>
      <p>To keep third party NIL deals from becoming disguised pay for play, the power conferences created the <strong>College Sports Commission</strong> and an online clearinghouse called <strong>NIL Go</strong>, operated by Deloitte, which launched in mid 2025. Any third party NIL deal worth <strong>$600 or more</strong> must be submitted for review, which checks that the deal has a real business purpose and pays a fair market rate.</p>
      <p>In its first reporting period the clearinghouse cleared more than 17,000 deals worth over $127M, while rejecting several hundred worth about $15M. The system has faced growing pains and legal disputes over how aggressively it polices deals, and that fight was still unfolding through early 2026.</p>

      <h2>What it means for athletes and fans</h2>
      <p>For top athletes, total compensation can now stack school revenue sharing on top of brand NIL deals. For everyone else, NIL remains the most accessible path, and it reaches well beyond the marquee names down to role players, high schoolers, and Olympic sport athletes who can turn an engaged audience into income.</p>
      <p>Curious what any athlete's NIL is worth? <a href="/#calculator">Use the calculator</a>, or see the <a href="/guide/highest-paid-college-athletes-2026/">highest-paid college athletes in 2026</a>.</p>

      <p class="muted">This article is general information, not legal, tax, or financial advice. Policy in this area is changing quickly, so verify current rules before acting.</p>
      ${SOURCES([
        ['ESPN: judge grants final approval to House v. NCAA settlement', 'https://www.espn.com/college-sports/story/_/id/45467505/judge-grants-final-approval-house-v-ncaa-settlement'],
        ['Congressional Research Service: the House settlement', 'https://www.congress.gov/crs-product/LSB11349'],
        ['Yahoo Sports: what is NIL Go', 'https://sports.yahoo.com/college-sports/article/what-is-nil-go-and-why-is-it-the-latest-subject-of-debate-among-college-sports-leaders-120028561.html'],
        ['ESPN: clearinghouse rejected 500-plus NIL deals', 'https://www.espn.com/college-sports/story/_/id/47591684/college-watchdog-group-rejected-500-plus-nil-deals-worth-nearly-15-million']
      ])}
    `
  },

  {
    slug: 'texas-softball-2026-wcws-champions',
    title: 'Texas Softball Wins Back-to-Back WCWS Titles: The NIL Stars Behind the Repeat',
    desc: "Texas swept Texas Tech to win the 2026 Women's College World Series, its second straight national title, behind two-time Most Outstanding Player Teagan Kavan.",
    date: '2026-06-06',
    body: `
      <p>The <strong>Texas Longhorns</strong> are back-to-back national champions. Texas swept Texas Tech 2-0 in the best-of-three 2026 Women's College World Series finals at Devon Park in Oklahoma City, taking Game 1 by 7 to 3 and clinching with a 4 to 1 win in Game 2. It is the program's second straight softball title, after Texas won its first ever championship in 2025, also over Texas Tech.</p>

      <h2>The "Heart Attack Horns"</h2>
      <p>Texas earned a nickname on the way to the title. After dropping their World Series opener to Tennessee, the Longhorns reeled off a string of must-win games to reach the final, then finished the job against the Red Raiders. Head coach Mike White now has two championships in his first run of title trips in Austin.</p>

      <h2>Teagan Kavan, two-time Most Outstanding Player</h2>
      <p><a href="/athlete/teagan-kavan/">Teagan Kavan</a> was named Most Outstanding Player of the Women's College World Series for the second year in a row, the first player ever to win it twice. She threw a complete game in the opener and came out of the bullpen to close the clincher. Around her, <a href="/athlete/katie-stewart/">Katie Stewart</a>, the 2026 SEC Player of the Year who set a Texas single-season home run record, and <a href="/athlete/kayden-henry/">Kayden Henry</a>, who homered in Game 2, powered the lineup. Star catcher <a href="/athlete/reese-atwood/">Reese Atwood</a> capped a decorated college career before turning pro in the AUSL.</p>

      <h2>Texas Tech and the Canady effect</h2>
      <p>Texas Tech reached the championship series for the second straight year, a rapid rise powered in large part by <a href="/athlete/nijaree-canady/">NiJaree Canady</a>. Her move from Stanford to Lubbock came with a reported NIL deal worth more than $1 million, believed to be the first seven figure package in college softball, and she was the ace at the center of the Red Raiders' run. Infielder <a href="/athlete/mia-williams/">Mia Williams</a> led the team in average and power. Texas Tech came up just short of Texas in the final in both seasons.</p>

      <h2>The NIL angle</h2>
      <p>Softball is one of the fastest growing NIL sports, and this final showed why. Canady's seven figure deal reset the market, and Texas's repeat champions are among the most marketable players in the women's game. Curious what a softball star is worth? <a href="/#calculator">Estimate any athlete</a>, see the <a href="/guide/highest-paid-college-athletes-2026/">highest-paid college athletes in 2026</a>, or browse the full <a href="/athletes/">player database</a>.</p>

      <p class="muted">Reporting compiled from ESPN, NCAA.com and other outlets. NIL figures on this site are estimates of earning potential, not confirmed deals.</p>
      ${SOURCES([
        ['ESPN: Heart Attack Horns, Texas wins the national championship', 'https://www.espn.com/college-sports/story/_/id/48971031/2026-wcws-texas-wins-national-championship'],
        ['NCAA.com: Texas wins the 2026 NCAA DI softball championship', 'https://www.ncaa.com/news/softball/article/2026-06-04/texas-wins-2026-ncaa-di-softball-championship'],
        ['ESPN: Texas claims second straight WCWS title over Texas Tech', 'https://www.espn.com/college-sports/story/_/id/48971064/texas-claims-second-straight-wcws-title-texas-tech'],
        ['ESPN: NiJaree Canady signs another seven-figure deal with Texas Tech', 'https://www.espn.com/college-sports/story/_/id/45464899/nijaree-canady-signs-another-7-figure-deal-texas-tech']
      ])}
    `
  },

  {
    slug: 'texas-oregon-2026-super-regional-nil',
    title: 'Texas vs Oregon 2026 Super Regional: NIL Stars and the Game 2 Pitching Matchup',
    desc: "No. 6 Texas leads No. 11 Oregon 1-0 in the 2026 Austin Super Regional with a trip to Omaha on the line. The Riojas vs Sanford pitching matchup, plus the NIL stars on both rosters.",
    date: '2026-06-08',
    body: `
      <p>The road to Omaha runs through Austin. <strong>No. 6 Texas</strong> and <strong>No. 11 Oregon</strong> are playing a best-of-three NCAA Super Regional, and the winner punches a ticket to the <strong>2026 Men's College World Series</strong>, which opens June 12 at Charles Schwab Field. Texas leads the series 1-0 after an 11 to 3 Game 1 win. Game 2 is set for Sunday, June 8 (8 p.m. Central, ESPN); if Oregon wins, a decisive Game 3 follows. However it ends, here is the pitching matchup and what the stars are worth.</p>

      <h2>The Game 2 pitching matchup: Riojas vs Sanford</h2>
      <p>Texas hands the ball to senior right-hander <a href="/athlete/ruger-riojas/">Ruger Riojas</a> (5-2, 3.86 ERA), an Austin native working back from a midseason bout of tendinitis. Oregon, facing elimination, counters with right-hander <a href="/athlete/will-sanford/">Will Sanford</a> (9-2, 3.46 ERA), the Eugene Regional MVP who struck out 14 and allowed just one hit over 6.1 innings against Washington State to push the Ducks to this round.</p>
      <p>Texas set the tone in Game 1 behind ace left-hander <a href="/athlete/dylan-volantis/">Dylan Volantis</a>, the reigning national freshman of the year and a finalist for national pitcher of the year, who struck out 10 over 5.1 innings. If the series goes the distance, the Longhorns would still have Volantis and weekend starter <a href="/athlete/luke-harrison/">Luke Harrison</a> available, with closer <a href="/athlete/thomas-burns/">Thomas Burns</a> anchoring the back end.</p>

      <h2>Texas's NIL names to know</h2>
      <p>Texas pairs elite pitching with a lineup full of draft-caliber bats. Beyond Volantis, watch catcher <a href="/athlete/carson-tinney/">Carson Tinney</a>, a Notre Dame transfer and middle-of-the-order presence; infielder <a href="/athlete/adrian-rodriguez/">Adrian Rodriguez</a>, the offensive star of the Game 1 rout; freshman outfielder <a href="/athlete/anthony-pack-jr/">Anthony Pack Jr.</a>, one of the SEC's top first-year players; <a href="/athlete/aiden-robbins/">Aiden Robbins</a>, a breakout Seton Hall transfer; and <a href="/athlete/jonah-williams/">Jonah Williams</a>, a two-sport athlete (also a football defensive back) who carries the biggest social following on the roster. Second baseman <a href="/athlete/ethan-mendoza/">Ethan Mendoza</a>, first baseman <a href="/athlete/casey-borba/">Casey Borba</a>, and LSU transfer outfielder <a href="/athlete/ashton-larson/">Ashton Larson</a> round out a deep group.</p>

      <h2>Oregon's NIL names to know</h2>
      <p>Sanford is the headliner on the mound, but the Ducks have pro upside in the field too. Shortstop <a href="/athlete/maddox-molony/">Maddox Molony</a> is a projected 2026 MLB Draft pick, switch-hitting outfielder <a href="/athlete/jax-gimenez/">Jax Gimenez</a> is a high-profile young prospect, and veteran corner bat <a href="/athlete/dominic-hellman/">Dominic Hellman</a> brings power to the middle of the order.</p>

      <h2>So what is a college baseball player worth in NIL?</h2>
      <p>Baseball NIL is real and growing, but it works differently than football or basketball, and public dollar figures are scarce. We break down exactly why in <a href="/guide/college-baseball-nil-explained/">how college baseball NIL works</a>. To see an estimate for any player above, open their page and unlock the value, or <a href="/#calculator">estimate any athlete in the calculator</a>. You can also <a href="/athletes/">browse the full database</a> or read <a href="/guide/how-nil-valuations-work/">how NIL valuations actually work</a>.</p>

      <p class="muted">Series details as of Sunday, June 8, 2026, compiled from NCAA.com, ESPN and other outlets. NIL figures on this site are modeled estimates of earning potential, not confirmed deals.</p>
      ${SOURCES([
        ['NCAA.com: 2026 baseball tournament bracket and schedule', 'https://www.ncaa.com/news/baseball/article/2026-06-07/2026-ncaa-baseball-tournament-bracket-schedule-scores-mens-college-world-series'],
        ['On3: Texas vs Oregon Game 2 preview', 'https://www.on3.com/teams/texas-longhorns/news/texas-vs-oregon-g2-preview-the-arms-that-will-define-texas-hopes-of-a-college-world-series-appearance/'],
        ['Sports Illustrated: Oregon vs Texas Game 2 starting pitchers', 'https://www.si.com/college/oregon/news/oregon-baseball-texas-longhorns-starting-pitchers-how-watch-elimination-will-sanford-ruger-riojas'],
        ['Burnt Orange Nation: Texas tops Oregon 11-3 in Game 1', 'https://www.burntorangenation.com/texas-longhorns-baseball/102509/texas-longhorns-11-oregon-ducks-3-adrian-rodriguez'],
        ['Texas Athletics: Austin Super Regional preview', 'https://texaslonghorns.com/news/2026/6/5/no-6-baseball-preview-no-11-oregon-ncaa-austin-super-regional']
      ])}
    `
  },

  {
    slug: 'college-baseball-nil-explained',
    title: 'Do College Baseball Players Get NIL Money? How Baseball NIL Works in 2026',
    desc: "Yes, college baseball players earn NIL, but it works differently than football or basketball. How baseball NIL works in 2026, what drives it, and the College World Series effect.",
    date: '2026-06-08',
    body: `
      <p>With the <strong>2026 Men's College World Series</strong> set to open June 12 in Omaha, a question always follows the sport's biggest stage: <strong>do college baseball players actually get NIL money?</strong> The short answer is yes, but baseball NIL works differently than it does in football or basketball, and the numbers are both smaller and far less public.</p>

      <h2>Yes, baseball players earn NIL, but the pool is smaller</h2>
      <p>Since 2021, college baseball players have been free to earn from their name, image, and likeness through brand deals, autograph and memorabilia sales, camps, and school collectives. Top draft prospects and postseason heroes can do real business. But the total NIL pool in baseball trails football, men's basketball, and women's basketball by a wide margin, because baseball draws smaller national TV audiences for individual stars and carries 35-plus man rosters that spread attention thin.</p>

      <h2>Why you rarely see baseball NIL dollar figures</h2>
      <p>For football and basketball, outlets like On3 publish per-player NIL valuations. For baseball, they generally do not, so reliable public dollar figures are hard to find. That is why baseball valuations on this site are clearly labeled <strong>modeled estimates</strong> rather than reported figures: we estimate earning potential from the same inputs brands actually weigh. See <a href="/guide/how-nil-valuations-work/">how NIL valuations actually work</a> for the full method.</p>

      <h2>What drives a baseball player's NIL value</h2>
      <ul>
        <li><strong>MLB Draft stock and pro upside.</strong> This matters more in baseball than in almost any other college sport. A projected high pick is a brand magnet, even at a smaller school.</li>
        <li><strong>Role and production.</strong> A Friday-night ace or an everyday middle-of-the-order bat earns more than a depth arm or a reserve.</li>
        <li><strong>Social following and engagement.</strong> A large, active audience is something brands pay for directly.</li>
        <li><strong>Program and the postseason spotlight.</strong> A run to Omaha puts players in front of a national audience and spikes their value in real time.</li>
        <li><strong>Position and story.</strong> Two-way players, power hitters, and flame-throwing closers carry appeal beyond the box score.</li>
      </ul>

      <h2>The College World Series effect</h2>
      <p>Postseason exposure is the single biggest short-term lever for a baseball player's NIL. Among the teams headed to the 2026 College World Series are Georgia, Ole Miss, North Carolina, and Troy, which is making the first trip in school history, with the Texas and Oregon Super Regional winner still to join them. You can look up players from those rosters in our database, from Georgia's <a href="/athlete/tre-phelps/">Tre Phelps</a> and Ole Miss's <a href="/athlete/cade-townsend/">Cade Townsend</a> to North Carolina's <a href="/athlete/jake-schaffner/">Jake Schaffner</a>, Troy's <a href="/athlete/jimmy-janicki/">Jimmy Janicki</a>, Texas ace <a href="/athlete/dylan-volantis/">Dylan Volantis</a>, and Oregon's <a href="/athlete/maddox-molony/">Maddox Molony</a>. Every deep run creates new household names, and new NIL opportunities.</p>

      <h2>Estimate any baseball player's NIL</h2>
      <p>Curious what a specific player could be worth? <a href="/#calculator">Use the calculator</a> to estimate any athlete, <a href="/athletes/">browse the full database</a>, or see the <a href="/guide/highest-paid-college-athletes-2026/">highest-paid college athletes of 2026</a> for how baseball stacks up against the big-money sports.</p>

      <p class="muted">NIL figures for baseball on this site are modeled estimates of 12 month earning potential, not confirmed deals or reported salaries.</p>
      ${SOURCES([
        ['On3 NIL Valuations: college baseball', 'https://www.on3.com/nil/rankings/player/college/baseball/'],
        ['NCAA.com: 2026 College World Series bracket and schedule', 'https://www.ncaa.com/news/baseball/article/2026-06-07/2026-ncaa-baseball-tournament-bracket-schedule-scores-mens-college-world-series']
      ])}
    `
  },

  {
    slug: 'brendan-sorsby-nil-lawsuit-texas-tech',
    title: "Brendan Sorsby's $6M NIL Deal and the Cincinnati Lawsuit, Explained",
    desc: "Brendan Sorsby left Cincinnati for a reported $6M Texas Tech NIL package, and now Cincinnati is suing him over a $1M exit fee. The deal, the lawsuit, and the NCAA eligibility ruling, explained.",
    date: '2026-06-09',
    body: `
      <p>No player better captures the new, messy economics of college football than <a href="/athlete/brendan-sorsby/">Brendan Sorsby</a>. In a matter of months the quarterback has been tied to a reported <strong>$6 million</strong> Texas Tech NIL package, been <strong>sued by his old school</strong> over a $1 million exit fee, and won a court fight to stay eligible. Here is what is actually going on, and why it matters for NIL.</p>

      <h2>Who is Brendan Sorsby?</h2>
      <p>Sorsby spent 2024 and 2025 as the starting quarterback at Cincinnati, where he became one of the best players in the Big 12. In 2025 he was named the <strong>PFF Big 12 Offensive Player of the Year</strong>, threw for 2,800 yards and 27 touchdowns, ran for 580 yards and nine more scores, and his 36 total touchdowns tied a school record. After the season he entered the transfer portal and committed to <a href="/athlete/brendan-sorsby/">Texas Tech</a>.</p>

      <h2>The reported $6 million Texas Tech deal</h2>
      <p>Texas Tech has built one of the most expensive rosters in the sport, and Sorsby is the anchor: reports peg his 2026 NIL package at about <strong>$6 million</strong>, part of a roster reportedly valued north of $38 million. That puts him among the highest-paid players in college football. See how he stacks up in our roundup of the <a href="/guide/highest-paid-college-athletes-2026/">highest-paid college athletes in 2026</a>.</p>

      <h2>Why Cincinnati is suing him</h2>
      <p>Here is the twist. Before the 2025 season, Cincinnati signed Sorsby to an 18-month NIL contract that ran through December 2026 and included a <strong>$1 million liquidated-damages clause</strong>, an exit fee owed if he left early. When he transferred to Texas Tech, Cincinnati sued to collect it. Sorsby has pushed back, arguing the deal functioned less like true name, image and likeness compensation and more as a pay-for-play retention tool. However the case ends, it is one of the first real tests of whether school and collective NIL contracts are actually enforceable, the question that defines this whole era. We break down how the money works in <a href="/guide/how-nil-valuations-work/">how NIL valuations actually work</a> and <a href="/guide/nil-revenue-sharing-house-settlement-2026/">NIL revenue sharing explained</a>.</p>

      <h2>The eligibility ruling</h2>
      <p>Sorsby's 2026 status was also in doubt: the NCAA had moved to rule him ineligible amid a gambling inquiry. In June 2026 he was granted a <strong>temporary injunction</strong> against the NCAA, clearing him to play for Texas Tech this season while the matter plays out. The ruling immediately shifted Texas Tech's outlook for 2026.</p>

      <h2>Why it matters</h2>
      <p>Sorsby is a preview of college football's next phase: guaranteed money, multi-year contracts, buyout clauses, and courtrooms. As deals get bigger, the paperwork behind them, exit fees and all, starts to look a lot like professional sports. That is exactly why a player's NIL value is now front-page news.</p>

      <h2>See the numbers</h2>
      <p>Check <a href="/athlete/brendan-sorsby/">Brendan Sorsby's NIL value</a>, <a href="/#calculator">estimate any athlete</a> in our calculator, or <a href="/athletes/">browse the full database</a>.</p>

      <p class="muted">Reporting compiled from ESPN, Sportico, Yahoo Sports and other outlets. Deal figures are as reported; NIL values on this site are estimates of earning potential, not confirmed amounts paid.</p>
      ${SOURCES([
        ['ESPN: Cincinnati sues Sorsby over $1M exit fee after Texas Tech transfer', 'https://www.espn.com/college-football/story/_/id/48035774/cincinnati-sues-sorsby-1m-exit-fee-texas-tech-transfer'],
        ['ESPN: Sorsby granted injunction vs. NCAA, eligible to play in 2026', 'https://www.espn.com/college-football/story/_/id/49000177/brendan-sorsby-granted-injunction-vs-ncaa-eligible-play-2026'],
        ['Sportico: Sorsby calls out NIL purpose in lawsuit', 'https://www.sportico.com/law/analysis/2026/brendan-sorsby-nil-deal-cincinnati-lawsuit-1234891362/'],
        ['Yahoo Sports: Texas Tech promised Sorsby $6M NIL', 'https://sports.yahoo.com/articles/texas-tech-already-promised-brendan-211541481.html']
      ])}
    `
  },

  {
    slug: 'sec-top-transfers-nil-2026',
    title: "The SEC's Most Valuable Transfers of 2026: What Each Move Is Worth",
    desc: "Sam Leavitt, Jordan Seaton and the portal additions carrying the biggest NIL price tags into SEC camps this fall, ranked with valuation ranges.",
    date: '2026-07-30',
    body: `
      <p>Lane Kiffin needed a quarterback, a left tackle and an edge rusher for his first season at LSU. He bought all three out of the transfer portal, and two of them now carry the largest NIL valuations of any transfers in the SEC. Across the conference, programs treated the 2026 portal cycle like a free agency period, and the money followed.</p>
      <p>Below are the highest-valued players who changed schools within, into or around the SEC for the 2026 season, ranked by their current valuation in our database. We show ranges here rather than exact figures. Each player's page carries the specific number, the projected range and the four-pillar breakdown behind it. Valuations blend figures published by services such as On3 and The NIL Standard with our own modeled estimates. Unless a deal is noted as reported, treat every number as an estimate, not a confirmed contract.</p>

      <h2>The top 12 SEC transfers by NIL value</h2>
      <ol>
        <li><a href="/athlete/sam-leavitt/">Sam Leavitt</a>, quarterback, Arizona State to LSU. Range: $3.5 million to $4.5 million. Leavitt broke out in Tempe, entered the portal as the cycle's most coveted passer and landed with Kiffin in Baton Rouge, where he carries a reported top-five NIL valuation among all college athletes.</li>
        <li><a href="/athlete/jordan-seaton/">Jordan Seaton</a>, offensive tackle, Colorado to LSU. Range: $3.5 million to $4.5 million. Seaton started at left tackle from his true freshman season in Boulder and was among the most pursued linemen in the portal. He protects Leavitt's blind side, which explains the price.</li>
        <li><a href="/athlete/byrum-brown/">Byrum Brown</a>, quarterback, USF to Auburn. Range: $2.6 million to $3.4 million. Brown threw for 3,158 yards and 28 touchdowns at USF in 2025, then followed head coach Alex Golesh to the Plains in January for his final year of eligibility.</li>
        <li><a href="/athlete/cam-coleman/">Cam Coleman</a>, wide receiver, Auburn to Texas. Range: $2.5 million to $3.3 million. The highest-rated player in the entire portal cycle. Coleman caught 56 passes for 708 yards at Auburn in 2025, entered the portal after Hugh Freeze's firing and committed to Texas in January. He has since signed a Nike deal.</li>
        <li><a href="/athlete/kenny-minchey/">Kenny Minchey</a>, quarterback, Notre Dame to Kentucky. Range: $1.7 million to $2.3 million. Minchey lost a tight competition to CJ Carr in South Bend. He becomes Kentucky's fifth transfer starter at quarterback in six seasons and the first under new head coach Will Stein.</li>
        <li><a href="/athlete/lance-heard/">Lance Heard</a>, offensive tackle, Tennessee to Kentucky. Range: $1.7 million to $2.3 million. A former five-star who began his career at LSU, Heard earned third-team All-SEC honors in Knoxville and arrives in Lexington as a preseason All-SEC pick. On3 rated him the No. 3 tackle in the portal.</li>
        <li><a href="/athlete/aaron-philo/">Aaron Philo</a>, quarterback, Georgia Tech to Florida. Range: $1.3 million to $1.7 million. Philo followed offensive coordinator Buster Faulkner from Atlanta to Gainesville and is battling Tramell Jones Jr. for the starting job under first-year head coach Jon Sumrall.</li>
        <li><a href="/athlete/princewill-umanmielen/">Princewill Umanmielen</a>, edge rusher, Ole Miss to LSU. Range: $1.3 million to $1.7 million. Umanmielen followed Kiffin from Oxford and was one of the highest-rated defensive players available in the cycle.</li>
        <li><a href="/athlete/wilkin-formby/">Wilkin Formby</a>, offensive tackle, Alabama to Texas A&M. Range: $1.2 million to $1.65 million. The 6-foot-7, 324-pound Formby started 14 games for the Crimson Tide in 2025 and arrived in College Station in January with two seasons of eligibility left.</li>
        <li><a href="/athlete/melvin-siani/">Melvin Siani</a>, offensive tackle, Wake Forest to Texas. Range: $1.1 million to $1.5 million. Siani has not allowed a sack in 853 career pass-blocking snaps across stops at Temple and Wake Forest. Texas projects him at right tackle.</li>
        <li><a href="/athlete/tyree-adams/">Tyree Adams</a>, offensive tackle, LSU to Texas A&M. Range: $1 million to $1.4 million. Adams started nine games at left tackle for LSU in 2025 and allowed one sack. The Aggies added him and Formby to rebuild both edges of their line in one cycle.</li>
        <li><a href="/athlete/jordan-norman/">Jordan Norman</a>, edge rusher, Tulane to Tennessee. Range: $950,000 to $1.25 million. Norman, who began his career at South Alabama, projects as the Volunteers' starting Leo rusher.</li>
      </ol>

      <h2>What the list says about the market</h2>
      <p>Five of these 12 play offensive tackle. That is not an accident. Pass protection is the scarcest skill in the portal, the position takes years to develop, and a proven college starter is worth more to an SEC contender than a projection. Quarterbacks still set the ceiling, but the middle of the SEC transfer market in 2026 belonged to linemen.</p>
      <p>Auburn is the story inside the story. The Tigers hired a quarterback from USF and lost the cycle's most valuable player to Texas, then watched receiver <a href="/athlete/eric-singleton-jr/">Eric Singleton Jr.</a> leave for Florida after a team-leading 58 catches. Coaching change, roster churn, and a portal market that reprices a program in weeks.</p>
      <p>Just outside the list: Texas linebacker <a href="/athlete/rasheem-biles/">Rasheem Biles</a>, an All-ACC pick at Pitt who posted 100 tackles and 4.5 sacks in 2025 and projects as the Longhorns' starting Money linebacker, plus LSU's <a href="/athlete/jordan-ross/">Jordan Ross</a> (from Tennessee) and Texas A&M's <a href="/athlete/cj-mims/">CJ Mims</a> (from North Carolina), all in the neighborhood of seven figures.</p>

      <h2>The name that started the conversation is back in the league</h2>
      <p>No player did more to shape how college sports talks about NIL contracts than <a href="/athlete/jaden-rashada/">Jaden Rashada</a>, whose reported $13.85 million collective agreement tied to a Florida commitment collapsed before he ever enrolled, and who later sued over it. He arrives at Mississippi State from Sacramento State for 2026, his fourth school, competing for the backup job. His valuation now sits in the mid six figures, well outside this list. That gap between the number attached to his name in 2023 and the one attached to it today is its own lesson in what these figures actually mean.</p>

      <h2>Look up the exact numbers</h2>
      <p>Every player above has a full profile with his current valuation, projected range and the breakdown behind it. <a href="/athletes/">Browse the database</a> or <a href="/#calculator">look up any athlete in the calculator</a>, including players who have not hit the portal yet.</p>

      <p class="muted">Ranges reflect current valuations in our database as of late July 2026. They are estimates of 12 month earning potential, not confirmed salaries or contract amounts, and they move as roles and markets change.</p>
      ${SOURCES([
        ['On3 NIL Valuations', 'https://www.on3.com/nil/rankings/player/nil-valuations/'],
        ['On3 Transfer Portal rankings', 'https://www.on3.com/transfer-portal/rankings/football/2026/'],
        ['The NIL Standard team valuations', 'https://thenilstandard.com/']
      ])}
    `
  },

  {
    slug: 'big-ten-top-transfers-nil-2026',
    title: "The Big Ten's Most Valuable Transfers of 2026: What Each Move Is Worth",
    desc: "Josh Hoover's move to the defending champs headlines the Big Ten's 2026 portal class. The top transfers in the conference, ranked by NIL valuation range.",
    date: '2026-07-30',
    body: `
      <p>The defending national champions lost their quarterback and most of their edge room, so Indiana went shopping. The Hoosiers left the 2026 portal cycle with the Big Ten's most expensive transfer and two of its priciest defenders, and they were not alone. Oregon restocked four spots on this list by itself.</p>
      <p>These are the highest-valued players suiting up for a new Big Ten program in 2026, ranked by their current valuation in our database. Ranges are shown here; each player's page has the exact figure and the full breakdown. Valuations blend published figures from services such as On3 and The NIL Standard with our own modeled estimates, and only deals noted as reported reflect actual published dollar amounts.</p>

      <h2>The top 14 Big Ten transfers by NIL value</h2>
      <ol>
        <li><a href="/athlete/josh-hoover/">Josh Hoover</a>, quarterback, TCU to Indiana. Range: $2 million to $3 million. Hoover threw for 3,472 yards and 29 touchdowns at TCU in 2025 and enters the season as the active FBS leader in career passing yards and touchdowns. His Indiana deal was widely reported at seven figures, one of the few transfer contracts of the cycle with a published number.</li>
        <li><a href="/athlete/rocco-becht/">Rocco Becht</a>, quarterback, Iowa State to Penn State. Range: $1.7 million to $2.3 million. Becht started four seasons in Ames and followed Matt Campbell east within weeks of Campbell taking the Penn State job. He is the centerpiece of the largest coach-driven roster migration of the cycle.</li>
        <li><a href="/athlete/chiddi-obiazor/">Chiddi Obiazor</a>, edge rusher, Kansas State to Indiana. Range: $1.3 million to $1.7 million. An honorable mention All-Big 12 pick, Obiazor is half of the Kansas State edge pair Indiana imported to replace Mikail Kamara.</li>
        <li><a href="/athlete/tobi-osunsanmi/">Tobi Osunsanmi</a>, edge rusher, Kansas State to Indiana. Range: $1.3 million to $1.7 million. The other half. Osunsanmi rates as the Hoosiers' highest-graded defensive addition of the cycle and is competing for the starting Stud role.</li>
        <li><a href="/athlete/dylan-raiola/">Dylan Raiola</a>, quarterback, Nebraska to Oregon. Range: $1.1 million to $1.5 million. A two-year starter in Lincoln, Raiola arrives in Eugene as the veteran in the quarterback room and still carries one of the sport's most recognizable NIL portfolios, with past national deals including adidas and EA Sports.</li>
        <li><a href="/athlete/john-henry-daley/">John Henry Daley</a>, edge rusher, Utah to Michigan. Range: $1 million to $1.4 million. Daley followed Kyle Whittingham to Ann Arbor after a first-team Walter Camp All-America season: 17.5 tackles for loss and 11.5 sacks in 11 games.</li>
        <li><a href="/athlete/michael-bennett-iii/">Michael Bennett III</a>, offensive tackle, Yale to Oregon. Range: $1 million to $1.4 million. A first-team All-Ivy pick who allowed two sacks on 839 snaps in 2025, Bennett is the rare FCS-to-power jump that projects as a day-one starter.</li>
        <li><a href="/athlete/koi-perich/">Koi Perich</a>, safety, Minnesota to Oregon. Range: $950,000 to $1.25 million. Rated the top safety in the portal after piling up 128 tackles and multiple all-conference honors in two Minnesota seasons.</li>
        <li><a href="/athlete/anthony-colandrea/">Anthony Colandrea</a>, quarterback, UNLV to Nebraska. Range: $950,000 to $1.25 million. The 2025 Mountain West Offensive Player of the Year threw for 3,459 yards on a nine-win UNLV team. Nebraska hired him to replace the man one spot above him on this list.</li>
        <li><a href="/athlete/james-smith/">James Smith</a>, defensive lineman, Alabama to Ohio State. Range: $925,000 to $1.25 million. A former five-star, Smith is expected to anchor the interior for the Buckeyes.</li>
        <li><a href="/athlete/iverson-hooks/">Iverson Hooks</a>, wide receiver, UAB to Oregon. Range: $900,000 to $1.2 million. Hooks caught 72 passes for 927 yards and seven scores at UAB and slots in at slot receiver for the Ducks.</li>
        <li><a href="/athlete/sahir-west/">Sahir West</a>, edge rusher, James Madison to UCLA. Range: $875,000 to $1.2 million. The Sun Belt Freshman of the Year posted 14 tackles for loss and seven sacks in 2025, then followed Bob Chesney west. He is the headline addition of UCLA's rebuild.</li>
        <li><a href="/athlete/aiden-gobaira/">Aiden Gobaira</a>, edge rusher, James Madison to UCLA. Range: $875,000 to $1.2 million. A former Notre Dame signee and third-team All-Sun Belt pick, Gobaira projects to start opposite West, giving UCLA both edges from one JMU pipeline.</li>
        <li><a href="/athlete/chase-sowell/">Chase Sowell</a>, wide receiver, Iowa State to Penn State. Range: $775,000 to $1.05 million. Sowell is on his fourth school after Colorado and East Carolina, and he followed Campbell and Becht from Ames to State College.</li>
      </ol>

      <h2>Two programs did not rebuild, they relocated</h2>
      <p>Becht and Sowell are two names out of roughly two dozen. When Matt Campbell left Iowa State for Penn State, he brought a sizable share of his roster with him, and the Nittany Lions now list more than 20 players whose previous school was Iowa State.</p>
      <p>UCLA ran the same play from a different level. New head coach Bob Chesney arrived from James Madison with roughly 40 portal additions, about 10 of them former Dukes, and West and Gobaira now project as both starting edge rushers. Programs have always poached individual players. Moving a functioning defensive front, or most of a depth chart, in a single offseason is new.</p>

      <h2>The Raiola-Colandrea trade that wasn't</h2>
      <p>No two moves explain the modern portal better than Nebraska and its quarterback room. Raiola left Lincoln for Oregon, and Nebraska replaced him within weeks by signing Colandrea away from UNLV. Two starting-caliber quarterbacks, two seven-figure valuations, zero high school recruiting involved.</p>
      <p>Two names deliberately missing. Washington's <a href="/athlete/demond-williams-jr/">Demond Williams Jr.</a> entered the portal in December and then agreed to return to the Huskies on one of the largest reported packages in the sport. He never changed schools. And UCLA's <a href="/athlete/nico-iamaleava/">Nico Iamaleava</a>, the most valuable quarterback in the conference at a reported seven figures, made his move from Tennessee in the spring of 2025, not this cycle. He stayed in Westwood after Chesney was hired, so 2026 is his second season as a Bruin. Both pages tell those stories.</p>

      <h2>Look up the exact numbers</h2>
      <p>Every player above has a profile with his current valuation and range. <a href="/athletes/">Browse the full database</a> or <a href="/#calculator">run any player through the calculator</a>.</p>

      <p class="muted">Ranges reflect current valuations in our database as of late July 2026. They are estimates of 12 month earning potential, not confirmed salaries or contract amounts.</p>
      ${SOURCES([
        ['On3 NIL Valuations', 'https://www.on3.com/nil/rankings/player/nil-valuations/'],
        ['On3 Transfer Portal rankings', 'https://www.on3.com/transfer-portal/rankings/football/2026/'],
        ['The NIL Standard team valuations', 'https://thenilstandard.com/']
      ])}
    `
  },

  {
    slug: 'big-12-top-transfers-nil-2026',
    title: "The Big 12's Most Valuable Transfers of 2026: What Each Move Is Worth",
    desc: "Texas Tech doubled down after a Big 12 title, BYU rebuilt through the blue bloods and a Harvard record-setter landed at TCU. The conference's top 2026 transfers, ranked.",
    date: '2026-07-30',
    body: `
      <p>Texas Tech won the Big 12 in 2025 by outspending the conference in the portal, then answered every departure with another check. Six of the nine players on this list are new Red Raiders. The rest of the conference's marquee moves came from unexpected directions: a Harvard record-holder taking over at TCU, and BYU raiding USC, Cal and Oregon for starters.</p>
      <p>These are the highest-valued players joining a new Big 12 program for 2026 among the conference schools in our database (Texas Tech, TCU, BYU and Oklahoma's former conference mates are covered separately). Ranges are shown here; exact figures live on each player's page. Valuations blend published figures from services such as On3 and The NIL Standard with our own modeled estimates.</p>

      <h2>The top Big 12 transfers by NIL value</h2>
      <ol>
        <li><a href="/athlete/adam-trick/">Adam Trick</a>, edge rusher, Miami (Ohio) to Texas Tech. Range: $1.25 million to $1.7 million. Trick posted 12.5 tackles for loss and 8.5 sacks in the MAC in 2025 and projects as the starting rush end on a rebuilt front.</li>
        <li><a href="/athlete/trey-white/">Trey White</a>, edge rusher, San Diego State to Texas Tech. Range: $1.25 million to $1.7 million. A two-time first-team All-Mountain West pick with 19.5 career sacks, White inherits the pass-rushing production Texas Tech lost to the NFL in David Bailey and Romello Height.</li>
        <li><a href="/athlete/kenny-johnson/">Kenny Johnson</a>, wide receiver, Pittsburgh to Texas Tech. Range: $850,000 to $1.15 million. Johnson caught 48 passes for 695 yards and five touchdowns for the Panthers in 2025 and projects to start at the Z.</li>
        <li><a href="/athlete/bryce-butler/">Bryce Butler</a>, defensive lineman, Washington to Texas Tech. Range: $800,000 to $1.1 million. The Toronto native gives the Red Raiders a plug-and-play nose tackle.</li>
        <li><a href="/athlete/jaden-craig/">Jaden Craig</a>, quarterback, Harvard to TCU. Range: $700,000 to $950,000. Craig left Harvard as its all-time leader in touchdown passes and passing yards, set single-season program records in 2025 and steps into the Big 12 as TCU's projected starter.</li>
        <li><a href="/athlete/austin-romaine/">Austin Romaine</a>, linebacker, Kansas State to Texas Tech. Range: $500,000 to $700,000. Romaine averaged better than seven tackles a game in an injury-shortened 2025 and graded among the Big 12's best linebackers the year before.</li>
        <li><a href="/athlete/walker-lyons/">Walker Lyons</a>, tight end, USC to BYU. Range: $325,000 to $450,000. Lyons brings 20 college catches and one of the biggest social followings on BYU's roster, with more than 100,000 followers on both Instagram and TikTok.</li>
        <li><a href="/athlete/cade-uluave/">Cade Uluave</a>, linebacker, Cal to BYU. Range: $300,000 to $425,000. Rated the top linebacker in the portal after a 97-tackle season in Berkeley, Uluave arrives with preseason All-Big 12 billing.</li>
        <li><a href="/athlete/kyler-kasper/">Kyler Kasper</a>, wide receiver, Oregon to BYU. Range: $150,000 to $210,000. The 6-foot-6 son of former NFL receiver Kevin Kasper was once a top national recruit and gets his first extended runway in Provo.</li>
      </ol>

      <h2>The deal that defined the cycle never counted</h2>
      <p>The most expensive Big 12 transfer of the winter is not on this list because he never played a down. Texas Tech landed Cincinnati quarterback Brendan Sorsby on a package reported near $6 million, then lost him before the season amid an NCAA eligibility fight that turned into the sport's most closely watched NIL lawsuit. <a href="/guide/brendan-sorsby-nil-lawsuit-texas-tech/">We covered the full saga here</a>.</p>
      <p>The other lesson in the numbers: Big 12 money runs a full tier below the SEC and Big Ten. The conference's top transfer valuation would rank sixth in the SEC's portal class and fourth in the Big Ten's.</p>

      <h2>Look up the exact numbers</h2>
      <p>Every player above has a profile with his current valuation and range. <a href="/athletes/">Browse the database</a> or <a href="/#calculator">estimate any player in the calculator</a>.</p>

      <p class="muted">Ranges reflect current valuations in our database as of late July 2026. They are estimates of 12 month earning potential, not confirmed salaries or contract amounts.</p>
      ${SOURCES([
        ['On3 NIL Valuations', 'https://www.on3.com/nil/rankings/player/nil-valuations/'],
        ['On3 Transfer Portal rankings', 'https://www.on3.com/transfer-portal/rankings/football/2026/'],
        ['The NIL Standard team valuations', 'https://thenilstandard.com/']
      ])}
    `
  },

  {
    slug: 'acc-top-transfers-nil-2026',
    title: "The ACC's Most Valuable Transfers of 2026: What Each Move Is Worth",
    desc: "Miami made Darian Mensah the most valuable player in college football. The ACC's top 2026 portal additions, ranked by NIL valuation range.",
    date: '2026-07-30',
    body: `
      <p>The biggest NIL valuation in college football does not belong to Arch Manning anymore. It belongs to a quarterback who was throwing for Duke last November. Miami's addition of Darian Mensah reset the ACC's price ceiling and headlines a portal cycle in which the conference's contenders did most of their roster building after the season ended.</p>
      <p>These are the highest-valued players joining a new ACC program for 2026, ranked by their current valuation in our database. Ranges are shown here; the exact figure, projected range and breakdown live on each player's page. Valuations blend published figures from services such as On3 and The NIL Standard with our own modeled estimates. Deals noted as reported reflect published dollar figures; everything else is an estimate.</p>

      <h2>The top ACC transfers by NIL value</h2>
      <ol>
        <li><a href="/athlete/darian-mensah/">Darian Mensah</a>, quarterback, Duke to Miami. Range: $5.5 million to $7.5 million. Mensah threw for 3,973 yards with 34 touchdowns against six interceptions in 2025, and his reported Miami package tops On3's NIL 100. He is the most valuable player in our entire database.</li>
        <li><a href="/athlete/damon-wilson-ii/">Damon Wilson II</a>, edge rusher, Missouri to Miami. Range: $1.3 million to $1.7 million. Wilson recorded nine sacks in Columbia in 2025 after beginning his career at Georgia. His deal, like Mensah's, was publicly reported.</li>
        <li><a href="/athlete/beau-pribula/">Beau Pribula</a>, quarterback, Missouri to Virginia. Range: $1.1 million to $1.5 million. Pribula passed for 1,941 yards and 11 touchdowns in 2025 and projects as Virginia's starter on a reported deal.</li>
        <li><a href="/athlete/xavier-chaplin/">Xavier Chaplin</a>, offensive tackle, Auburn to Florida State. Range: $1.1 million to $1.55 million. Chaplin started all 12 games at left tackle for Auburn in 2025 after three seasons at Virginia Tech, and he anchors an FSU line rebuilt almost entirely through the portal.</li>
        <li><a href="/athlete/nate-pabst/">Nate Pabst</a>, offensive lineman, Bowling Green to Florida State. Range: $975,000 to $1.35 million. Pabst projects to start on the interior alongside Chaplin.</li>
        <li><a href="/athlete/rylan-kennedy/">Rylan Kennedy</a>, edge rusher, Texas A&M to Florida State. Range: $950,000 to $1.3 million. Kennedy arrived in January and projects as the starting JACK, a bigger role than he held at any earlier stop.</li>
        <li><a href="/athlete/davis-warren/">Davis Warren</a>, quarterback, Michigan to Stanford. Range: $950,000 to $1.25 million. A leukemia survivor who walked on at Michigan and made nine starts in 2024, Warren transferred west as a graduate and is projected to start for new-look Stanford.</li>
        <li><a href="/athlete/marques-white/">Marques White</a>, edge rusher, UMass to SMU. Range: $800,000 to $1.1 million. White posted 11 tackles for loss and five sacks in 2025 and made the All-New England first team.</li>
        <li><a href="/athlete/billy-edwards-jr/">Billy Edwards Jr.</a>, quarterback, Wisconsin to North Carolina. Range: $800,000 to $1.1 million. The headline addition of Bill Belichick's second portal cycle in Chapel Hill, Edwards threw for 2,881 yards as Maryland's starter in 2024.</li>
        <li><a href="/athlete/ashton-daniels/">Ashton Daniels</a>, quarterback, Auburn to Florida State. Range: $675,000 to $925,000. Daniels won the FSU job out of spring. He has started 23 of his 37 career games across stops at Stanford and Auburn.</li>
      </ol>

      <h2>Missouri paid the exit bill</h2>
      <p>Two of the top three names on this list left the same locker room. Missouri lost Wilson to Miami and Pribula to Virginia in the same cycle, a reminder that in the revenue-share era, developing a player and keeping him are now separate line items.</p>
      <p>Two notes on who is missing. Florida State's <a href="/athlete/duce-robinson/">Duce Robinson</a>, the league's most productive transfer receiver, moved from USC a year earlier, so he is not a 2026 arrival. His 1,081-yard 2025 season is exactly why programs keep paying portal prices. And Notre Dame, which added Alabama edge rusher <a href="/athlete/keon-keeley/">Keon Keeley</a> in January, remains independent in football despite playing most other sports in the ACC, so Keeley is not on this list either.</p>

      <h2>Look up the exact numbers</h2>
      <p>Every player above has a profile with his current valuation and range. <a href="/athletes/">Browse the database</a> or <a href="/#calculator">look up any athlete in the calculator</a>.</p>

      <p class="muted">Ranges reflect current valuations in our database as of late July 2026. They are estimates of 12 month earning potential, not confirmed salaries or contract amounts.</p>
      ${SOURCES([
        ['On3 NIL Valuations', 'https://www.on3.com/nil/rankings/player/nil-valuations/'],
        ['On3 Transfer Portal rankings', 'https://www.on3.com/transfer-portal/rankings/football/2026/'],
        ['The NIL Standard team valuations', 'https://thenilstandard.com/']
      ])}
    `
  }
];
