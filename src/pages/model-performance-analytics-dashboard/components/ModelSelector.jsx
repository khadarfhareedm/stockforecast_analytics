import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ModelSelector = ({ selectedModels, onModelToggle, className = '' }) => {
  const models = [
    {
      id: 'lstm',
      name: 'LSTM',
      description: 'Long Short-Term Memory',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'gru',
      name: 'GRU',
      description: 'Gated Recurrent Unit',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      id: 'cnn-lstm',
      name: 'CNN-LSTM',
      description: 'Convolutional LSTM Hybrid',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className={`bg-card rounded-lg border border-border p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Brain" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-foreground">Model Selection</h3>
      </div>
      <div className="space-y-3">
        {models?.map((model) => (
          <div key={model?.id} className={`flex items-center space-x-3 p-3 rounded-lg ${model?.bgColor} border border-border/50`}>
            <Checkbox
              checked={selectedModels?.includes(model?.id)}
              onChange={(e) => onModelToggle(model?.id, e?.target?.checked)}
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${model?.color}`}>{model?.name}</span>
                <div className={`w-2 h-2 rounded-full bg-current ${model?.color}`}></div>
              </div>
              <p className="text-sm text-muted-foreground">{model?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;