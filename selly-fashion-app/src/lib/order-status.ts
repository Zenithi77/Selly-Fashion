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
    badge: 'bg-yellow-100 text-yellow-700',
    button: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
    customer: 'Захиалга хүлээн авлаа',
  },
  confirmed: {
    label: 'Баталгаажсан', color: 'blue',
    badge: 'bg-blue-100 text-blue-700',
    button: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    customer: 'Захиалга баталгаажсан',
  },
  processing: {
    label: 'Бэлдэж буй', color: 'indigo',
    badge: 'bg-indigo-100 text-indigo-700',
    button: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
    customer: 'Захиалга бэлдэж байна',
  },
  ready_for_pickup: {
    label: 'Авахад бэлэн', color: 'cyan',
    badge: 'bg-cyan-100 text-cyan-700',
    button: 'bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100',
    customer: 'Дэлгүүрээс авахад бэлэн',
  },
  assigned_to_courier: {
    label: 'Курьерт хуваарилсан', color: 'sky',
    badge: 'bg-sky-100 text-sky-700',
    button: 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100',
    customer: 'Хүргэлтийн ажилтанд хуваарилсан',
  },
  picked_up: {
    label: 'Курьер авсан', color: 'violet',
    badge: 'bg-violet-100 text-violet-700',
    button: 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100',
    customer: 'Курьер таны барааг хүлээн авлаа',
  },
  in_transit: {
    label: 'Замдаа', color: 'purple',
    badge: 'bg-purple-100 text-purple-700',
    button: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
    customer: 'Хүргэлт явж байна',
  },
  out_for_delivery: {
    label: 'Хүргэлтэнд гарсан', color: 'fuchsia',
    badge: 'bg-fuchsia-100 text-fuchsia-700',
    button: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-100',
    customer: 'Хүргэлт танай руу очиж байна',
  },
  delivered: {
    label: 'Хүргэгдсэн', color: 'green',
    badge: 'bg-green-100 text-green-700',
    button: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
    customer: 'Амжилттай хүргэгдсэн', isFinal: true,
  },
  failed_delivery: {
    label: 'Хүргэлт амжилтгүй', color: 'orange',
    badge: 'bg-orange-100 text-orange-700',
    button: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
    customer: 'Хүргэх боломжгүй болсон',
  },
  returned: {
    label: 'Буцаагдсан', color: 'amber',
    badge: 'bg-amber-100 text-amber-700',
    button: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100',
    customer: 'Бараа буцаагдсан', isFinal: true,
  },
  cancelled: {
    label: 'Цуцлагдсан', color: 'red',
    badge: 'bg-red-100 text-red-700',
    button: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
    customer: 'Цуцлагдсан', isFinal: true,
  },
  shipped: {
    label: 'Хүргэлтэнд', color: 'purple',
    badge: 'bg-purple-100 text-purple-700',
    button: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
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

