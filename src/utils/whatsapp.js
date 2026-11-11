export function buildWhatsAppLink(number, message = '') {
  const digits = String(number || '').replace(/\D/g, '')
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${text}`
}

export const GENERAL_ENQUIRY_MESSAGE =
  'Hello, I would like to enquire about the vehicles listed on your website.'

export const vehicleEnquiryMessage = (title) =>
  `Hello, I am interested in the ${title} listed on your website. Is this vehicle still available?`
