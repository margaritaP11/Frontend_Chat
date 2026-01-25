import Sidebar from './components/Sidebar'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '240px', width: '100%', padding: '20px' }}>
        <AppRoutes />
      </div>
    </div>
  )
}
