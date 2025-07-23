import React from 'react';

import Button, { ButtonType } from '../../../components/button/Button';
import IconCheck from '../../../icons/general/IconCheck';
import IconClose from '../../../icons/general/IconClose';

import { type DetectedItem } from './__mocks__/redactWizardMockData';

export interface RedactWizardItemCardProps {
    item: DetectedItem;
    isSelected: boolean;
    onApprove: (itemId: string) => void;
    onReject: (itemId: string) => void;
}

const RedactWizardItemCard = ({ item, isSelected, onApprove, onReject }: RedactWizardItemCardProps) => {
    const getRiskLevelLabel = (riskLevel: number): string => {
        switch (riskLevel) {
            case 1: return 'MEDIUM';
            case 2: return 'HIGH';
            case 3: return 'CRITICAL';
            default: return 'MEDIUM';
        }
    };

    const getRiskLevelColor = (riskLevel: number): string => {
        switch (riskLevel) {
            case 1: return '#26C281'; // Green
            case 2: return '#F5A623'; // Orange
            case 3: return '#ED3757'; // Red
            default: return '#666666'; // Gray
        }
    };

    const getConfidenceColor = (confidence: number): string => {
        if (confidence >= 95) return '#26C281'; // Green
        if (confidence >= 90) return '#0061D5'; // Blue
        if (confidence >= 80) return '#F5A623'; // Yellow
        return '#ED3757'; // Red
    };

    const riskLabel = getRiskLevelLabel(item.riskLevel);
    const riskColor = getRiskLevelColor(item.riskLevel);
    const confidenceColor = getConfidenceColor(item.confidence);

    return (
        <div className="bcs-RedactWizardSidebar-item">
            <div className="bcs-RedactWizardSidebar-item-header">
                <span className="bcs-RedactWizardSidebar-item-title">{item.title}</span>
                <span 
                    className="bcs-RedactWizardSidebar-item-risk"
                    style={{ backgroundColor: riskColor }}
                >
                    {riskLabel}
                </span>
            </div>
            
            <div className="bcs-RedactWizardSidebar-item-category">
                Category: {item.category}
            </div>
            
            <div className="bcs-RedactWizardSidebar-item-value">
                "{item.term}"
            </div>
            
            <div className="bcs-RedactWizardSidebar-item-footer">
                <span 
                    className="bcs-RedactWizardSidebar-item-confidence"
                    style={{ color: confidenceColor }}
                >
                    Confidence: {item.confidence.toFixed(1)}%
                </span>
                
                <div className="bcs-RedactWizardSidebar-item-actions">
                    <Button
                        className={`bcs-RedactWizardSidebar-action-btn ${!isSelected ? 'is-active' : ''}`}
                        onClick={() => onReject(item.id)}
                        type={ButtonType.BUTTON}
                    >
                        <IconClose color="#ED3757" width={16} height={16} />
                    </Button>
                    <Button
                        className={`bcs-RedactWizardSidebar-action-btn ${isSelected ? 'is-active' : ''}`}
                        onClick={() => onApprove(item.id)}
                        type={ButtonType.BUTTON}
                    >
                        <IconCheck color="#26C281" width={16} height={16} />
                    </Button>
                </div>
            </div>
            
            <div className="bcs-RedactWizardSidebar-item-status">
                {isSelected ? (
                    <>
                        <IconCheck color="#26C281" width={16} height={16} />
                        <span style={{ color: '#26C281' }}>Will be redacted</span>
                    </>
                ) : (
                    <>
                        <IconClose color="#ED3757" width={16} height={16} />
                        <span style={{ color: '#ED3757' }}>Will not be redacted</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default RedactWizardItemCard; 