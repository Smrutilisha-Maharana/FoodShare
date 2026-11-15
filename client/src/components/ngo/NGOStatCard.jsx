
import { motion } from "framer-motion";

export default function NGOStatCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-white bg-white p-6 shadow-lg shadow-slate-900/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            {value}
          </h3>

          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div
          className={`rounded-2xl bg-gradient-to-br ${gradient} p-3.5 text-white shadow-lg`}
        >
          <Icon size={23} />
        </div>
      </div>
    </motion.div>
  );
}
