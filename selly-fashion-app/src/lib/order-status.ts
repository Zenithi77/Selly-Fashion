// Захиалгын болон хүргэлтийн статусын меню/тайлбар (нэг газар тогтоосон)
import { OrderStatus } from './supabase'

export interface StatusInfo {
  label: string
  color: string
  badge: string // bg + text Tailwind class string
  button: string // background + border + hover
  customer?: string
  isFinal?: boolean
}

export const ORDER_STATUS: Record<OrderStatus, StatusInfo> = {
  pending: {
    label: 'Хүлээгдэж буй', color: 'yellow',
    badge: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
    button: 'bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100',
    customer: 'Захиалга хүлээн авлаа',
  },
  confirmed: {
    label: 'Баталгаажсан', color: 'blue',
    badge: 'bg-blue-100 text-blue-800 ring-1 ring-blue-200',
    button: 'bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100',
    customer: 'Захиалга баталгаажсан',
  },
  processing: {
    label: 'Бэлдэж буй', color: 'indigo',
    badge: 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200',
    button: 'bg-indigo-50 border-indigo-300 text-indigo-800 hover:bg-indigo-100',
    customer: 'Захиалга бэлдэж байна',
  },
  ready_for_pickup: {
    label: 'Авахад бэлэн', color: 'teal',
    badge: 'bg-teal-100 text-teal-800 ring-1 ring-teal-200',
    button: 'bg-teal-50 border-teal-300 text-teal-800 hover:bg-teal-100',
    customer: 'Дэлгүүрээс авахад бэлэн',
  },
  assigned_to_courier: {
    label: 'Хүргэлтийн ажилтанд хуваарилсан', color: 'sky',
    badge: 'bg-sky-100 text-sky-800 ring-1 ring-sky-200',
    button: 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100',
    customer: 'Хүргэлтийн ажилтанд хуваарилсан',
  },
  picked_up: {
    label: 'Хүргэлтийн ажилтан авсан', color: 'violet',
    badge: 'bg-violet-100 text-violet-800 ring-1 ring-violet-200',
    button: 'bg-violet-50 border-violet-300 text-violet-800 hover:bg-violet-100',
    customer: 'Хүргэлтийн ажилтан таны барааг хүлээн авлаа',
  },
  in_transit: {
    label: 'Замдаа', color: 'purple',
    badge: 'bg-purple-100 text-purple-800 ring-1 ring-purple-200',
    button: 'bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100',
    customer: 'Хүргэлт явж байна',
  },
  out_for_delivery: {
    label: 'Хүргэлтэнд гарсан', color: 'pink',
    badge: 'bg-pink-100 text-pink-800 ring-1 ring-pink-200',
    button: 'bg-pink-50 border-pink-300 text-pink-800 hover:bg-pink-100',
    customer: 'Хүргэлт танай руу очиж байна',
  },
  delivered: {
    label: 'Хүргэгдсэн', color: 'green',
    badge: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
    button: 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100',
    customer: 'Амжилттай хүргэгдсэн', isFinal: true,
  },
  failed_delivery: {
    label: 'Хүргэлт амжилтгүй', color: 'orange',
    badge: 'bg-orange-100 text-orange-800 ring-1 ring-orange-200',
    button: 'bg-orange-50 border-orange-300 text-orange-800 hover:bg-orange-100',
    customer: 'Хүргэх боломжгүй болсон',
  },
  returned: {
    label: 'Буцаагдсан', color: 'amber',
    badge: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
    button: 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100',
    customer: 'Бараа буцаагдсан', isFinal: true,
  },
  cancelled: {
    label: 'Цуцлагдсан', color: 'red',
    badge: 'bg-red-100 text-red-800 ring-1 ring-red-200',
    button: 'bg-red-50 border-red-300 text-red-800 hover:bg-red-100',
    customer: 'Цуцлагдсан', isFinal: true,
  },
  shipped: {
    label: 'Хүргэлтэнд', color: 'purple',
    badge: 'bg-purple-100 text-purple-800 ring-1 ring-purple-200',
    button: 'bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100',
    customer: 'Хүргэлт явж байна',
  },
}

export const COURIER_FLOW: OrderStatus[] = [
  'assigned_to_courier',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'failed_delivery',
]

export const DELIVERY_STATUSES: OrderStatus[] = [
  'ready_for_pickup',
  'assigned_to_courier',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'failed_delivery',
  'returned',
]

