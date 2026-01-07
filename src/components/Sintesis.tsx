import React from 'react';
import type { ReportData } from '../types/reporte.tipos';

interface ReportSummaryProps {
  reportData: ReportData;
}

/**
 * Componente que muestra las tarjetas de resumen del reporte
 */
const Sintesis: React.FC<ReportSummaryProps> = ({ reportData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SummaryCard
        icon="📦"
        title="Total Cajas"
        value={reportData.totalCajas.toLocaleString()}
        color="blue"
      />
      <SummaryCard
        icon="⚖️"
        title="Total Kilos"
        value={reportData.totalKilos.toLocaleString()}
        color="green"
      />
      <SummaryCard
        icon="🫐"
        title="Especies"
        value={reportData.porEspecie.length.toString()}
        color="purple"
      />
      <SummaryCard
        icon="👨‍🌾"
        title="Productores"
        value={reportData.porProductor.length.toString()}
        color="orange"
      />
    </div>
  );
};

interface SummaryCardProps {
  icon: string;
  title: string;
  value: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

/**
 * Tarjeta individual de métrica
 */
const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    green: 'from-green-50 to-green-100 border-green-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    orange: 'from-orange-50 to-orange-100 border-orange-200'
  };

  return (
    <div className={`
      bg-gradient-to-br ${colorClasses[color]}
      rounded-xl shadow-md hover:shadow-lg 
      border-2 p-6 text-center 
      transform transition-all duration-200 hover:-translate-y-1
    `}>
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default Sintesis;