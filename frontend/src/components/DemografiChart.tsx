import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import type { DemografikItem } from '../data/demographics'

interface DemografiChartProps {
  title: string
  data: DemografikItem[]
  barColor: string
  delay?: number
}

function formatNumber(n: number): string {
  return n.toLocaleString('id-ID')
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm font-medium text-foreground">
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
      className="fill-muted-foreground text-xs"
      fontSize={13}
    >
      {payload.value}
    </text>
  )
}

export function DemografiChart({ title, data, barColor, delay = 0 }: DemografiChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-surface-card rounded-2xl border border-border/60 p-5 hover:shadow-md transition-shadow duration-300"
    >
      <h3 className="font-heading font-semibold text-base text-foreground mb-4">{title}</h3>
      <div style={{ width: '100%', height: data.length * 48 + 16 }}>
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
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'var(--color-muted)', opacity: 0.5 }}
            />
            <Bar
              dataKey="value"
              fill={barColor}
              radius={[0, 6, 6, 0]}
              maxBarSize={22}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
