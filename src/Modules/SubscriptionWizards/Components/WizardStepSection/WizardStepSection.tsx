import React from 'react';
import styles from './WizardStepSection.module.scss';

export interface WizardStepSectionProps {
  className?: string;
  title: string;
  children: React.ReactNode;
}

export const WizardStepSection = ({
  children,
  className = '',
  title
}: WizardStepSectionProps): React.ReactElement<WizardStepSectionProps> => {
  return (
    <div className={`${styles.wizardStepSection} ${className}`}>
      <h3>{title}</h3>
      {children}
    </div>
  );
};
