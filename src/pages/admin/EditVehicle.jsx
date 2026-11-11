import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import VehicleForm from '../../components/admin/VehicleForm'
import { useVehicles } from '../../context/VehicleContext'
import { vehicleTitle } from '../../utils/vehicles'
import { adminUrl } from '../../config'

export default function EditVehicle() {
  const { id } = useParams()
  const { getVehicle, updateVehicle, loading } = useVehicles()
  const navigate = useNavigate()
  const vehicle = getVehicle(id)

  if (!vehicle) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-semibold">{loading ? 'Loading…' : 'Car not found'}</h1>
        {!loading && <Link to={adminUrl('/vehicles')} className="btn-primary mt-6">Back to vehicles</Link>}
      </div>
    )
  }

  const onSubmit = async (payload) => {
    const result = await updateVehicle(id, payload)
    if (result.ok) navigate(adminUrl('/vehicles'), { state: { flash: 'Changes saved. The website is updated for everyone.' } })
    return result
  }

  return (
    <div>
      <Link to={adminUrl('/vehicles')} className="mb-4 inline-flex items-center gap-2 text-sm text-ink-300 hover:text-white"><ArrowLeft size={16} /> Back to vehicles</Link>
      <h1 className="mb-8 text-3xl font-semibold">Edit {vehicleTitle(vehicle)}</h1>
      <VehicleForm vehicle={vehicle} onSubmit={onSubmit} submitLabel="Save changes" />
    </div>
  )
}
