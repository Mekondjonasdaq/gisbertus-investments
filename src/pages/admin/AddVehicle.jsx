import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import VehicleForm from '../../components/admin/VehicleForm'
import { useVehicles } from '../../context/VehicleContext'
import { adminUrl } from '../../config'

export default function AddVehicle() {
  const { addVehicle } = useVehicles()
  const navigate = useNavigate()

  const onSubmit = async (payload) => {
    const result = await addVehicle(payload)
    if (result.ok) navigate(adminUrl('/vehicles'), { state: { flash: 'Car added. It is now live on the website for everyone.' } })
    return result
  }

  return (
    <div>
      <Link to={adminUrl('/vehicles')} className="mb-4 inline-flex items-center gap-2 text-sm text-ink-300 hover:text-white"><ArrowLeft size={16} /> Back to vehicles</Link>
      <h1 className="mb-8 text-3xl font-semibold">Add a car</h1>
      <VehicleForm onSubmit={onSubmit} submitLabel="Publish car" />
    </div>
  )
}
