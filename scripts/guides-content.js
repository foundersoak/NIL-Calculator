/* ============================================================
   HowMuchNIL — guide articles (un-gated SEO content)
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
    title: 'Texas Softball Wins Back-to-Back WCWS Titles in 2026',
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
  }
];
