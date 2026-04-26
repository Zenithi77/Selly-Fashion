// Захиалгын болон хүргэлтийн статусын меню/тайлбар (нэг газар тогтоосон)
import { OrderStatus } from './supabase'

export interface StatusInfo {
  label: string
  color: string
  customer?: string // хэрэглэгчид харагдах текст
  isFinal?: boolean
}

// Үндсэн захиалгын статусууд
export const ORDER_STATUS: Record<OrderStatus, StatusInfo> = {
  pending: { label: 'Хүлээгдэж буй', color: 'yellow', customer: 'Захиалга хүлээн авлаа' },
  confirmed: { label: 'Баталгаажсан', color: 'blue', customer: 'Захиалга баталгаажсан' },
  processing: { label: 'Бэлдэж буй', color: 'indigo', customer: 'Захиалга бэлдэж байна' },
  ready_for_pickup: { label: 'Бэлэн (авахад бэлэн)', color: 'cyan', customer: 'Дэлгүүрээс авахад бэлэн боллоо' },
  assigned_to_courier: { label: 'Курьерт хуваарилагдсан', color: 'sky', customer: 'Хүргэлтийн ажилтанд хуваарилсан' },
  picked_up: { label: 'Курьер хүлээн авсан', color: 'violet', customer: 'Курьер таны барааг хүлээн авлаа' },
  in_transit: { label: 'Замдаа', color: 'purple', customer: 'Хүргэлт явж байна' },
  out_for_delivery: { label: 'Хүргэлтэнд гарсан', color: 'fuchsia', customer: 'Хүргэлт танай руу очиж байна' },
  delivered: { label: 'Хүргэгдсэн', color: 'green', customer: 'Амжилттай хүргэгдсэн', isFinal: true },
  failed_delivery: { label: 'Хүргэлт амжилтгүй', color: 'orange', customer: 'Хүргэх боломжгүй болсон' },
  returned: { label: 'Буцаасан', color: 'amber', customer: 'Бараа буцаагдсан', isFinal: true },
  cancelled: { label: 'Цуцлагдсан', color: 'red', customer: 'Цуцлагдсан', isFinal: true },
  // backward-compat
  shipped: { label: 'Хүргэлтэнд', color: 'purple', customer: 'Хүргэлт явж байна' },
}

// Курьерт зөвшөөрөгдсөн статусын урагшлах дараалал
export const COURIER_FLOW: OrderStatus[] = [
  'assigned_to_courier',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'failed_delivery',
]

// Дэлгүүрээс хүргэлтэнд гарах урсгалд хамаарах статусууд
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
