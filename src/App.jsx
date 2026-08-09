import './premium.css';

const ORIGINS = [
  {
    name: 'Yirgacheffe',
    country: 'Ethiopia',
    coords: '6.16° N, 38.20° E',
    altitude: '1,900–2,200 m',
    process: 'Washed',
    notes: 'Bergamot, jasmine, stone fruit',
  },
  {
    name: 'Huila',
    country: 'Colombia',
    coords: '2.54° N, 76.02° W',
    altitude: '1,700–2,000 m',
    process: 'Washed',
    notes: 'Red apple, caramel, cacao',
  },
  {
    name: 'Gayo Highlands',
    country: 'Sumatra, Indonesia',
    coords: '4.68° N, 96.85° E',
    altitude: '1,200–1,500 m',
    process: 'Wet-hulled',
    notes: 'Cedar, dark chocolate, low acidity',
  },
];

const LEDGER = [
  {
    name: 'Single-Origin Roasts',
    desc: 'One farm, one harvest, roasted light-to-medium to let the origin speak first.',
    tag: 'Rotating',
  },
  {
    name: 'Meridian Blend',
    desc: 'Our house espresso — built for milk, balanced across three origins.',
    tag: 'Signature',
  },
  {
    name: 'Subscription',
    desc: 'A fresh bag every 2 or 4 weeks, timed to when your last one runs out.',
    tag: 'Every 2–4 wks',
  },
  {
    name: 'Wholesale',
    desc: 'Roast-to-order accounts for cafés and offices, with a dedicated roast day.',
    tag: 'By inquiry',
  },
];

const PROOF = [
  { num: '48', label: 'Hours or less between roast and ship date' },
  { num: '3', label: 'Origin partnerships, all direct trade' },
  { num: '1', label: 'Roast logged and cupped before it leaves the drum' },
];

function MeridianLine({ static: isStatic = false }) {
  return (
    <div className={`meridian-line${isStatic ? ' meridian-line--static' : ''}`}>
      {!isStatic && <div className="meridian-dot" />}
    </div>
  );
}

export default function App() {
  return (
    <div>
      <header className="site-header">
        <div className="wrap site-header__row">
          <span className="wordmark">Meridian</span>
          <nav className="site-nav">
            <a href="#story">Story</a>
            <a href="#origins">Origins</a>
            <a href="#offerings">Offerings</a>
            <a href="#why">Why Us</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap">
            <p className="eyebrow">45.4° N — Edge of Dawn</p>
            <h1>
              Coffee roasted at the <em>moment</em> light crosses the meridian.
            </h1>
            <p className="hero__tagline">
              Small-batch. Direct trade. Every bag carries the exact date it left the drum —
              because coffee, like dawn, doesn't wait.
            </p>
            <div className="hero__meridian">
              <MeridianLine />
              <div className="hero__coords">
                <span>Yirgacheffe, ET</span>
                <span>Huila, CO</span>
                <span>Gayo, ID</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="story">
          <div className="wrap">
            <div className="section__head">
              <div>
                <span className="section__label">01 — Story</span>
                <h2>Built around a single drum roaster.</h2>
              </div>
            </div>
            <div className="story">
              <div>
                <p>
                  Meridian Roasters started with one drum roaster in a converted garage and a
                  stubborn belief that coffee should taste like where it came from — not like
                  a warehouse shelf.
                </p>
                <p>
                  Today we source green beans directly from growers across Ethiopia, Colombia,
                  and Sumatra, and roast in batches small enough that every one gets cupped by
                  hand before it ships.
                </p>
              </div>
              <p className="story__figure">
                "We roast to a ship date, not a sell-by date."
              </p>
            </div>
          </div>
        </section>

        <MeridianLine static />

        <section className="section" id="origins">
          <div className="wrap">
            <div className="section__head">
              <div>
                <span className="section__label">02 — Origins</span>
                <h2>Three farms, tracked to the coordinate.</h2>
              </div>
              <p className="section__note">
                Every origin is direct trade — we know the farm, the altitude, and the harvest
                it came from.
              </p>
            </div>
          </div>
          <div className="wrap" style={{ padding: 0 }}>
            <div className="origins">
              {ORIGINS.map((o) => (
                <div className="origin" key={o.name}>
                  <div className="origin__coords">{o.coords}</div>
                  <h3>{o.name}</h3>
                  <dl>
                    <dt>Region</dt>
                    <dd>{o.country}</dd>
                    <dt>Altitude</dt>
                    <dd>{o.altitude}</dd>
                    <dt>Process</dt>
                    <dd>{o.process}</dd>
                    <dt>Cup notes</dt>
                    <dd>{o.notes}</dd>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="offerings">
          <div className="wrap">
            <div className="section__head">
              <div>
                <span className="section__label">03 — Offerings</span>
                <h2>Roasted for how you actually drink it.</h2>
              </div>
            </div>
            <div className="ledger">
              {LEDGER.map((item, i) => (
                <div className="ledger-row" key={item.name}>
                  <span className="ledger-row__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ledger-row__name">{item.name}</span>
                  <span className="ledger-row__desc">{item.desc}</span>
                  <span className="ledger-row__tag">{item.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="why">
          <div className="wrap">
            <div className="section__head">
              <div>
                <span className="section__label">04 — Why Meridian</span>
                <h2>Freshness isn't a claim here. It's a log.</h2>
              </div>
            </div>
            <div className="proof">
              {PROOF.map((p) => (
                <div className="proof__item" key={p.label}>
                  <div className="proof__num">{p.num}</div>
                  <div className="proof__label">{p.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="wrap">
            <h2>Your next bag is still on the drum.</h2>
            <a className="cta__button" href="#offerings">
              See this week's roast →
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap site-footer__row">
          <span>Meridian Roasters</span>
          <span>Roasted at the edge of dawn</span>
        </div>
      </footer>
    </div>
  );
}
