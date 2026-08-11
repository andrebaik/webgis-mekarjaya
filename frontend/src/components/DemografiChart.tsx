import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

export interface DemografiChartItem {
  label_key: string
  label: string
  value: number
}

interface DemografiChartProps {
  title: string
  data: DemografiChartItem[]
  barColor: string
  delay?: number
}

function formatNumber(n: number): string {
  return n.toLocaleString('id-ID')
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-neutral-200 rounded-xl px-3 py-2 shadow-md text-xs font-semibold text-neutral-900">
      {payload[0]?.payload?.label}: {formatNumber(payload[0].value)}
    </div>
  )
}

function CustomYAxisTick({ x, y, payload }: any) {
  return (
    <text
      x={x}
      y={y}
      dy={4}
      textAnchor="end"
      className="fill-neutral-500 text-xs font-medium"
      fontSize={12}
    >
      {payload.value}
    </text>
  )
}

export function DemografiChart({ title, data, barColor, delay = 0 }: DemografiChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs flex flex-col justify-between"
    >
      <h3 className="font-heading font-semibold text-sm text-neutral-900 mb-4 uppercase tracking-wider text-[11px] text-neutral-400">
        {title}
      </h3>
      <div style={{ width: '100%', height: data.length * 44 + 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <XAxis type="number" hide domain={[0, maxValue * 1.1]} />
            <YAxis
              type="category"
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={<CustomYAxisTick />}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F5F4', opacity: 0.7 }} />
            <Bar
              dataKey="value"
              fill={barColor}
              radius={[0, 6, 6, 0]}
              maxBarSize={20}
              // Recharts 3.10: animasi masuk pada bar tidak pernah selesai di setup ini,
              // menyisakan <g class="recharts-inactive-bar"> kosong sehingga bar tidak
              // pernah tergambar. Dimatikan; kartu sudah dianimasikan framer-motion.
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
