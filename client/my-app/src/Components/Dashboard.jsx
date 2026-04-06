import "./Dashboard.css"
import {
  Home,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search
} from "lucide-react"

export default function Dashboard() {

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <h2 className="logo">21st</h2>

        <nav>

          <div className="nav-item active">
            <Home size={18}/>
            <span>Dashboard</span>
          </div>

          <div className="nav-item">
            <BarChart3 size={18}/>
            <span>Analytics</span>
          </div>

          <div className="nav-item">
            <Users size={18}/>
            <span>Users</span>
          </div>

          <div className="nav-item">
            <Settings size={18}/>
            <span>Settings</span>
          </div>

        </nav>

      </aside>


      {/* MAIN AREA */}

      <main className="main">

        {/* HEADER */}

        <header className="header">

          <div className="search">
            <Search size={16}/>
            <input placeholder="Search..." />
          </div>

          <Bell size={20}/>

        </header>


        {/* STATS */}

        <section className="stats">

          <div className="card">
            <h3>$45,231</h3>
            <p>Total Revenue</p>
          </div>

          <div className="card">
            <h3>+2350</h3>
            <p>Subscriptions</p>
          </div>

          <div className="card">
            <h3>+12,234</h3>
            <p>Sales</p>
          </div>

          <div className="card">
            <h3>+573</h3>
            <p>Active Now</p>
          </div>

        </section>


        {/* ANALYTICS */}

        <section className="analytics">

          <div className="chart">
            <h3>Analytics Overview</h3>
            <div className="fake-chart"></div>
          </div>

          <div className="activity">
            <h3>Recent Activity</h3>

            <ul>
              <li>User John signed up</li>
              <li>New sale completed</li>
              <li>Server restarted</li>
              <li>Subscription renewed</li>
            </ul>

          </div>

        </section>

      </main>

    </div>
  )
}